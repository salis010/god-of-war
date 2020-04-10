import { Reel } from './Reel'
import { DisplayObject, sprite, buttons, button, text, render } from './SpriteClasses'
import { makePointer } from './Pointer'
import { PayTable } from './PayTable'
import { CONSECUTIVE_NO_WINS, a, d, iconWidth, iconHeight } from './constants'
import { WinningLine } from './WinningLine'

///////////////////////////////
//Global Variables
///////////////////////////////
//Canvases
let canvasMain, ctxMain        //main canvas
let canvasReels, ctxReels      //reels canvas
let yHeader                    //vertical distance from top of main canvas to top of reels canvas
let leftBorder
//stages
let stage, infoPanelStage
//Control Panel
let buttonNames, buttonImages
let spinButton
let spinButtonWidth, spinButtonHeight  //dimensions of Spin button
let infoButton
let infoButtonWidth, infoButtonHeight
let coinUpButton, coinDownButton
let coinButtonWidth, coinButtonHeight
let linesInfoPanel
let linesInfoPanelWidth, linesInfoPanelHeight
let winPanel
let winPanelWidth, winPanelHeight
//Frame Images
let frameImageNames, frameImages
let frameLeft, frameRight, dragonLeft, dragonRight, god0, header
//Reels
let image
let reels
let reel1, reel2, reel3, reel4, reel5
let iconNames, iconImages
let flashCounter, flashTime, flashPeriod, reverseFlash
let shrineIconNames, shrineIconImages
let sunTzuIconNames, sunTzuIconImages
let skullWarriorIconNames, skullWarriorIconImages
let spinTimeMin, spinTimeMax
let extraSpinTime //the maximum extra spinning time one reel has over the reel to its left
let spinning   //use as boolean to trigger spinning
//textual info
let bet, balance, totalWinningLines, win
let betMin, betMax
let textBet, textBalance, textTotalWinningLines, textWin
let yFooter, footerHeight
let footerFont, footerFillStyle
//bet settlement
let payTable
let winningLines
let showWinningLines
let winningBorderNames, winningBorderImages
let showWinningLine //showWinningLine toggles through the winning lines
let showWinningLinePeriod, showWinningLineTime
let winLineText
let winLineFont
let winLineTextColor
let winAmountY
let showFlashyIcons        //a boolean, to trigger the flashing of any flashy icons
//infoPanel
let showInfoPanels
let infoPanelsImageNames, infoPanelsImages
let infoBottom
let backButton
let leftButton, rightButton
let panelToShow
//sound
let armyComing, warHorn
let consecutiveNoWins
//other
let firstScreen
let pointer

///////////////////////////////
//init function
///////////////////////////////
export function init() {
        
    loadResources()
        .then(setup)
        .then(gameLoop)         
}

///////////////////////////////
//loadResources
///////////////////////////////
function loadResources() {
    
    let globalCounter = 0
    let counter = 0
    
    return new Promise(resolve => {
        
        ///////////////////////////////////
        //icon images   (VERY IMPORTANT TO BE IN THE SAME ORDER AS THE PAYTABLE)
        iconNames = ["ten", "jack", "queen", "king", "ace",
            "map", "yabusame", "skullCanon", "canon", "catapult",   
            "shrine0", "sunTzu0", "skullWarrior"]
        iconImages = []
        
        //load icon images
        for(let i = 0; i < iconNames.length; i++) {
            image = new Image()
            iconImages.push(image)
            iconImages[i].addEventListener("load", loadHandler, false)
            image.src = "src/images/" + iconNames[i] + ".png"
        }
        
        ////////////////////////////////////
        //load flash images
        
        //load Shrine images
        shrineIconNames = ["shrine nova 0", "shrine nova 1", "shrine nova 2", "shrine nova 3", "shrine nova 4", "shrine nova 5", "shrine nova 6"] 
        shrineIconImages = []
        
        for(let i = 0; i < shrineIconNames.length; i++) {
            image = new Image()
            shrineIconImages.push(image)
            shrineIconImages[i].addEventListener("load", loadHandler, false)
            image.src = "src/images/" + shrineIconNames[i] + ".png"
        }                
        
        //load SunTzu images
        sunTzuIconNames = ["sunTzu0", "sunTzu1", "sunTzu2", "sunTzu3", "sunTzu4", "sunTzu5", "sunTzu6"] 
        sunTzuIconImages = []
                
        for(let i = 0; i < sunTzuIconNames.length; i++) {
            image = new Image()
            sunTzuIconImages.push(image)
            sunTzuIconImages[i].addEventListener("load", loadHandler, false)
            image.src = "src/images/" + sunTzuIconNames[i] + ".png"
        }
        
        //load SunTzu images
        skullWarriorIconNames = ["skull warrior0", "skull warrior1", "skull warrior2", "skull warrior3", "skull warrior4", "skull warrior5", "skull warrior6"] 
        skullWarriorIconImages = []
                
        for(let i = 0; i < skullWarriorIconNames.length; i++) {
            image = new Image()
            skullWarriorIconImages.push(image)
            skullWarriorIconImages[i].addEventListener("load", loadHandler, false)
            image.src = "src/images/" + skullWarriorIconNames[i] + ".png"
        }
       
        ///////////////////////////////////
        //frame images
        frameImageNames = ["frameLeft", "frameRight", "dragonLeft", "dragonRight", "god0", "header"]
        frameImages = []
        
        //load frame images
        for(let i = 0; i < frameImageNames.length; i++) {
            image = new Image()
            frameImages.push(image)
            frameImages[i].addEventListener("load", loadHandler, false)
            image.src = "src/images/" + frameImageNames[i] + ".png"
        }
        
        ///////////////////////////////////
        //button images
        buttonNames = ["spin", "spinHover", "spinPressed",
            "coinUp", "coinUpHover", "coinUpPressed",
            "coinDown", "coinDownHover", "coinDownPressed", 
            "info", "infoHover", "infoPressed", 
            "backButton", "backButtonHover", "backButtonPressed",
            "left", "leftHover", "leftPressed",
            "right", "rightHover", "rightPressed"]
        buttonImages = []
        
        //load button images
        for(let i = 0; i < buttonNames.length; i++) {
            image = new Image()
            buttonImages.push(image)
            buttonImages[i].addEventListener("load", loadHandler, false)
            image.src = "src/images/" + buttonNames[i] + ".png"
        }
        
        ////////////////////////////////////
        //winning border images
        winningBorderNames = ["winningBorder"]
        winningBorderImages = []
        
        //load border images
        for(let i = 0; i < winningBorderNames.length; i++) {
            image = new Image()
            winningBorderImages.push(image)
            winningBorderImages[i].addEventListener("load", loadHandler, false)
            image.src = "src/images/" + winningBorderNames[i] + ".png"
        }
        
        ////////////////////////////////////
        //info Panels images
        infoPanelsImageNames = ["infoBottom", "panelPrizes", "winExplanationPanel"]
        infoPanelsImages = []
        
        //load Info Panels images
        for(let i = 0; i < infoPanelsImageNames.length; i++) {
            image = new Image()
            infoPanelsImages.push(image)
            infoPanelsImages[i].addEventListener("load", loadHandler, false)
            image.src = "src/images/" + infoPanelsImageNames[i] + ".png"
        }
        
        ///////////////////////////////////
        //sound
        armyComing = new Audio()
        armyComing.addEventListener("canplaythrough", playSoundHandler, false)
        armyComing.src = "armyComing.wav"
        
        warHorn = new Audio()
        warHorn.addEventListener("canplaythrough", playSoundHandler, false)
        warHorn.src = "warHorn.wav"        
        
        function playSoundHandler(event) {
            warHorn.play()
        }
        
        ///////////////////////////////////
        //loadHandler function
        function loadHandler()
        {
            counter++
                        
            if(counter === iconNames.length 
                + frameImageNames.length
                + buttonNames.length                
                + winningBorderNames.length
                + shrineIconNames.length            
                + sunTzuIconNames.length
                + skullWarriorIconNames.length
                + infoPanelsImageNames.length
                )
                
                resolve()
        }
    })
}

