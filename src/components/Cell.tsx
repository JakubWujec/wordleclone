import { WORDLE_EMPTY_CHAR } from "../utils/wordleReducer"


const Cell = (props: any) => {
  if (props.state === "UNCHECKED") {
    if (props.char === WORDLE_EMPTY_CHAR) {
      return (
        <div className="select-none w-12 h-12 border-2 flex justify-center items-center font-bold text-xl">
          { }
        </div>
      )
    }

    return (
      <div className="select-none w-12 h-12 border-2 border-slate-800 flex justify-center items-center font-bold text-xl">
        {props.char}
      </div>
    )
  }

  if (props.state === "WRONG") {
    return (
      <div className="select-none w-12 h-12  flex justify-center items-center font-bold text-xl bg-slate-500 text-white">
        {props.char}
      </div>
    )
  }

  if (props.state === "MISPLACED") {
    return (
      <div className="select-none w-12 h-12 flex justify-center items-center font-bold text-xl bg-yellow-500 text-white">
        {props.char}
      </div>
    )
  }

  if (props.state === "CORRECT") {
    return (
      <div className="select-none w-12 h-12 flex justify-center items-center font-bold text-xl bg-green-500 text-white">
        {props.char}
      </div>
    )
  }

  return (
    <div className="select-none w-12 h-12 flex justify-center items-center font-bold text-x">
      {props.char}
    </div>
  )

}

export default Cell;