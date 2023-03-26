import { findLastIndex } from "./utils";

const WORDLE_EMPTY_CHAR = '_'
const ROWS = 6;
const COLUMNS = 5;

interface WordleReducerState {
  board: string[][];
  correctWord: string;
  currentRowIndex: number;
  status: 'WIN' | 'LOST' | 'IN_PROGRESS'
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
  switch (type) {
    case WordleActionKind.ADD_LETTER:
      if (state.status === 'IN_PROGRESS') {
        writeIfPossible(state, action.payload.letter!)
      }
      return {
        ...state,
      };
    case WordleActionKind.REMOVE_LETTER:
      return {
        ...state,
      };
    default:
      return state;
  }
}

function getInitialState(word?: string): WordleReducerState {
  let board: string[][] = [];
  for (let row = 0; row < ROWS; row++) {
    board.push([]);
    for (let column = 0; column < COLUMNS; column++) {
      board[row].push(WORDLE_EMPTY_CHAR);
    }
  }


  return {
    board: [[]],
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

function setCurrentRow(state: WordleReducerState, row: string[]) {
  return state.board[state.currentRowIndex] = row;
}

function isRowFullyFilled(state: WordleReducerState, rowIndex: number) {
  return false;
  // return !state.board[rowIndex].some(boardCell => boardCell.char === EMPTY_CHAR)
}

function writeIfPossible(state: WordleReducerState, char: string) {
  let currentRow = getCurrentRow(state);
  let lastFilledColumnIndex = findLastIndex(currentRow, item => item !== WORDLE_EMPTY_CHAR)
  if (lastFilledColumnIndex + 1 < COLUMNS) {
    currentRow[lastFilledColumnIndex + 1] = char;
    setCurrentRow(state, currentRow);
  }
}



export {
  wordleReducer,
  getInitialState,
  WordleActionKind,
  WORDLE_EMPTY_CHAR
}