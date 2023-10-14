import { useEffect, useReducer } from "react";
import { wordleReducer, getInitialState, WordleActionKind, isCurrentRowFullyFilled } from "../utils/wordleReducer";
import Cell from "./Cell";
import Keyboard from "./Keyboard";
import toast from 'react-hot-toast';

const Wordle = () => {
  const [wordleState, dispatch] = useReducer(wordleReducer, getInitialState('POINT'));
  const handleKeyboardInput = (val: string) => {
    if (wordleState.status === 'IN_PROGRESS') {
      if (val === 'ENTER') {
        handleEnter();
      } else if (val === 'BACKSPACE') {
        handleBackspace();
      } else if (val.length === 1 && val.match(/[A-Z]{1}/)) {
        handleWrite(val as string);
      }
    }
  }

  useEffect(() => {
    if (wordleState.status === 'LOST') {
      toast.dismiss();
      toast(wordleState.correctWord, {
        duration: Infinity
      })
    } else if (wordleState.status === 'WON') {
      toast.dismiss();
      toast("Good job!", {
        duration: 3000
      })
    }
  }, [wordleState.status])

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
    if (!isCurrentRowFullyFilled(wordleState)) {
      toast.dismiss();
      toast("Not enough letters")
    } else {
      dispatch({
        type: WordleActionKind.ENTER_ROW,
        payload: {}
      })
    }
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
      payload: {}
    })
    toast.dismiss();

  }

  function handleWrite(char: string) {
    dispatch({
      type: WordleActionKind.ADD_LETTER,
      payload: { letter: char }
    })
  }

  const keyboardClickHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    if (event.target instanceof HTMLElement) {
      let val = event.target.dataset.value;
      if (val) {
        handleKeyboardInput(val);
      }
    }
  }

  return (
    <div className="flex flex-col items-center">
      {(wordleState.status === "LOST" || wordleState.status === 'WON') && <button className="mb-2 p-2 bg-blue-500" onClick={handleRestart}>Try again</button>}
      <div className="w-84 mb-4 grid grid-rows-6 gap-1">
        {wordleState.board.map((boardRow, rowIndex) => {
          return <div key={rowIndex} className="grid grid-cols-5 gap-1">
            {boardRow.map((wordleCell, columnIndex) => {
              return (
                <Cell wordleCell={wordleCell}></Cell>
              )
            })}
          </div>
        })}
      </div>
      <Keyboard
        onClick={keyboardClickHandler}
        charToCharStatus={wordleState.charToCharStatus}
      ></Keyboard>
    </div>
  )
}

export default Wordle;