///////////////////////////////
//setup 
///////////////////////////////
function setup() {
    
    return new Promise(resolve => {
        
        ///////////////////////////////////////////////////////////////
        //setup the reels canvas
        canvasReels = document.createElement("canvas")
        canvasReels.style.background = "black"
        canvasReels.setAttribute("style", "display: none")        
        canvasReels.width = 128 * 5
        canvasReels.height = 128 * 3
        document.body.appendChild(canvasReels)

        ctxReels = canvasReels.getContext("2d")

        ///////////////////////////////////////////////////////////////
        //set up the reels
        
        //set up the min and max spinning times
        spinTimeMin = 20
        spinTimeMax = 50
        extraSpinTime = 20
        
        //set up the reels
        reel1 = new Reel()
        reel2 = new Reel()
        reel3 = new Reel()
        reel4 = new Reel()
        reel5 = new Reel()
        
        reels = [reel1, reel2, reel3, reel4, reel5]
        
        //set up the images for each reel
        reel1.icons = [2, 4, 4, 6, 10, 7, 1, 3, 10, 9, 5, 0, 7, 0, 2, 2, 3, 10, 0, 2, 0, 10, 1, 0, 0, 0, 0, 2, 5, 11, 7, 4, 5, 3, 3, 3, 0, 1, 1, 3, 3, 2, 0, 11, 9, 3, 2, 2, 2, 1, 2, 10, 0, 1, 1, 4, 10, 3, 3, 2, 3, 4, 7, 1, 0, 8, 0, 11, 7, 6, 9, 2, 5, 4, 4, 8, 3, 4, 3, 2, 1, 3, 0, 3, 2, 2, 3, 2, 7, 7, 12, 0, 4, 1, 3, 10, 4, 3, 1, 9, 2, 3, 3, 12, 1, 2, 1, 7, 12, 12, 6, 4, 8, 4, 4, 3, 3, 4, 9, 2, 0, 2, 1, 3, 3, 0, 3, 1, 0, 1, 4, 2, 1, 2, 11, 0, 2, 7, 5, 2, 0, 8, 0, 5, 11, 1, 12, 5, 4, 4, 4, 3, 11, 4, 0, 4, 5, 11, 6, 1, 3, 4, 2, 0, 2, 1, 7, 0, 8, 7, 1, 5, 5, 4, 10, 2, 11, 3, 3, 5, 7, 1, 0, 0, 1, 4, 9, 3, 1, 10, 9, 3, 1, 9, 3, 1, 1, 3, 8, 7, 7, 0, 2, 0, 2, 0, 0, 3, 1, 1, 2, 8, 12, 3, 4, 5, 2, 9, 7, 0, 0, 3, 3, 3, 6, 12, 1, 4, 5, 11, 2, 4, 1, 2, 7, 4, 0, 0, 3, 7, 0, 12, 0, 5, 6, 0, 9, 3, 11, 9, 1, 0, 11, 3, 3, 7, 4, 2, 7, 2, 2, 3, 8, 5, 3, 3, 7, 0, 0, 2, 4, 4, 2, 7, 12, 8, 0, 4, 0, 5, 4, 1, 2, 3, 1, 2, 1, 8, 2, 4, 0, 6, 1, 5, 3, 1, 1, 6, 3, 10, 5, 1, 1, 8, 10, 8, 4, 0, 0, 1, 0, 11, 0, 2, 9, 8, 2, 0, 1, 10, 3, 1, 0, 1, 2, 0, 12, 3, 0, 8, 1, 4, 0, 2, 10, 3, 0, 2, 6, 4, 1, 3, 3, 3, 1, 3, 2, 2, 4, 0, 0, 9, 6, 4, 1, 2, 2, 12, 4, 4, 2, 1, 4, 2, 9, 1, 5, 3, 11, 1, 1, 3, 12, 3, 3, 4, 2, 0, 10, 3, 9, 6, 2, 3, 1, 3, 9, 3, 1, 4, 9, 0, 1, 0, 1, 12, 9, 6, 3, 8, 6, 2, 1, 9, 3, 4, 4, 4, 1, 3, 5, 1, 2, 1, 1, 9, 3, 1, 3, 1, 4, 0, 4, 5, 4, 4, 4, 1, 6, 1, 2, 2, 8, 0, 1, 8, 9, 0, 12, 0, 12, 4, 1, 1, 4, 0, 1, 0, 11, 4, 0, 3, 6, 3, 3, 0, 3, 10, 1, 6, 1, 1, 2, 0, 0, 10, 5, 3, 1, 1, 2, 8, 2, 11, 0, 5, 9, 6, 3, 4, 2, 4, 4, 1, 9, 3, 2, 1, 2, 2, 12, 4, 0, 5, 0, 1, 2, 1, 10, 4, 5, 2, 3, 4, 7, 12, 4, 1, 4, 1, 9, 3, 1, 0, 1, 6, 2, 0, 10, 1, 4, 2, 11, 6, 0, 2, 4, 10, 6, 9, 2, 9, 1, 6, 2, 3, 2, 6, 6, 7, 12, 4, 0, 8, 9, 0, 6, 0, 4, 1, 4, 2, 4, 9, 5, 0, 6, 0, 7, 3, 1, 3, 2, 9, 1, 2, 1, 8, 2, 2, 11, 1, 11, 7, 1, 3, 4, 11, 3, 7, 4, 1, 6, 1, 1, 6, 7, 12, 12, 10, 2, 3, 8, 3, 4, 4, 3, 3, 3, 4, 4, 1, 2, 3, 4, 2, 1, 12, 2, 9, 5, 3, 0, 4, 4, 11, 1, 0, 5, 12, 2, 2, 3, 1, 0, 10, 4, 0, 0, 4, 9, 12, 5, 0, 7, 0, 1, 2, 5, 1, 9, 1, 6, 1, 3, 3, 1, 4, 12, 6, 4, 7, 6, 1, 12, 0, 10, 1, 3, 3, 1, 3, 4, 4, 3, 3, 6, 3, 6, 4, 3, 4, 0, 3, 1, 7, 0, 8, 8, 0, 3, 0, 3, 7, 1, 2, 3, 4, 1, 4, 10, 4, 3, 3, 0, 4, 1, 4, 6, 5, 10, 6, 0, 2, 2, 5, 1, 3, 2, 5, 1, 2, 2, 3, 10, 3, 3, 4, 5, 4, 1, 0, 10, 7, 2, 4, 2, 12, 7, 4, 5, 1, 11, 5, 3, 2, 5, 4, 5, 3, 0, 2, 4, 4, 4, 10, 5, 5, 2, 4, 0, 2, 7, 0, 3, 3, 1, 0, 4, 1, 1, 1, 6, 4, 4, 0, 8, 1, 1, 2, 4, 2, 10, 1, 1, 4, 2, 4, 0, 0, 4, 7, 0, 8, 4, 7, 10, 4, 6, 2, 0, 0, 4, 2, 2, 6, 0, 10, 2, 11, 2, 8, 0, 2, 8, 0, 0, 6, 0, 2, 2, 0, 8, 0, 11, 2, 2, 0, 0, 0, 0, 8, 0, 0, 11, 0, 2, 2, 0, 2, 0, 2, 0, 8, 0, 0, 2, 0, 0, 2, 2, 11, 8, 8, 8, 8, 11, 11, 11]
        
        reel2.icons = [1, 11, 11, 3, 0, 2, 4, 11, 0, 1, 3, 4, 3, 6, 10, 10, 6, 2, 1, 4, 10, 2, 1, 0, 3, 0, 4, 0, 2, 2, 2, 1, 5, 5, 10, 2, 0, 2, 2, 3, 2, 1, 8, 2, 3, 3, 10, 11, 2, 1, 0, 1, 2, 4, 4, 9, 3, 9, 1, 6, 3, 2, 7, 4, 5, 7, 1, 5, 0, 2, 4, 2, 2, 0, 4, 2, 6, 12, 6, 2, 2, 2, 11, 11, 3, 2, 2, 0, 3, 0, 7, 7, 3, 6, 1, 4, 2, 3, 0, 2, 1, 6, 8, 1, 2, 6, 11, 11, 5, 3, 5, 5, 1, 11, 9, 1, 1, 1, 2, 11, 4, 9, 4, 3, 6, 6, 3, 6, 1, 2, 11, 1, 9, 3, 11, 4, 11, 0, 7, 10, 11, 3, 1, 2, 3, 9, 12, 1, 3, 4, 6, 12, 1, 2, 7, 0, 1, 2, 1, 1, 6, 1, 1, 7, 8, 4, 3, 10, 1, 10, 1, 3, 5, 4, 4, 10, 10, 5, 0, 0, 2, 1, 3, 10, 5, 1, 9, 6, 3, 1, 1, 4, 1, 0, 0, 5, 4, 8, 1, 4, 7, 3, 6, 12, 5, 2, 3, 2, 0, 4, 2, 2, 9, 4, 4, 5, 9, 0, 4, 1, 12, 7, 4, 10, 4, 4, 6, 0, 0, 12, 7, 2, 12, 4, 1, 9, 3, 1, 2, 4, 2, 3, 4, 2, 3, 2, 4, 1, 0, 3, 8, 7, 8, 9, 5, 7, 0, 12, 6, 4, 0, 9, 7, 0, 1, 2, 5, 0, 4, 12, 6, 3, 3, 3, 1, 0, 6, 3, 1, 1, 5, 1, 8, 1, 3, 1, 12, 12, 9, 3, 12, 10, 8, 9, 5, 0, 10, 7, 1, 3, 3, 1, 5, 4, 9, 8, 8, 2, 8, 3, 3, 5, 3, 4, 2, 4, 12, 4, 3, 2, 2, 5, 0, 4, 3, 4, 0, 0, 9, 4, 0, 8, 3, 0, 4, 4, 0, 10, 8, 0, 0, 0, 0, 0, 0, 0, 8, 0, 8, 0, 0, 7, 0, 0, 0, 0, 0, 8, 7, 8, 7, 7]
        
        reel3.icons = [11, 6, 7, 8, 1, 1, 5, 1, 5, 0, 12, 3, 12, 1, 9, 2, 5, 1, 11, 5, 1, 0, 4, 9, 8, 0, 0, 1, 4, 5, 0, 3, 3, 4, 4, 1, 7, 3, 2, 0, 3, 3, 3, 3, 4, 0, 7, 9, 1, 5, 3, 0, 11, 1, 4, 3, 3, 2, 11, 12, 8, 0, 1, 1, 8, 10, 1, 3, 2, 1, 8, 3, 9, 4, 1, 0, 1, 0, 0, 0, 2, 5, 3, 3, 5, 1, 3, 9, 6, 1, 10, 1, 4, 7, 4, 4, 4, 1, 0, 2, 6, 4, 3, 2, 1, 2, 4, 0, 3, 7, 1, 9, 2, 1, 3, 8, 6, 3, 0, 0, 6, 1, 8, 6, 3, 1, 4, 1, 9, 0, 3, 2, 2, 0, 11, 1, 0, 7, 2, 10, 0, 9, 6, 2, 2, 2, 3, 4, 1, 0, 7, 0, 6, 2, 2, 9, 7, 8, 9, 3, 4, 6, 10, 4, 12, 5, 4, 1, 2, 5, 11, 0, 6, 4, 7, 2, 0, 1, 9, 5, 2, 8, 9, 12, 7, 11, 1, 11, 1, 1, 2, 5, 10, 8, 4, 5, 10, 0, 4, 8, 11, 11, 6, 4, 0, 8, 8, 4, 1, 3, 1, 10, 3, 6, 4, 1, 8, 0, 0, 1, 0, 3, 2, 7, 4, 3, 7, 11, 9, 10, 1, 9, 5, 1, 3, 3, 1, 1, 1, 10, 3, 8, 3, 0, 10, 2, 2, 2, 10, 0, 9, 10, 4, 7, 2, 2, 0, 2, 0, 2, 0, 8, 3, 10, 9, 1, 3, 11, 1, 2, 7, 3, 2, 1, 4, 7, 0, 0, 4, 5, 5, 2, 4, 4, 2, 7, 5, 4, 12, 5, 6, 6, 5, 7, 0, 7, 1, 3, 12, 5, 1, 8, 10, 3, 3, 1, 3, 0, 12, 4, 6, 0, 4, 3, 4, 3, 2, 3, 3, 2, 6, 3, 6, 2, 4, 0, 0, 2, 0, 0, 4, 0, 4, 6, 6, 4, 2, 10, 2, 4, 4, 2, 0, 0, 0, 0, 4, 12, 2, 0, 4, 11, 2, 12, 11, 2, 2, 2, 2, 12, 12, 12]
        
        reel4.icons = [1, 5, 4, 2, 1, 8, 2, 4, 3, 3, 6, 4, 4, 3, 8, 7, 4, 12, 1, 11, 8, 1, 5, 9, 9, 2, 9, 1, 1, 6, 0, 5, 2, 4, 8, 8, 3, 0, 2, 3, 0, 5, 2, 0, 4, 6, 5, 11, 2, 7, 11, 12, 0, 12, 5, 4, 3, 8, 3, 1, 7, 1, 4, 10, 11, 8, 1, 5, 11, 2, 0, 12, 11, 3, 3, 3, 1, 1, 9, 6, 1, 3, 4, 1, 11, 0, 3, 8, 0, 4, 1, 1, 3, 12, 10, 0, 2, 5, 5, 4, 4, 11, 2, 3, 3, 2, 11, 2, 2, 3, 2, 0, 1, 0, 2, 4, 6, 7, 4, 2, 3, 5, 2, 0, 1, 0, 2, 1, 1, 3, 2, 1, 3, 6, 0, 2, 1, 5, 0, 0, 2, 1, 12, 1, 4, 0, 3, 2, 1, 3, 1, 2, 0, 4, 1, 11, 2, 9, 7, 2, 7, 4, 8, 1, 1, 12, 0, 0, 9, 6, 9, 4, 9, 5, 12, 1, 2, 1, 1, 3, 7, 0, 0, 11, 8, 12, 6, 6, 6, 7, 1, 1, 0, 7, 1, 0, 2, 5, 1, 7, 5, 0, 7, 3, 5, 2, 1, 0, 0, 12, 7, 1, 4, 1, 2, 9, 4, 0, 3, 6, 0, 5, 0, 12, 2, 7, 3, 2, 3, 4, 0, 0, 1, 7, 12, 0, 11, 6, 12, 3, 9, 10, 2, 0, 9, 0, 4, 0, 10, 7, 4, 10, 2, 2, 7, 0, 2, 11, 0, 1, 3, 3, 2, 7, 4, 9, 3, 2, 0, 10, 11, 2, 0, 1, 4, 1, 5, 0, 7, 0, 5, 2, 3, 10, 4, 0, 9, 2, 3, 1, 0, 8, 1, 0, 2, 10, 0, 9, 4, 4, 4, 0, 3, 0, 3, 0, 1, 2, 4, 4, 4, 10, 5, 2, 0, 6, 2, 4, 5, 9, 2, 4, 10, 8, 2, 1, 8, 8, 6, 10, 1, 4, 10, 8, 4, 1, 4, 6, 4, 6, 6, 6, 3, 4, 3, 6, 4, 10, 3, 4, 9, 8, 8, 3, 3, 3, 10, 10, 3, 3, 3, 3]
        
        reel5.icons = [4, 3, 4, 2, 0, 4, 5, 2, 2, 0, 0, 0, 9, 2, 2, 2, 3, 1, 2, 0, 9, 8, 1, 2, 8, 6, 5, 1, 2, 2, 1, 5, 4, 9, 5, 2, 4, 11, 10, 8, 7, 4, 9, 0, 3, 10, 1, 0, 1, 3, 3, 11, 8, 0, 4, 8, 1, 6, 7, 5, 5, 3, 10, 8, 9, 2, 4, 4, 3, 8, 3, 2, 0, 9, 3, 5, 4, 10, 0, 2, 7, 4, 0, 10, 5, 0, 3, 0, 2, 3, 2, 9, 9, 0, 7, 11, 1, 0, 10, 3, 0, 0, 0, 1, 4, 5, 0, 3, 1, 3, 0, 0, 0, 2, 2, 1, 1, 2, 1, 9, 2, 12, 12, 0, 0, 2, 9, 5, 1, 3, 7, 4, 3, 0, 8, 2, 0, 10, 6, 11, 9, 2, 4, 2, 4, 6, 3, 3, 2, 10, 2, 1, 4, 3, 11, 2, 5, 1, 9, 3, 1, 9, 0, 7, 9, 2, 7, 3, 6, 1, 5, 11, 1, 2, 0, 1, 1, 8, 0, 0, 7, 4, 4, 0, 1, 6, 2, 4, 2, 4, 0, 5, 7, 12, 6, 0, 9, 8, 2, 12, 3, 5, 2, 6, 1, 2, 7, 6, 10, 3, 4, 3, 2, 3, 1, 10, 5, 4, 1, 8, 3, 1, 9, 6, 2, 1, 7, 1, 2, 12, 12, 3, 0, 2, 3, 3, 6, 4, 0, 0, 3, 3, 2, 0, 0, 3, 2, 11, 8, 2, 2, 1, 2, 11, 11, 2, 4, 10, 3, 3, 4, 2, 7, 0, 3, 2, 1, 6, 7, 10, 0, 1, 5, 7, 1, 4, 0, 0, 1, 0, 3, 0, 11, 1, 10, 4, 0, 10, 0, 1, 7, 10, 4, 1, 6, 7, 1, 6, 1, 3, 1, 5, 7, 5, 1, 3, 12, 6, 4, 4, 6, 0, 1, 4, 12, 4, 4, 11, 0, 0, 5, 4, 1, 0, 3, 3, 8, 4, 3, 3, 3, 3, 1, 1, 8, 1, 4, 8, 5, 4, 1, 1, 1, 11, 6, 6, 7, 6, 11, 4, 12, 4, 4, 12, 12, 8, 4, 4, 8, 11, 12, 12]
        
        //set up a random initial current icon for each reel
        reel1.currentIcon = randomInt(0, reel1.icons.length - 1)
        reel2.currentIcon = randomInt(0, reel2.icons.length - 1)
        reel3.currentIcon = randomInt(0, reel3.icons.length - 1)
        reel4.currentIcon = randomInt(0, reel4.icons.length - 1)
        reel5.currentIcon = randomInt(0, reel5.icons.length - 1)
        
        //set up the initial x position of each reel
        reel1.x = 0
        reel2.x = iconWidth
        reel3.x = iconWidth * 2
        reel4.x = iconWidth * 3
        reel5.x = iconWidth * 4
        
        //set up the initial y position of each reel
        reel1.y = 0
        reel2.y = 0
        reel3.y = 0
        reel4.y = 0
        reel5.y = 0
        
        //set up the time spent spinning per spin for each reel
        reel1.t = 0
        reel2.t = 0
        reel3.t = 0
        reel4.t = 0
        reel5.t = 0 
        
        //set up the delay of each reel
        reel1.delay = 0
        reel2.delay = 5
        reel3.delay = 10
        reel4.delay = 15
        reel5.delay = 20 
        
        //set up the speed  of each reel
        reel1.v = 0
        reel2.v = 0
        reel3.v = 0
        reel4.v = 0
        reel5.v = 0 
        
        //setup the acceleration of each reel
        reel1.a = a
        reel2.a = a
        reel3.a = a
        reel4.a = a
        reel5.a = a 
        
        //setup the deceleration of each reel
        reel1.d = d
        reel2.d = d
        reel3.d = d
        reel4.d = d
        reel5.d = d 
        
        //game status
        firstScreen = true
        spinning = false
        
        //flashy icons
        flashPeriod = 6
        reverseFlash = false
        
        
        canvasMain = document.createElement("canvas")
        canvasMain.style.background = "black"
        canvasMain.width = 896
        canvasMain.height = 640
        document.body.appendChild(canvasMain)
        
        ctxMain = canvasMain.getContext("2d")
                
        yHeader = 128
        leftBorder = 128
        
        //create the main stage (using the 'van der Spuy' engine)
        stage = new DisplayObject()
        stage.width = canvasMain.width
        stage.height = canvasMain.height  
        
        //create the Info Panel stage (using the 'van der Spuy' engine)
        infoPanelStage = new DisplayObject()
        infoPanelStage.width = canvasMain.width
        infoPanelStage.height = canvasMain.height  
        
        /////////////////////////////////
        //Frame Images (header, sides and control panel)
        god0 = sprite(frameImages[4], canvasMain.width / 2 - 64, 0)
        god0.width = iconWidth
        god0.height = iconWidth
        stage.addChild(god0)
        
        header = sprite(frameImages[5], 0, 0)        
        stage.addChild(header)
        
        frameLeft = sprite(frameImages[0], 0, yHeader, 128, 384)
        stage.addChild(frameLeft)
                
        frameRight = sprite(frameImages[1], frameLeft.width + canvasReels.width, yHeader, 128, 384)
        stage.addChild(frameRight)
        
        dragonLeft = sprite(frameImages[2], -140, frameLeft.y + frameLeft.height + 25)        
        dragonLeft.width = 549
        dragonLeft.height = 316
        stage.addChild(dragonLeft)
                
        dragonRight = sprite(frameImages[3], canvasMain.width - 410, frameLeft.y + frameLeft.height + 25)
        dragonRight.width = 549
        dragonRight.height = 316
        stage.addChild(dragonRight)
        
        /////////////////////////////////
        //The Control Panel
        //the Spin button
        spinButtonWidth = 110
        spinButtonHeight = 110
                
        spinButton = button([buttonImages[0], buttonImages[1], buttonImages[2]],
            (canvasMain.width / 2) - (spinButtonWidth / 2),
            yHeader + canvasReels.height)
        spinButton.width = spinButtonWidth
        spinButton.height = spinButtonHeight        
                
        spinButton.release = () => { 
            
            spinButton.gotoAndStop(2)          
            
            spinButton.interactive = false  
            
            firstScreen = false
            spinning = true
            setReels() 

            infoButton.interactive = false
            coinUpButton.interactive = false
            coinDownButton.interactive = false
            showWinningLines = false
            showWinningLine = 0
            winningLines = []
            totalWinningLines = 0
            win = 0
            balance -= bet
            showFlashyIcons = false
            flashCounter = 0
            flashTime = 0   
            reverseFlash = false
            updateFooter()            
            
            if(consecutiveNoWins === CONSECUTIVE_NO_WINS) {            
                armyComing.play().catch(err => console.log('Playing failed:', err))
                consecutiveNoWins = 0
            }
        }
        
        stage.addChild(spinButton)
        
        
        //the coin buttons
        coinButtonWidth = 32
        coinButtonHeight = 32
        
        coinUpButton = button([buttonImages[3], buttonImages[4], buttonImages[5]],
            spinButton.x + spinButton.width,
            spinButton.y + spinButton.height - coinButtonHeight)
        coinUpButton.width = coinButtonWidth
        coinUpButton.height = coinButtonHeight
               
        coinUpButton.release = () => {                        
            if(bet < betMax) {
                bet += 10
                updateFooter()
            }
        }
        
        stage.addChild(coinUpButton)
        
        
        coinDownButton = button([buttonImages[6], buttonImages[7], buttonImages[8]],
            spinButton.x - coinButtonWidth,
            spinButton.y + spinButton.height - coinButtonHeight)
        coinDownButton.width = coinButtonWidth
        coinDownButton.height = coinButtonHeight
        
        coinDownButton.release = () => {
            if(bet >= betMin * 2) {
                bet -= 10
                updateFooter()
            }
        }
        
        stage.addChild(coinDownButton)
        
        //the info button
        infoButtonWidth = 32
        infoButtonHeight = 32
        infoButton = button([buttonImages[9], buttonImages[10], buttonImages[11]],
            canvasMain.width - (yHeader / 2), 
            (yHeader / 2) - infoButtonHeight / 2)
        
        infoButton.release = () => {
            
            showFlashyIcons = false
            showWinningLines = false            
            showInfoPanels = true
            spinButton.interactive = false
            backButton.interactive = true
            leftButton.interactive = true
            rightButton.interactive = true
            panelToShow = 1
        }
        
        stage.addChild(infoButton)
        
        
        /////////////////////////////////
        //footer info
        bet = 100
        balance = 100000
        totalWinningLines = 0
        win = 0      
        betMin = 10
        betMax = 100
        
        footerHeight = 20
        yFooter = canvasMain.height - footerHeight
        footerFont = "1pc sans-serif"
        footerFillStyle = "white"
        
        textBet = text("Bet: €" + bet, footerFont, footerFillStyle, 50, yFooter)
        stage.addChild(textBet)        
        
        textBalance = text("Balance: €" + balance.toFixed(2), footerFont, footerFillStyle, 200, yFooter)
        stage.addChild(textBalance)        
        
        textWin = text("Win: €" + win, footerFont, footerFillStyle, 580, yFooter)
        stage.addChild(textWin)       
        
        textTotalWinningLines = text("Winning Lines: " + totalWinningLines, footerFont, footerFillStyle, 700, yFooter)
        stage.addChild(textTotalWinningLines)        
        
                 
        /////////////////////////////////
        //create a pointer
        pointer = makePointer(canvasMain)
        
        /////////////////////////////////
        //bet settlement
        payTable = new PayTable()
        winningLines = []
        showWinningLine = 0
        showWinningLinePeriod = 50
        showWinningLineTime = 0        
        winLineText = ""
        winLineFont = "bold 1.5pc sans-serif"
        winLineTextColor = "RGB(233, 123, 8)"
        
        ctxMain.font = winLineFont
        ctxMain.fillStyle = winLineTextColor
        
        /////////////////////////////////
        //Info Panels
        infoBottom = sprite(infoPanelsImages[0], 0, canvasMain.height - 108)
        infoBottom.width = canvasMain.width
        infoBottom.height = 108        
        
        infoPanelStage.addChild(infoBottom)
        
        //Info Panel Back Panel
        //Back button
        backButton = button([buttonImages[12], buttonImages[13], buttonImages[14]],
                canvasMain.width / 2 - 48, infoBottom.y - 48)
        backButton.width = 96
        backButton.height = 48
        
        backButton.interactive = false
        
        backButton.release = () => {
            
            backButton.interactive = false
            leftButton.interactive = false
            rightButton.interactive = false
            showInfoPanels = false
            spinButton.interactive = true
            ctxMain.font = winLineFont
            
        }
        
        infoPanelStage.addChild(backButton)
        
        //Left Info Panel button
        leftButton = button([buttonImages[15], buttonImages[16], buttonImages[17]],
            backButton.x - 20 - 32, backButton.y + 24 - 16)
        leftButton.width = 32
        leftButton.height = 32
        
        leftButton.interactive = false
        
        leftButton.release = () => {
        
            if(panelToShow === 2)
                panelToShow = 1
            else if(panelToShow === 1)
                panelToShow = 2
        }
        
        infoPanelStage.addChild(leftButton)
        
        //Right Info Panel button
        rightButton = button([buttonImages[18], buttonImages[19], buttonImages[20]],
            backButton.x + backButton.width + 20, backButton.y + 24 - 16)
        rightButton.width = 32
        rightButton.height = 32
        
        rightButton.interactive = false
        
        rightButton.release = () => { 
            
            if(panelToShow === 1)
                panelToShow = 2
            else if(panelToShow === 2)
                panelToShow = 1
        
        }
        
        infoPanelStage.addChild(rightButton)
        
        /////////////////////////////////
        //sound
        warHorn.play()
        consecutiveNoWins = 0
        
        /////////////////////////////////
        resolve()
        
    })
}

