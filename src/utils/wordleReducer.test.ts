import { wordleReducer, getInitialState, WordleActionKind } from "./wordleReducer";
import { describe, expect, it } from 'vitest'

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


  })


})