import { EMPTY_CHAR } from "../Wordle";

type TileProps = {
  char: string;
  state?: "WRONG" | "MISPLACED" | "CORRECT"
}

const Tile = (props: TileProps) => {
  let tileState = props.state ?? "WRONG"

  if (props.char === EMPTY_CHAR) {
    return (
      <div className="w-12 h-12 border-2 flex justify-center items-center font-bold text-xl">
        {""}
      </div>
    )
  }

  if (tileState === "WRONG") {
    return (
      <div className="w-12 h-12 border-2 border-slate-800 flex justify-center items-center font-bold text-xl">
        {props.char}
      </div>
    )
  }

  if (tileState === "MISPLACED") {
    return (
      <div className="w-12 h-12 border-2 border-slate-800 flex justify-center items-center font-bold text-xl bg-yellow-300">
        {props.char}
      </div>
    )
  }

  if (tileState === "CORRECT") {
    return (
      <div className="w-12 h-12 border-2 border-slate-800 flex justify-center items-center font-bold text-xl bg-green-300">
        {props.char}
      </div>
    )
  }


  console.log(props)
  return (
    <div className="w-12 h-12 border-2 flex justify-center items-center font-bold text-x">
      {props.char}
    </div>
  )

}

export default Tile;