import { findLastIndex } from "./utils";

const WORDLE_EMPTY_CHAR = '_'
const ROWS = 6;
const COLUMNS = 5;

interface WordleReducerState {
  board: string[][];
  correctWord: string;
  currentRowIndex: number;
  status: 'WON' | 'LOST' | 'IN_PROGRESS'
  rows: number,
  columns: number,
  usedChars: string[];
  correctChars: string[];
  misplacedChars: string[];
}

enum WordleActionKind {
  ADD_LETTER = 'ADD_LETTER',
  REMOVE_LETTER = 'REMOVE_LETTER',
  ENTER_ROW = 'ENTER_ROW'
}

interface WordleActionPayload {
  letter?: string;
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
        let lastFilledColumnIndex = findLastIndex(currentRow, item => item !== WORDLE_EMPTY_CHAR)
        if (lastFilledColumnIndex >= 0) {
          currentRow[lastFilledColumnIndex] = WORDLE_EMPTY_CHAR;
          setCurrentRow(stateCopy, currentRow);
        }
        return stateCopy;
      }

      case WordleActionKind.ENTER_ROW: {
        let stateCopy = copyState(state);
        let currentRow = getCurrentRow(stateCopy);
        if (currentRow.join('') === stateCopy.correctWord) {
          stateCopy.status = 'WON';

        } else if (!isAtLastRow(stateCopy)) {
          if (isCurrentRowFullyFilled(state)) {
            stateCopy.currentRowIndex++;
          }
        } else {
          stateCopy.status = 'LOST'
        }

        return stateCopy;
      }

      default:
        return state;
    }
  }
}

function getInitialState(word?: string): WordleReducerState {
  let board: string[][] = [];
  let rows = ROWS;
  let columns = COLUMNS;
  for (let row = 0; row < ROWS; row++) {
    board.push([]);
    for (let column = 0; column < COLUMNS; column++) {
      board[row].push(WORDLE_EMPTY_CHAR);
    }
  }

  return {
    board: board,
    rows,
    columns,
    correctWord: word || 'POINT',
    currentRowIndex: 0,
    status: 'IN_PROGRESS',
    usedChars: [],
    correctChars: [],
    misplacedChars: [],
  }
}

function getCurrentRow(state: WordleReducerState) {
  return [...state.board[state.currentRowIndex]]
}

function copyState(state: WordleReducerState) {
  return {
    ...state,
    board: copyBoard(state.board),
    usedChars: [...state.usedChars],
    correctChars: [...state.correctChars],
    misplacedChars: [...state.misplacedChars],
  }
}

function copyBoard(board: string[][]) {
  return board.map(row => [...row])
}

function setCurrentRow(state: WordleReducerState, row: string[]) {
  let _copyBoard = copyBoard(state.board);
  state.board = _copyBoard;
  state.board[state.currentRowIndex] = [...row];
  return;
}

function isCurrentRowFullyFilled(state: WordleReducerState) {
  return state.board[state.currentRowIndex].every(letter => letter != WORDLE_EMPTY_CHAR);
}

function writeIfPossible(state: WordleReducerState, char: string) {
  let currentRow = getCurrentRow(state);
  let lastFilledColumnIndex = findLastIndex(currentRow, item => item !== WORDLE_EMPTY_CHAR)
  if (lastFilledColumnIndex + 1 < COLUMNS) {
    currentRow[lastFilledColumnIndex + 1] = char;
    setCurrentRow(state, currentRow);
  }
}

function isAtLastRow(state: WordleReducerState) {
  return state.currentRowIndex === state.rows - 1;
}

export {
  wordleReducer,
  getInitialState,
  setCurrentRow,
  getCurrentRow,
  WordleActionKind,
  WORDLE_EMPTY_CHAR
}
