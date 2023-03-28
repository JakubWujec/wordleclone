type EndGameProps = {
  gameStatus: 'WON' | 'LOST' | 'IN_PROGRESS'
  restart: () => void
}

const EndGame = ({ gameStatus, restart }: EndGameProps) => {
  return (<>
    {gameStatus !== 'IN_PROGRESS' &&
      <div className='h-20 p-2'>
        <div>You {gameStatus}</div>
        <button className="p-2 bg-blue-500" onClick={restart}>Try again</button>
      </div>
    }</>)
}

export default EndGame;