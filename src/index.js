import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className="square" onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    renderSquare(i) {
        return <Square value={this.props.squares[i]} onClick={() => this.props.onClick(i)} />;
    }

    renderRow(width, row) {
        return [...Array(width).keys()].map((i) =>
            <span key={i} >{this.renderSquare(i + (width * row))}</span>
        )
    }

    render() {
        const height = 3;
        const width = 3;
        let board = [...Array(height).keys()].map((i) =>
            <div key={i} className="board-row">{this.renderRow(width, i)}</div>
        );
        return (
            <div>
                {board}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [{
                squares: Array(9).fill(null),
            }],
            xIsNext: true,
            stepNumber: 0,
        };
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0,
            lastMove: this.state.history[step].lastMove
        })
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        let [winner, winningMoves] = calculateWinner(squares);
        if(winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext? 'X' : 'O';
        alert(squares);
        this.setState({
            history: history.concat([{
                squares: squares,
                lastMove: i
            }]),
            xIsNext: !this.state.xIsNext,
            stepNumber: history.length,
        })
    }

    render() {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[this.state.stepNumber];
        const [winner, winningSquares] = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            let desc;
            let details;
            if (move) {
                let lastPlayed = (move % 2) === 0 ? 'O' : 'X';
                desc =  'Go to move #' + move;
                details = <span>{lastPlayed} at ({Math.floor((step.lastMove / 3) + 1)}, {(step.lastMove % 3) + 1})</span>
            } else {
                desc = 'Go to game start';
                details = ''
            }

            return (
                <li key={move}>
                    <button onClick={() => this.jumpTo(move)}>{desc}</button>{details}
                </li>
            );
        });

        let status;
        if (winner) {
            status = 'Winner: ' + winner;
        } else if(current.squares.some((e) => e === null)) {
            status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
        } else {
            status = 'Draw'
        }
        return (
            <div className="game">
                <div className="game-board">
                    <Board squares={current.squares} onClick={(i) => this.handleClick(i)}/>
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6],
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a], [a, b, c]];
        }
    }
    return [null, null];
}


// ========================================

ReactDOM.render(
    <Game />,
    document.getElementById('root')
);
