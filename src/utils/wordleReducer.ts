import { findLastIndex } from "./utils";
import { POSSIBLE_CORRECT_WORDS } from "./words";
const WORDLE_EMPTY_CHAR = '_'
const ROWS = 6;
const COLUMNS = 5;
const ALPHABET_CHARS_ARRAY = "abcdefghijklmnopqrstuvwxyz".toUpperCase().split('')
interface WordleCell {
  char: string;
  status: CharStatus
}


type CharStatus = 'UNCHECKED' | 'WRONG' | 'MISPLACED' | 'CORRECT';
type GameStatus = 'WON' | 'LOST' | 'IN_PROGRESS'

interface WordleReducerState {
  board: WordleCell[][];
  correctWord: string;
  currentRowIndex: number;
  status: GameStatus
  rows: number,
  columns: number,
  charToCharStatus: Map<string, CharStatus>
}

enum WordleActionKind {
  ADD_LETTER = 'ADD_LETTER',
  REMOVE_LETTER = 'REMOVE_LETTER',
  ENTER_ROW = 'ENTER_ROW',
  RESTART = 'RESTART'
}

interface WordleActionPayload {
  letter?: string;
  word?: string;
}

interface WordleAction {
  type: WordleActionKind;
  payload: WordleActionPayload;
}

function wordleReducer(state: WordleReducerState, action: WordleAction) {
  const { type, payload } = action;
  {
    switch (type) {
      case WordleActionKind.ADD_LETTER: {
        if (state.status === 'IN_PROGRESS' && !!action.payload.letter) {
          let stateCopy = copyState(state);
          writeIfPossible(stateCopy, action.payload.letter)
          return stateCopy;
        }
        return {
          ...state,
        };
      }
      case WordleActionKind.REMOVE_LETTER: {
        let stateCopy = copyState(state);
        let currentRow = getCurrentRow(stateCopy);
        let lastFilledColumnIndex = findLastIndex(currentRow, item => item.char !== WORDLE_EMPTY_CHAR)
        if (lastFilledColumnIndex >= 0) {
          currentRow[lastFilledColumnIndex] = { char: WORDLE_EMPTY_CHAR, status: 'UNCHECKED' };
          setCurrentRow(stateCopy, currentRow);
        }
        return stateCopy;
      }

      case WordleActionKind.ENTER_ROW: {
        let stateCopy = copyState(state);
        let currentRow = getCurrentRow(stateCopy);

        if (isCurrentRowFullyFilled(state)) {
          let guess = currentRow.map(cell => cell.char).join('');
          setCurrentRow(stateCopy, checkRow(guess, state.correctWord))
          stateCopy.charToCharStatus = makeCharToCharStatus(stateCopy);

          if (guess === stateCopy.correctWord) {
            stateCopy.status = 'WON';
          } else if (!isAtLastRow(stateCopy)) {
            stateCopy.currentRowIndex++;
          } else {
            stateCopy.status = 'LOST'
          }
        }

        return stateCopy;
      }

      case WordleActionKind.RESTART: {
        let correctWord = action.payload.word ?? POSSIBLE_CORRECT_WORDS[Math.floor(Math.random() * POSSIBLE_CORRECT_WORDS.length)]
        return getInitialState(correctWord)
      }

      default:
        return state;
    }
  }
}

function makeEmptyBoard(rows: number, columns: number) {
  let board: WordleCell[][] = [];
  for (let row = 0; row < rows; row++) {
    board.push([]);
    for (let column = 0; column < columns; column++) {
      board[row].push({ char: WORDLE_EMPTY_CHAR, status: 'UNCHECKED' });
    }
  }
  return board;
}

function getInitialState(word?: string): WordleReducerState {
  let rows = ROWS;
  let columns = COLUMNS;
  let board = makeEmptyBoard(rows, columns);
  let charToCharStatus = getEmptyCharToCharStatus();

  return {
    board: board,
    rows,
    columns,
    correctWord: word || 'POINT',
    currentRowIndex: 0,
    status: 'IN_PROGRESS',
    charToCharStatus: charToCharStatus,
  }
}

