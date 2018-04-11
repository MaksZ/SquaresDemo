function Point2D(x, y, id) {
    this.x = x;
    this.y = y;
    this.id = id;
}

Point2D.MinX = -5000;
Point2D.MaxX = 5000;

Point2D.MinY = -5000;
Point2D.MaxY = 5000;

Point2D.Validate = function (x, y) {
    return Point2D.MinX <= x && x <= Point2D.MaxX && Point2D.MinY <= y && y <= Point2D.MaxY;
}

Point2D.prototype.Add = function(other){
    return new Point2D(this.x + other.x, this.y + other.y);
}

Point2D.prototype.Subtract = function(other) {
    return new Point2D(this.x - other.x, this.y - other.y);
}

Point2D.prototype.DotProduct = function(other) {
    return this.x * other.x + this.y * other.y;
}

export default Point2D;