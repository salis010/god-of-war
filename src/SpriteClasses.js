export let buttons = [];        

//////////////////////////////////////////
//**********************************
//DisplayObject Class
//**********************************
////////////////////////////////////

export class DisplayObject{
    constructor() {
        
        //The sprite's position and size
        this.x = 0;
        this.y = 0;
        this.width = 0;
        this.height = 0;
    
      
        //Rotation, alpha, visible, and scale properties
        this.rotation = 0;
        this.alpha = 1;
        this.visible = true;
        this.scaleX = 1;
        this.scaleY = 1;

        //`pivotX` and `pivotY` let you set the sprite's axis of rotation
        //(0.5 represents the sprite's center point)
        this.pivotX = 0.5;
        this.pivotY = 0.5;
        
        //Add `vw` and `vy` (velocity) variables that will help you move the sprite
        this.vx = 0;
        this.vy = 0;
    
        //A "private" `_layer` property
        this._layer = 0;

        //A `children` array on the sprite that will contain all the 
        //child sprites in this container
        this.children = [];

        //The sprite's `parent` property
        this.parent = undefined;
     
        //Optional drop shadow properties
        //Set `shadow` to `true` if you want the sprote to display a shadow
        this.shadow = false;
        this.shadowColor = "rgba(100, 100, 100, 0.5)";
        this.shadowOffsetX = 3;
        this.shadowOffsetY = 3;
        this.shadowBlur = 3;
        
        //Optional blend property
        this.blendModule = undefined;
    
        
        ///////////////////////////////////
        //Properties and advanced features:
        ///////////////////////////////////
        
        //Image states and animation
        this.frames = [];
        this.loop = true;
        this._currentFrame = 0;
        this.playing = false;
    
        //Can the sprite be drragged?
        this._draggable = undefined;
        
        //Is the sprite circular? If it is, equip it with a `radius` and `diameter`
        this._circular = false;
        
        //Is the sprite interactive?
        //If it is, it can become clickable or touchable
        this._interactive = false;
        
        //Buttons
     //   this.buttons = [];        
    }
        
    
    //////////////////////////////
    //Essentials
    //////////////////////////////
    
    //Global position
    get gx() {
        if (this.parent) {
            
            //The sprite's global x position is a combination of
            //its local x value and its parent's global x value
            return this.x + this.parent.gx;
        } else {
            return this.x;
        }
    }
    get gy() {
        if (this.parent) {
            
            //The sprite's global x position is a combination of
            //its local x value and its parent's global x value
            return this.y + this.parent.gy;
        } else {
            return this.y;
        }
    }
    
    //The `addChild` method lets you add sprites to this container
    addChild(sprite) {
        
        if(sprite.parent) {
            sprite.parent.removeChild(sprite);
        }
        
        sprite.parent = this;
        this.children.push(sprite);
    }
    
    removeChild(sprite) {
        
        if(sprite.parent === this) {
            this.children.splice(this.children.indexOf(sprite), 1);
        } else {
            throw new Error(sprite + "is not a child of " + this);
        }        
    }        
    
    //Depth layer
    get layer() {
        if(this._layer === 1)
            return this._layer;
    }
    set layer(value) {
        this._layer = value;
        if(this.parent) {
            this.parent.children.sort((a, b) => a.layer - b.layer);
        }
    }
    
    //Getters that return useful points on the sprite
    get halfWidth() {
        return this.width / 2;
    }
    get halfHeight() {
        return this.height / 2;
    }
    get centerX() {
        return this.x + this.halfWidth;
    }
    get centerY() {
        return this.y + this.halfHeight;
    }
    
    //////////////////
    //Conveniences
    //////////////////
    
    //A `position` getter. It returns an object with x and y properties
    get position() {
        return {x: this.x, y: this.y};
    }
    
    //A `setPosition` method to quickly set the sprite's x and y values
    setPosition(x, y) {
        this.x = x;
        this.y = y;
    }
    
    //The `localBounds` and `globalBounds` methods return an object
    //with `x`, `y`, `width`, and `height` properties that define
    //the dimensions and position of the sprite. This is a convenience
    //to help you set or test boundaries without having to know
    //these numbers or request them specifically in your code
    get localBounds() {
        return {
            x: this.x,  //I changed this, it was "x: 0,"
            y: this.y,  //I changed this, it was "y: 0,"
            width: this.width,
            height: this.height
        };       
    }
    
