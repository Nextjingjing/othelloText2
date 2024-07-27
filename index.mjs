import readline from 'readline';
import Othello from "./Classes/Othello.mjs";

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function askQuestion(query) {
    return new Promise(resolve => rl.question(query, resolve));
}

async function setupGame() {
    const player1 = await askQuestion('Choose player 1 type (human/bot): ');
    const player2 = await askQuestion('Choose player 2 type (human/bot): ');

    rl.close();


    if (!['human', 'bot'].includes(player1) || !['human', 'bot'].includes(player2)) {
        console.log('Invalid player type. Please enter "human" or "bot".');
        return;
    }

    const game = new Othello([player1, player2]);
    game.startGame();
}

// Start the setup process
setupGame();
