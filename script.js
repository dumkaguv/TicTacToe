"use strict";

function GameBoard() {
  const rows = 3;
  const cols = 3;
  const board = [];

  // IIFE
  (function createGameBoard() {
    for (let row = 0; row < rows; ++row) {
      board.push([]);
      for (let col = 0; col < cols; ++col) {
        board[row].push(Cell());
      }
    }
  })();

  const getBoard = () => board;

  const printBoard = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => cell.getValue())
    );
    return boardWithCellValues;
  };

  const fillCell = (coordinates, player) => {
    const row = coordinates[0];
    const col = coordinates[1];
    if (board[row][col].getValue() !== "") {
      return false;
    }

    board[row][col].setValue(player.symbol);
    return true;
  };

  return { getBoard, printBoard, fillCell };
}

function Cell() {
  let value = "";

  const setValue = (playerValue) => {
    value = playerValue;
  };

  const getValue = () => value;

  return { setValue, getValue };
}

function GameController(
  playerOneName = "Player_1",
  playerTwoName = "Player_2"
) {
  const players = [
    {
      name: playerOneName,
      symbol: "o",
    },
    {
      name: playerTwoName,
      symbol: "x",
    },
  ];

  let activePlayer = players[0];
  let isGameOver = false;
  const board = GameBoard();

  const getActivePlayer = () =>
    (activePlayer = activePlayer === players[0] ? players[0] : players[1]);

  const switchActivePlayer = () =>
    (activePlayer = activePlayer === players[0] ? players[1] : players[0]);

  const printNewRound = () => {
    board.printBoard();
  };

  const checkWinCondition = () => {
    const _board = board.printBoard().flat(); // to get board with actual values
    const activePlayer = getActivePlayer();
    const winConditions = [
      [0, 1, 2], // 1st horizontal
      [3, 4, 5], // 2nd horizontal
      [6, 7, 8], // 3rd horizontal
      [0, 3, 6], // 1st vertical
      [1, 4, 7], // 2nd vertical
      [2, 5, 8], // 3rd vertical
      [0, 4, 8], // main diagonal
      [2, 4, 6], // additional diagonal
    ];

    for (const winCondition of winConditions) {
      const currLine = winCondition.map((index) => _board[index]);
      if (currLine.every((val) => val === activePlayer.symbol)) {
        return true;
      }
    }

    return false;
  };

  const playRound = (coordinates) => {
    const activePlayer = getActivePlayer();
    const _coordinates = coordinates;

    if (!board.fillCell(_coordinates, activePlayer) || isGameOver) {
      return false;
    }

    if (!isGameOver && checkWinCondition()) {
      isGameOver = true;
      return true;
    }

    printNewRound();
    switchActivePlayer();
    return true;
  };

  return { getActivePlayer, playRound };
}

function ScreenController() {
  const playerNames = ["Player_1", "Player_2"];
  const game = GameController(playerNames[0], playerNames[1]);
  const boardDiv = document.querySelector(".game-board");
  const boardCellClassDiv = "board-cell";
  const activePlayerDiv = document.querySelector(".player-turn");

  const updatePlayerTurn = () => {
    const activePlayer = game.getActivePlayer();
    activePlayerDiv.textContent = "";
    activePlayerDiv.textContent = `${activePlayer.name}'s turn!`;
  };

  const clickHandlerBoard = () => {
    boardDiv.addEventListener("click", (e) => {
      const cell = e?.target;
      if (cell?.classList?.contains(boardCellClassDiv)) {
        const activePlayer = game.getActivePlayer();

        game.playRound(cell.id)
          ? (cell.classList.add(`symbol-${activePlayer.symbol}`),
            updatePlayerTurn())
          : console.log("Cell isn't empty or game is over!");
      }
    });
  };

  updatePlayerTurn();
  clickHandlerBoard();
}

ScreenController();
