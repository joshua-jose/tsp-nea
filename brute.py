import numpy as np
import math
from numba import jit
from functools import cache
import pickle
from os import path

from solution import Solution

basepath = path.dirname(__file__)
PERM_FOLDER = path.abspath(path.join(basepath, "..", "permutation"))


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


@cache
def permutations(n):
    try:
        with open(f"{n}_perm.pickle", "rb") as f:
            a = pickle.load(f)
            return a
    except FileNotFoundError:
        pass

    FACT_LUT = np.array([
        1, 1, 2, 6, 24, 120, 720, 5040, 40320,
        362880, 3628800, 39916800, 479001600,
        6227020800, 87178291200, 1307674368000,
        20922789888000, 355687428096000, 6402373705728000,
        121645100408832000, 2432902008176640000], dtype='int64')

    #a = np.zeros((np.math.factorial(n), n), np.uint8)
    a = np.zeros((FACT_LUT[n], n), np.uint8)
    f = 1
    for m in range(2, n+1):
        b = a[:f, n-m+1:]      # the block of permutations of range(m-1)
        for i in range(1, m):
            a[i*f:(i+1)*f, n-m] = i
            a[i*f:(i+1)*f, n-m+1:] = b + (b >= i)

        b += 1
        f *= m
    with open(f"{PERM_FOLDER}/{n}_perm.pickle", 'wb') as f:
        pickle.dump(a, f)
    return a


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
