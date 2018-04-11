// Helper method to check if a corner being made on two vectors has right angle
function hasRightAngle(v1, v2) { 

    return Math.abs(v1.DotProduct(v2)) == 0;
}


// Finds all possible squares in the given set of points;
// duplicate points are not allowed;
// improved version
function findSquares(points, onFoundCallback) {

    if (points.length < 4) return;

    let i1, i2, i3, i4;
    let e4 = points.length, e3 = e4 - 1, e2 = e3 - 1, e1 = e2 - 1;

    for (i1 = 0; i1 < e1; i1++)
    {
        let p1 = points[i1];

        for (i2 = i1 + 1; i2 < e2; i2++)
        {
            let p2 = points[i2];
            let v12 = p2.Subtract(p1);
            let l12 = v12.DotProduct(v12);

            for (i3 = i2 + 1; i3 < e3; i3++)
            {
                let p3 = points[i3];
                let v23 = p3.Subtract(p2);
                let l23 = v23.DotProduct(v23);

                let expected = null; 

                if (l12 == l23 && hasRightAngle(v12, v23))
                    expected = p1.Add(v23);
                else
                {
                    let v31 = p1.Subtract(p3);
                    let l31 = v31.DotProduct(v31);

                    if ((l31 == l23) && hasRightAngle(v23,v31))
                        expected = p2.Add(v31);

                    else if ((l31 == l12) && hasRightAngle(v31,v12))
                        expected = p3.Add(v12);
                }

                if (!expected) continue;

                let result = [p1.id, p2.id, p3.id, 0 ];

                for (i4 = i3 + 1; i4 < e4; i4++)
                {
                    let p4 = points[i4];

                    if (p4.x == expected.x && p4.y == expected.y)
                    {
                        result[3] = p4.id;

                        onFoundCallback(result);

                        // we can break here as only one point can match given three,
                        // and no duplicates expected in the set
                        break;
                    }
                }
            }
        }
    }
}


/* ---- OLD STUFF ----
//
// Returns 4th point for the given three, if those are vertices of a square, or null
//
function completeSquare(p1, p2, p3) {
    let v1 = p2.Subtract(p1);
    let v2 = p3.Subtract(p1);

    let dotp = v1.DotProduct(v2);
    let isRightAngle = Math.abs(dotp) == 0;

    if (!isRightAngle) return null;

    // a square has equal sides
    return (v1.DotProduct(v1) == v2.DotProduct(v2)) ? p3.Add(v1) : null;
}

//
// Finds squares in the given list of points, returns as array of quadruples of ids of points that make a square
//
/*
function findSquares(points) {
    var result = [];

    if (points.length < 4) return result;

    var i1, i2, i3, i4;
    var p1, p2, p3, p4, expected;

    let e1 = points.length - 3;
    let e2 = points.length - 2;
    let e3 = points.length - 1;
    let e4 = points.length;

    for (i1 = 0; i1 < e1; i1++) {
        p1 = points[i1];

        for (i2 = i1 + 1; i2 < e2; i2++) {
            p2 = points[i2];

            if (p2.x == p1.x && p2.y == p1.y) continue;

            for (i3 = i2 + 1; i3 < e3; i3++) {
                p3 = points[i3];

                if (p3.x == p2.x && p3.y == p2.y) continue;
                if (p3.x == p1.x && p3.y == p1.y) continue;

                expected = completeSquare(p1, p2, p3);
                if (expected === null) expected = completeSquare(p2, p1, p3);
                if (expected === null) expected = completeSquare(p3, p1, p2);

                if (expected === null) continue;

                for (i4 = i3 + 1; i4 < e4; i4++) {
                    p4 = points[i4];

                    if (p4.x == expected.x && p4.y == expected.y) {
                        result.push([p1.id, p2.id, p3.id, p4.id]);

                        break;
                    }
                }

            }

        } // end of second loop

    } // end of first loop

    return result;
}
*/
export default findSquares;