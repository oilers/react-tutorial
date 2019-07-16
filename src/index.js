import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
    return (
        <button className={'square ' +  (props.highlight? 'highlight' : '')} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            highlight: []
        }
    }
    renderCols(width, rowNum, highlight) {
        return [...Array(width).keys()].map((colNum) => (this.renderSquare(colNum, rowNum, width, highlight)))
    }

    renderSquare(colNum, rowNum, width, highlight) {

        let index = colNum + (rowNum * width);
        let highlightSquare = false;
        if(highlight && highlight.includes(index)) {
            highlightSquare = true;
        }
        return  <Square
            key={index}
            value={this.props.squares[index]}
            onClick={() => this.props.onClick(index)}
            highlight={highlightSquare}
        />
    }

    render() {
        const rows = [...Array(3).keys()].map((rowNum) =>(
            <div key={rowNum} className="board-row">
                {this.renderCols(3, rowNum, this.props.highlight)}
            </div>
        ));
        return (
            <div>
                {rows}
            </div>
        );
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            history: [
                {
                    squares: Array(9).fill(null),
                    moves: [],
                }
            ],
            stepNumber: 0,
            xIsNext: true,
            sortAsc: true,
        };
    }

    handleClick(i) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.slice();
        const moves = current.moves.slice();
        let [winner, _]= calculateWinner(squares);
        if (winner || squares[i]) {
            return;
        }
        squares[i] = this.state.xIsNext ? "X" : "O";

        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    moves: moves.concat([i])

                }
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: (step % 2) === 0
        });
    }

    changeSort(){
        this.setState({
            sortAsc: !this.state.sortAsc,
        })
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const [winner, winningMoves] = calculateWinner(current.squares);
        const currentStep = this.state.stepNumber;

        let moves = history.map((step, moveNum) => {
            const desc = moveNum ?
                'Go to move #' + moveNum :
                'Go to game start';
            let moveCoord = '';
            if (step.moves.length > 0) {
                const lastMove = step.moves[step.moves.length - 1];
                moveCoord = <span>({lastMove % 3},{Math.floor(lastMove / 3)})</span>
            }
            return (
                <li key={moveNum}>
                    <button className={moveNum === currentStep? 'bold' : ''} onClick={() => this.jumpTo(moveNum)}>{desc} {moveCoord}</button>
                </li>
            );
        });

        let status;
        if (winner) {
            status = "Winner: " + winner;
        } else if (current.squares.some((e) => e === null)) {
            status = "Next player: " + (this.state.xIsNext ? "X" : "O");
        } else {
            status = "Draw"
        }
        if(!this.state.sortAsc) {
            moves = moves.reverse();
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board
                        squares={current.squares}
                        onClick={i => this.handleClick(i)}
                        highlight={winningMoves}
                    />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <div><button onClick={() => this.changeSort()}>Sort {this.state.sortAsc? 'Desc' : 'Asc'}</button></div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));

function calculateWinner(squares) {
    const lines = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
            return [squares[a],lines[i]];
        }
    }
    return [null, null];
}
