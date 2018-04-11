import React from 'react';
import PropTypes from 'prop-types';
import Paper from 'material-ui/Paper';
import Grid from 'material-ui/Grid';
import TextField from 'material-ui/TextField';
import Button from 'material-ui/Button';
import Typography from 'material-ui/Typography';

function NavSlot (props) {
    const { classes, title, isOccupied, pointsCount, onSave, onLoad, onCleanup } = props;

    return (
            <Paper className={classes.navPaper} >
              <div>
                <Typography className={classes.title} color="inherit" component="h1">{title}</Typography>
                <Typography color="inherit" component="p">Points count: {pointsCount}</Typography>
              </div>
              
                {
                    !isOccupied
                    ? 
                        (
                    <div>
                            <Button variant="raised" className={classes.formButton} onClick={onSave} >save</Button>
                            <Button variant="raised" color="primary" disabled className={classes.formButton}>load</Button>
                            <Button variant="raised" color="secondary" disabled className={classes.formButton}>clean up</Button>
</div>
                        )
                    
                    :
(
<div>
                            <Button variant="raised" className={classes.formButton} onClick={onSave} >save</Button>
                            <Button variant="raised" color="primary" className={classes.formButton} onClick={onLoad}>load</Button>
                            <Button variant="raised" color="secondary" className={classes.formButton} onClick={onCleanup}>clean up</Button>
</div>
                    )

                }
              
            </Paper>        
        );
}


function AppSidenav(props) {
    const { classes, slots, onAction } = props;

    return (
          <Grid container spacing={8}>
          {
              slots.map((slot, i) => 
                    (
                        <Grid key={i} item xs={12}>
                            <NavSlot classes={classes} 
                            title={'SLOT-'+(i+1)} 
                            isOccupied={slot.isOccupied()} 
                            pointsCount={slot.length()}
                            onSave={() => onAction(slot, 'SAVE')}
                            onLoad={() => onAction(slot, 'LOAD')}
                            onCleanup={() => onAction(slot, 'CLEANUP')}/>
                        </Grid>))
                }
          </Grid>
  );
}

AppSidenav.propTypes = {
    classes: PropTypes.object.isRequired,
    slots: PropTypes.array
};

export default AppSidenav;

/*



*/