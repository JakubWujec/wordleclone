import { useEffect, useMemo, useState, useReducer } from "react";
import { wordleReducer, getInitialState, WordleActionKind } from "../utils/wordleReducer";
import Board from "./Board";
import EndGame from "./EndGame";
import Keyboard from "./Keyboard";

const Wordle = () => {
  const [wordleState, dispatch] = useReducer(wordleReducer, getInitialState('POINT'));

  const handleKeyboardInput = (val: string) => {
    if (wordleState.status === 'IN_PROGRESS') {
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

  function handleEnter() {
    dispatch({
      type: WordleActionKind.ENTER_ROW,
      payload: {}
    })
  }

  function handleBackspace() {
    dispatch({
      type: WordleActionKind.REMOVE_LETTER,
      payload: {}
    })
  }

  function handleRestart() {
    dispatch({
      type: WordleActionKind.RESTART,
      payload: {
        word: 'POINT'
      }
    })
  }

  function writeIfPossible(char: string) {
    dispatch({
      type: WordleActionKind.ADD_LETTER,
      payload: { letter: char }
    })
  }

  const keyboardClickHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    let val = event.target.dataset.value;
    handleKeyboardInput(val);
  }

  return (
    <div className="flex flex-col items-center">
      <EndGame restart={handleRestart} gameStatus={wordleState.status}></EndGame>
      <Board board={wordleState.board}></Board>
      <Keyboard onClick={keyboardClickHandler} misplacedChars={wordleState.misplacedChars} usedChars={wordleState.usedChars} correctChars={wordleState.correctChars}></Keyboard>
    </div>
  )
}

export default Wordle;