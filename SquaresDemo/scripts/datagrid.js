import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { withStyles } from 'material-ui/styles';
import Table, {
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TablePagination,
  TableRow,
  TableSortLabel,
} from 'material-ui/Table';
import Toolbar from 'material-ui/Toolbar';
import Typography from 'material-ui/Typography';
import Paper from 'material-ui/Paper';
import Checkbox from 'material-ui/Checkbox';
import IconButton from 'material-ui/IconButton';
import Tooltip from 'material-ui/Tooltip';
import DeleteIcon from 'material-ui-icons/Delete';
import FilterListIcon from 'material-ui-icons/FilterList';
import { lighten } from 'material-ui/styles/colorManipulator';



class EnhancedTableHead extends React.Component {
  createSortHandler = property => event => {
    this.props.onRequestSort(event, property);
  };

  render() {
      const { onSelectAllClick, order, orderBy, numSelected, rowCount, columnData, canSelect } = this.props;

      let renderColumns = () => {
                var result = [];

                if (canSelect) { result.push((
                    <TableCell key="sel" padding="checkbox">
                        <Checkbox
                            indeterminate={numSelected > 0 && numSelected < rowCount}
                            checked={numSelected === rowCount}
                            onChange={onSelectAllClick}
                        />
                    </TableCell>));
                }
                
                return result.concat(columnData.map(column => { return (
                      <TableCell
                            key={column.id}
                            numeric={column.numeric}
                            padding={column.disablePadding ? 'none' : 'default'}
                            sortDirection={orderBy === column.id ? order : false}
                       >
                            <Tooltip
                                title="Sort"
                                placement={column.numeric ? 'bottom-end' : 'bottom-start'}
                                enterDelay={300}
                            >
                                <TableSortLabel
                                    active={orderBy === column.id}
                                    direction={order}
                                    onClick={this.createSortHandler(column.id)}
                                >
                                    {column.label}
                                </TableSortLabel>
                            </Tooltip>
                        </TableCell>);}, this));
            }; 

    return (
      <TableHead>
        <TableRow>
        {renderColumns()}
        </TableRow>
      </TableHead>
    );
  }
}

EnhancedTableHead.propTypes = {
  numSelected: PropTypes.number.isRequired,
  onRequestSort: PropTypes.func.isRequired,
  onSelectAllClick: PropTypes.func.isRequired,
  order: PropTypes.string.isRequired,
  orderBy: PropTypes.string.isRequired,
  rowCount: PropTypes.number.isRequired,
  columnData: PropTypes.array.isRequired,
  canSelect: PropTypes.bool.isRequired
};

const toolbarStyles = theme => ({
  root: {
    paddingRight: theme.spacing.unit,
  },
  highlight:
    theme.palette.type === 'light'
      ? {
          color: theme.palette.secondary.main,
          backgroundColor: lighten(theme.palette.secondary.light, 0.85),
        }
      : {
          color: theme.palette.text.primary,
          backgroundColor: theme.palette.secondary.dark,
        },
  spacer: {
    flex: '1 1 100%',
  },
  actions: {
    color: theme.palette.text.secondary,
  },
  title: {
    flex: '0 0 auto',
  },
});

let EnhancedTableToolbar = props => {
    const { title, numSelected, classes, handleDeletion } = props;

     

  return (
    <Toolbar
      className={classNames(classes.root, {
        [classes.highlight]: numSelected > 0,
      })}
    >
      <div className={classes.title}>
        {numSelected > 0 ? (
          <Typography color="inherit" variant="subheading">
            {numSelected} selected
          </Typography>
        ) : (
          <Typography variant="title">{title}</Typography>
        )}
      </div>
      <div className={classes.spacer} />
      <div className={classes.actions}>
        {numSelected > 0 ? (
          <Tooltip title="Delete">
            <IconButton aria-label="Delete" onClick={handleDeletion}>
              <DeleteIcon />
            </IconButton>
          </Tooltip>
        ) : null
    //(
    //      <Tooltip title="Filter list">
    //        <IconButton aria-label="Filter list">
    //          <FilterListIcon />
    //        </IconButton>
    //      </Tooltip>
    //    )
}
      </div>
    </Toolbar>
  );
};

EnhancedTableToolbar.propTypes = {
  title: PropTypes.string.isRequired,  
  classes: PropTypes.object.isRequired,
  numSelected: PropTypes.number.isRequired
};

