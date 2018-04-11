import Point2D from './point2d'
import Points2DRepo from './points2drepo'
import findSquares from './findSquares'

function PlayGroundService() {

    this.repo = new Points2DRepo();
    this.squares = [];
}

PlayGroundService.prototype.addPoint = function(x,y) {

    return this.repo.addPoint(x,y);
}

PlayGroundService.prototype.removePoints = function(ids) {

    this.repo.removePointsById(ids);

    let newSquares = [];

    if (this.getPointsCount() > 0 && this.squares.length > 0) {

        let isRemoved = (id) => ids.indexOf(id) !== -1;

        newSquares = this.squares.filter((s) => !s.res.some(isRemoved));
    }

    this.squares = newSquares;
}

PlayGroundService.prototype.removeAllPoints = function() {

    this.repo.removeAllPoints();
    this.squares = [];
}

PlayGroundService.prototype.getPointsCount = function() {

    return this.repo.points.length;
}

PlayGroundService.prototype.findSquares = function() {

    if (this.getPointsCount() < 4) return;

    let counter = 0;
    this.squares = [];

    findSquares(this.repo.points, (found) => { this.squares.push({ id: ++counter, res: found}); });
}

PlayGroundService.prototype.getEmptyRepo = function() {

    return new Points2DRepo();
}

PlayGroundService.prototype.updateRepo = function(newRepo) {

    this.repo.shallowCopy(newRepo);

    // after repo update we reset squares
    this.squares = [];
}

export default PlayGroundService;