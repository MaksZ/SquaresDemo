using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SquaresDemo.Geometry;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;

namespace SquaresDemo.Tests.Geometry
{
    [TestClass]
    public class AlgorithmsTests
    {
        [TestMethod]
        public void CompleteSquareOrDefaultShouldFind4thPoint()
        {
            var set1 = new[]
            {
                new Point2d(1, 1),
                new Point2d(1, 2),
                new Point2d(2, 1),
                new Point2d(2, 2) // expected
            };

            var set2 = new[]
            {
                new Point2d(2, 1),
                new Point2d(1, 2),
                new Point2d(2, 3),
                new Point2d(3, 2) // expected
            };

            var sets = new[] { set1, set2 };

            for(var i = 0; i < sets.Length; i++)
            {
                var iteration = $"iteration {i + 1}";
                var set = sets[i];
                var expected = set[3];

                Action<int, int, int> assertEquality = (i1, i2, i3) =>
                {
                    var p1 = set[i1];
                    var p2 = set[i2];
                    var p3 = set[i3];

                    var actual = Algorithms.CompleteSquareOrDefault(p1, p2, p3);

                    var step = $"{iteration}, ({i1}, {i2}, {i3})";
                    Assert.IsNotNull(actual);
                    Assert.AreEqual(expected.X, actual.X, $"X, {step}");
                    Assert.AreEqual(expected.Y, actual.Y, $"Y, {step}");
                };

                // try all possible orders of initial points
                assertEquality(0, 1, 2);
                assertEquality(0, 2, 1);
                assertEquality(1, 0, 2);
                assertEquality(1, 2, 0);
                assertEquality(2, 0, 1);
                assertEquality(2, 1, 0);
            }

        }

        [TestMethod]
        public void CompleteSquareOrDefaultShouldReturnNullWhenPointNotFound()
        {
            var set1 = new[]
            {
                new Point2d(1, 1),
                new Point2d(2, 2),
                new Point2d(3, 3),
            };

            var set2 = new[]
            {
                new Point2d(1, 1),
                new Point2d(2, 7),
                new Point2d(3, 1),
            };

            var sets = new[] { set1, set2 };

            for (var i = 0; i < sets.Length; i++)
            {
                var iteration = $"iteration {i + 1}";
                var set = sets[i];

                Action<int, int, int> assertAbsence = (i1, i2, i3) =>
                {
                    var p1 = set[i1];
                    var p2 = set[i2];
                    var p3 = set[i3];

                    var actual = Algorithms.CompleteSquareOrDefault(p1, p2, p3);

                    var step = $"{iteration}, ({i1}, {i2}, {i3})";
                    Assert.IsNull(actual, step);
                };

                // try all possible orders of initial points
                assertAbsence(0, 1, 2);
                assertAbsence(0, 2, 1);
                assertAbsence(1, 0, 2);
                assertAbsence(1, 2, 0);
                assertAbsence(2, 0, 1);
                assertAbsence(2, 1, 0);
            }
        }

        [TestMethod]
        public void FindSquaresShouldFindOneSquare()
        {
            var foundSquares = new List<int[]>();

            var set1 = new[]
            {
                new Point2d(1, 1),
                new Point2d(2, 2),
                new Point2d(3, 1),
                new Point2d(4, 2),
                new Point2d(3, 3),
                new Point2d(5, 4),
            };

            Algorithms.FindSquares(set1, square => foundSquares.Add(square));

            Assert.AreEqual(1, foundSquares.Count);

            var r = foundSquares[0];
            Assert.IsTrue(r[0] == 1 && r[1] == 2 && r[2] == 3 && r[3] == 4, "wrong indices");
        }

        [TestMethod]
        public void FindSquaresShouldFindSixSquares()
        {
            var foundSquares = new List<int[]>();

            var indices = new[] { 0, 1, 2 };

            var set1 = indices.SelectMany(x => indices.Select(y => new Point2d(x, y))).ToArray();

            Algorithms.FindSquares(set1, square => foundSquares.Add(square));

            Assert.AreEqual(6, foundSquares.Count);
        }

        [TestMethod]
        public void FindSquaresShouldNotRunTooLong()
        {
            var indices = Enumerable.Range(0, 30).ToArray();

            var set1 = indices.SelectMany(x => indices.Select(y => new Point2d(x, y))).ToArray();

            var stopWatch = Stopwatch.StartNew();
            var counter = 0;
            Algorithms.FindSquares2(set1, _ => { counter++; });
            stopWatch.Stop();

            Assert.Fail($"Method completed in {stopWatch.Elapsed} for {indices.Length* indices.Length} points, {counter} squares found");
        }
    }
}