    get globalBounds() {
        return {
            x: this.gx,
            y: this.gy,
            width: this.gx + this.width,
            height: this.gy + this.height
        };
    }
    
    //`empty` is a convenience property that will return `true` or `false`
    //depending on whether this sprite's `children` array is empty
    get empty() {
        if(this.children.length === 0) {
            return true;
        } else {
            return false;
        }
    }
    
    
    //The following "put" methods help you position
    //another sprite in and around this sprite. You can position
    //sprites relative to this sprite's center, top, right, bottom or
    //left sides. The `xOffset` and `yOffset`
    //arguments determine by how much the other sprite's position
    //should be offset from this position.
    //In all these methods, `b` is the second sprite that is being
    //positioned relative to the first sprite (this one), `a`
    
    //Center `b` inside `a`
    putCenter(b, xOffset = 0, yOffset = 0) { ;
        let a = this;
        b.x = (a.x + a.halfWidth - b.halfWidth) + xOffset; 
        b.y = (a.y + a.halfHeight - b.halfHeight) + yOffset; 
    }
    
    //Position `b` above `a`
    putTop(b, xOffset = 0, yOffset = 0) {
        let a = this;
        b.x = (a.x + a.halfWidth - b.halfWidth) + xOffset;
        b.y = (a.y - b.height) + yOffset;
    }
    
    //Position `b` to the right of `a`
    putRight(b, xOffset = 0, yOffset = 0) {
        let a = this;
        b.x = (a.x + a.width) + xOffset;
        b.y = (a.y + a.halfHeight - b.halfHeight) + yOffset;
    }
    
    //Position `b` below `a`
    putBottom(b, xOffset = 0, yOffset = 0) {
        let a = this;
        b.x = (a.x + a.halfWidth - b.halfWidth) + xOffset;
        b.y = (a.y + b.height) + yOffset;
    }
    
    //Position `b` to the left of `a`
    putLeft(b, xOffset = 0, yOffset = 0) {
        let a = this;
        b.x = (a.x - b.width) + xOffset;
        b.y = (a.y + a.halfHeight - b.halfHeight) + yOffset;
    }
    
    ////////////////////////////////////////
    //Some extra conveniences for working with child sprites
    ////////////////////////////////////////
    
    swapChildren(child1, child2) {
        let index1 = this.children.indexOf(child1);
        let index2 = this.children.indexOf(child2);
        
        if(index1 !== -1 && index2 !== -1) {
            //Swap the indexes
            child1.childIndex = index2;
            child2.childINdex = index1;
            
            //Swap the array positions
            this.children[index1] = child2;
            this.children[index2] = child1;
        } else {
            throw new Error(`Both objects must be a child of the caller ${this}`);
        }
    }
    
    //`add` and `remove` let you add and remove many sprites at the same time
    add(...spritedToAdd) {
        spritesToAdd.forEach(sprite => this.addChild(sprite));
    }
    remove(...spritesToRemove) {
        spritesToRemove.forEach(sprite => this.removeChild(sprite));
    }
    
    /////////////////////////
    //Advanced features
    /////////////////////////
    
    //If the sprite has more than one frame, 
    //return the value of `_currentFrame`
    get currentFrame() {
        return this._currentFrame;
    }
    
    
    //The `circular` property lets you define whether a sprite
    //should be interpreted as a circular object. If yes set
    //`circular` to `true`, the sprite is given `radius` and `diameter`
    //properties. If you set `circular` to `false`, the `radius`
    //and `diameter` properties are deleted from the sprite
    get circular() {
        return this._circular;
    }
    set circular(value) {
        //Give the sprite `diameter` and `radius` properties
        //if `circular` is `true`
        if(value === true && this._circular === false) {
            Object.defineProperties(this, {
                diameter: {
                    get() {
                        return this.width;
                    },
                    set(value) {
                        this.width = value;
                        this.height = value;
                    },
                    enumerable: true, configurable: true
                },
                radius: {
                    get() {
                        return this.halfWidth;
                    },
                    set(value) {
                        this.width = value * 2;
                        this.height = value * 2;
                    },
                    enumerable: true, configurable: true
                }
            });
            
            //Set this sprite's `_circular` property to `true`
            this._circular = true;
        }
        
        //Remove the sprite's `diameter` and `radius` properties
        //if `circular` is `false`
        if(value === false && this._circular === true) {
            delete this.diameter;
            delete this.radius;
            this._circular = false;
        }
    }
/*
    //Is the sprite draggable by the pointer? If `draggable` is set
    //to `true`, the sprite is added to a `draggableSprites`
    //array. All the sprites in `draggableSprits` are updated each
    //frame to check whether they're being dragged.
    get draggable() {
        return this._draggable;
    }
    set draggable(value) {
        if(value === true) {
            draggableSprites.push(this);
            this._draggable = true;
        }
        
        //If it's `false`, remove it from the `draggableSprites` array
        
        if(value === false) {
            draggableSprites.splice(draggableSprites.indexOf(this), 1);
        }
        
    }
*/


