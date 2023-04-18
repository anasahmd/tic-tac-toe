const squares = document.querySelectorAll('.square');
const gameGrid = document.querySelector('.game-grid');
const result = document.querySelector('.result');

//Logic for choosing mode

const modeButtons = document.querySelectorAll('.mode-button');
for (let btn of modeButtons) {
  btn.addEventListener('click', () => {
    const mode = btn.dataset.mode;
    if (mode == 'pvp') {
      game.setGameMode('player');
    } else if (mode == 'pvb') {
      game.setGameMode('bot');
    }
    btn.parentElement.parentElement.classList.add('hidden');
    gameGrid.classList.remove('hidden');
  });
}

const signButtons = document.querySelectorAll('.sign-button');
for (let btn of signButtons) {
  btn.addEventListener('click', () => {});
}

for (let square of squares) {
  square.addEventListener('click', () => {
    if (game.getActivePlayer().role == 'bot') return;
    game.playMove(square);
  });
}

function gameBoard() {
  let board = [];

  for (let i = 0; i < 9; i++) {
    board[i] = new Cell(i);
  }

  const getEmptyCells = () =>
    board.filter((cell) => cell.value == 0).map((cell) => cell.index);
  return { board, getEmptyCells };
}

function Cell(i) {
  this.value = 0;
  this.index = i;
}

Cell.prototype.addMark = function (playerMark) {
  this.value = playerMark;
};

function Player(name, role, mark) {
  this.name = name;
  this.role = role;
  this.mark = mark;
}

function GameController() {
  const gameboard = gameBoard();

  let gameOver = false;
  let activePlayer;

  let players = [];

  const setGameMode = (mode) => {
    console.log(mode);
    if (mode == 'player') {
      players[0] = new Player('Player X', 'player', 'X');

      players[1] = new Player('Player O', 'player', 'O');
    } else if (mode == 'bot') {
      players[0] = new Player('Player', 'player', 'X');

      players[1] = new Player('Bot', 'bot', 'O');
    }
    activePlayer = players[0];
  };

  const switchActivePlayer = () =>
    (activePlayer = activePlayer === players[0] ? players[1] : players[0]);

  const checkWinner = (pos) => {
    pos = Number(pos);
    const winCombinations = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6],
    ];

    //First filters out positions that were not part of the move, then checks if

    const result = winCombinations
      .filter((combination) => combination.includes(pos))
      .some((combination) =>
        combination.every(
          (cell) => gameboard.board[cell].value === activePlayer.mark
        )
      );

    if (result) {
      return 'win';
    } else if (gameboard.getEmptyCells().length == 0) {
      return 'draw';
    } else {
      return false;
    }
  };

  const playMove = (square) => {
    if (gameOver) {
      return;
    }

    const pos = gameboard.board[square.dataset.pos];

    if (pos.value !== 0) return;

    pos.addMark(activePlayer.mark);
    updateSquare(square);

    let winResult = checkWinner(square.dataset.pos);

    winHandler(winResult);

    switchActivePlayer();

    if (activePlayer.role == 'bot') {
      const play = setTimeout(botPlay(), 500);
    }
  };

  const updateSquare = (square) => {
    if (activePlayer.mark == 'X') {
      square.children[0].className = 'fa-solid fa-xmark';
    } else {
      square.children[0].className = 'fa-regular fa-circle';
    }
  };

  const winHandler = (res) => {
    if (res == 'win') {
      result.innerText = `${activePlayer.name} Wins`;
      gameOver = true;
    } else if (res == 'draw') {
      result.innerText = `It's a draw!`;
      gameOver = true;
    }
  };

  const botPlay = () => {
    const emptyCells = gameboard.getEmptyCells();

    let ran = Math.floor(Math.random() * emptyCells.length - 1);

    let cell = emptyCells.splice(ran, 1);

    setTimeout(playMove, 1000, squares[cell[0]]);
  };

  const getActivePlayer = () => activePlayer;

  return { playMove, getActivePlayer, botPlay, setGameMode };
}

const game = GameController();

if (game.getActivePlayer() && game.getActivePlayer().role == 'bot') {
  game.botPlay();
}
