import React from "react";
import ReactDOM from "react-dom";
import axios from "axios";
import update from "immutability-helper";

const NewPointForm = ({onSubmit}) =>
{
    let minValue = -5000;
    let maxValue = 5000;

    let inputX;
    let inputY;

    let handleSubmit = (e) => 
    {
        e.preventDefault();
        onSubmit(inputX.value, inputY.value);
        inputX.value = "";
        inputY.value = "";
    };

    return (
        <form className="form-inline" onSubmit={handleSubmit}>
            <div className="form-group">
                <label htmlFor="px">X:</label>
                    <input id="px" type="number" className="form-control" min={minValue} max={maxValue} required
                           ref={(input) => inputX = input}  />
</div>
<div className="form-group">
<label htmlFor="py">Y:</label>
<input id="py" type="number" className="form-control" min={minValue} max={maxValue} 
ref={(input) => inputY = input} />
</div>

<button type="submit" className="btn btn-default">Add</button>

</form>
    );

};




    const Table = (props) =>
    {
        let items = props.itemSource;

        if (items === null || items.length == 0)
            return (<table className="table table-bordered" />);

        let deleteFunc = props.onItemDelete;
    
        let isActionsColumnVisible =  (typeof deleteFunc === 'function');

        let headers = Object.keys(items[0]).map( (item, i) => (<th key={i}>{item}</th>));

    if (isActionsColumnVisible)
        headers.push((<th key={headers.length}>action</th>));
   
    
    let getCells = (data, ri) => 
    {
        let cells = Object.values(data).map( (value, i) => (<td key={i}>{value}</td>) );

    if (isActionsColumnVisible)
        cells.push((<td key={cells.length}>
            <button className="btn btn-default" type="button" onClick={() => deleteFunc(ri)}>
                <span className="glyphicon glyphicon-trash" ></span>
            </button></td>));

    return (<tr key={ri+1}>{cells}</tr>);
    };

    return (
        <table className="table table-bordered">
            <thead><tr key={0}>{headers}</tr></thead>
            <tbody>{items.map( (row, i) => getCells(row, i) )}</tbody>
        </table>);
    };

    const EnhancedTable = React.createClass({

        getInitialState() {
            return {
                pageNumber: 1,
                pageSize: 5,
                counter: 0
            }
        },

        render() {

            this.state.counter = this.state.counter+1;

            let title = this.props.title + ": " + this.props.itemSource.length;

            return (
                <div className="panel panel-default">
                    <div className="panel-heading text-center">
                        <h3>{title}</h3>
                    </div>
                    <div className="panel-body">
                        <Table itemSource={this.props.itemSource} onItemDelete={this.props.onPointRemoved} />
                    </div>
                </div>
            )
    }
    });

    const CommandBar = React.createClass({

        handleFiles : function (files) {
    },

        render() {
		
		<div className="panel panel-default">
                    <div className="panel-body">
                        <input type="file" id="fileElem" accept=".txt" style={{display: 'none'}} onChange={(e) => this.handleFiles(e.target.files)} />
    <button className="btn btn-default" type="button" onClick={() => document.getElementById('fileElem').click()}>
          
<span className="glyphicon glyphicon-import" ></span>
    Import (*.txt)
  </button>  
      
<button className="btn btn-default" type="button">
          
      <span className="glyphicon glyphicon-download" ></span>
    Save to file
  </button>
          
<button className="btn btn-default" type="button">
          
            <span className="glyphicon glyphicon-remove" ></span>
    Clear all points
  </button> 
        </div>
    </div>
		
            return (
                
        );
    }
    });

    let counter = 0;
    function createPoint(x,y) {
        counter += 1;
        return { id: counter, x, y };
    }

    let sqCounter = 0;
    function createSquare(pts) {
        sqCounter += 1;
        return { id: sqCounter, points: pts};
    }

    const PlayGround = React.createClass({

        getInitialState() {
            return {
                points: []
            }
        },

        onPointAdded : function (x, y)
        {
            this.setState((prevState) => ({
                points: update(prevState.points, {$push: [createPoint(x,y)]})
                        
            }));
        },

        onPointRemoved : function (i)
        {
            this.setState( (prevState) => ({ points: update(prevState.points, {$splice: [[i, 1]]})}))
        },

        render() {
            return (
                    <div className="col-sm-10">
                        <CommandBar />

                        <div className="panel panel-default">
                            <div className="panel-body">
                                <NewPointForm onSubmit={this.onPointAdded} />
                            </div>
                        </div>
                    
                        <EnhancedTable title="Points" itemSource={this.state.points} onPointRemoved={this.onPointRemoved} />

                        <EnhancedTable title="Squares" itemSource={[]} />
                    </div>
            )
        }
    });


    const SaidNav = () =>
    {
        return(
            <div className="col-sm-2 sidenav">
                        <h4>Samples</h4>
                        <ul className="nav nav-pills nav-stacked">
                            <li className="active"><a href="#section1">Test</a></li>
                            <li><a href="#section2">10000 points in the list</a></li>
                            <li><a href="#section3">Sample 1</a></li>
                            <li><a href="#section3">Sample 2</a></li>
                        </ul>
                    </div>
        )
};

    const App = React.createClass({

        render() {
            return (
                <div className="row content">
                    <PlayGround />
                    <SaidNav />
                </div>
            );
        }
    });

    ReactDOM.render(<App />, document.getElementById("app"));
