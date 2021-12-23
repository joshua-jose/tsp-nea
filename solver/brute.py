import numpy as np
import math
from numba import jit


from solution import Solution
from misc import score_solution, permutations


def tsp_brute_force(problem):
    solution = Solution(problem)
    paths = permutations(problem.size)

    iterations, best_path = find_best_solution(paths, problem.nodes)

    for i in iterations:
        solution.add_iteration(i)
    solution.set_path(best_path)

    return solution


@jit(nopython=True, fastmath=True)
def find_best_solution(paths, nodes):
    n_nodes = len(nodes)
    best_path = np.empty((n_nodes,), dtype=np.uint8)
    best_paths = []
    best_score = math.inf

    for path in paths:
        score = score_solution(path, nodes)
        if score < best_score:
            best_path = path
            best_score = score
            best_paths.append(path)

    return best_paths, best_path