    //Is the sprite interactive? If `interactive` is set to `true`,
    //the sprite is run through the `makeInteractive` function.
    //`makeInteractive` makes the sprite sensitive to pointer
    //actions. It also adds the sprite to the `buttons` array,
    //which is updated each frame.
    get interactive() {
        return this._interactive;
    }
    set interactive(value) {
        if(value === true) {
            
            //Add interactive properties to the sprite
            //so it can act like a button
            makeInteractive(this);
            
            //Add the sprite to the global `buttons` array so
            //it can be updated each frame
            buttons.push(this);
            
            //Set this sprite's private `_interactive` property to `true`
            this._interactive = true;
        }
        if(value === false) {
            
            //Remove the sprite's reference from the 
            //`buttons` array so that it's no longer affected
            //by mouse and touch interactivity
            buttons.splice(buttons.indexOf(this), 1);
            this._interactive = false;
        }
    }

}

function remove(...spritesToRemove) {
    spritesToRemove.forEach(sprite => {
        sprite.parent.removeChild(sprite);
    });
}


////////////////////////////////////
//**********************************
//Rectangle Class
//**********************************
////////////////////////////////////
class Rectangle extends DisplayObject {
    constructor(
        width = 32,
        height = 32,
        fillStyle = "gray",
        strokeStyle = "none",
        lineWidth = 0,
        x = 0,
        y = 0
    ){

        //Call the DisplayObject's constructor
        super();

        //Assigne the argument values to this sprite
        Object.assign(
                this, {width, height, fillStyle, strokeStyle, lineWidth, x, y}
                );
        //Add a `mask` property to enable optional masking
        this.mask = false;
    }
    
    //The `render` method explains how to draw the sprite
    render(ctx) {    
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.fillStyle = this.fillStyle;
        ctx.beginPath();
        //Draw the sprite around its `pivotX` and `pivotY` point
        ctx.rect(
                -this.width * this.pivotX,
                -this.height * this.pivotY,
                this.width,
                this.height
                );
        if(this.strokeStyle !== "none") ctx.stroke();
        if(this.fillStyle !== "none") ctx.fill();
        if(this.mask && this.mask === true) ctx.clip();
    }
}
//A higher-level wrapper for the rectangle sprite
function rectangle(width, height, fillStyle, strokeStyle, lineWidth, x, y) {
    
    //Create the sprite
    let sprite = new Rectangle(width, height, fillStyle, strokeStyle, lineWidth, x, y);
    
    //Add the sprite to the stage
    //stage.addChild(sprite);
    
    //Return the sprite to the main program
    return sprite;
}


////////////////////////////////////
//**********************************
//Circle Class
//**********************************
////////////////////////////////////

class Circle extends DisplayObject {
    constructor(
            diameter = 32,
            fillStyle = "gray",
            strokeStyle = "none",
            lineWidth = 0,
            x = 0,
            y = 0
    ) {
        //Call the DisplayObject's constructor
        super();
        
        //Enable `radius` and `diameter` properties
        this.circular = true;
        
        //Assign the argument values to this sprite
        Object.assign(
                this, {diameter, fillStyle, strokeStyle, lineWidth, x, y}
        );

        //Add a `mask` property to enable optional masking
        this.mask = false;
    }
    
    //The `render` method
    render(ctx) {
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.fillStyle = this.fillStyle;
        ctx.beginPath();
        ctx.arc(
            this.radius + (-this.diameter * this.pivotX),
            this.radius + (-this.diameter * this.pivotY),
            this.radius,
            0, 2 * Math.PI,
            false
        );
               
        if(this.strokeStyle !== "none") ctx.stroke();
        if(this.fillStyle !== "none") ctx.fill();
        if(this.mask && this.mask === true) ctx.clip();        
        
    }
}


//A higher level wrapper for the circle sprite
function circle(diameter, fillStyle, strokeStyle, lineWidth, x, y) {
    
    //create the sprite
    let sprite = new Circle(diameter, fillStyle, strokeStyle, lineWidth, x, y);
    
    //Add sprite
    //stage.addChild(sprite);
    
    return sprite;
}


