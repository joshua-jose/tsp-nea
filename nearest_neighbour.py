import numpy as np
import math
from numba import jit
from functools import cache

from get_start import get_start, get_start_index
from solution import Solution


@jit(nopython=True, fastmath=True, cache=True)
def score_solution(path, nodes):
    total_distance = 0

    for prev, curr in zip(path, path[1:]):
        prev_node = nodes[prev]
        curr_node = nodes[curr]

        dx = prev_node[0] - curr_node[0]
        dy = prev_node[1] - curr_node[1]

        total_distance += dx**2 + dy**2
    return total_distance


def tsp_nearest_neighbour(problem):
    solution = Solution(problem)
    start = get_start_index(problem.nodes)

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

        #print(unused_nodes, nearest_neighbour_index)
        unused_nodes.remove(nearest_neighbour_index)
        path.append(nearest_neighbour_index)
        curr_node = problem.nodes[nearest_neighbour_index]
        solution.add_iteration(path)

    solution.set_path(path)
    return solution
