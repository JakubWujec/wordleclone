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
      return 'bg-wordle-correct-color'
    }
    if (charStatus === 'MISPLACED') {
      return 'bg-wordle-misplaced-color'
    }
    if (charStatus === 'WRONG') {
      return 'bg-wordle-wrong-color'
    }
    return 'bg-wordle-unused-color'
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