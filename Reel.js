class Reel {
    constructor() {
        this.x;
        this.y;
        this.v;
        this.a;
        this.d;
        this.spinTime;
        this.t = 0;        
        this.icons = [];
        this.currentIcon;
        this.displayedIcons = [];
        this.drawIcon;
        this.spinning = false;
        this.delay;
        this.wait = 0;   //time spent before 'delay' is exhausted and reel starts spinning
    }    
    
    ///////////////////////////////
    //spinReel
    ///////////////////////////////
    spinReel() {
        
        if(this.wait < this.delay) {
            
            this.wait++;
            
        } else {
            
            if(this.t <= this.spinTime) {         //control spinning time

                this.t++;

                if(this.v < 100)            //control maximum spinning speed
                    this.v += a;

                this.y += this.v;
                
            } else {                    //else if spinning time is over, decelerate

                if(this.v > 5) {             

                    this.v += d;             //decelerate with the decelaration factor
                    this.y += this.v;

                } else {                //decelerate finely to a positive stop
                    if(this.y > 0) {
                        if(this.y < iconHeight / 2)
                            this.y += 16;                                        
                        
                        else {
                            this.y++;            
                            this.v = 0;
                        }
                    }
                }
            }    

            if(this.y === 0) {    
                this.spinning = false;
                this.t = 0;     
                this.wait = 0;
            }
        }
        
    }
    
    ///////////////////////////////
    //identifyDisplayedIcons
    ///////////////////////////////
    identifyDisplayedIcons() {
        
        //row 1
        this.displayedIcons[0] = this.icons[this.currentIcon];
        
        //row 2
        if(this.currentIcon === this.icons.length - 1)
            this.displayedIcons[1] = this.icons[0];
        else
            this.displayedIcons[1] = this.icons[this.currentIcon + 1];
        
        //row 3
        if(this.currentIcon === this.icons.length - 2)
            this.displayedIcons[2] = this.icons[0];
        else if(this.currentIcon === this.icons.length - 1)
            this.displayedIcons[2] = this.icons[1];
        else
            this.displayedIcons[2] = this.icons[this.currentIcon + 2];
    }
}