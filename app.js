const squares = document.querySelectorAll('.square');

for (let square of squares) {
  square.addEventListener('click', () => {
    game.addMark(square);
  });
}

function Gameboard() {
  let gameboard = [];

  for (let i = 0; i < 9; i++) {
    gameboard[i] = Cell();
  }

  const getBoard = () => gameboard;
  return gameboard;
}

function Cell() {
  let value = 0;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return { addToken, getValue };
}

// function Player() {
//     const playerX = (role) => {

//     }

//     const playerO = (role) => {

//     }
// }

function GameController() {
  const gameboard = Gameboard();

  const players = [
    {
      mark: 'X',
      icon: 'fa-solid fa-xmark',
    },
    {
      mark: 'O',
      icon: 'fa-regular fa-circle',
    },
  ];

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
          (cell) => gameboard[cell].getValue() === activePlayer.mark
        )
      );
  };

  const addMark = (square) => {
    const pos = gameboard[square.dataset.pos];

    if (pos.getValue() !== 0) return;

    pos.addToken(activePlayer.mark);
    updateSquare(square);

    if (checkWinner(square.dataset.pos)) {
      console.log(activePlayer.mark);
      return;
    }

    switchActivePlayer();
  };

  const updateSquare = (square) => {
    square.children[0].className = activePlayer.icon;
  };

  return { addMark, updateSquare };
}

const game = GameController();