////////////////////////////////////
//**********************************
//Line Class
//**********************************
////////////////////////////////////

class Line extends DisplayObject {
    constructor(
        strokeStyle = "none",
        lineWidth = 0,
        ax = 0,
        ay = 0,
        bx = 32,
        by = 32
    ){
    
        //Call the DisplayObject's constructor
        super();

        //Assign the argument values to this sprite
        Object.assign(this, {strokeStyle, lineWidth, ax, ay, bx, by} );

        //The `lineJoin` style
        //Options are "round", "mitre" and "bevel"
        this.lineJoin = "round";
    }
    
    //The `render` method
    render(ctx) {
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.lineJoin = this.lineJoin;
        ctx.beginPath();
        ctx.moveTo(this.ax, this.ay);
        ctx.lineTo(this.bx, this.by);
        if(this.strokeStyle !== "none") ctx.stroke();
    }
}

//A higher level wrapper for the Line sprite
function line(strokeStyle, lineWidth, ax, ay, bx, by) {
    let sprite = new Line(strokeStyle, lineWidth, ax, ay, bx, by);
    //stage.addChild(sprite);
    return sprite;
}


////////////////////////////////////
//**********************************
//Text Class
//**********************************
////////////////////////////////////

class Text extends DisplayObject {
    constructor(
        content = "Hello!",
        font = "12pc sans-serif",
        fillStyle = "black",
        x = 0,
        y = 0
    ){
        //Call the DisplayObject's constructor
        super();
        
        //Assign the argument values to this sprite
        Object.assign(this, {content, font, fillStyle, x, y} );
        
        //Set the default text baseline to "top"
        this.textBaseline = "top";
        
        //Set `strokeText` to "none"
        this.strokeText = "none";        
    }
    
    //The `render` method describes how to draw the sprite
    render(ctx) {
        ctx.font = this.font;
        ctx.strokeStyle = this.strokeStyle;
        ctx.lineWidth = this.lineWidth;
        ctx.fillStyle = this.fillStyle;
        
        //Measure the width and height of the text
        if(this.width === 0) this.width = ctx.measureText(this.content).width;
        if(this.height === 0) this.height = ctx.measureText("M").width;
        
        ctx.translate(
                -this.width * this.pivotX,
                -this.height * this.pivotY
        );
        ctx.textBaseline = this.textBaseline;
        ctx.fillText(
                this.content,
                0, 0
        );
        if(this.strokeText !== "none") ctx.strokeText();
    }
}

//A higher-level wrapper
export function text(content, font, fillStyle, x, y) {
    let sprite = new Text(content, font, fillStyle, x, y);
    //stage.addChild(sprite);
    return sprite;
}


////////////////////////////////////
//**********************************
//Group Class
//**********************************
////////////////////////////////////

class Group extends DisplayObject {
    constructor(...spritesToGroup) {
        //Call the DisplayObject's constructor
        super();
        
        //Group all the sprites listed in the constuctor arguments
        spritesToGroup.forEach(sprite => this.addChild(sprite));
    }
    
    //Groups have custome `addChild` and `removeChild` methods that call
    //a `calculateSize` method when any sprites are added or removed
    //from the group
    
    addChild(sprite) {
        if(sprite.parent) {
            sprite.parent.removeChild(sprite);
        }
        sprite.parent = this;
        this.children.push(sprite);
        
        //Figure out the new size of the group
        this.calculateSize();
    }
    
    removeChild(sprite) {
        if(sprite.parent === this) {
            this.children.splice(this.children.indexOf(sprite), 1);
            
            //Figure out the new size of the group
            this.calculateSize();
        } else {
            throw new Error(`${sprite} is not a child of ${this}`);
        }
    }
    
    calculateSize() {
        
        //Calculate the width based on the size of the largest child
        //that the sprite contains
        if(this.children.length > 0) {
            
            //Some temporary private variable to help track the new
            //calculated width and height
            this._newWidth = 0;
            this._newHeight = 0;
            
            //Find the width and height of the child sprites furthest
            //from the top left corner of the group
            this.children.forEach(child => {
                
                //Find child sprites that combined x value and width
                //that's greater than the current value of `_newWidth`
                if(child.x + child.width > this._newWidth) {
                    
                    //The new width is a combination of the child's
                    //x position and its width
                    this._newWidth = child.x + child.width;
                }
                if(child.y + child.height > this._newHeight) {
                    this._newHeight = child.y + child.height;
                }
            });
            
            //Apply the `_newWidth` and `_newHeight` tp this sprite's width
            //and height
            this.width = this._newWidth;
            this.height = this._newHeight;
        }
    }
}

