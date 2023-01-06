type TileProps = {
  char: string;
}

const Tile = (props: TileProps) => {
  return (
    <div className="w-12 h-12 border-2 flex justify-center items-center font-bold text-xl">
      {props.char}
    </div>
  )

}

export default Tile;