///////////////////////////////
//gameLoop
///////////////////////////////
function gameLoop() {
    
    requestAnimationFrame(gameLoop)
    
    ///////////////////////////////////////////////////////////////
    //Main canvas    
        
    //get buttons feedback
    buttons.forEach(button => {
            
            button.update(pointer, canvasMain)
    
        }) 
    
    render(canvasMain, stage)
    
    ///////////////////////////////////////////////////////////////
    //Reels canvas    
    if(spinning) {
        
        ctxReels.clearRect(0, 0, canvasReels.width, canvasReels.height)

        if(reel1.spinning) reel1.spinReel()
        if(reel2.spinning) reel2.spinReel()
        if(reel3.spinning) reel3.spinReel()
        if(reel4.spinning) reel4.spinReel()
        if(reel5.spinning) reel5.spinReel()
        
        //settle bets
        if(!reel1.spinning && 
            !reel2.spinning && 
            !reel3.spinning && 
            !reel4.spinning && 
            !reel5.spinning) {
                
                spinning = false
                identifyDisplayedIcons()    
                settle()                
                showFlashyIcons = true
            }
    } else {            //if not spinning
        
        ctxReels.clearRect(0, 0, canvasReels.width, canvasReels.height)      
        
    }
    
    drawReel(reel1)
    drawReel(reel2)
    drawReel(reel3)
    drawReel(reel4)
    drawReel(reel5)
    
    ///////////////////////////////////////////////////////////////
    //flash any flashy icons
    if(showFlashyIcons)
        flashIcons()
    
    ///////////////////////////////////////////////////////////////
    //display any winning lines
    if(showWinningLines === true) {
        
        //draw a border around each icon of the winning line currently being displayed
        for(let x = 0; x < winningLines[showWinningLine].line.length; x++)
            ctxMain.drawImage(winningBorderImages[0], 
                leftBorder + (x * iconWidth),
                yHeader + (winningLines[showWinningLine].line[x] * iconHeight),
                iconWidth,
                iconHeight)                      
        
        if(winningLines[showWinningLine].combination === 3)
            winAmountY = winningLines[showWinningLine].line[2]
        else if(winningLines[showWinningLine].combination === 4)
            winAmountY = winningLines[showWinningLine].line[3]
        else if(winningLines[showWinningLine].combination === 5)
            winAmountY = winningLines[showWinningLine].line[4]
        
        if(winningLines[showWinningLine].prize < 100)
            ctxMain.fillText("€" + winningLines[showWinningLine].prize.toFixed(2), leftBorder + canvasReels.width + 20, 
                yHeader + (winAmountY * iconHeight) + (iconHeight / 2) + 8)
        else
            ctxMain.fillText("€" + winningLines[showWinningLine].prize.toFixed(0), leftBorder + canvasReels.width + 20, 
                yHeader + (winAmountY * iconHeight) + (iconHeight / 2) + 8)
        
         
       //parse through each winning line at the set interval of showWinningLinePeriod
       if(showWinningLineTime < showWinningLinePeriod) {
            showWinningLineTime++
        } else {
            
            showWinningLineTime = 0
            
            if(showWinningLine < winningLines.length - 1)
                showWinningLine++
            else
                showWinningLine = 0
        }                
    }
    
    ///////////////////////////////////////////////////////////////
    //display the info panel
    if(showInfoPanels === true) {
        
        ctxMain.clearRect(0, 0, canvasMain.width, canvasMain.height)      
        
        render(canvasMain, infoPanelStage)
        
        if(panelToShow === 1) {

            ctxMain.drawImage(infoPanelsImages[1], 0, 20, 896, 464)

            ctxMain.font = "bold 1pc Arial"

            //Tier1
            ctxMain.fillText("€" + (payTable.combination5[12] * bet).toFixed(2), 137, 75)
            ctxMain.fillText("€" + (payTable.combination4[12] * bet).toFixed(2), 137, 101)
            ctxMain.fillText("€" + (payTable.combination3[12] * bet).toFixed(2), 137, 128)

            ctxMain.fillText("€" + (payTable.combination5[11] * bet).toFixed(2), 437, 75)
            ctxMain.fillText("€" + (payTable.combination4[11] * bet).toFixed(2), 437, 101)
            ctxMain.fillText("€" + (payTable.combination3[11] * bet).toFixed(2), 437, 128)

            ctxMain.fillText("€" + (payTable.combination5[10] * bet).toFixed(2), 730, 75)
            ctxMain.fillText("€" + (payTable.combination4[10] * bet).toFixed(2), 730, 101)
            ctxMain.fillText("€" + (payTable.combination3[10] * bet).toFixed(2), 730, 128)

            //Tier 2
            ctxMain.font = ".8pc Arial"

            ctxMain.fillText("€" + (payTable.combination5[9] * bet).toFixed(2), 89, 225)
            ctxMain.fillText("€" + (payTable.combination4[9] * bet).toFixed(2), 89, 245)
            ctxMain.fillText("€" + (payTable.combination3[9] * bet).toFixed(2), 89, 265)

            ctxMain.fillText("€" + (payTable.combination5[8] * bet).toFixed(2), 262, 225)
            ctxMain.fillText("€" + (payTable.combination4[8] * bet).toFixed(2), 262, 245)
            ctxMain.fillText("€" + (payTable.combination3[8] * bet).toFixed(2), 262, 265)

            ctxMain.fillText("€" + (payTable.combination5[7] * bet).toFixed(2), 442, 225)
            ctxMain.fillText("€" + (payTable.combination4[7] * bet).toFixed(2), 442, 245)
            ctxMain.fillText("€" + (payTable.combination3[7] * bet).toFixed(2), 442, 265)

            ctxMain.fillText("€" + (payTable.combination5[6] * bet).toFixed(2), 621, 225)
            ctxMain.fillText("€" + (payTable.combination4[6] * bet).toFixed(2), 621, 245)
            ctxMain.fillText("€" + (payTable.combination3[6] * bet).toFixed(2), 621, 265)

            ctxMain.fillText("€" + (payTable.combination5[5] * bet).toFixed(2), 800, 225)
            ctxMain.fillText("€" + (payTable.combination4[5] * bet).toFixed(2), 800, 245)
            ctxMain.fillText("€" + (payTable.combination3[5] * bet).toFixed(2), 800, 265)

            //Tier 3
            ctxMain.fillText("€" + (payTable.combination5[4] * bet).toFixed(2), 86, 377)
            ctxMain.fillText("€" + (payTable.combination4[4] * bet).toFixed(2), 86, 397)
            ctxMain.fillText("€" + (payTable.combination3[4] * bet).toFixed(2), 86, 417)

            ctxMain.fillText("€" + (payTable.combination5[3] * bet).toFixed(2), 262, 377)
            ctxMain.fillText("€" + (payTable.combination4[3] * bet).toFixed(2), 262, 397)
            ctxMain.fillText("€" + (payTable.combination3[3] * bet).toFixed(2), 262, 417)

            ctxMain.fillText("€" + (payTable.combination5[2] * bet).toFixed(2), 442, 377)
            ctxMain.fillText("€" + (payTable.combination4[2] * bet).toFixed(2), 442, 397)
            ctxMain.fillText("€" + (payTable.combination3[2] * bet).toFixed(2), 442, 417)

            ctxMain.fillText("€" + (payTable.combination5[1] * bet).toFixed(2), 621, 377)
            ctxMain.fillText("€" + (payTable.combination4[1] * bet).toFixed(2), 621, 397)
            ctxMain.fillText("€" + (payTable.combination3[1] * bet).toFixed(2), 621, 417)

            ctxMain.fillText("€" + (payTable.combination5[0] * bet).toFixed(2), 800, 377)
            ctxMain.fillText("€" + (payTable.combination4[0] * bet).toFixed(2), 800, 397)
            ctxMain.fillText("€" + (payTable.combination3[0] * bet).toFixed(2), 800, 417)
        }
        else if(panelToShow === 2) {
            
            ctxMain.drawImage(infoPanelsImages[2], 0, 20, 896, 464)
        }
    }
    
}

