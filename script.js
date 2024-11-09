"use strict";

function GameBoard() {
  const rows = 3;
  const cols = 3;
  const board = [];

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

  const getIsGameOver = () => isGameOver;

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

  return { getActivePlayer, playRound, getIsGameOver };
}

function ScreenController() {
  let game = null;
  const boardDiv = document.querySelector(".game-board");
  const activePlayerDiv = document.querySelector(".player-turn");
  const restartGameBtn = document.querySelector(".btn-restart");
  const initialModal = document.querySelector(".modal-initial");

  const initGame = async () => {
    initialModal.style.display = "block";
    const playerNames = await getPlayerNames();
    game = GameController(playerNames[0], playerNames[1]);
    updatePlayerTurn();
    clickHandlerBoard();
  };

  function gatherInfoFromInitialModal() {
    const firstPlayerName = document.getElementById("playerOneName").value;
    const secondPlayerName = document.getElementById("playerTwoName").value;
    return [firstPlayerName, secondPlayerName];
  }

  function getPlayerNames() {
    return new Promise((resolve) => {
      document
        .querySelector(".start-game-btn")
        .addEventListener("click", () => {
          initialModal.style.display = "none";
          resolve(gatherInfoFromInitialModal());
        });
    });
  }

  const updatePlayerTurn = () => {
    const activePlayer = game.getActivePlayer();
    activePlayerDiv.innerHTML = `<i class="fa-solid fa-person"></i> ${activePlayer.name}'s turn!`;
  };

  const printGameIsOver = () => {
    const activePlayer = game.getActivePlayer();
    activePlayerDiv.innerHTML = `<i class="fa-solid fa-person"></i> ${activePlayer.name}'s won! <i class="fa-solid fa-hand-peace"></i>`;
  };

  const clickHandlerBoard = () => {
    boardDiv.addEventListener("click", (e) => {
      const cell = e?.target;
      if (cell?.classList?.contains("board-cell")) {
        const activePlayer = game.getActivePlayer();

        game.playRound(cell.id)
          ? (cell.classList.add(`symbol-${activePlayer.symbol}`),
            updatePlayerTurn())
          : console.log("Cell isn't empty or game is over!");

        if (game.getIsGameOver()) {
          printGameIsOver();
        }
      }
    });
  };

  const restartGame = async () => {
    const isReseting = await setupRestartModal();
    if (!isReseting) return;

    await initGame();
    wipeBoard();
    updatePlayerTurn();

    function wipeBoard() {
      const cells = document.querySelectorAll(".board-cell");
      cells.forEach((cell) => {
        if (
          cell?.classList?.contains("symbol-o") ||
          cell?.classList?.contains("symbol-x")
        ) {
          cell?.classList?.remove("symbol-o");
          cell?.classList?.remove("symbol-x");
        }
      });
    }

    function setupRestartModal() {
      return new Promise((resolve) => {
        const restartModal = document.querySelector(".modal-restart");
        restartModal.style.display = "block";

        restartModal.addEventListener("click", (e) => {
          const isCloseArea =
            e?.target?.classList?.contains("modal-restart") ||
            e?.target?.classList?.contains("modal-close") ||
            e?.target?.classList?.contains("btn-no");
          const isReseting = e?.target?.classList?.contains("btn-yes");

          if (isCloseArea) {
            restartModal.style.display = "none";
            resolve(false);
          } else if (isReseting) {
            restartModal.style.display = "none";
            resolve(true);
          }
        });
      });
    }
  };
  restartGameBtn.addEventListener("click", restartGame);

  initGame();
}

ScreenController();
