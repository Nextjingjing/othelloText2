import Player from "./Player.mjs";

class BotPlayer extends Player {
    constructor(color) {
        super(color);
    }

    decideMove(board) {
        const validMoves = board.findValidMoves(this);
        if (validMoves.length > 0) {
            return validMoves[0];
        }
        return null;
    }
}

export default BotPlayer;
