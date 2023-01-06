type KeyboardKeyProps = {
  char: string
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}

const KeyboardKey = (props: KeyboardKeyProps) => {
  return <button className="p-4 m-1 bg-slate-300" onClick={props.onClick} data-value={props.char}>{props.char}</button>
}

type KeyboardRowProps = {
  children: any
}

const KeyboardRow = (props: KeyboardRowProps) => {
  return <div>
    {props.children}
  </div>
}

type KeyboardProps = {
  onClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void
}
const Keyboard = (props: KeyboardProps) => {
  const keyboardRows = [
    ['q', 'w', 'e', 'r', 't', 'y', 'u', 'i', 'o', 'p'].map(l => l.toUpperCase()),
    ['a', 's', 'd', 'f', 'g', 'h', 'j', 'k', 'l'].map(l => l.toUpperCase()),
    ['enter', 'z', 'x', 'c', 'v', 'b', 'n', 'm', 'back'].map(l => l.toUpperCase()),
  ]

  return (
    <div>
      {keyboardRows.map((keyboardRow, index) => {
        return <KeyboardRow key={index}>
          {keyboardRow.map(char => { return <KeyboardKey key={char} char={char} onClick={props.onClick}></KeyboardKey> })}
        </KeyboardRow>
      })}
    </div>
  )

}

export default Keyboard