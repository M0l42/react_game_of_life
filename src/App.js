import React from 'react';
import './App.css';
import {isMobile} from 'react-device-detect';

class SetInfo extends React.Component {
    render(){
        if (isMobile) {
            return(<div className="description">{window.flask_description}</div>);
        }
        return(<h2>{window.flask_description}</h2>);
    }
}

class Box extends React.Component {
    selectBox = () => {
        this.props.selectBox(this.props.row, this.props.col)
    }

    render() {
        return(
            <div
                className={this.props.boxClass}
                id={this.props.id}
                onClick={this.selectBox}
            />
        );
    }

}

class Grid extends React.Component {
    render() {
        const width = this.props.cols * 14;
        var rowsArr = [];

        var boxClass = "";
        for (var i = 0; i < this.props.rows; i++){
            for (var j = 0; j < this.props.cols; j++){
                let boxId = i + "_" + j;

                boxClass = this.props.gridFull[i][j] ? "box on" : "box off";
                rowsArr.push(
                    <Box
                        boxClass={boxClass}
                        key={boxId}
                        boxId={boxId}
                        row={i}
                        col={j}
                        selectBox={this.props.selectBox}
                    />
                );
            }
        }

        return (
            <div className="grid" style={{width: width}}>
                {rowsArr}
            </div>
        );
    }
}

class Main extends React.Component{
    constructor() {
        super();
        this.speed = 100;
        if (isMobile) {
            this.cols = 20;
            this.rows = 40;
        }
        else {
            this.rows = 30;
            this.cols = 50;
        }
        this.title = window.flask_title;

        this.state = {
            generation: 0,
            gridFull: Array(this.rows).fill().map(() => Array(this.cols).fill(false) )
        }
    }

    selectBox = (row, col) => {
        let gridCopy = arrayClone(this.state.gridFull);
        gridCopy[row][col] = !gridCopy[row][col];
        this.setState({
            gridFull: gridCopy
        })
    };

      seed = () => {
      let gridCopy = arrayClone(this.state.gridFull);
      for(let i=0 ; i < this.rows; i++){
        for(let j=0; j < this.cols; j++){
          if(Math.floor(Math.random() * 4) === 1){
             gridCopy[i][j] = true;
          }
        }
      }
      this.setState({
        gridFull: gridCopy
      });
    };

    playButton = () => {
      clearInterval(this.intervalId)
      this.intervalId = setInterval(this.play, this.speed);
    };

    pauseButton = () => {
      clearInterval(this.intervalId);
    };

    clearButton = () => {
        let grid = Array(this.rows).fill().map(() => Array(this.cols).fill(false) );
        this.setState({
           gridFull: grid,
           generation: 0
        });
    };

    play = () => {
      let g = this.state.gridFull;
      let g2 = arrayClone(this.state.gridFull)

      for(let i = 0; i<this.rows; i++){
        for(let j = 0; j<this.cols; j++){
          let count = 0;
          if(i>0) if(g[i-1][j]) count++;
          if(i>0 && j>0) if(g[i-1][j-1]) count++;
          if(i>0 && j<this.cols-1) if(g[i-1][j+1]) count++;
          if(j<this.cols-1) if(g[i][j+1]) count++;
          if(j>0) if(g[i][j-1]) count++;
          if(i<this.rows-1) if(g[i+1][j]) count++;
          if(i<this.rows-1 && j>0) if(g[i+1][j-1]) count++;
          if(i<this.rows-1 && j<this.cols-1) if(g[i+1][j+1]) count++;

          if(g[i][j] && (count<2 || count>3)) g2[i][j] = false;
          if(!g[i][j] && count === 3) g2[i][j] = true;
        }
      }

      this.setState({
        gridFull: g2,
        generation: this.state.generation + 1
      });
    }

    render() {
        return (
            <div>
                <h1>{this.title}</h1>
                <SetInfo/>
                <div className="center">
                    <div className="btn-group" role="group" aria-label="Basic example">
                        <button type="button" className="btn btn-primary" onClick={() => this.playButton()}>Play</button>
                        <button type="button" className="btn btn-primary" onClick={() => this.pauseButton()}>Stop</button>
                        <button type="button" className="btn btn-primary" onClick={() => this.seed()}>Seed</button>
                        <button type="button" className="btn btn-primary" onClick={() => this.clearButton()}>Clear</button>
                    </div>
                </div>
                <Grid
                    gridFull={this.state.gridFull}
                    rows={this.rows}
                    cols={this.cols}
                    selectBox={this.selectBox}
                />
                <h2>Generations {this.state.generation}</h2>
            </div>
        );
    }
}

function arrayClone(arr) {
    return JSON.parse(JSON.stringify(arr));
}

// ReactDOM.render(<Main />, document.getElementById('root'));

export default Main;
