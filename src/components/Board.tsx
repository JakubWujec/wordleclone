import Cell from "./Cell";
import { BoardCell } from "./Wordle";

type BoardProps = {
  board: BoardCell[][]
}

const Board = ({ board }: BoardProps) => {
  return (
    <div className="w-84 grid grid-rows-6 gap-1">
      {board.map((boardRow, rowIndex) => {
        return <div key={rowIndex} className="grid grid-cols-5 gap-1">
          {boardRow.map((boardCell, columnIndex) => {
            return <Cell state={boardCell.state} key={`${rowIndex}-${columnIndex}`} char={boardCell.char}></Cell>
          })}
        </div>
      })}
    </div>
  )
}

export default Board;