///////////////////////////////
//drawReel
///////////////////////////////
function drawReel(reel) {
    
    for(let i = -1; i < 3; i++) {
        
            if(reel.currentIcon + i < 0)
                reel.drawIcon = reel.icons.length - 1
            else if(reel.currentIcon + i === reel.icons.length)
                reel.drawIcon = 0
            else if(reel.currentIcon + i === reel.icons.length + 1)
                reel.drawIcon = 1
            else 
                reel.drawIcon = reel.currentIcon + i
        
        ctxReels.drawImage(iconImages[reel.icons[reel.drawIcon]], 
            reel.x,
            reel.y + (i * iconHeight),
            iconWidth,
            iconHeight)                       
    } 
    ctxMain.drawImage(canvasReels, leftBorder, yHeader)

    if(reel.y >= iconHeight) {
    
        reel.y -= iconHeight

        reel.currentIcon--

        if(reel.currentIcon < 0 )
            reel.currentIcon = reel.icons.length - 1
    }    
}

///////////////////////////////
//settle function
///////////////////////////////
function settle() {
    
    //reel 1
    for(let i = 0; i < 3; i++) {
        
        //reel 2
        for(let j = 0; j < 3; j++) { 
            if(reel1.displayedIcons[i] !== reel2.displayedIcons[j]) {            
                continue
            } 
            
            //reel 3
            for(let k = 0; k < 3; k++) { 
                if(reel2.displayedIcons[j] !== reel3.displayedIcons[k]) {                    
                    continue
                } else {
                //console.log("i: " + i + ", j: " + j + ", k: " + k)
                if(reel1.displayedIcons[i] === reel2.displayedIcons[j] 
                        && reel2.displayedIcons[j] === reel3.displayedIcons[k])
                    if(reel3.displayedIcons[k] !== reel4.displayedIcons[0] &&
                            reel3.displayedIcons[k] !== reel4.displayedIcons[1] &&
                            reel3.displayedIcons[k] !== reel4.displayedIcons[2]) {                        
                        winningLines.push(new WinningLine([i, j, k]))
                        winningLines[winningLines.length - 1].combination = 3                                          
                        winningLines[winningLines.length - 1].prize = payTable.combination3[reel1.displayedIcons[i]] * bet                        
                    }
                }
                //reel 4
                for(let l = 0; l < 3; l++) {                     
                    if(reel3.displayedIcons[k] !== reel4.displayedIcons[l]) {
                           continue                        
                    } else {                        
                        if(reel1.displayedIcons[i] === reel2.displayedIcons[j] 
                            && reel2.displayedIcons[j] === reel3.displayedIcons[k]
                            && reel3.displayedIcons[k] === reel4.displayedIcons[l])
                        if(reel4.displayedIcons[l] !== reel5.displayedIcons[0] &&
                            reel4.displayedIcons[l] !== reel5.displayedIcons[1] &&
                            reel4.displayedIcons[l] !== reel5.displayedIcons[2]) {                        
                            winningLines.push(new WinningLine([i, j, k, l]))
                            winningLines[winningLines.length - 1].combination = 4                            
                            winningLines[winningLines.length - 1].prize = payTable.combination4[reel1.displayedIcons[i]] * bet
                        }
                    }                    
                
                    
                    //reel 5
                    for(let m = 0; m < 3; m++) {
                        if(reel4.displayedIcons[l] != reel5.displayedIcons[m]) {
                           continue                        
                        } else {                            
                            if(reel1.displayedIcons[i] === reel2.displayedIcons[j] 
                                && reel2.displayedIcons[j] === reel3.displayedIcons[k]
                                && reel3.displayedIcons[k] === reel4.displayedIcons[l]
                                && reel4.displayedIcons[l] === reel5.displayedIcons[m]) {
                                winningLines.push(new WinningLine([i, j, k, l, m]))    
                                winningLines[winningLines.length - 1].combination = 5                                
                                winningLines[winningLines.length - 1].prize = payTable.combination5[reel1.displayedIcons[i]] * bet
                            }                               
                        }
                    }
                }
            }
        }
    } 
    
    if(winningLines.length > 0) {
        
        for(let i = 0; i < winningLines.length; i++)
            win += winningLines[i].prize
        
        balance += win              
        totalWinningLines = winningLines.length
        
        showWinningLines = true
    } else {
        consecutiveNoWins++            
        
    }
    
    if(balance - betMax < 0)
        balance = 100000
            
    updateFooter()
    
    spinButton.interactive = true        
    infoButton.interactive = true
    coinUpButton.interactive = true
    coinDownButton.interactive = true
}

