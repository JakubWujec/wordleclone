import { findLastIndex } from "./utils";
import { POSSIBLE_CORRECT_WORDS } from "./words";
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

        if (isCurrentRowFullyFilled(state)) {
          let guess = currentRow.map(cell => cell.char).join('');
          setCurrentRow(stateCopy, checkRow(guess, state.correctWord))

          stateCopy.usedChars = getUsedChars(stateCopy);
          stateCopy.correctChars = getCorrectChars(stateCopy);
          stateCopy.misplacedChars = getMisplacedChars(stateCopy);

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

function getUsedChars(state: WordleReducerState) {
  let usedChars = state.board.reduce((acc, row) => {
    return acc + row.map(cell => cell.char).filter(char => char !== WORDLE_EMPTY_CHAR).join('')
  }, '')
  return [...new Set(usedChars)];
}

function getCorrectChars(state: WordleReducerState) {
  let correctChars = state.board.reduce((acc, row) => {
    return acc + row
      .filter(cell => cell.status === 'CORRECT')
      .map(cell => cell.char)
      .filter(char => char !== WORDLE_EMPTY_CHAR)
      .join('')
  }, '')
  return [...new Set(correctChars)]
}

function getMisplacedChars(state: WordleReducerState) {
  let misplacedChars = state.board.reduce((acc, row) => {
    return acc + row.filter(cell => cell.status === 'MISPLACED').map(cell => cell.char).filter(char => char !== WORDLE_EMPTY_CHAR).join('')
  }, '')

  return [...new Set([...misplacedChars].filter((char) => !getCorrectChars(state).includes(char)))]
}

export {
  wordleReducer,
  getInitialState,
  setCurrentRow,
  getCurrentRow,
  WordleActionKind, WORDLE_EMPTY_CHAR
}; export type { WordleCell };