function getCurrentRow(state: WordleReducerState) {
  return [...state.board[state.currentRowIndex]]
}

function copyState(state: WordleReducerState) {
  return {
    ...state,
    board: copyBoard(state.board),
    charToCharStatus: new Map(state.charToCharStatus)
  }
}

function copyBoard(board: WordleCell[][]) {
  let rows = board.length;
  let columns = board[0].length;
  let copyBoard = makeEmptyBoard(rows, columns);
  for (let row = 0; row < rows; row++) {
    for (let column = 0; column < columns; column++) {
      copyBoard[row][column].char = board[row][column].char;
      copyBoard[row][column].status = board[row][column].status;
    }
  }
  return copyBoard;
}

function setCurrentRow(state: WordleReducerState, row: WordleCell[]) {
  let _copyBoard = copyBoard(state.board);
  state.board = _copyBoard;
  state.board[state.currentRowIndex] = [...row];
  return;
}

function isCurrentRowFullyFilled(state: WordleReducerState) {
  return state.board[state.currentRowIndex].every(cell => cell.char != WORDLE_EMPTY_CHAR);
}

function writeIfPossible(state: WordleReducerState, char: string) {
  let currentRow = getCurrentRow(state);
  let lastFilledColumnIndex = findLastIndex(currentRow, cell => cell.char !== WORDLE_EMPTY_CHAR)
  if (lastFilledColumnIndex + 1 < COLUMNS) {
    currentRow[lastFilledColumnIndex + 1] = { char, status: 'UNCHECKED' };
    setCurrentRow(state, currentRow);
  }
}

function isAtLastRow(state: WordleReducerState) {
  return state.currentRowIndex === state.rows - 1;
}

function checkRow(guess: string, correct: string): WordleCell[] {
  let indexToCharGuess = new Map<number, string>();
  let indexToCharCorrect = new Map<number, string>();
  let resultRow = guess.split('').map(char => { return { char, status: 'WRONG' } as WordleCell })
  for (let index = 0; index < guess.length; index++) {
    indexToCharCorrect.set(index, correct[index]);
    indexToCharGuess.set(index, guess[index]);
  }

  // correct chars
  for (let i = 0; i < guess.length; i++) {
    if (guess[i] === correct[i]) {
      resultRow[i].status = 'CORRECT'
      indexToCharGuess.delete(i);
      indexToCharCorrect.delete(i);
    }
  }
  // misplaced
  for (let [index, char] of indexToCharGuess.entries()) {
    let index2ToDelete = null;
    for (let [index2, char2] of indexToCharCorrect.entries()) {
      if (char === char2) {
        resultRow[index].status = 'MISPLACED';
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

function getEmptyCharToCharStatus() {
  let charToCharStatus = new Map<string, CharStatus>();
  for (let char of ALPHABET_CHARS_ARRAY) {
    charToCharStatus.set(char, 'UNCHECKED');
  }
  return charToCharStatus;
}

function makeCharToCharStatus(state: WordleReducerState) {
  let charToCharStatus = getEmptyCharToCharStatus();

  for (let boardRow of state.board) {
    for (let i = 0; i < boardRow.length; i++) {
      charToCharStatus.set(boardRow[i].char, 'WRONG');

      if (state.correctWord[i] === boardRow[i].char) {
        charToCharStatus.set(boardRow[i].char, 'CORRECT');
      } else if (state.correctWord.includes(boardRow[i].char) && charToCharStatus.get(boardRow[i].char) != 'CORRECT') {
        charToCharStatus.set(boardRow[i].char, 'MISPLACED')
      }
    }
  }

  return charToCharStatus;
}

export {
  wordleReducer,
  getInitialState,
  setCurrentRow,
  getCurrentRow,
  WordleActionKind, WORDLE_EMPTY_CHAR
}; export type { WordleCell, CharStatus };

