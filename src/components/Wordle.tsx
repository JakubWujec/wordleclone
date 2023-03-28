import { useEffect, useMemo, useState } from "react";
import { findLastIndex } from "../utils/utils";
import Board from "./Board";
import EndGame from "./EndGame";
import Keyboard from "./Keyboard";

const ROWS = 6;
const COLUMNS = 5;
export const EMPTY_CHAR = '_'

export type CellState = 'UNCHECKED' | 'WRONG' | 'MISPLACED' | 'CORRECT'
export type GameState = 'WON' | 'LOST' | 'INPROGRESS'

export type BoardCell = {
  char: string;
  state: CellState
}

function getInitialBoardState(): BoardCell[][] {
  let s = [];
  for (let i = 0; i < ROWS; i++) {
    s.push(new Array(COLUMNS).fill({
      char: EMPTY_CHAR,
      state: 'UNCHECKED'
    }))
  }
  return s;
}

const Wordle = () => {
  const CORRECT_WORD = 'POINT'
  const [board, setBoard] = useState<BoardCell[][]>(getInitialBoardState());
  const [currentRow, setCurrentRow] = useState(0)

  const usedChars = useMemo(() => getUsedChars(), [currentRow]);
  const correctChars = useMemo(() => getCorrectChars(), [currentRow]);
  const misplacedChars = useMemo(() => getMisplacedChars(), [currentRow]);

  const gameState: GameState = getGameState();

  function getGameState(): GameState {
    if (board.some(row => row.every(cell => cell.state === 'CORRECT'))) return 'WON'
    if (board.every(row => row.every(cell => cell.state !== 'UNCHECKED'))) return 'LOST'
    return 'INPROGRESS'
  }

  const handleKeyboardInput = (val: string) => {
    if (gameState === 'INPROGRESS') {
      if (val === 'ENTER') {
        handleEnter();
      } else if (val === 'BACKSPACE') {
        handleBackspace();
      } else if (val.length === 1 && val.match(/[A-Z]{1}/)) {
        writeIfPossible(val as string);
      }
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

  function restart() {
    setBoard(getInitialBoardState());
    setCurrentRow(0)
  }

  function copyBoard(boardRows: BoardCell[][]) {
    return boardRows.map(row => [...row])
  }

  function isRowFullyFilled(rowIndex: number) {
    return !board[rowIndex].some(boardCell => boardCell.char === EMPTY_CHAR)
  }

  function getUsedChars() {
    let usedChars = board.reduce((acc, currentRow) => {
      return acc + currentRow.map(cell => cell.char).filter(char => char !== EMPTY_CHAR).join('')
    }, '')
    return new Set(usedChars);
  }

  function getCorrectChars() {
    let correctChars = board.reduce((acc, currentRow) => {
      return acc + currentRow.filter(cell => cell.state === 'CORRECT').map(cell => cell.char).filter(char => char !== EMPTY_CHAR).join('')
    }, '')
    return new Set(correctChars)
  }

  function getMisplacedChars() {
    let misplacedChars = board.reduce((acc, currentRow) => {
      return acc + currentRow.filter(cell => cell.state === 'MISPLACED').map(cell => cell.char).filter(char => char !== EMPTY_CHAR).join('')
    }, '')
    console.log(misplacedChars, correctChars, new Set([...misplacedChars].filter((char) => !getCorrectChars().has(char))))

    return new Set([...misplacedChars].filter((char) => !getCorrectChars().has(char)))
  }

  function moveToNextRow() {
    if (currentRow + 1 < ROWS) {
      setCurrentRow(old => old + 1)
    }
  }

  function handleEnter() {
    if (isRowFullyFilled(currentRow)) {
      let boardCopy = copyBoard(board);
      let checkedRow = checkRow(boardCopy[currentRow].map(cell => cell.char).join(''), CORRECT_WORD);
      boardCopy[currentRow] = checkedRow;
      setBoard(boardCopy);
      moveToNextRow();
    }
  }

  function handleBackspace() {
    let boardCopy = copyBoard(board);
    let lastFilledColumnIndex = findLastIndex(boardCopy[currentRow], item => item.char !== EMPTY_CHAR)
    boardCopy[currentRow][lastFilledColumnIndex] = { char: EMPTY_CHAR, state: "UNCHECKED" };
    setBoard(boardCopy);
  }

  function writeIfPossible(char: string) {
    let boardCopy = copyBoard(board);
    let lastFilledColumnIndex = findLastIndex(boardCopy[currentRow], item => item.char !== EMPTY_CHAR)
    if (lastFilledColumnIndex + 1 < COLUMNS) {
      boardCopy[currentRow][lastFilledColumnIndex + 1] = {
        char: char,
        state: 'UNCHECKED'
      }
    }
    setBoard(boardCopy);
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
      <EndGame restart={handleRestart} gameStatus={wordleState.status}></EndGame>
      <Board board={board}></Board>
      <Keyboard onClick={keyboardClickHandler} misplacedChars={misplacedChars} usedChars={usedChars} correctChars={correctChars}></Keyboard>
    </div>
  )
}

export default Wordle;