import '../styles/snake.css';

const getTile = (tileType) => {
    if(tileType === "empty") {
        return (<div className="empty-square"></div>);
    }
    else if(tileType === "snake") {
        return (<div className="snake-square"></div>);
    }
    else if(tileType === "pellet") {
        return (<div className="pellet-square"></div>);
    }
}

function Tile(props) {
    return getTile(props.tileType);
}

export default Tile;