function group(...spritesToGroup) {
    let sprite = new Group(...spritesToGroup);
    //stage.addChild(sprite);
    return sprite;
}

////////////////////////////////////
//**********************************
//Sprite Class
//**********************************
////////////////////////////////////

class Sprite extends DisplayObject {
    constructor(
        source,
        x = 0,
        y = 0
    ) {
    
        //Call the DisplayObject's constructor
        super();

        //Assign the argument values to this sprite
        Object.assign(this, {x, y});

        //We need to figure out what the source is, and the use
        //that source data to display the sprite image correctly

        //Is the source a Javascript Image object?
        if(source instanceof Image) {
            this.createFromImage(source);
        }

        //Is the source a tileset from a texture atlas?
        //(it is if it has a `frame` property)
        else if(source.frame) {
            this.createFromAtlas(source);
        }

        //If the source contains an `image` subproperty, this must
        //be a `frame` object that's defining the rectangular area of an inner subimage.
        //Use that subimage to make the sprite. If it doesn't contain a
        //`data` property, then it must be a single frame
        else if(source.image && !source.data) {
            this.createFromTileset(source);
        }

        //If the source contains an `image` subproperty
        //and a `data` property, then it contains multiple frames
        else if(source.image && source.data) {
            this.createFromTilesetFrames(source);
        }

        //Is the source an array? If so, what kind of array?
        else if(source instanceof Array) {
            if(source[0] && source[0].source) {

                //The source is an array of frames on a texture atlas tileset
                this.createFromAtlasFrames(source);
            }

            //It must be an array of image objects
            else if(source[0] instanceof Image) {
                this.createFromImages(source);
            }

            //throw an error if the sources in the array aren't recognized
            else {
                throw new Error(`The image sources in ${source} are not recognized`);
            }
        }
        else {
            throw new Error(`The image source ${source} is not recognized`);
        }
    }
    
    createFromImage(source) {
        
        //Throw an error if the source is not an Image object
        if(!(source instanceof Image)) {
            throw new Error(`{source} is not an image object`);
        }
        
        //Otherwise, create the sprite using an Image
        else {
            this.source = source;
            this.sourceX = 0;
            this.sourceY = 0;
            this.width = source.width;
            this.height = source.height;
            this.sourceWidth = source.width;
            this.sourceHeight = source.height;            
        }
    }
    
    createFromAtlas(source) {
        this.tilesetFrame = source;
        this.source = this.tilesetFrame.source;
        this.sourceX = this.tilesetFrame.frame.x;
        this.sourceY = this.tilesetFrame.frame.y;
        this.width = this.tilesetFrame.frame.w;
        this.height = this.tilesetFrame.frame.h;
        this.sourceWidth = this.tilesetFrame.frame.w;
        this.sourceHeight = this.tilesetFrame.frame.h;        
    }
    
    createFromTileset(source) {
        if(!(source.image instanceof Image)) {
            throw new Error(`${source.image} is not an image object`);
        } else {
            this.source = source.image;
            this.sourceX = source.x;
            this.sourceY = source.y;
            this.width = source.width;
            this.height = source.height;
            this.sourceWidth = source.width;
            this.sourceHeight = source.height;
        }
    }
    
    createFromTilesetFrames(source) {
        if(!(source.image instanceof Image)) {
            throw new Error(`${source.image} is not an image object`);
        } else {
            this.source = source.image;
            this.frames = source.data;
            
            //Set the sprite to the first frame
            this.sourceX = this.frames[0][0];
            this.sourceY = this.frames[0][1];
            this.width = source.width;
            this.height = source.height;
            this.sourceWidth = source.width;
            this.sourceHeight = source.height;
        }
    }
    
    createFromAtlasFrames(source) {
        this.frames = source;
        this.source = source[0].source;
        this.sourceX = source[0].frame.x;
        this.sourceY = source[0].frame.y;
        this.width = source[0].frame.w;
        this.height = source[0].frame.h;
        this.sourceWidth = source[0].frame.w;
        this.sourceHeight = source[0].frame.h;
    }
    
    createFromImages(source) {
        this.frames = source;
        this.source = source[0];
        this.sourceX = 0;
        this.sourceY = 0;
        this.width = source[0].width;
        this.height = source[0].height;
        this.sourceWidth = source[0].width;
        this.sourceHeight = source[0].height;
    }
    
