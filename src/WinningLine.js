export class WinningLine {
    constructor(line) {
        this.line = line;     //will map the winning line   (e.g: [1, 0, 2, 2, 0])  
        this.combination;   //either X3, X4, or X5
        this.winningIcon;   //will store the winning icon
        this.prize;         //prize won
    }
}