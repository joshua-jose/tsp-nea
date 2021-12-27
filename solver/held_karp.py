from functools import cache
import numpy as np

from solution import Solution


def tsp_held_karp(problem):
    hk_shortest_path.cache_clear()  # dont need solutions from previous run

    solution = Solution(problem)
    #start = tuple(problem.start)
    start = tuple(problem.nodes[0])

    # TODO: refactor this to work in indexes rather than raw nodes
    # TODO: work from a distance matrix rather than assuming 2D nodes

    # turn our array of arrays into a set of tuples, where each tuple is a point
    # easy to pop off this set
    points = frozenset(tuple(point) for point in problem.nodes)

    paths = []
    for c in points - {start}:
        paths.append(hk_shortest_path(start, points-{start, c}, c))

    shortest_solution = min(paths, key=segment_length)
    shortest_path = []
    for i in shortest_solution:
        shortest_path.append(np.where(problem.nodes == i))
        pass

    solution.set_path(shortest_path)
    return solution


@cache
def hk_shortest_path(start, cities, end):
    # The cities set is empty (path between start node and end node)
    if not cities:
        return [start, end]
    else:
        paths = []
        for c in cities:
            # shortest path between start and c
            paths.append(hk_shortest_path(start, cities-{c}, c) + [end])

        # Find the path in the list with the shortest length
        shortest_path = min(paths, key=segment_length)

        return shortest_path


def segment_length(segment):
    "The total of distances between each pair of consecutive cities in the segment."

    length = 0
    for i in range(len(segment)):
        dx = segment[i][0] - segment[i-1][0]
        dy = segment[i][1] - segment[i-1][1]
        length += dx*dx + dy*dy

    return length
