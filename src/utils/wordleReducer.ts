import { findLastIndex } from "./utils";

const WORDLE_EMPTY_CHAR = '_'
const ROWS = 6;
const COLUMNS = 5;

interface WordleCell {
  char: string;
  status: 'UNCHECKED' | 'WRONG' | 'MISPLACED' | 'CORRECT'
}

interface WordleReducerState {
  board: WordleCell[][];
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
        if (currentRow.map(cell => cell.char).join('') === stateCopy.correctWord) {
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

      case WordleActionKind.RESTART: {
        return getInitialState(action.payload.word)
      }

      default:
        return state;
    }
  }
}

function getInitialState(word?: string): WordleReducerState {
  let board: WordleCell[][] = [];
  let rows = ROWS;
  let columns = COLUMNS;
  for (let row = 0; row < ROWS; row++) {
    board.push([]);
    for (let column = 0; column < COLUMNS; column++) {
      board[row].push({ char: WORDLE_EMPTY_CHAR, status: 'UNCHECKED' });
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

function copyBoard(board: WordleCell[][]) {
  return board.map(row => [...row])
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

export {
  wordleReducer,
  getInitialState,
  setCurrentRow,
  getCurrentRow,
  WordleActionKind, WORDLE_EMPTY_CHAR
}; export type { WordleCell };