EnhancedTableToolbar = withStyles(toolbarStyles)(EnhancedTableToolbar);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 2,
  },
  table: {
    // minWidth: 400,
  },
  tableWrapper: {
    overflowX: 'auto',
  },
});

class EnhancedTable extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      order: 'asc',
      orderBy: 'id',
      selected: [],
      page: 0,
      rowsPerPage: 5,
    };
  }

  handleRequestSort = (event, property) => {
    const orderBy = property;
    let order = 'desc';

    if (this.state.orderBy === property && this.state.order === 'desc') {
      order = 'asc';
    }

    const data =
      order === 'desc'
        ? this.props.itemSource.sort((a, b) => (b[orderBy] < a[orderBy] ? -1 : 1))
        : this.props.itemSource.sort((a, b) => (a[orderBy] < b[orderBy] ? -1 : 1));

    this.setState({ order, orderBy });
  };

  handleSelectAllClick = (event, checked) => {

    this.setState({ selected: !checked ? [] : this.props.itemSource.map(n => n.id)});
  };

  handleClick = (event, id) => {
    const { selected } = this.state;
    const selectedIndex = selected.indexOf(id);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, id);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    this.setState({ selected: newSelected });
  };

  handleChangePage = (event, page) => {
    this.setState({ page });
  };

  handleChangeRowsPerPage = event => {
    this.setState({ rowsPerPage: event.target.value });
  };

  isSelected = id => this.state.selected.indexOf(id) !== -1;

  toItself = o => o;

  render() {
    const { title, classes, itemSource, columnData, onRemoveItems } = this.props;
    const { order, orderBy, selected, rowsPerPage, page } = this.state;
    const emptyRows = rowsPerPage - Math.min(rowsPerPage, itemSource.length - page * rowsPerPage);

    let canSelect = typeof onRemoveItems == 'function';

    let renderColumns = (n, isSelected) => {
        
        var result = [];
        if (canSelect) { result.push((<TableCell key="sel" padding="checkbox"><Checkbox checked={isSelected} /></TableCell>)); }

        return result.concat(
            columnData.map(col => { 
                let value = !col.transform ? n[col.id] : col.transform(n[col.id]);
                return col.numeric 
                ? (<TableCell key={col.id} numeric >{value}</TableCell>)
                : (<TableCell key={col.id} >{value}</TableCell>); } )
            );
            }
    
    let handleDeletion = (e) => {
        onRemoveItems(selected);
        this.setState({ selected: [] });
    }

    return (
      <Paper className={classes.root}>
        <EnhancedTableToolbar title={title} numSelected={selected.length} handleDeletion={handleDeletion} />
        <div className={classes.tableWrapper}>
          <Table className={classes.table}>
            <EnhancedTableHead
              numSelected={selected.length}
              order={order}
              orderBy={orderBy}
              onSelectAllClick={this.handleSelectAllClick}
              onRequestSort={this.handleRequestSort}
              rowCount={itemSource.length}
              columnData={columnData}
              canSelect={canSelect}
            />
            <TableBody>
                {itemSource.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map(n => {
                   
                    const isSelected = canSelect ? this.isSelected(n.id): false;
                    return (
                      <TableRow
                        hover
                        onClick={event => this.handleClick(event, n.id)}
                        role="checkbox"
                        aria-checked={isSelected}
                        tabIndex={-1}
                        key={n.id}
                        selected={isSelected}
                        >
                            {renderColumns(n, isSelected)}
                    </TableRow>
                );
            })}
              {emptyRows > 0 && (
                <TableRow style={{ height: 49 * emptyRows }}>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TablePagination
                  colSpan={6}
                  count={itemSource.length}
                  rowsPerPage={rowsPerPage}
                  page={page}
                  backIconButtonProps={{
                    'aria-label': 'Previous Page',
                  }}
              nextIconButtonProps={{
                'aria-label': 'Next Page',
              }}
              onChangePage={this.handleChangePage}
              onChangeRowsPerPage={this.handleChangeRowsPerPage}
              rowsPerPageOptions={[5, 10, 20, 50]}
            />
          </TableRow>
        </TableFooter>
      </Table>
    </div>
  </Paper>
);
              }
}

EnhancedTable.propTypes = {
    title: PropTypes.string.isRequired,
    classes: PropTypes.object.isRequired,
    itemSource: PropTypes.array.isRequired,
    columnData: PropTypes.array.isRequired,
    onRemoveItems: PropTypes.func
};

export default withStyles(styles)(EnhancedTable);
