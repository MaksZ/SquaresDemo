using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace SquaresDemo.Geometry
{
    public static class Algorithms
    {
        /// <summary>
        /// Finds all possible squares in the given set of points;
        /// duplicate points are not allowed;
        /// </summary>
        public static void FindSquares(Point2d[] points, Action<int[]> onFound)
        {
            if (points.Length < 4) return;

            int i1, i2, i3, i4;
            int e4 = points.Length, e3 = e4 - 1, e2 = e3 - 1, e1 = e2 - 1;

            for (i1 = 0; i1 < e1; i1++)
            {
                var p1 = points[i1];

                for (i2 = i1 + 1; i2 < e2; i2++)
                {
                    var p2 = points[i2];

                    for (i3 = i2 + 1; i3 < e3; i3++)
                    {
                        var expected = CompleteSquareOrDefault(p1, p2, points[i3]);

                        if (expected == null) continue;

                        var result = new[] { i1, i2, i3, 0 };

                        for (i4 = i3 + 1; i4 < e4; i4++)
                        {
                            var p4 = points[i4];

                            if (p4.X == expected.X && p4.Y == expected.Y)
                            {
                                result[3] = i4;

                                onFound(result);

                                // we can break here as only one point can match given three,
                                // and no duplicates expected in the set
                                break;
                            }
                        }
                    }
                }
            }
        }

        /// <summary>
        /// Finds all possible squares in the given set of points;
        /// duplicate points are not allowed;
        /// improved version
        /// </summary>
        public static void FindSquares2(Point2d[] points, Action<int[]> onFound)
        {
            if (points.Length < 4) return;

            int i1, i2, i3, i4;
            int e4 = points.Length, e3 = e4 - 1, e2 = e3 - 1, e1 = e2 - 1;

            for (i1 = 0; i1 < e1; i1++)
            {
                var p1 = points[i1];

                for (i2 = i1 + 1; i2 < e2; i2++)
                {
                    var p2 = points[i2];
                    var v12 = p2.Subtract(p1);
                    var l12 = v12.DotProduct(v12);

                    for (i3 = i2 + 1; i3 < e3; i3++)
                    {
                        var p3 = points[i3];
                        var v23 = p3.Subtract(p2);
                        var l23 = v23.DotProduct(v23);

                        Point2d expected = null; 

                        if (l12 == l23 && hasRightAngle(v12, v23))
                            expected = p1.Add(v23);
                        else
                        {
                            var v31 = p1.Subtract(p3);
                            var l31 = v31.DotProduct(v31);

                            if ((l31 == l23) && hasRightAngle(v23, v31))
                                expected = p2.Add(v31);

                            else if ((l31 == l12) && hasRightAngle(v31, v12))
                                expected = p3.Add(v12);
                        }

                        if (expected == null) continue;

                        var result = new[] { i1, i2, i3, 0 };

                        for (i4 = i3 + 1; i4 < e4; i4++)
                        {
                            var p4 = points[i4];

                            if (p4.X == expected.X && p4.Y == expected.Y)
                            {
                                result[3] = i4;

                                onFound(result);

                                // we can break here as only one point can match given three,
                                // and no duplicates expected in the set
                                break;
                            }
                        }
                    }
                }
            }
        }

        /// <summary>
        /// If given points are vertices of a square, finds 4th point, otherwise - null;
        /// all points should differ
        /// </summary>
        public static Point2d CompleteSquareOrDefault(Point2d p1, Point2d p2, Point2d p3)
        {
            var v12 = p2.Subtract(p1);
            var v23 = p3.Subtract(p2);

            int l12, l23, l31;

            // p2 - corner point
            l23 = v23.DotProduct(v23);
            l12 = v12.DotProduct(v12);

            if ((l12 == l23) && hasRightAngle(v12, v23)) return p1.Add(v23);
            
            // p3 - corner point
            var v31 = p1.Subtract(p3);
            l31 = v31.DotProduct(v31);

            if ((l31 == l23) && hasRightAngle(v23, v31)) return p2.Add(v31);

            // p1 - corner point
            if ((l31 == l12) && hasRightAngle(v31, v12)) return p3.Add(v12);

            return default(Point2d);
        }

        /// <summary>
        /// Checks if a corner being made on p1, zero point and p2, has the right angle
        /// </summary>
        private static bool hasRightAngle(Point2d p1, Point2d p2) => p1.DotProduct(p2) == 0;

    }
}