    //Add a `gotoAndStop` method to go to a specific frame
    gotoAndStop(frameNumber) {
        if(this.frames.length > 0 && frameNumber < this.frames.length) {
            
            //a. Frame made from tileset images.
            //If each frame is an array, the the frames were made from an
            //ordinary Image object using the `frames` method
            if(this.frames[0] instanceof Array) {
                this.sourceX = this.frames[frameNumber][0];
                this.sourceY = this.frames[frameNumber][1];
            }
            
            //b. Frames made from texture atlas frames.
            //If each frame isn't an array, and it has a subobject called `frame`,
            //then the frame must be a texture atlas ID name.
            //In that case, get the source position from the atlas's `frame` object
            else if (this.frames[frameNumber].frame) {
                this.sourceX = this.frames[frameNumber].frame.x;
                this.sourceY = this.frames[frameNumber].frame.y;
                this.sourceWidth = this.frames[frameNumber].frame.w;
                this.sourceHeight = this.frames[frameNumber].frame.h;
                this.width = this.frames[frameNumber].frame.w;
                this.height = this.frames[frameNumber].frame.h;
            }
            
            //c. Frames made from individual Image objects.
            //If neither of the above is true, then each frame must be
            //an individual Image object
            else {
                this.source = this.frames[frameNumber];
                this.sourceX = 0;
                this.sourceY = 0;
                this.width = this.source.width;
                this.height = this.source.height;
                this.sourceWidth = this.source.width;
                this.sourceHeight = this.source.height;
            }
            
            //Set the `_currentFrame` value to the chosen frame
            this._currentFrame = frameNumber;
        }
            
        //Throw an error if this sprite doesn't contain any frames
        else {
            //throw new Error(`Frame number ${frameNumber} does not exist`);
        }
    }
    
    //The `render` method
    render(ctx) {        
        ctx.drawImage(
            this.source,
            this.sourceX, this.sourceY,
            this.sourceWidth, this.sourceHeight,
            -this.width * this.pivotX,
            -this.height * this.pivotY,
            this.width, this.height
        );        
    }
}
          
//A higher-level wrapper
export function sprite(source, x, y) {
    let sprite = new Sprite(source, x, y);
    //stage.addChild(sprite);
    return sprite;
}

////////////////////////////////////
//**********************************
//Button Class
//**********************************
////////////////////////////////////
    
class Button extends Sprite {
    constructor(source, x = 0, y = 0) {
        super(source, x, y);
        this.interactive = true;
    }
}

export function button(source, x, y) {
    let sprite = new Button(source, x, y);
    //stage.addChild(sprite);
    return sprite;
}


////////////////////////////////////
//**********************************
//render function
//**********************************
////////////////////////////////////
export function render(canvas, stage) {
    
    
    //Get a reference to the context
    let ctx = canvas.getContext("2d");
    
    
    //Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    
    //Loop through each sprite object in the stage's `children' array
    stage.children.forEach(sprite => {
        
        //Display a sprite
        displaySprite(sprite);
    });
    
    function displaySprite(sprite) {
        //console.log("sprite.width: " + sprite.width);
                
                
        //Only display the sprite if it's visible
        //and within the area of the canvas
        if(
                sprite.visible
                && sprite.gx < canvas.width + sprite.width
                &&sprite.gx + sprite.width >= -sprite.width
                && sprite.gy < canvas.height + sprite.height
                &&sprite.gy + sprite.height >= -sprite.height
                ) {
            
            //Save the canvas's present state
            ctx.save();
            
            //Shift the canvas to the center of the sprite's position
            ctx.translate(
                    sprite.x + (sprite.width * sprite.pivotX),
                    sprite.y + (sprite.height * sprite.pivotY)
            );
    
            //Set the sprite's `rotation`, `alpha`, and `scale`
            ctx.rotate(sprite.rotation);
            ctx.globalAlpha = sprite.alpha * sprite.parent.alpha;
            ctx.scale(sprite.scaleX, sprite.scaleY);
            
            //Display the sprite's optional shadow
            if(sprite.shadow) {
                ctx.shadowColor = sprite.shadowColor;
                ctx.shadowOffsetX = sprite.shadowOffsetX;
                ctx.shadowOffsetY = sprite.shadowOffsetY;
                ctx.shadowBlur = sprite.shadowBlur;
            }
            
            //Display the optional blend mode
            if(sprite.blendMode) ctx.globalCompositeOperation = sprite.blendMode;
            
            //Use the sprite's own `render` method to draw the sprite
            if(sprite.render) sprite.render(ctx);
            
            if(sprite.children && sprite.children.length > 0) {
                
                //Reset the context back to the parent sprite's top-left corner,
                //relative to the pivot point
                ctx.translate(-sprite.width * sprite.pivotX, -sprite.height * sprite.pivotY);
                
                //Loop through the parent sprite's children
                sprite.children.forEach(child => {
                    
                    //display the child
                    displaySprite(child);
                });
            }
            
            //Restore the canvas to its prenvious state
            ctx.restore();
        }
    }    
}

