import { wordleReducer, getInitialState, WordleActionKind, setCurrentRow, getCurrentRow, WORDLE_EMPTY_CHAR, WordleCell } from "./wordleReducer";
import { describe, expect, it } from 'vitest'

function makeUncheckedRow(chars: string): WordleCell[] {
  return [...chars].map(char => { return { char, status: "UNCHECKED" } });
}

describe("Wordle reducer testing", () => {

  describe("ADD_LETTER action testing", () => {
    it('Should add letter at (0,0) when dispatching ADD_LETTER for the first time', () => {
      let state = getInitialState();
      let addLetterAction = {
        type: WordleActionKind.ADD_LETTER,
        payload: {
          letter: 'H',
        }
      }
      let newState = wordleReducer(state, addLetterAction)
      expect(newState.board[0][0].char).toBe(addLetterAction.payload.letter);
    })

    it("Should not change anything when currentRow is full", () => {
      let state = getInitialState();
      setCurrentRow(state, makeUncheckedRow("ABCED"))

      let addLetterAction = {
        type: WordleActionKind.ADD_LETTER,
        payload: {
          letter: 'H',
        }
      }
      let newState = wordleReducer(state, addLetterAction)
      expect(newState).toEqual(state);
    })
  })


  describe("REMOVE_LETTER action testing", () => {
    it("Should not change anything when currentRow is empty", () => {
      let state = getInitialState();

      let removeLetterAction = {
        type: WordleActionKind.REMOVE_LETTER,
        payload: {
          letter: 'H',
        }
      }
      let newState = wordleReducer(state, removeLetterAction)
      expect(newState).toEqual(state);
    })

    it("Should remove last added letter", () => {
      let state = getInitialState();
      let addLetterAction = {
        type: WordleActionKind.ADD_LETTER,
        payload: {
          letter: 'H',
        }
      }
      let newState = wordleReducer(state, addLetterAction)
      expect(getCurrentRow(newState)).not.to.equal(getCurrentRow(state));

      let removeLetterAction = {
        type: WordleActionKind.REMOVE_LETTER,
        payload: {}
      }
      newState = wordleReducer(newState, removeLetterAction)

      expect(getCurrentRow(newState)).toEqual(getCurrentRow(state));
    })
  })

  describe("ENTER_ROW action testing", () => {
    it("Should not change anything when currentRow is not full", () => {
      let state = getInitialState();

      let enterRowAction = {
        type: WordleActionKind.ENTER_ROW,
        payload: {}
      }
      let newState = wordleReducer(state, enterRowAction)
      expect(newState).toEqual(state);
    })

    it("Should move to the next row when the current row is full and next row exist", () => {
      let state = getInitialState();
      setCurrentRow(state, makeUncheckedRow("ABCED"));
      let enterRowAction = {
        type: WordleActionKind.ENTER_ROW,
        payload: {}
      }

      let newState = wordleReducer(state, enterRowAction)

      expect(newState.currentRowIndex).toEqual(state.currentRowIndex + 1);
      expect(getCurrentRow(newState).filter(cell => cell.char !== WORDLE_EMPTY_CHAR).length).toBe(0);
    })

    it("Should end game when last row is entered", () => {
      let state = getInitialState('HONOR');
      let newState = state;
      let enterRowAction = {
        type: WordleActionKind.ENTER_ROW,
        payload: {}
      }
      for (let i = 0; i < newState.rows; i++) {
        setCurrentRow(newState, makeUncheckedRow('ABCDE'));
        newState = wordleReducer(newState, enterRowAction)
      }
      expect(newState.status).not.to.equal('IN_PROGRESS');
    })

    it("Should end game when correct word is entered", () => {
      let state = getInitialState('HONOR');
      let newState = state;
      let enterRowAction = {
        type: WordleActionKind.ENTER_ROW,
        payload: {}
      }

      setCurrentRow(newState, makeUncheckedRow('ABCDE'));
      newState = wordleReducer(newState, enterRowAction)

      expect(newState.status).to.equal('IN_PROGRESS');

      setCurrentRow(newState, makeUncheckedRow('HONOR'));
      newState = wordleReducer(newState, enterRowAction)

      expect(newState.status).to.equal('WON');

    })
  })


})