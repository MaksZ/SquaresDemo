import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Grid from 'material-ui/Grid';
import Paper from 'material-ui/Paper';
import Typography from 'material-ui/Typography';

import Playground from './appplayground'
import SideNav from './appsidenav'
import Points2DRepo from './points2drepo'
import PlayGroundService from './playgroupdservice'

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: 'rgba(255, 255, 255, 0.95)',
        backgroundColor: 'rgba(245, 00, 87, 1)',
    },
    navPaper: {
        padding: theme.spacing.unit * 2,
    },
    title: { 
        fontWeight: 'bold'
    },
    formContainer: {
        display: 'flex',
        flexWrap: 'wrap',
    },
    formTextField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
        width: 200,
    },
    formButton: {
        margin: theme.spacing.unit,
    },
    slotTextField: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit
    },
    fileInput: {
        display: 'none',
    },
});

function ApplicationTitle(props) {
    const { classes } = props;

    return (
        <Paper className={classes.paper}>
            <Typography className={classes.title} color="inherit"  variant="title" component="h1">
                  SQUARES DEMO
            </Typography>
            <Typography color="inherit"  component="p">
                  Finds all possible squares in the given list of 2D points
            </Typography>
        </Paper>
    );
}

ApplicationTitle.propTypes = {
    classes: PropTypes.object.isRequired,
};


function MemSlot() {
    this.repo = null;
}

MemSlot.prototype.isOccupied = function() { return this.repo != null; }
MemSlot.prototype.length = function() { return this.repo == null ? 0 : this.repo.points.length; }

class Application extends React.Component {

    state = {
        // TODO: move slots also to service
        slots: [ new MemSlot(), new MemSlot(), new MemSlot() ],
        demoService: new PlayGroundService()
    }

    handleSlotAction = (slot, action) => {

        if (action == "SAVE")
        {
            slot.repo = new Points2DRepo();
            slot.repo.shallowCopy(this.state.demoService.repo);

            this.setState( (prevState) => ({ slots: prevState.slots }) );
        }

        else if (action=="LOAD")
        {
            this.state.demoService.updateRepo(slot.repo);

            this.setState( (prevState) => ({ slots: prevState.slots }) );
        }
        
        else if (action == "CLEANUP")
        {
            slot.repo = null;
            this.setState( (prevState) => ({ slots: prevState.slots }) );
        }
    }

    render() {

        const { classes } = this.props;

        return (
            <div className={classes.root}>
            <Grid container spacing={16}>
                <Grid item xs={12}>
                <ApplicationTitle classes={classes} />
                </Grid>
                <Grid item xs={12} sm={9}>
                <Playground classes={classes} service={this.state.demoService} />
                </Grid>
                <Grid item xs={12} sm={3}>
                <SideNav classes={classes} slots={this.state.slots} onAction={this.handleSlotAction}/>
                </Grid>
            </Grid>
            </div>
  );}
}

Application.propTypes = {
    classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(Application);
