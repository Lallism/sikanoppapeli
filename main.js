const players = [];
let scoreGoal = 100;
let diceAmount = 1;

// Valikot

const settings = document.getElementById("settings");
const nameSelect = document.getElementById("name-select");
const scoreboard = document.getElementById("scoreboard");
const game = document.getElementById("game");

const settingsForm = document.getElementById("settings-form");
const namesForm = document.getElementById("names-form");
settingsForm.addEventListener("submit", submitSettings);
namesForm.addEventListener("submit", submitNames);

function submitSettings(event) {
    event.preventDefault();
    const playersAmount = document.getElementById("players-amount").value;
    const playersWarning = document.getElementById("players-warning");
    const scoreWarning = document.getElementById("score-warning");
    
    scoreGoal = document.getElementById("score-goal").value;
    diceAmount = document.forms["settings"]["dice-amount"].value;

    if (playersAmount < 2) {
        playersWarning.innerText = "Pelaajia pitää olla vähintään 2";
        playersWarning.setAttribute("class", "warning");
        return;
    }

    if (playersAmount > 99) {
        playersWarning.innerText = "Pelaajia voi olla enintään 99";
        playersWarning.setAttribute("class", "warning");
        return;
    }

    playersWarning.setAttribute("class", "hidden");

    if (scoreGoal < 100) {
        scoreWarning.setAttribute("class", "warning")
        return;
    }

    scoreWarning.setAttribute("class", "hidden");

    for (let i = 0; i < playersAmount; i++) {
        let player = {id: i, name: "", score: 0};
        players.push(player);

        let newLabel = document.createElement("label");
        newLabel.setAttribute("class", "label");
        newLabel.setAttribute("for", "name-p" + i);
        newLabel.innerText = "Pelaaja " + (i + 1) + ":";
        nameSelect.appendChild(newLabel);

        let newInput = document.createElement("input");
        newInput.setAttribute("type", "text");
        newInput.setAttribute("id", "name-p" + i);
        nameSelect.appendChild(newInput);
        nameSelect.appendChild(document.createElement("br"))
    }

    settings.setAttribute("class", "hidden");
    nameSelect.setAttribute("class", "");
}

function submitNames(event) {
    event.preventDefault();

    for (let i = 0; i < players.length; i++) {
        const player = players[i];
        const name = document.getElementById("name-p" + i).value;

        if (name.length < 1) {
            document.getElementById("names-warning").setAttribute("class", "warning");
            return;
        }

        player.name = name;

        let newP = document.createElement("p");
        newP.setAttribute("id", "score-p" + i);
        newP.innerText = name + ": 0";
        scoreboard.appendChild(newP);
    }

    nameSelect.setAttribute("class", "hidden");
    game.setAttribute("class", "");
    startGame();
}


// Peli

const dice1 = document.getElementById("dice-1");
const dice2 = document.getElementById("dice-2");
const turnText = document.getElementById("turn-text");
const scoreText = document.getElementById("score-text");
const winText = document.getElementById("score-text");

const throwButton = document.getElementById("throw-button");
const endButton = document.getElementById("end-button");
const newGameButton = document.getElementById("new-game");
endButton.addEventListener("click", endTurn);
newGameButton.addEventListener("click", newGame);

let currentTurn = 0;
let turnScore = 0;
let doubles = 0;

function startGame() {
    switch (diceAmount) {
        case "1":
            throwButton.addEventListener("click", throwSingleDice);
            break;
    
        case "2":
            dice2.setAttribute("class", "dice");
            throwButton.addEventListener("click", throwTwoDice);
            break;
    }

    updateTurnText();
}

function throwSingleDice() {
    let result = Math.floor(Math.random() * 6);

    dice1.setAttribute("src", "gfx/dice" + (result + 1) + ".png");

    turnScore += result + 1;
    updateTurnScoreText();

    if (result == 0) {
        turnScore = 0;
        endTurn();
        return;
    }

    if (turnScore + players[currentTurn].score >= scoreGoal) {
        winGame();
    }
}

function throwTwoDice() {
    let result1 = Math.floor(Math.random() * 6);
    let result2 = Math.floor(Math.random() * 6);

    dice1.setAttribute("src", "gfx/dice" + (result1 + 1) + ".png");
    dice2.setAttribute("src", "gfx/dice" + (result2 + 1) + ".png");

    let totalResult = result1 + result2 + 2;

    if (result1 == result2) {
        doubles += 1;
        if (doubles == 3) {
            turnScore = 0;
            doubles = 0;
            endTurn();
            return;
        }
        if (result1 == 0) {
            totalResult = 25;
            turnScore += totalResult;
            updateTurnScoreText();
            if (turnScore + players[currentTurn].score >= scoreGoal) {
                winGame();
            }
            return;
        }
        totalResult *= 2;
        turnScore += totalResult;
        updateTurnScoreText();
        if (turnScore + players[currentTurn].score >= scoreGoal) {
            winGame();
        }
        return;
    }

    doubles = 0;
    turnScore += totalResult;
    updateTurnScoreText();

    if (result1 == 0 || result2 == 0) {
        turnScore = 0;
        endTurn();
        return;
    }

    if (turnScore + players[currentTurn].score >= scoreGoal) {
        winGame();
    }
}

function endTurn() {
    updatePlayerScore();
    turnScore = 0;
    
    currentTurn++;
    if (currentTurn >= players.length) {
        currentTurn = 0;
    }
    updateTurnText();
    updateTurnScoreText();
}

function updateTurnText() {
    turnText.innerText = "Pelaajan " + players[currentTurn].name + " vuoro";
}

function updateTurnScoreText() {
    scoreText.innerText = "Vuoron pisteet: " + turnScore;
}

function updatePlayerScore() {
    players[currentTurn].score += turnScore;
    document.getElementById("score-p" + currentTurn).innerText = players[currentTurn].name + ": " + players[currentTurn].score;
}

function winGame() {
    updatePlayerScore();
    throwButton.setAttribute("class", "hidden");
    endButton.setAttribute("class", "hidden");
    winText.innerText = players[currentTurn].name + " voitti!"
    winText.setAttribute("class", "");
    newGameButton.setAttribute("class", "button");
}

function newGame() {
    location.reload();
}