///////////////////////////////
//identifyDisplayedIcons function
///////////////////////////////
function identifyDisplayedIcons() {
        
    reel1.identifyDisplayedIcons()
    reel2.identifyDisplayedIcons()
    reel3.identifyDisplayedIcons()
    reel4.identifyDisplayedIcons()
    reel5.identifyDisplayedIcons()
    
}

///////////////////////////////
//setReels function
///////////////////////////////
function setReels() {
    
    reel1.spinning = true
    reel2.spinning = true
    reel3.spinning = true
    reel4.spinning = true
    reel5.spinning = true
    
    //different spinning time for each spin
    //each reel is to have a longer spin time than the one to its left
    reel1.spinTime = randomInt(spinTimeMin, spinTimeMax)
    reel2.spinTime = randomInt(reel1.spinTime, spinTimeMax)
    reel3.spinTime = randomInt(reel2.spinTime, spinTimeMax)
    reel4.spinTime = randomInt(reel3.spinTime, spinTimeMax)
    reel5.spinTime = randomInt(reel4.spinTime, spinTimeMax)
}

///////////////////////////////
//updateFooter function
///////////////////////////////
function updateFooter() {
    
    textBet.content = "Bet: €" + bet 
    textBalance.content = "Balance: €" + balance.toFixed(2)
    textTotalWinningLines.content = "Winning Lines: " + totalWinningLines
    textWin.content = "Win: €" + win.toFixed(2)     
}

