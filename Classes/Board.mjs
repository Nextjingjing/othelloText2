class Board {
    #tableMatrix;
    #checkingArray;

    constructor() {
        this.#tableMatrix = [
            [".", ".", ".", ".", ".", ".", ".", "."],
            [".", ".", ".", ".", ".", ".", ".", "."],
            [".", ".", ".", ".", ".", ".", ".", "."],
            [".", ".", ".", "○", "◉", ".", ".", "."],
            [".", ".", ".", "◉", "○", ".", ".", "."],
            [".", ".", ".", ".", ".", ".", ".", "."],
            [".", ".", ".", ".", ".", ".", ".", "."],
            [".", ".", ".", ".", ".", ".", ".", "."]
        ];

        this.#checkingArray = [
            [-1, -1], [-1, 0], [-1, 1],
            [0, -1],           [0, 1],
            [1, -1], [1, 0], [1, 1]
        ];
    }

    displayBoard() {
        console.clear();
        console.log("\n");
        console.log("    | A | B | C | D | E | F | G | H");
        let numberRow = 1;
        for (let row of this.#tableMatrix) {
            console.log(` ${numberRow}  | ` + row.join("   "));
            numberRow += 1;
        }
    }

    #isInBounds(x, y) {
        return x >= 0 && x < 8 && y >= 0 && y < 8;
    }

    isValidMove(i, j, playerObj) {
        if (this.#tableMatrix[i][j] !== ".") {
            return false;
        }

        for (let [dx, dy] of this.#checkingArray) {
            let xPos = i + dx;
            let yPos = j + dy;
            let hasOpponentPiece = false;

            while (this.#isInBounds(xPos, yPos) && this.#tableMatrix[xPos][yPos] !== "." && this.#tableMatrix[xPos][yPos] !== playerObj.getColor()) {
                xPos += dx;
                yPos += dy;
                hasOpponentPiece = true;
            }

            if (hasOpponentPiece && this.#isInBounds(xPos, yPos) && this.#tableMatrix[xPos][yPos] === playerObj.getColor()) {
                return true;
            }
        }

        return false;
    }

    findValidMoves(playerObj) {
        const validMoves = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.isValidMove(i, j, playerObj)) {
                    validMoves.push([i, j]);
                }
            }
        }

        return validMoves;
    }

    flipPieces(i, j, playerObj) {
        for (let [dx, dy] of this.#checkingArray) {
            let [xPos, yPos] = [i + dx, j + dy];
            const temp = [];

            while (this.#isInBounds(xPos, yPos) && this.#tableMatrix[xPos][yPos] !== "." && this.#tableMatrix[xPos][yPos] !== playerObj.getColor()) {
                temp.push([xPos, yPos]);
                xPos += dx;
                yPos += dy;
            }

            if (this.#isInBounds(xPos, yPos) && this.#tableMatrix[xPos][yPos] === playerObj.getColor()) {
                for (let [flipX, flipY] of temp) {
                    this.#tableMatrix[flipX][flipY] = playerObj.getColor();
                }
            }
        }
    }

    placePiece(i, j, playerObj) {
        if (this.isValidMove(i, j, playerObj)) {
            this.#tableMatrix[i][j] = playerObj.getColor();
            this.flipPieces(i, j, playerObj);
        }
    }

    countPieces() {
        let blackScore = 0;
        let whiteScore = 0;
    
        this.#tableMatrix.forEach(row => {
            blackScore += row.filter(cell => cell === "◉").length;
            whiteScore += row.filter(cell => cell === "○").length;
        });
    
        return {
            blackScore: blackScore, whiteScore: whiteScore}
    }
}

export default Board;