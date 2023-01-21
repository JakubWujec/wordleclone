import { useState, useEffect, useMemo } from "react"
import Keyboard from "./Keyboard";
import Cell from "./Tiles/Tile";

const ROWS = 6;
const COLUMNS = 5;
export const EMPTY_CHAR = '_'

export type CellState = 'WRONG' | 'MISPLACED' | 'CORRECT'

type BoardCell = {
  char: string;
  state: CellState
}

function getEmptyState(): BoardCell[][] {
  let s = [];
  for (let i = 0; i < ROWS; i++) {
    s.push(new Array(COLUMNS).fill({
      char: EMPTY_CHAR,
      state: 'WRONG'
    }))
  }
  return s;
}

const Wordle = () => {
  const CORRECT_WORD = 'POINT'
  const [boardRows, setBoardRows] = useState<BoardCell[][]>(getEmptyState());
  const [[currentRow, currentColumn], setCurrentPosition] = useState([0, 0])

  // const correctWordMap = useMemo(() => )
  const usedChars = useMemo(() => getUsedChars(), [currentRow]);
  const correctChars = useMemo(() => getCorrectChars(), [currentRow]);
  const misplacedChars = useMemo(() => getMisplacedChars(), [currentRow]);

  const handleKeyboardInput = (val: string) => {
    if (val === 'ENTER') {
      if (isRowFullyFilled(currentRow)) {
        let checkedRow = checkRow(boardRows[currentRow].map(cell => cell.char).join(''), CORRECT_WORD);
        setRow(checkedRow, currentRow);
        moveToNextRow();
      }
    } else if (val === 'BACKSPACE') {
      let board = copyBoard(boardRows);
      board[currentRow][currentColumn] = { char: EMPTY_CHAR, state: "WRONG" };
      setBoardRows(board);
      moveToPreviousColumn();
    } else if (val.length === 1 && val.match(/[A-Z]{1}/)) {
      writeIfEmpty(currentRow, currentColumn, val as string);
      moveToNextColumn();
    }
  }

  useEffect(() => {
    function handleKeyDown(evt: KeyboardEvent) {
      handleKeyboardInput(evt.key.toUpperCase())
    }

    document.addEventListener('keydown', handleKeyDown);

    // cleanup
    return function cleanup() {
      document.removeEventListener('keydown', handleKeyDown);
    }
  }, [handleKeyboardInput]);

  function copyBoard(boardRows: BoardCell[][]) {
    return boardRows.map(row => [...row])
  }

  function isRowFullyFilled(rowIndex: number) {
    return !boardRows[rowIndex].some(boardCell => boardCell.char === EMPTY_CHAR)
  }

  function getUsedChars() {
    let usedChars = boardRows.reduce((acc, currentRow) => {
      return acc + currentRow.map(cell => cell.char).filter(char => char !== EMPTY_CHAR).join('')
    }, '')
    return new Set(usedChars);
  }

  function getCorrectChars() {
    let correctChars = boardRows.reduce((acc, currentRow) => {
      return acc + currentRow.filter(cell => cell.state === 'CORRECT').map(cell => cell.char).filter(char => char !== EMPTY_CHAR).join('')
    }, '')
    return new Set(correctChars)
  }

  function getMisplacedChars() {
    let misplacedChars = boardRows.reduce((acc, currentRow) => {
      return acc + currentRow.filter(cell => cell.state === 'MISPLACED').map(cell => cell.char).filter(char => char !== EMPTY_CHAR).join('')
    }, '')
    console.log(misplacedChars, correctChars, new Set([...misplacedChars].filter((char) => !getCorrectChars().has(char))))

    return new Set([...misplacedChars].filter((char) => !getCorrectChars().has(char)))
  }

  const setRow = (row: BoardCell[], rowIndex: number) => {
    let board = copyBoard(boardRows);
    board[rowIndex] = row;
    setBoardRows(board);
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
    if (board[row][column].char === EMPTY_CHAR) {
      board[row][column] = {
        char: char,
        state: 'WRONG'
      }
    }
    setBoardRows(board);
  }

  function checkRow(guess: string, correct: string): BoardCell[] {
    let indexToCharGuess = new Map<number, string>();
    let indexToCharCorrect = new Map<number, string>();
    let resultRow = guess.split('').map(char => { return { char: char, state: 'WRONG' } as BoardCell })
    for (let index = 0; index < guess.length; index++) {
      indexToCharCorrect.set(index, correct[index]);
      indexToCharGuess.set(index, guess[index]);
    }

    // correct chars
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === correct[i]) {
        resultRow[i].state = 'CORRECT'
        indexToCharGuess.delete(i);
        indexToCharCorrect.delete(i);
      }
    }
    // misplaced
    for (let [index, char] of indexToCharGuess.entries()) {
      let index2ToDelete = null;
      for (let [index2, char2] of indexToCharCorrect.entries()) {
        if (char === char2) {
          resultRow[index].state = 'MISPLACED';
          index2ToDelete = index2
          break;
        }
      }
      if (index2ToDelete !== null) {
        indexToCharCorrect.delete(index2ToDelete);
      }
    }
    return resultRow;
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
            {boardRow.map((boardCell, columnIndex) => {
              return <Cell state={boardCell.state} key={`${rowIndex}-${columnIndex}`} char={boardCell.char}></Cell>
            })}
          </div>
        })}
      </div>
      <Keyboard onClick={keyboardClickHandler} misplacedChars={misplacedChars} usedChars={usedChars} correctChars={correctChars}></Keyboard>
    </div>
  )
}

export default Wordle;