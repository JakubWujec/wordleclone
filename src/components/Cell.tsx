import { WordleCell, WORDLE_EMPTY_CHAR } from "../utils/wordleReducer"


type CellProps = {
  wordleCell: WordleCell
}


const Cell = ({ wordleCell }: CellProps) => {
  if (wordleCell.status === "UNCHECKED") {
    if (wordleCell.char === WORDLE_EMPTY_CHAR) {
      return (
        <div className="select-none w-12 h-12 border-2 flex justify-center items-center font-bold text-xl">
          { }
        </div>
      )
    }

    return (
      <div className="select-none w-12 h-12 border-2 border-slate-800 flex justify-center items-center font-bold text-xl">
        {wordleCell.char}
      </div>
    )
  }

  if (wordleCell.status === "WRONG") {
    return (
      <div className="select-none w-12 h-12  flex justify-center items-center font-bold text-xl bg-slate-500 text-white">
        {wordleCell.char}
      </div>
    )
  }

  if (wordleCell.status === "MISPLACED") {
    return (
      <div className="select-none w-12 h-12 flex justify-center items-center font-bold text-xl bg-yellow-500 text-white">
        {wordleCell.char}
      </div>
    )
  }

  if (wordleCell.status === "CORRECT") {
    return (
      <div className="select-none w-12 h-12 flex justify-center items-center font-bold text-xl bg-green-500 text-white">
        {wordleCell.char}
      </div>
    )
  }

  return (
    <div className="select-none w-12 h-12 flex justify-center items-center font-bold text-x">
      {wordleCell.char}
    </div>
  )

}

export default Cell;