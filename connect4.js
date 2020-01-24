/** Connect Four
 *
 * Player 1 and 2 alternate turns. On each turn, a piece is dropped down a
 * column until a player gets four-in-a-row (horiz, vert, or diag) or until
 * board fills (tie)
 */

const WIDTH = 7;
const HEIGHT = 6;

let currPlayer = 1; // active player: 1 or 2
const board = []; // array of rows, each row is array of cells  (board[y][x])

/** makeBoard: create in-JS board structure:
 *    board = array of rows, each row is array of cells  (board[y][x])
 */

const makeBoard = (WIDTH, HEIGHT) => {
  // Set board to empty HEIGHT x WIDTH matrix array
  for (let i = 0; i < HEIGHT; i++) {
    board[i] = Array.from({ length: WIDTH }).map(x => null);
  }
};

/** makeHtmlBoard: make HTML table and row of column tops. */

const makeHtmlBoard = () => {
  // Get "htmlBoard" variable from the item in HTML w/ID of "board"
  const htmlBoard = document.getElementById("board");

  // Create the top row and add a click handler
  const top = document.createElement("tr");
  top.setAttribute("id", "column-top");
  top.addEventListener("click", handleClick);

  // Create table head cells and append to board
  for (let x = 0; x < WIDTH; x++) {
    let headCell = document.createElement("td");
    headCell.setAttribute("id", x);
    top.append(headCell);
  }

  // Add the tavle rows to the DOM
  htmlBoard.append(top);

  // Create table row cells and append to board
  for (let y = 0; y < HEIGHT; y++) {
    const row = document.createElement("tr");
    for (let x = 0; x < WIDTH; x++) {
      const cell = document.createElement("td");
      cell.setAttribute("id", `${y}-${x}`);
      row.append(cell);
    }
    htmlBoard.append(row);
  }
};

/** findSpotForCol: given column x, return top empty y (null if filled) */

const findSpotForCol = x => {
  for (let y = HEIGHT - 1; y >= 0; y--) {
    if (!board[y][x]) {
      return y;
    }
  }
  return null;
};

/** placeInTable: update DOM to place piece into HTML table of board */

const placeInTable = (y, x) => {
  // Select cell to place piece
  let cell = document.getElementById(`${y}-${x}`);
  // Create piece div
  let piece = document.createElement("div");
  // Assign piece class to div
  piece.classList.add("piece");
  // Set player class based on current player
  currPlayer === 1 ? piece.classList.add("p1") : piece.classList.add("p2");
  cell.append(piece);
};

/** endGame: announce game end */

const endGame = msg => {
  // pop up alert message
  alert(msg);
};

/** handleClick: handle click of column top to play piece */

const handleClick = evt => {
  // get x from ID of clicked cell
  let x = +evt.target.id;

  // get next spot in column (if none, ignore click)
  let y = findSpotForCol(x);
  if (y === null) {
    return;
  }

  // place piece in board and add to HTML table
  placeInTable(y, x);

  // Update in-memory board
  board[y][x] = currPlayer;

  // check for win
  if (checkForWin()) {
    return endGame(`Player ${currPlayer} won!`);
  }

  // check for tie
  // check if all cells in board are filled; if so call, call endGame
  if (board.every(cell => cell === 1 || cell === 2)) {
    endGame("It's a tie!!");
  }
  // switch currPlayer 1 <-> 2
  currPlayer === 1 ? (currPlayer = 2) : (currPlayer = 1);
};

/** checkForWin: check board cell-by-cell for "does a win start here?" */

const checkForWin = () => {
  const _win = cells => {
    // Check four cells to see if they're all color of current player
    //  - cells: list of four (y, x) cells
    //  - returns true if all are legal coordinates & all match currPlayer

    return cells.every(
      ([y, x]) =>
        y >= 0 &&
        y < HEIGHT &&
        x >= 0 &&
        x < WIDTH &&
        board[y][x] === currPlayer
    );
  };

  // Loop through each row
  for (let y = 0; y < HEIGHT; y++) {
    // Loop through each column
    for (let x = 0; x < WIDTH; x++) {
      // Assign row cells
      let horiz = [
        [y, x],
        [y, x + 1],
        [y, x + 2],
        [y, x + 3]
      ];
      // Assign column cells
      let vert = [
        [y, x],
        [y + 1, x],
        [y + 2, x],
        [y + 3, x]
      ];
      // Assign diagonal (down-right)
      let diagDR = [
        [y, x],
        [y + 1, x + 1],
        [y + 2, x + 2],
        [y + 3, x + 3]
      ];
      // Assign diagonal (down-left)
      let diagDL = [
        [y, x],
        [y + 1, x - 1],
        [y + 2, x - 2],
        [y + 3, x - 3]
      ];
      // Check if four cells in any direction match
      if (_win(horiz) || _win(vert) || _win(diagDR) || _win(diagDL)) {
        return true;
      }
    }
  }
};

makeBoard(WIDTH, HEIGHT);
makeHtmlBoard();
