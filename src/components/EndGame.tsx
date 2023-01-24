import { GameState } from "./Wordle"

type EndGameProps = {
  gameState: GameState
  restart: () => void
}

const EndGame = ({ gameState, restart }: EndGameProps) => {
  return (<>
    {gameState !== 'INPROGRESS' &&
      <div className='h-20 p-2'>
        <div>You {gameState}</div>
        <button className="p-2 bg-blue-500" onClick={restart}>Try again</button>
      </div>
    }</>)
}

export default EndGame;