import readline from 'readline';
import Board from "./Board.mjs";
import HumanPlayer from "./HumanPlayer.mjs";
import BotPlayer from "./BotPlayer.mjs";

class Othello {
    constructor(playerTypes) {
        this.board = new Board();
        this.player1 = this.createPlayer(playerTypes[0], "◉");
        this.player2 = this.createPlayer(playerTypes[1], "○");
        this.currentPlayer = this.player1;
        this.gameOver = false;
    }

    createPlayer(type, color) {
        if (type === 'human') {
            return new HumanPlayer(color);
        } else if (type === 'bot') {
            return new BotPlayer(color);
        } else {
            throw new Error("Invalid player type");
        }
    }

    startGame() {
        this.game_loop();
    }

    async game_loop() {
        while (!this.gameOver) {
            this.board.displayBoard();
            const validMoves = this.board.findValidMoves(this.currentPlayer);

            if (validMoves.length === 0) {
                console.log(`No valid moves for ${this.currentPlayer.getColor()}`);
                
                // Check if the other player has valid moves
                const otherPlayer = (this.currentPlayer === this.player1) ? this.player2 : this.player1;
                const otherPlayerMoves = this.board.findValidMoves(otherPlayer);
                
                if (otherPlayerMoves.length === 0) {
                    // If both players have no valid moves, the game is over
                    this.gameOver = true;
                } else {
                    // If the other player has valid moves, skip the current player
                    console.log(`Skipping ${this.currentPlayer.getColor()}'s turn.`);
                    this.switch_player();
                }
                continue;
            }

            this.display_valid_moves(validMoves);

            // Show current player and prompt for move
            console.log(`Current player: ${this.currentPlayer.getColor()}`);
            let move;
            if (this.currentPlayer instanceof HumanPlayer) {
                move = await this.get_human_move(validMoves);
            } else {
                move = this.currentPlayer.decideMove(this.board);
            }

            if (validMoves.some(m => m[0] === move[0] && m[1] === move[1])) {
                this.board.placePiece(move[0], move[1], this.currentPlayer);
                this.switch_player();
            } else {
                console.log("Invalid move. Try again.");
            }

            this.gameOver = this.check_game_over();
        }

        this.display_winner();
    }

    switch_player() {
        // Ensure that this function correctly switches the player
        this.currentPlayer = (this.currentPlayer === this.player1) ? this.player2 : this.player1;
    }

    check_winner() {
        const scores = this.board.countPieces();
        if (scores.blackScore > scores.whiteScore) return 'Black';
        if (scores.whiteScore > scores.blackScore) return 'White';
        if (scores.blackScore === scores.whiteScore) return 'Draw';
        return 'N'; // Shouldn't be reached
    }

    display_winner() {
        const winner = this.check_winner();
        console.log(`Game Over! Winner: ${winner}`);
    }

    display_valid_moves(validMoves) {
        const moves = validMoves.map(([x, y]) => `${String.fromCharCode(65 + y)}${x + 1}`).join(' ');
        console.log("Valid moves: " + moves);
    }

    get_human_move(validMoves) {
        const rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });

        return new Promise((resolve) => {
            rl.question('Enter your move (e.g., B3): ', (input) => {
                const row = parseInt(input[1]) - 1;
                const col = input[0].toUpperCase().charCodeAt(0) - 65;

                if (validMoves.some(m => m[0] === row && m[1] === col)) {
                    rl.close();
                    resolve([row, col]);
                } else {
                    console.log("Invalid move. Try again.");
                    rl.close();
                    resolve(this.get_human_move(validMoves)); // Retry
                }
            });
        });
    }

    check_game_over() {
        const player1Moves = this.board.findValidMoves(this.player1);
        const player2Moves = this.board.findValidMoves(this.player2);
        return player1Moves.length === 0 && player2Moves.length === 0;
    }
}

export default Othello;