////////////////////////////////////
//**********************************
//frame function
//**********************************
////////////////////////////////////

function frame(source, x, y, width, height) {
    var o = {};
    o.image = source;
    o.x = x;
    o.y = y;
    o.width = width;
    o.height = height;
    return o;
}

////////////////////////////////////
//**********************************
//frames function
//**********************************
////////////////////////////////////

function frames(source, arrayOfPostions, width, height) {
    var o = {};
    o.image = source;
    o.data = arrayOfPositions;
    o.width = width;
    o.height = height;
    return o
}

////////////////////////////////////
//**********************************
//distance function
//**********************************
////////////////////////////////////

function distance(s1, s2) {
    let vx = s2.centerX - s1.centerX;
    let vy = s2.centerY - s1.centerY;
    
    return Math.sqrt(vx * vx + vy * vy);
}
/*
////////////////////////////////////
//**********************************
//makeInteractive function
//**********************************
////////////////////////////////////

function makeInteractive(o) {
    
    //The `press`, `release`, `over`, `out`, and `tap` methods. They're `undefined`
    //for now, but they can be defined in the game program
    o.press = o.press || undefined;
    o.release = o.release || undefined;
    o.over = o.over || undefined;
    o.out = o.out || undefined;
    o.tap = o.tap || undefined;
    
    //The `state` property tells you the button's
    //current state. Set its initial state to "up"
    o.state = "up";
    
    //The `action` property tells you whether it's being pressed or
    //released
    o.action = "";
    
    //The `pressed` and `hoverOver` Booleans are mainly for internal
    //use in this code to help figure out the correct state.
    //`pressed` is a Boolean that helps track whether
    //the sprite has been pressed down
    o.pressed = false;
    
    //The `pressed` and `hoverOver` Booleans are mainly for internal
    //use in this code to help figure out the correct state.
    //`pressed` is a Boolean that helps track whether 
    //the sprite has been pressed down
    o.pressed = false;
    
    //`hoverOver` is a Boolean that checks whether the pointer
    //has hovered over the sprite
    o.hoverOver = false;
    
    //The `update` method will be called each frame
    //inside the game loop
    o.update = (pointer, canvas) => {
        
        //Figure out if the pointer is touching the sprite
        let hit = pointer.hitTestSprite(o); 
        
        //1. Figure out the current state
        if(pointer.isUp) {
            
            //Up state
            o.state = "up";
            
            //Show the first image state frame, if this is a `Button` sprite
            if(o instanceof Button) o.gotoAndStop(0);
        }
        
        //If the pointer is touching the sprite, figure out
        //if the over or down state should be displayed
        if(hit) {
            
            //Over state
            o.state = "over";
            
            //Show the second image state frame if this sprite has
            //3 frames and it's a `Button` sprite
            if(o.frames && o.frames.length === 3 && o instanceof Button) {
                o.gotoAndStop(1);
            }
            
            //Down state
            if(pointer.isDown) {
                o.state = "down";
                
                //Show the third frame if this sprite is a `Button` sprite and it
                //has only three frames, or show the second frame if it
                //has only two frames]
                if(o instanceof Button) {
                    if(o.frames.length === 3) {
                        o.gotoAndStop(2);                        
                    } else {
                        o.gotoAndStop(1);
                    }
                }                
            }
        }
        
        
        //Perform the correct interactive action
        
        //a. Run the `press` method if the sprite state is "down" and
        //the sprite hasn't already been pressed
        if(o.state === "down") {
            if(!o.pressed) {
                if(o.press) o.press();
                o.pressed = true;
                o.action = "pressed";
            }
        }
        
        //b. Run the `release` method if the sprite state is "over" and
        //the sprite has been pressed
        if(o.state === "over") {
            if(o.pressed) {
                
                if(o.release) o.release();
                o.pressed = false;
                o.action = "released";
                
                //If the pointer was tapped and the user assigned a `tap`
                //method, call the `tap` method
                if(pointer.tapped && o.tap) o.tap();
            }
            
            //Run the `over` method if it has been assigned
            if(!o.hoverOver) {
                if(o.over) o.over();
                o.hoverOver = true;
            }
        }
        
        //c. Check whether the pointer has been released outside
        //the sprite's area. If the button state is "up" and it has
        //already been pressed, then run the `release` method
        if(o.state === "up") {
            if(o.presed) {
                if(o.release) o.release();
                o.pressed = false;
                o.action = "released";
            }
            
            //Run the `out` method if it has been assigned
            if(o.hoverOver) {
                if(o.out) o.out();
                o.hoverOver = false;
            }
        }
    };
    
}
*/



