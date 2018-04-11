import Point2D from './point2d'


function Points2DRepo() {
    this.points = [];
    this.nextId = 1;
}

Points2DRepo.MaxSize = 10000;

// Adds a point to reporsitory
// returns:
// -100 - size exceeded
// -1 - invalid point
// -2 - duplicate
//  0 - success
Points2DRepo.prototype.addPoint = function(x,y) {
    
    if (this.points.length == Points2DRepo.MaxSize) return -100;
    
    if (!Point2D.Validate(x,y)) return -1;

    if (this.points.length > 0) {

        if (undefined !== this.points.find((p) => p.x==x && p.y==y)) return -2;
    }

    this.points.push(new Point2D(x,y,this.nextId++));
    return 0;
}

Points2DRepo.prototype.removePointsById = function(ids) {
    
    let isRemoved = (id) => ids.indexOf(id) !== -1;

    this.points = this.points.filter((p) => !isRemoved(p.id));
}

Points2DRepo.prototype.removeAllPoints = function() {
    
    this.points = [];
    this.nextId = 1;
}

Points2DRepo.prototype.shallowCopy = function(other) {
    
    this.points = other.points.slice(0, other.length);
    this.nextId = other.nextId;
}

export default Points2DRepo;
