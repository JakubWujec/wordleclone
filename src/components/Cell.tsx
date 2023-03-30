import { WordleCell, WORDLE_EMPTY_CHAR } from "../utils/wordleReducer"


type CellProps = {
  wordleCell: WordleCell
}

let extraClassName = {
  CORRECT: 'bg-green-500 text-white',
  MISPLACED: 'bg-yellow-500 text-white',
  WRONG: 'bg-slate-500 text-white',
  UNCHECKED: 'border-slate-800'
}


const Cell = ({ wordleCell }: CellProps) => {
  const isEmpty = wordleCell.char === WORDLE_EMPTY_CHAR

  if (isEmpty) {
    return <div className="select-none w-12 h-12 border-2 flex justify-center items-center font-bold text-xl">
      { }
    </div>
  }

  return (
    <div className={`select-none w-12 h-12 border-2 flex justify-center items-center font-bold text-xl ${extraClassName[wordleCell.status]}`}>
      {isEmpty ? ' ' : wordleCell.char}
    </div>
  )
}

export default Cell;