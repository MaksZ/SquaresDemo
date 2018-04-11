import React from 'react';
import PropTypes from 'prop-types';
import update from 'immutability-helper';

import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';

import DataGrid from './datagrid'
import Point2D from './point2d'
import Points2DRepo from './points2drepo'


class PlayGroundCommandBar extends React.Component {
    constructor(props) {
        super(props);

        this.xRef = null;
        this.yRef = null;
        this.fRef = null;

        this.setxRef = element => { this.xRef = element; };
        this.setyRef = element => { this.yRef = element; };
        this.setfRef = element => { this.fRef = element; };

        this.handleSubmit = (e) => {
            e.preventDefault();

            let errorCode = this.props.onSubmit(this.xRef.value, this.yRef.value);
            if (errorCode !== 0) {
                // TODO: display error message
                return;
            }

            this.xRef.value = "";
            this.yRef.value = "";
        };
    }

    handleImport = (e) => {
        
        let file = e.target.files[0];

        this.props.onFileSelected(file);
        
        e.target.value = null;
        return false;
    }

    render() {
        const {classes} = this.props;

        const inputXprops = { min: Point2D.MinX, max: Point2D.MaxX };
        const inputYprops = { min: Point2D.MinY, max: Point2D.MaxY };

        return (
            <form className={classes.formContainer} autoComplete="off" onSubmit={this.handleSubmit}>
                <TextField
                    required
                    id="x"
                    label="X"
                    className={classes.formTextField}
                    margin="normal"
                    type="number"
                    inputProps={inputXprops}
                    inputRef={this.setxRef}
                />
                <TextField
                    required
                    id="y"
                    label="Y"
                    className={classes.formTextField}
                    margin="normal"
                    type="number"
                    inputProps={inputYprops}
                    inputRef={this.setyRef}
                />

                <Button type="submit" variant="raised" className={classes.formButton}>
                   Add point
                </Button>

                  <input
                    accept="*.txt"
                    className={classes.fileInput}
                    ref={this.setfRef}
                    type="file"
                    onChange={this.handleImport}
                  />
                <Button  variant="raised"  className={classes.formButton} onClick={(e) => this.fRef.click()}>
                    Import from file
                </Button>

                <Button variant="raised" color="primary" className={classes.formButton} onClick={this.props.getSquares}>Get squares</Button>
            </form>
        );    
    }
}

const pointColumns = [
    { id: 'id', numeric: true, disablePadding: false, label: 'Id' },
    { id: 'x', numeric: true, disablePadding: false, label: 'X' },
    { id: 'y', numeric: true, disablePadding: false, label: 'Y' },
];

const squareColumns = [
    { id: 'id', numeric: true, disablePadding: false, label: 'Nr' },
    { id: 'res', numeric: false, disablePadding: false, label: 'Square', transform: (v) => JSON.stringify(v) },
];

class AppPlayground extends React.Component {
    constructor(props) {
        super(props);
    }

    state = {}

    handleNewPoint = (x,y) => {

        let intX = parseInt(x)
        let intY = parseInt(y)

        let result = this.props.service.addPoint(intX, intY);

        if (result == 0) this.setState({});

        return result;
    }

    handleRemoveItems = (ids) => {

        let allPointsSelected = ids.length == this.props.service.getPointsCount();

        if (allPointsSelected)
            this.props.service.removeAllPoints()
        else
            this.props.service.removePoints(ids);

        this.setState({});
    }

    refreshSquares = () => {

        this.setState( (prevState) => { this.props.service.findSquares(); return ({}); } );
    }

    importPointsFromFile = (f) => {

        let reader = new FileReader();
        let _this = this;
        
        reader.onload = function() {
            
            let text = reader.result;
            
            let pattern = /^\d+ \d+$/mg

            let match, t;
            let newRepo = _this.props.service.getEmptyRepo();

            // BUG: last point is omitted if CR LF are not presented
            while((match = pattern.exec(text)) !== null)
            {
                t = match[0].split(' ');

                let intX = parseInt(t[0]);
                let intY = parseInt(t[1]);

                if (-100 == newRepo.addPoint(intX, intY)) break;
            }
            
            _this.props.service.updateRepo(newRepo);
            _this.setState({});
        };

        reader.readAsText(f);
    }

    render () {
        const { classes, service } = this.props;

        return (
          <Grid container spacing={8}>
            <Grid item xs={12}>
                <PlayGroundCommandBar classes={classes} onSubmit={this.handleNewPoint} onFileSelected={this.importPointsFromFile} getSquares={this.refreshSquares} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <DataGrid title="Points" itemSource={service.repo.points} columnData={pointColumns} onRemoveItems={this.handleRemoveItems} />
            </Grid>
            <Grid item xs={12} sm={6}>
                <DataGrid title="Squares" itemSource={service.squares} columnData={squareColumns} />
            </Grid>
          </Grid>
        );
    }
}
    
AppPlayground.propTypes = {
    classes: PropTypes.object.isRequired,
    service: PropTypes.object.isRequired
};

export default AppPlayground;