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
    console.log(boardWithCellValues);
  };

  const getEmptyCells = () => {
    const boardWithCellValues = board.map((row) =>
      row.map((cell) => (cell.getValue() === "" ? true : false))
    );
    console.log(boardWithCellValues);
    return boardWithCellValues;
  };

  return { getBoard, printBoard, getEmptyCells };
}

function Cell() {
  let value = "";

  const setValue = (playerValue) => {
    value = playerValue;
  };

  const getValue = () => value;

  return { setValue, getValue };
}

function GameController() {}

function main() {
  GameBoard().printBoard();
  GameBoard().getEmptyCells();
}

main();