////////////////////////////////////
//**********************************
//makeInteractive function II
//**********************************
////////////////////////////////////

function makeInteractive(o) {
    
    //The `press`, `release`, `over`, `out`, and `tap` methods. They're `undefined`
    //for now, but they can be defined in the game program
    o.press = o.press || undefined;
    o.release = o.release || undefined;
    o.over = o.over || undefined;
    o.out = o.out || undefined;
    o.tap = o.tap || undefined;
    
    //The `state` property tells you the button's
    //current state. Set its initial state to "up"
    o.state = "up";
    
    //The `action` property tells you whether it's being pressed or
    //released
    o.action = "";
    
    //The `pressed` and `hoverOver` Booleans are mainly for internal
    //use in this code to help figure out the correct state.
    //`pressed` is a Boolean that helps track whether
    //the sprite has been pressed down
    o.pressed = false;
    
    //The `pressed` and `hoverOver` Booleans are mainly for internal
    //use in this code to help figure out the correct state.
    //`pressed` is a Boolean that helps track whether 
    //the sprite has been pressed down
    o.pressed = false;
    
    //`hoverOver` is a Boolean that checks whether the pointer
    //has hovered over the sprite
    o.hoverOver = false;
    
    //The `update` method will be called each frame
    //inside the game loop
    o.update = (pointer, canvas) => {
        
        //Figure out if the pointer is touching the sprite
        let hit = pointer.hitTestSprite(o); 
        
        if(hit) {   //if the pointer is hitting the button
            
            //if coming from outside of the button with pointer released
            if(o.hoverOver === false && pointer.isUp) {
            
                o.action = "entered to click";
                
                //Show the first image state frame is this is a Button
               if(o instanceof Button) o.gotoAndStop(1);
                
            }
            //if coming from outside of the button with pointer pressed
            if(o.hoverOver === false && pointer.isDown) {
                
                o.action = "release before reclicking";
                
                if(o instanceof Button) o.gotoAndStop(0);
            }
            //if pointer was already on the button and is reclicking
            if(o.hoverOver === true && o.action === "entered to click") {
                
                if(o instanceof Button) o.gotoAndStop(1);
                
            } 
            o.hoverOver = true;
            
            if(pointer.isUp) {
                
                o.state = "up";
                
                if(o.action === "release before reclicking") {
                    o.action = "entered to click";
                }
            }
            
            if(pointer.isDown) {
                
                o.state = "down";
                
            }
            
        } else {    //if the pointer is not hitting the button
            
            o.action = "";
            o.hoverOver = false;
            if(o instanceof Button) o.gotoAndStop(0);
        }
       
        //console.log(o.action);
       
        //Run the 'Press' method
        if(o.state === "down" && o.hoverOver) {
            if(!o.pressed) {
                if(o.action === "entered to click") {
                
                    o.action = "release to spin";
                    
                    //Show the second or third frame, depending on availability
                    if(o instanceof Button) {
                        if(o.frames.length === 3) o.gotoAndStop(2);
                        else o.gotoAndStop(1);
                    }  
                }
                if(o.press) o.press();            
                o.pressed = true;  
            }
        }
        
        //Run the 'Release' method
        if(o.state === "up" && o.hoverOver) {
            if(o.pressed) { 
                if(o.action === "release to spin") {
                    o.action = "entered to click"; 
                    if(o.release) o.release();                     
                    
                }
                
                o.pressed = false;                
            }
        }
        
        if(!o.hoverOver) {
            if(o.over) o.over();
            //o.hoverOver = true;
        }    

        if(o.hoverOver) {
            if(o.out) o.out();
            //o.hoverOver = false;        
        }    
        
    };
    
}

