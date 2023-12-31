import { WordleCell } from "../utils/wordleReducer";
import Cell from "./Cell";

type BoardProps = {
  board: WordleCell[][]
}

const Board = ({ board }: BoardProps) => {
  return (
    <div className="w-84 grid grid-rows-6 gap-1">
      {board.map((boardRow, rowIndex) => {
        return <div key={rowIndex} className="grid grid-cols-5 gap-1">
          {boardRow.map((cell, columnIndex) => {
            return (
              <div key={`${rowIndex}-${columnIndex}`} className="select-none w-12 h-12 border-2 border-slate-800 flex justify-center items-center font-bold text-xl">
                {cell.char}
              </div>
            )
          })}
        </div>
      })}
    </div>
  )
}

export default Board;