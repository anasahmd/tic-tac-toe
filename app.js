const squares = document.querySelectorAll('.square');

for (let square of squares) {
  square.addEventListener('click', () => {
    if (game.getActivePlayer().role == 'bot') return;
    game.playChance(square);
  });
}

function gameBoard() {
  let board = [];

  for (let i = 0; i < 9; i++) {
    board[i] = cell(i);
  }

  const getEmptyCells = () =>
    board.filter((cell) => cell.getValue() == 0).map((cell) => cell.getIndex());
  return { board, getEmptyCells };
}

function cell(i) {
  let value = 0;
  let index = i;
  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  const getIndex = () => index;

  return { addToken, getValue, getIndex };
}

function Player(name, role, mark) {
  this.name = name;
  this.role = role;
  this.mark = mark;
}

function GameController() {
  const gameboard = gameBoard();

  let players = [];

  players[0] = new Player('Anas', 'bot', 'X');

  players[1] = new Player('Jarvis', 'user', 'O');

  let activePlayer = players[0];

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

    return winCombinations
      .filter((combination) => combination.includes(pos))
      .some((combination) =>
        combination.every(
          (cell) => gameboard.board[cell].getValue() === activePlayer.mark
        )
      );
  };

  const playChance = (square) => {
    const pos = gameboard.board[square.dataset.pos];

    if (pos.getValue() !== 0) return;

    pos.addToken(activePlayer.mark);
    updateSquare(square);

    if (checkWinner(square.dataset.pos)) {
      console.log(activePlayer.mark);
      return;
    }

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

  const botPlay = () => {
    const emptyCells = gameboard.getEmptyCells();

    let ran = Math.floor(Math.random() * emptyCells.length - 1);

    let cell = emptyCells.splice(ran, 1);

    setTimeout(playChance, 1000, squares[cell[0]]);
  };

  const getActivePlayer = () => activePlayer;

  return { playChance, getActivePlayer, botPlay };
}

const game = GameController();

if (game.getActivePlayer().role == 'bot') {
  game.botPlay();
}
