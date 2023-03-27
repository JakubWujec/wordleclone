import { wordleReducer, getInitialState, WordleActionKind, setCurrentRow, getCurrentRow, WORDLE_EMPTY_CHAR } from "./wordleReducer";
import { describe, expect, it } from 'vitest'
import { EMPTY_CHAR } from "../components/Wordle";

describe("Wordle reducer testing", () => {

  describe("ADD_LETTER action testing", () => {
    it('Should at letter and (0,0) when dispatching ADD_LETTER for the first time', () => {
      let state = getInitialState();
      let addLetterAction = {
        type: WordleActionKind.ADD_LETTER,
        payload: {
          letter: 'H',
        }
      }
      let newState = wordleReducer(state, addLetterAction)
      expect(newState.board[0][0]).toBe(addLetterAction.payload.letter);
    })
    it("Should not change anything when currentRow is full", () => {
      let state = getInitialState();
      setCurrentRow(state, [...'ABCDE'])

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
      expect(getCurrentRow(newState)).not.to.equal(getCurrentRow(newState));

      let removeLetterAction = {
        type: WordleActionKind.REMOVE_LETTER,
        payload: {}
      }
      newState = wordleReducer(state, removeLetterAction)

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
      setCurrentRow(state, [...'ABCDE']);
      let enterRowAction = {
        type: WordleActionKind.ENTER_ROW,
        payload: {}
      }

      let newState = wordleReducer(state, enterRowAction)

      expect(newState.currentRowIndex).toEqual(state.currentRowIndex + 1);
      expect(getCurrentRow(newState).filter(x => x !== WORDLE_EMPTY_CHAR).length).toBe(0);
    })

    it("Should end game when last row is entered", () => {
      let state = getInitialState('HONOR');
      let newState = state;
      let enterRowAction = {
        type: WordleActionKind.ENTER_ROW,
        payload: {}
      }
      for (let i = 0; i < newState.rows; i++) {
        setCurrentRow(newState, [...'ABCDE']);
        newState = wordleReducer(newState, enterRowAction)
      }
      console.log(newState)
      expect(newState.status).not.to.equal('IN_PROGRESS');
    })
  })


})