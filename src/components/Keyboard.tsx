import { CharStatus } from "../utils/wordleReducer"

type KeyboardRowProps = {
  children: any
}

const KeyboardRow = (props: KeyboardRowProps) => {
  return <div>
    {props.children}
  </div>
}

type KeyboardProps = {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void,
  charToCharStatus: Map<string, CharStatus>;
}
const Keyboard = (props: KeyboardProps) => {
  const keyboardRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map(l => l.toUpperCase()),
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map(l => l.toUpperCase()),
    ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'BACKSPACE'].map(l => l.toUpperCase()),
  ]


  function getKeyColor(char: string) {
    let charStatus = props.charToCharStatus.get(char);
    if (charStatus === 'CORRECT') {
      return 'bg-lime-500'
    }
    if (charStatus === 'MISPLACED') {
      return 'bg-yellow-300'
    }
    if (charStatus === 'WRONG') {
      return 'bg-slate-600'
    }
    return 'bg-slate-300'
  }


  return (
    <div>
      {keyboardRows.map((keyboardRow, index) => {
        return <KeyboardRow key={index}>
          {keyboardRow.map(char => {
            const keyColor = getKeyColor(char)
            return <button key={char} className={`p-4 m-1 ${keyColor}`} onClick={props.onClick} data-value={char}>{char}
            </button>
          })}
        </KeyboardRow>
      })}
    </div>
  )

}

export default Keyboard