const gameBoard = document.getElementById("gameBoard");
const movesDisplay = document.getElementById("moves");
const pairsDisplay = document.getElementById("pairs");
const restartBtn = document.getElementById("restartBtn");
const timerDisplay = document.getElementById("timer");

const winScreen = document.getElementById("winScreen");
const finalTime = document.getElementById("finalTime");
const finalMoves = document.getElementById("finalMoves");
const bestScoreDisplay = document.getElementById("bestScore");
const playAgainBtn = document.getElementById("playAgainBtn");

let currentPlayer = 1;
let player1Score = 0;
let player2Score = 0;
const symbols = [
    "images/1.png",
    "images/2.png",
    "images/3.png",
    "images/4.png",
    "images/5.png",
    "images/6.png",
    "images/7.png",
    "images/8.png",
    "images/9.png",
    "images/10.png",
    "images/11.png",
    "images/12.png"
];

let flippedCards = [];
let matchedPairs = 0;
let moves = 0;
let seconds = 0;
let timerInterval;
let lockBoard = false;
let gameStarted = false;

function startGame() {
    player1Score = 0;
    player2Score = 0;
    currentPlayer = 1;
    clearInterval(timerInterval);

    gameBoard.innerHTML = "";
    flippedCards = [];
    matchedPairs = 0;
    moves = 0;
    seconds = 0;
    lockBoard = false;
    gameStarted = false;

    timerDisplay.textContent = "00:00";
    movesDisplay.textContent = "0";
    pairsDisplay.textContent = "0";

    winScreen.classList.remove("show");

    const cards = [...symbols, ...symbols];

    cards.sort(() => Math.random() - 0.5);

    cards.forEach(imagePath => {

        const card = document.createElement("div");

        card.classList.add("card");
        card.dataset.symbol = imagePath;

        const image = document.createElement("img");
        image.src = imagePath;
        image.alt = "Memory card";

        card.appendChild(image);

        card.addEventListener("click", flipCard);

        gameBoard.appendChild(card);
    });
}

function startTimer() {

    if (gameStarted) return;

    gameStarted = true;

    timerInterval = setInterval(() => {

        seconds++;

        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        timerDisplay.textContent =
            String(minutes).padStart(2, "0") +
            ":" +
            String(remainingSeconds).padStart(2, "0");

    }, 1000);
}

function flipCard() {

    if (lockBoard) return;
    if (this.classList.contains("flipped")) return;
    if (this.classList.contains("matched")) return;

    startTimer();

    this.classList.add("flipped");

    flippedCards.push(this);

    if (flippedCards.length === 2) {

        moves++;
        movesDisplay.textContent = moves;

        checkMatch();
    }
}

function checkMatch() {

    const firstCard = flippedCards[0];
    const secondCard = flippedCards[1];

    if (firstCard.dataset.symbol === secondCard.dataset.symbol) {

        firstCard.classList.add("matched");
        secondCard.classList.add("matched");

        matchedPairs++;
        if (currentPlayer === 1) {
            player1Score++;
        } else {
            player2Score++;
        }
        document.getElementById("player1Score").textContent = player1Score;
        document.getElementById("player2Score").textContent = player2Score;
        pairsDisplay.textContent = matchedPairs;

        flippedCards = [];

        if (matchedPairs === symbols.length) {
            finishGame();
        }

    } else {

        lockBoard = true;

        setTimeout(() => {

            firstCard.classList.remove("flipped");
            secondCard.classList.remove("flipped");

            flippedCards = [];
            lockBoard = false;
            currentPlayer = currentPlayer === 1 ? 2 : 1;
            document.getElementById("currentPlayer").textContent = `PLAYER ${currentPlayer}`;
            document.getElementById("player1Card").classList.toggle("active", currentPlayer === 1);
            document.getElementById("player2Card").classList.toggle("active", currentPlayer === 2);
        }, 900);
    }
}

function finishGame() {

    clearInterval(timerInterval);

    finalTime.textContent = timerDisplay.textContent;
    finalMoves.textContent = moves;

    saveBestScore();

    setTimeout(() => {
        winScreen.classList.add("show");
    }, 500);
}

function saveBestScore() {

    const currentScore = {
        time: seconds,
        moves: moves
    };

    const oldScore = JSON.parse(localStorage.getItem("memoryBestScore"));

    if (
        !oldScore ||
        currentScore.moves < oldScore.moves ||
        (
            currentScore.moves === oldScore.moves &&
            currentScore.time < oldScore.time
        )
    ) {
        localStorage.setItem(
            "memoryBestScore",
            JSON.stringify(currentScore)
        );

        bestScoreDisplay.textContent = "🏆 New Best Score!";
    } else {

        bestScoreDisplay.textContent =
            `Best: ${oldScore.moves} moves • ${formatTime(oldScore.time)}`;
    }
}

function formatTime(totalSeconds) {

    const minutes = Math.floor(totalSeconds / 60);
    const remainingSeconds = totalSeconds % 60;

    return (
        String(minutes).padStart(2, "0") +
        ":" +
        String(remainingSeconds).padStart(2, "0")
    );
}

restartBtn.addEventListener("click", startGame);
playAgainBtn.addEventListener("click", startGame);

startGame();