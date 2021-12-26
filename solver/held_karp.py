from functools import cache
import numpy as np
from numba import jit

from solution import Solution


def tsp_held_karp(problem):
    solution = Solution(problem)
    start_index = problem.start_index
    start = tuple(problem.start)

    '''
    path = [start]

    unused_nodes = list(range(problem.size))
    curr_node = problem.nodes[start]
    unused_nodes.remove(start)

    while len(unused_nodes) > 0:
        nearest_neighbour_index = 0
        nearest_distance = np.math.inf

        for i in unused_nodes:
            distance = np.sum((problem.nodes[i]-curr_node)**2)
            if distance < nearest_distance:
                nearest_distance = distance
                nearest_neighbour_index = i

        # print(unused_nodes, nearest_neighbour_index)
        unused_nodes.remove(nearest_neighbour_index)
        path.append(nearest_neighbour_index)
        curr_node = problem.nodes[nearest_neighbour_index]
        solution.add_iteration(path)

    solution.set_path(path)
    '''

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
    for i in range(1, len(segment)):
        dx = segment[i][0] - segment[i-1][0]
        dy = segment[i][1] - segment[i-1][1]
        length += dx*dx + dy*dy

    return length
