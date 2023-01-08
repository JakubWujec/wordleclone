import { useState, useEffect, useMemo } from "react"
import Keyboard from "./Keyboard";
import Tile from "./Tiles/Tile";

const ROWS = 6;
const COLUMNS = 5;
const ENTER = "ENTER"
const BACKSPACE = "BACKSPACE"

function getEmptyState() {
  let s = [];
  for (let i = 0; i < ROWS; i++) {
    s.push(new Array(COLUMNS).fill(''))
  }
  return s;
}

const Wordle = () => {
  const CORRECT_WORD = 'POINT'
  const [boardRows, setBoardRows] = useState<string[][]>(getEmptyState());
  const [[currentRow, currentColumn], setCurrentPosition] = useState([0, 0])

  const usedLetters = useMemo(() => getUsedLettersSet(), [currentRow]);
  console.log(usedLetters);


  function getUsedLettersSet() {
    return new Set(boardRows.filter((row, index) => index < currentRow).flat().filter(char => char !== ''))
  }

  const handleKeyboardInput = (val: string) => {
    if (val === 'ENTER') {
      if (!boardRows[currentRow].some(l => l === '')) {
        checkRow();
      }

    }
    else if (val === 'BACKSPACE') {
      let board = copyBoard(boardRows);
      board[currentRow][currentColumn] = '';
      setBoardRows(board);
      moveToPreviousColumn();
    } else if (val.length === 1 && val.match(/[A-Z]{1}/)) {
      writeIfEmpty(currentRow, currentColumn, val);
      moveToNextColumn();
    }
  }

  useEffect(() => {
    function handleKeyDown(evt: KeyboardEvent) {
      handleKeyboardInput(evt.key.toUpperCase())
    }

    document.addEventListener('keydown', handleKeyDown);

    // Don't forget to clean up
    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyboardInput]);

  function copyBoard(boardRows: string[][]) {
    return boardRows.map(row => [...row])
  }

  function moveToPreviousColumn() {
    if (currentColumn !== 0) {
      setCurrentPosition([currentRow, Math.max(0, currentColumn - 1)])
    }
  }

  function moveToNextColumn() {
    if (currentColumn !== COLUMNS - 1) {
      setCurrentPosition([currentRow, Math.min(COLUMNS - 1, currentColumn + 1)])
    }
  }

  function moveToNextRow() {
    if (currentRow + 1 < ROWS) {
      setCurrentPosition([currentRow + 1, 0])
    }
  }

  function writeIfEmpty(row: number, column: number, char: string) {
    let board = copyBoard(boardRows);
    if (board[row][column] === '') {
      board[row][column] = char;
    }
    setBoardRows(board);
  }

  function checkRow() {
    let guess = boardRows[currentRow].join('');
    if (guess === CORRECT_WORD) {
      endGame();
    } else {
      moveToNextRow();
    }
  }

  function endGame() {
    alert("Game finished")
  }

  const keyboardClickHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    let val = event.target.dataset.value;
    handleKeyboardInput(val);
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-84 grid grid-rows-6 gap-1">
        {boardRows.map((boardRow, rowIndex) => {
          return <div key={rowIndex} className="grid grid-cols-5 gap-1">
            {boardRow.map((char, columnIndex) => {
              return <Tile state={(rowIndex === currentRow && char !== '') ? "UNCHECKED" : "EMPTY"} key={`${rowIndex}-${columnIndex}`} char={char}></Tile>
            })}
          </div>
        })}
      </div>
      <Keyboard onClick={keyboardClickHandler}></Keyboard>
    </div>
  )
}

export default Wordle;