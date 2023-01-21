import { useState, useEffect, useMemo } from "react"
import Keyboard from "./Keyboard";
import Tile from "./Tiles/Tile";

const ROWS = 6;
const COLUMNS = 5;
export const EMPTY_CHAR = '_'

type BoardCell = {
  char: string;
  state: 'WRONG' | 'MISPLACED' | 'CORRECT'
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
  const usedLettersMap = useMemo(() => getUsedLettersMap(), [currentRow]);
  const correctLetters = useMemo(() => getCorrectLetters(), [currentRow]);

  function isRowFullyFilled(rowIndex: number) {
    return !boardRows[rowIndex].some(boardCell => boardCell.char === EMPTY_CHAR)
  }


  function getUsedLettersMap() {
    let m = new Map<string, number[]>();
    for (let row of boardRows) {
      for (let i = 0; i < row.length; i++) {
        if (!m.has(row[i].char)) {
          m.set(row[i].char, [i])
        } else {
          if (!m.get(row[i].char)?.includes(i)) {
            m.get(row[i].char)?.push(i);
          }
        }
      }
    }
    return m;
  }

  function getCorrectLetters() {
    let foundLetters = new Set<string>();
    for (let row of boardRows) {
      for (let boardCell of row) {
        if (CORRECT_WORD.indexOf(boardCell.char) >= 0) {
          foundLetters.add(boardCell.char)
        }
      }
    }
    return foundLetters;
  }

  const handleKeyboardInput = (val: string) => {
    if (val === 'ENTER') {
      if (isRowFullyFilled(currentRow)) {
        let checkedRow = checkRow(boardRows[currentRow].map(cell => cell.char).join(''), CORRECT_WORD);
        setRow(checkedRow, currentRow);
        moveToNextRow();
      }

    }
    else if (val === 'BACKSPACE') {
      let board = copyBoard(boardRows);
      board[currentRow][currentColumn] = { char: EMPTY_CHAR, state: "WRONG" };
      setBoardRows(board);
      moveToPreviousColumn();
    } else if (val.length === 1 && val.match(/[A-Z]{1}/)) {
      writeIfEmpty(currentRow, currentColumn, val as string);
      moveToNextColumn();
    }
  }

  const setRow = (row: BoardCell[], rowIndex: number) => {
    let board = copyBoard(boardRows);
    board[rowIndex] = row;
    setBoardRows(board);
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

  function copyBoard(boardRows: BoardCell[][]) {
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
    console.log(row, column, char)
    if (board[row][column].char === EMPTY_CHAR) {
      board[row][column] = {
        char: char,
        state: 'WRONG'
      }
    }
    setBoardRows(board);
  }

  function checkRow(guess: string, correct: string): BoardCell[] {
    let indexToLetterGuess = new Map<number, string>();
    let indexToLetterCorrect = new Map<number, string>();
    let resultRow = guess.split('').map(letter => { return { char: letter, state: 'WRONG' } as BoardCell })
    for (let index = 0; index < guess.length; index++) {
      indexToLetterCorrect.set(index, correct[index]);
      indexToLetterGuess.set(index, guess[index]);
    }

    // correct letters
    for (let i = 0; i < guess.length; i++) {
      if (guess[i] === correct[i]) {
        resultRow[i].state = 'CORRECT'
        indexToLetterGuess.delete(i);
        indexToLetterCorrect.delete(i);
      }
    }
    // misplaced
    for (let [index, letter] of indexToLetterGuess.entries()) {
      let index2ToDelete = null;
      for (let [index2, letter2] of indexToLetterCorrect.entries()) {
        if (letter === letter2) {
          resultRow[index].state = 'MISPLACED';
          index2ToDelete = index2
          break;
        }
      }
      if (index2ToDelete !== null) {
        indexToLetterCorrect.delete(index2ToDelete);
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
              return <Tile state={boardCell.state} key={`${rowIndex}-${columnIndex}`} char={boardCell.char}></Tile>
            })}
          </div>
        })}
      </div>
      <Keyboard onClick={keyboardClickHandler} usedLetters={new Set(usedLettersMap.keys())} foundLetters={correctLetters}></Keyboard>
    </div>
  )
}

export default Wordle;