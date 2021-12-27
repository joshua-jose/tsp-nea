import numpy as np
import math
from numba import jit


from solution import Solution
from misc import shortest_paths, permutations


def tsp_brute_force(problem):
    solution = Solution(problem)
    paths = permutations(problem.size)

    iterations, best_path = shortest_paths(paths, problem.points)

    for i in iterations:
        solution.add_iteration(i)
    solution.set_path(best_path)

    return solution
