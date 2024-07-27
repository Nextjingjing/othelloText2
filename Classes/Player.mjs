class Player {
    constructor(color) {
      this._color = color
    }
    
    getColor(){
        return this._color;
    }

    decideMove(BoardObj){
        // pass
        return;
    }
}

export default Player;