from math import inf

from solution import Solution
from misc import point_dist_sq, score_path
import sys


async def tsp_convex_hull(problem):
    solution = Solution(problem)
    solution.iterations = convex_hull_gen(problem)

    return solution


def counter_clockwise(p, q, r):
    return (q[0] - p[0]) * (r[1] - q[1]) < (q[1] - p[1]) * (r[0] - q[0])


def convex_hull_gen(problem):
    leftmost = 0
    for index, point in enumerate(problem.points):
        if point[0] < problem.points[leftmost][0]:
            leftmost = index

    path = [leftmost]
    nodes = list(range(problem.size))

    while True:
        current = path[-1]
        selected = 0

        # find the "most counterclockwise" point
        for node in nodes:
            if selected == 0 or counter_clockwise(problem.points[current], problem.points[node], problem.points[selected]):
                # this point is counterclockwise with respect to the current hull
                # and selected point (e.g. more counterclockwise)
                selected = node

        # adding this to the hull so it's no longer available
        nodes.remove(selected)

        # back to the furthest left point, formed a cycle, break
        if selected == leftmost:
            break

        path.append(selected)  # add to hull
        yield path
    # Hull is built, now use an insertion algorithm to add rest of points to path
    while len(nodes) > 0:
        best_ratio, bestNode, insert_index = inf, 0, 0

        for free in nodes:
            # for every free point, find the point in the current path
            # that minimizes the cost of adding the point minus the cost of
            # the original segment
            bestCost, bestIdx = inf, 0
            for pathIdx, pathNode in enumerate(path):

                nextPathNode = path[(pathIdx + 1) % len(path)]

                # the new cost minus the old cost
                evalCost = score_path([pathNode, free, nextPathNode], problem.points) - \
                    score_path([pathNode, nextPathNode], problem.points)

                if evalCost < bestCost:
                    bestCost, bestIdx = evalCost, pathIdx

            # figure out how "much" more expensive this is with respect to the
            # overall length of the segment
            nextPoint = path[(bestIdx + 1) % len(path)]
            prevCost = score_path([path[bestIdx], nextPoint], problem.points)
            newCost = score_path(
                [path[bestIdx], free, nextPoint], problem.points)
            ratio = newCost / prevCost

            if (ratio < best_ratio):
                best_ratio, bestNode, insert_index = ratio, free, bestIdx + 1

        nodes.remove(bestNode)
        path.insert(insert_index, bestNode)

        yield path

    # rotate the array so that starting point is back first
    #startIdx = path.findIndex(p == sp)

    # path.unshift(...path.splice(startIdx, path.length))

    # go back home
    # path.push(sp)
