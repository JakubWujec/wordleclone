import { wordleReducer, getInitialState, WordleActionKind, setCurrentRow, getCurrentRow } from "./wordleReducer";
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
      console.log("S1", getCurrentRow(state))
      let addLetterAction = {
        type: WordleActionKind.ADD_LETTER,
        payload: {
          letter: 'H',
        }
      }
      let newState = wordleReducer(state, addLetterAction)
      expect(getCurrentRow(newState)).not.to.equal(getCurrentRow(newState));
      console.log("S2", getCurrentRow(newState))
      let removeLetterAction = {
        type: WordleActionKind.REMOVE_LETTER,
        payload: {}
      }
      newState = wordleReducer(state, removeLetterAction)
      console.log("S3", getCurrentRow(newState), getCurrentRow(state))
      expect(getCurrentRow(newState)).toEqual(getCurrentRow(state));
    })
  })


})