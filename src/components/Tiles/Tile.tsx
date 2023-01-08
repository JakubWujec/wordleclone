type TileProps = {
  char: string;
  state?: "EMPTY" | "UNCHECKED" | "WRONG" | "MISPLACED" | "CORRECT"
}

const Tile = (props: TileProps) => {
  let tileState = props.state ?? "EMPTY"

  if (tileState === "UNCHECKED" && props.char !== '') {
    return (
      <div className="w-12 h-12 border-2 border-slate-800 flex justify-center items-center font-bold text-xl">
        {props.char}
      </div>
    )
  }

  if (tileState === "EMPTY") {
    return (
      <div className="w-12 h-12 border-2 flex justify-center items-center font-bold text-xl">
        {props.char}
      </div>
    )
  }

  return null;
}

export default Tile;