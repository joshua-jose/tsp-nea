from functools import cache

from solution import Solution
from misc import shortest_path


def tsp_held_karp(problem):
    # TODO: work from a distance matrix rather than assuming 2D nodes

    hk_shortest_path.cache_clear()  # dont need solutions from previous run

    solution = Solution(problem)
    start = 0

    # turn our array of arrays into a set of tuples, where each tuple is a point
    # easy to pop off this set
    nodes = frozenset(range(problem.size))

    paths = []
    for c in nodes - {start}:
        paths.append(hk_shortest_path(problem, start, nodes-{start, c}, c))

    best_path = shortest_path(paths, problem.points)
    solution.add_iteration(best_path)
    solution.set_path(best_path)

    return solution


@cache
def hk_shortest_path(problem, start, cities, end):
    # The cities set is empty (path between start node and end node)

    if not cities:
        return [start, end]
    else:
        paths = []
        for c in cities:
            # shortest path between start and c
            path = hk_shortest_path(problem, start, cities-{c}, c) + [end]
            paths.append(path)

        # Find the path in the list with the shortest length
        best_path = shortest_path(paths, problem.points)
        return best_path