///////////////////////////////
//flashIcons function
///////////////////////////////
function flashIcons() {
         
    //time the icon flashing 
    if(flashTime < flashPeriod) {
        flashTime++    
        
    } else {        
        flashTime = 0
        if(!reverseFlash) flashCounter++       
        else flashCounter--
    }
    if(flashCounter === shrineIconImages.length - 1)
        reverseFlash = true
    
    if(flashCounter === 0 && reverseFlash)
        showFlashyIcons = false
    
    //search for any flashy icons and flash them accordingly
    for(let n = 0; n < reels.length; n++) {        
        for(let i = 0; i < reels[n].displayedIcons.length; i++) {            
            //look for any shrines
            if(reels[n].displayedIcons[i] === 10)                
                drawIcon(shrineIconImages[flashCounter], reels[n], i)
            //look for any Sun Tzu
            if(reels[n].displayedIcons[i] === 11)                
                drawIcon(sunTzuIconImages[flashCounter], reels[n], i)
            //look for any Skull Warriors
            if(reels[n].displayedIcons[i] === 12)                
                drawIcon(skullWarriorIconImages[flashCounter], reels[n], i)
        }
    }        
}

///////////////////////////////
//drawIcon function
///////////////////////////////
function drawIcon(image, reel, i) {
    ctxMain.drawImage(image, 
        leftBorder + reel.x, 
        yHeader + (i * iconHeight),
        iconWidth,
        iconHeight)                
}

///////////////////////////////
//random function
///////////////////////////////
function randomInt(min, max) {
        
    return Math.floor(Math.random() * max) + min  
}
