using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SquaresDemo.Geometry
{
    public class Point2d
    {
        public static Point2d Zero { get; } = new Point2d(0, 0);

        public int X { get; }
        public int Y { get; }

        public Point2d(int x, int y)
        {
            X = x;
            Y = y;
        }

        public Point2d Add(Point2d other) => new Point2d(X + other.X, Y + other.Y);

        public Point2d Subtract(Point2d other) => new Point2d(X - other.X, Y - other.Y);

        public int DotProduct(Point2d other) => (X * other.X + Y * other.Y);

        public override string ToString() => $"({X},{Y})";
    }
}