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

  //const getEmptyCells = () => {
    //const boardWithCellValues = board.map((row) =>
      //row.map((cell) => (cell.getValue() === "" ? true : false))
    //);
    //return boardWithCellValues;
  //};

  const fillCell = (coordinates, player) => {
    const row = coordinates[0];
    const col = coordinates[1];
    if (board[row][col].getValue() !== "") {
      console.log("Cell isn't empty!!");
      return false;
    }

    board[row][col].setValue(player.symbol);
    return true;
  }


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
      symbol: "O",
    },
    {
      name: playerTwoName,
      symbol: "X",
    }
  ]

  let activePlayer = players[0];
  const board = GameBoard(); 

  const getActivePlayer = () =>
    (activePlayer = activePlayer === players[0] ? players[0] : players[1]);

  const switchActivePlayer = () =>
    (activePlayer = activePlayer === players[0] ? players[1] : players[0]);

  const printNewRound = () => {
    board.printBoard();
    console.log(`${getActivePlayer().name}'s turn.`);
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

  const playRound = () => {
    const activePlayer = getActivePlayer();
    const coordinates = [0, 0];

    if (checkWinCondition()) {
      return `${activePlayer.name} = won!`;
    }

    if (!board.fillCell(coordinates, activePlayer)) {
      return;
    }
  }

  printNewRound();
  switchActivePlayer();
  
  return { getActivePlayer, playRound };
}

function main() {
  GameBoard().printBoard();
  //GameBoard().getEmptyCells();
  //GameController("Pl_1", "Pl_2").checkWinCondition();
}

main();
