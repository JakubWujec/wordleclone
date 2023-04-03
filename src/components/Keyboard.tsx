import { CharStatus } from "../utils/wordleReducer"

type KeyboardRowProps = {
  children: any
}

const KeyboardRow = (props: KeyboardRowProps) => {
  return <div className="flex w-full h-full">
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
    ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'backspace'].map(l => l.toUpperCase()),
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
    <div className="w-full h-16">
      {keyboardRows.map((keyboardRow, index) => {
        return <KeyboardRow key={index}>
          {keyboardRow.map(char => {

            const keyColor = getKeyColor(char)
            return <button key={char} className={`flex-[1_1_0%]  m-1 font-bold place-content-center ${keyColor}`} onClick={props.onClick} data-value={char}>
              {char === 'BACKSPACE' ? <BackspaceIcon></BackspaceIcon> : char}
            </button>
          })}
        </KeyboardRow>
      })}
    </div>
  )
}

const BackspaceIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 mx-auto pointer-events-none">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9.75L14.25 12m0 0l2.25 2.25M14.25 12l2.25-2.25M14.25 12L12 14.25m-2.58 4.92l-6.375-6.375a1.125 1.125 0 010-1.59L9.42 4.83c.211-.211.498-.33.796-.33H19.5a2.25 2.25 0 012.25 2.25v10.5a2.25 2.25 0 01-2.25 2.25h-9.284c-.298 0-.585-.119-.796-.33z" />
    </svg>)
}

export default Keyboard