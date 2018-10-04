import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props) {
  return (
    <button
      className="square"
      onClick={props.onClick}
    >
      {props.value}
    </button>
  );
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
      return squares[a];
    }
  }
  return null;
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {

    var rows = [];
    let squares = [];
    var i;
    var j;
    var count=0;


    for(j=0;j<3;j++){

      for(i=0;i<3;i++){
        squares.push(this.renderSquare(count));
        count++;
      }

      rows.push(<div className="board-row">{squares}</div>);
      squares = [];

    }

    return(
      <div>{rows}</div>
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
      stepNumber: 0,
      xIsNext: true,
      positions: [],
    };
  }

  handleClick(i){
    const history = this.state.history.slice(0,this.state.stepNumber+1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();

    if(calculateWinner(squares) || squares[i]){
      return;
    }

    squares[i] = this.state.xIsNext ? 'X' : 'O';

    this.setState({
      history: history.concat([{
        squares: squares,
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
    this.state.positions.push(i);
  }

  jumpTo(step){
    this.setState({
      history: this.state.history.splice(0,step),
      stepNumber: step-1,
      xIsNext: (step%2)===0,
      positions: this.state.positions.slice(0,step),
    });
  }

  getCurrentPosition(move){

    var step = this.state.positions[move-1];
    var position = '';

    switch(step){
      case 0: position='(1,1)';break;
      case 1: position='(1,2)';break;
      case 2: position='(1,3)';break;
      case 3: position='(2,1)';break;
      case 4: position='(2,2)';break;
      case 5: position='(2,3)';break;
      case 6: position='(3,1)';break;
      case 7: position='(3,2)';break;
      case 8: position='(3,3)';break;
      default: position='(-,-)';
    }

    return 'Position : '+position;
  }

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const moves = history.map((step, move) => {
      const desc = move ?
        'Go to move #'+move+'' :
        'Go to game start'
      ;
      return (
        <li key={move}>
          <button
            onClick={() => this.jumpTo(move)}
          >
            {desc}, {this.getCurrentPosition(move)}
          </button>
        </li>
      );
    });

    let status;
    if(winner){
      status = 'Winner: '+ winner;
    } else{
      status = 'Next player: '+ (this.state.xIsNext ? 'X' : 'O');
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{moves}</ol>
        </div>
      </div>
    );
  }
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);

