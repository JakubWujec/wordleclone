import Cell from "./Cell";
import { CellState } from "./Wordle";

type BoardProps = {
  boardRows: {
    char: string;
    state: CellState
  }[][]
}

const Board = ({ boardRows }: BoardProps) => {
  return (
    <div className="w-84 grid grid-rows-6 gap-1">
      {boardRows.map((boardRow, rowIndex) => {
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