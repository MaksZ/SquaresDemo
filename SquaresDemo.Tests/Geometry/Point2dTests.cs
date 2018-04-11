using System;
using Microsoft.VisualStudio.TestTools.UnitTesting;
using SquaresDemo.Geometry;
using System.Linq;

namespace SquaresDemo.Tests
{
    [TestClass]
    public class Point2dTests
    {
        [TestMethod]
        public void ZeroPointShouldHaveZeroForEachCoordinate()
        {
            var zeroPoint = Point2d.Zero;

            Assert.AreEqual(0, zeroPoint.X, "Expected zero X");
            Assert.AreEqual(0, zeroPoint.Y, "Expected zero Y");
        }

        [TestMethod]
        public void AddedToItselfShouldGetBiggerTwice()
        {
            foreach (var sample in GetNonZeroTestPoints())
            {
                var actual = sample.Add(sample);

                Assert.AreEqual(sample.X * 2, actual.X, "Expected double X");
                Assert.AreEqual(sample.Y * 2, actual.Y, "Expected double Y");
            }
        }

        [TestMethod]
        public void AddedToOppositeItselfShouldGetZero()
        {
            foreach (var sample in GetNonZeroTestPoints())
            {
                var opposite = new Point2d(-1 * sample.X, -1 * sample.Y);
                var actual = sample.Add(opposite);

                Assert.AreEqual(0, actual.X, "Expected zero X");
                Assert.AreEqual(0, actual.Y, "Expected zero Y");
            }
        }

        [TestMethod]
        public void SubtractedFromItselfShouldGetZero()
        {
            foreach (var sample in GetNonZeroTestPoints())
            {
                var actual = sample.Subtract(sample);

                Assert.AreEqual(0, actual.X, "Expected zero X");
                Assert.AreEqual(0, actual.Y, "Expected zero Y");
            }
        }

        [TestMethod]
        public void SubtractedFromOppositeItselfShouldGetBiggerTwice()
        {
            foreach (var sample in GetNonZeroTestPoints())
            {
                var opposite = new Point2d(-1 * sample.X, -1 * sample.Y);
                var actual = sample.Subtract(opposite);

                Assert.AreEqual(sample.X * 2, actual.X, "Expected double X");
                Assert.AreEqual(sample.Y * 2, actual.Y, "Expected double Y");
            }
        }

        [TestMethod]
        public void DotProductWithItselfShouldReturnPositiveForNonZeroPoints()
        {
            foreach (var sample in GetNonZeroTestPoints())
            {
                var result = sample.DotProduct(sample);

                Assert.IsTrue(result > 0, $"Expected positive, actual: {result}");
            }
        }

        [TestMethod]
        public void DotProductReturnsZeroWithZeroPoint()
        {
            var zeroPoint = Point2d.Zero;

            var result = zeroPoint.DotProduct(zeroPoint);

            Assert.AreEqual(0, result);

            foreach (var sample in GetNonZeroTestPoints())
            {
                result = zeroPoint.DotProduct(sample);
                Assert.AreEqual(0, result);

                result = sample.DotProduct(zeroPoint);
                Assert.AreEqual(0, result);
            }
        }

        [TestMethod]
        public void DotProductReturnsZeroForTwoVectorsHavingRightAngle()
        {
            var scale = new[] { 1, 1, 3, 3 };
            var direction = new[] { 1, -1, 1, -1 };

            foreach (var v1 in GetNonZeroTestPoints())
            {
                
                var samples = direction.Zip(scale, (k, s) => Rotate90andScale(v1, k, s));

                foreach (var v2 in samples)
                {
                    Assert.AreEqual(0, v2.DotProduct(v1), $"dot({v2}, {v1})");
                    Assert.AreEqual(0, v1.DotProduct(v2), $"dot({v1}, {v2})");
                }
            }
        }

        /// <summary>
        /// Transform given point p so that a corner being made on 
        ///  p, zero point, p transformed had right andle, i.e L 
        /// </summary>
        /// <param name="p">Point to trasform</param>
        /// <param name="k">direction of rotation, expected 1 or -1</param>
        /// <param name="s">scale factor for new point</param>
        /// <returns></returns>
        private Point2d Rotate90andScale(Point2d p, int k, int s) => new Point2d(s * k * p.Y, s * (-k) * p.X);

        private Point2d[] GetNonZeroTestPoints() => new[]
        {
            new Point2d(11, 17),
            new Point2d(-11, 17),
            new Point2d(-11, -17),
            new Point2d(11, -17),
        };
    }
}
