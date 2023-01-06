import { useState } from "react"
import { ContentLayout } from "./components/ContentLayout"
import Keyboard from "./components/Keyboard"
import NavBar from "./components/NavBar"
import Tile from "./components/Tile"

const ROWS = 6;
const COLUMNS = 5;

function getEmptyState() {
  let s = [];
  for (let i = 0; i < ROWS; i++) {
    s.push(new Array(COLUMNS).fill(''))
  }
  return s;
}

function App() {
  const [boardRows, setBoardRows] = useState<string[][]>(getEmptyState());
  const [[currentRow, currentColumn], setCurrentPosition] = useState([0, 0])


  function copyBoard(boardRows: string[][]) {
    return boardRows.map(row => [...row])
  }

  function moveToPreviousColumn() {
    if (currentColumn !== 0) {
      setCurrentPosition([currentRow, Math.max(0, currentColumn - 1)])
    }
  }

  function moveToNextColumn() {
    if (currentColumn !== COLUMNS - 1) {
      setCurrentPosition([currentRow, Math.min(COLUMNS - 1, currentColumn + 1)])
    }
  }

  const keyboardClickHandler = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    let val = event.target.dataset.value;
    if (val === 'enter') {
      console.log("enter")
    }
    else if (val === 'back') {
      let board = copyBoard(boardRows);
      board[currentRow][currentColumn] = '';
      setBoardRows(board);
      moveToPreviousColumn();
    } else {
      let board = copyBoard(boardRows);
      moveToNextColumn();
      board[currentRow][currentColumn] = val;
      setBoardRows(board);
    }
  }

  return (
    <>
      <NavBar></NavBar>
      <main>
        <ContentLayout>
          <div className="flex flex-col items-center">
            <div className="w-84 grid grid-rows-6 gap-1">
              {boardRows.map((boardRow, rowIndex) => {
                return <div key={rowIndex} className="grid grid-cols-5 gap-1">
                  {boardRow.map((char, columnIndex) => { return <Tile key={`${rowIndex}-${columnIndex}`} char={char}></Tile> })}
                </div>
              })}
            </div>
            <Keyboard onClick={keyboardClickHandler}></Keyboard>
          </div>
        </ContentLayout>
      </main>
    </>
  )
}

export default App
