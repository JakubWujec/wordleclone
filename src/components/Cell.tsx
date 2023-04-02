import { useEffect, useState } from "react"
import { WordleCell, WORDLE_EMPTY_CHAR } from "../utils/wordleReducer"


type CellProps = {
  wordleCell: WordleCell
}

let extraClassName = {
  CORRECT: 'bg-wordle-correct-color text-white',
  MISPLACED: 'bg-wordle-misplaced-color text-white',
  WRONG: 'bg-wordle-wrong-color text-white',
  UNCHECKED: 'bg-wordle-unchecked-color border-slate-800'
}


const Cell = ({ wordleCell }: CellProps) => {
  const isEmpty = wordleCell.char === WORDLE_EMPTY_CHAR
  let classNameExtra = isEmpty ? '' : extraClassName[wordleCell.status]
  let text = isEmpty ? '' : wordleCell.char

  return <div className={`${isEmpty ? '' : 'animate-bump'} select-none w-12 h-12 border-2 flex justify-center items-center font-bold text-xl ${classNameExtra}`}>
    {text}
  </div>
}

export default Cell;