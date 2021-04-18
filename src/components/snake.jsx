import { useState, useEffect } from 'react';
import Tile from './tile';
import { useInterval } from '../utils/utils';

const numRows = 30;
const numCols = 40;

const UP = 0;
const LEFT = 1;
const DOWN = 2;
const RIGHT = 3;

function Snake() {
    const [tiles, setTiles] = useState([]);
    const [snake, setSnake] = useState([]);
    const [direction, setDirection] = useState(0);


    const updateSnakePos = (newSnake) => {
        let newTiles = [];

        for(let i = 0; i < tiles.length; i++) {
            let row = [];

            for(let j = 0; j < tiles[i].length; j++) {
                if(tiles[i][j] === 1) {
                    row.push(0);
                }
                else {
                    row.push(tiles[i][j]);
                }
            }

            newTiles.push(row);
        }

        for(let i = 0; i < newSnake.length; i++) {
            newTiles[newSnake[i][0]][newSnake[i][1]] = 1;
        }

        setSnake(newSnake);
        setTiles(newTiles);
    }

    const spawnPellet = () => {
        // set a random tile to the pellet
        let randRow = parseInt(Math.random() * numRows);
        let randCol = parseInt(Math.random() * numCols);

        // keep randomizing until the pellet spawns in an empty space
        while(tiles[randRow][randCol] !== 0) {
            randRow = parseInt(Math.random() * numRows);
            randCol = parseInt(Math.random() * numCols);
        }

        let newTiles = tiles;
        newTiles[randRow][randCol] = 2;
        setTiles(newTiles);
    }

    // initialize tiles with snake and pellet
    const initializeBoard = () => {
        let initialTiles = [];

        for(let i = 0; i < numRows; i++) {
            let row = [];

            for(let j = 0; j < numCols; j++) {
                row.push(0);
            }

            initialTiles.push(row);
        }

        let initialSnake = [
            [14, 5],
            [14, 4],
            [14, 3]
        ];

        // start snake in middle of board, may change this to not be hard coded
        setSnake(initialSnake);

        // set tiles with snake
        for(let i = 0; i < initialSnake.length; i++) {
            initialTiles[initialSnake[i][0]][initialSnake[i][1]] = 1;
        }

        // add a new pellet to the board
        const randRow = parseInt(Math.random() * numRows);
        const randCol = parseInt(Math.random() * numCols);
        initialTiles[randRow][randCol] = 2;

        setTiles(initialTiles);
    }

    const handleKeyPress = (keyCode) => {
        if(keyCode === 87) {
            setDirection(UP);
        }
        else if(keyCode === 65) {
            setDirection(LEFT);
        }
        else if(keyCode === 83) {
            setDirection(DOWN);
        }
        else if(keyCode === 68) {
            setDirection(RIGHT);
        }
    }

    // move the head of the snake in the current direction of movement
    // wrap to the other side of the screen when a wall is encountered
    const moveSnakeHead = () => {
        let newPos = []

        // get the head position of the snake
        let snakeRow = snake[0][0];
        let snakeCol = snake[0][1];

        if(direction === UP) {
            let newRow = snakeRow - 1;
            
            if(newRow < 0) {
                newRow = numRows - 1;
            }

            newPos = [newRow, snakeCol];
        }
        else if(direction === LEFT) {
            let newCol = snakeCol - 1;

            if(newCol < 0) {
                newCol = numCols - 1;
            }

            newPos = [snakeRow, newCol];
        }
        else if(direction === DOWN) {
            let newRow = snakeRow + 1;

            if(newRow >= numRows) {
                newRow = 0;
            }

            newPos = [newRow, snakeCol];
        }
        else if(direction === RIGHT) {
            let newCol = snakeCol + 1;

            if(newCol >= numCols) {
                newCol = 0;
            }

            newPos = [snakeRow, newCol];
        }

        return newPos;
    }

    // Move the snake by first moving the head in the direction of
    // movement. For each piece of the snake after the head, move it to
    // the position that came before it.
    // e.g. move the piece directly after the head to the position that the
    //      head was previously in
    const move = () => {
        let newSnake = [];
        let newPos = snake[0]; // set to head initially
        let collectedPellet = false;

        for(let i = 0; i < snake.length; i++) {
            if(i === 0) { // update head of snake based on direction of movement
                const newHeadPos = moveSnakeHead();
                newSnake.push(newHeadPos);

                // if head of new snake is on a pellet, set collectedPellet
                // to true so we can extend the length of the snake 
                if(tiles[newHeadPos[0]][newHeadPos[1]] === 2) {
                    collectedPellet = true;
                }
            }
            else {
                newSnake.push([newPos[0], newPos[1]]);
            }
            newPos = snake[i];
        }

        // if a pellet was collected, keep the last position of the tail
        // of the current snake to extend the new snakes length by one
        if(collectedPellet) {
            let snakeTail = snake[snake.length - 1];
            newSnake.push(snakeTail);
            spawnPellet()
        }

        updateSnakePos(newSnake);
    }

    // set the interval for the snake to move
    // create listeners for key presses (wasd to move)
    useEffect(() => {
        initializeBoard();

        // listen for key press events
        window.addEventListener('keydown', (event) => {
            handleKeyPress(event.keyCode);
        });

        // set initial direction to right
        setDirection(RIGHT);
    }, []);

    useInterval(() => {
        move();
    }, 100);

    return (
        <div className="row">
            <div className="col-md-2"></div>
            <div className="text-center">
                <h1>snake</h1>
                {tiles.map((row, outerIndex) => {
                    return (
                        <div key={outerIndex} className="row">
                            {row.map((tile, innerIndex) => {
                                let tileToDisplay = <Tile key={innerIndex} tileType="empty"></Tile>
                            
                                if(tile === 1) {
                                    tileToDisplay = <Tile key={innerIndex} tileType="snake"></Tile>
                                }
                                else if(tile === 2) {
                                    tileToDisplay = <Tile key={innerIndex} tileType="pellet"></Tile>
                                }

                                return tileToDisplay;
                            })}
                        </div>
                    )
                })}
            </div>
        </div>
    );
}

export default Snake;
