import pickle
import math
import numpy as np

from numba import jit, njit
from functools import cache
from os import path

basepath = path.dirname(__file__)
PERM_FOLDER = path.abspath(path.join(basepath, "../..", "permutation"))


@njit(fastmath=True, cache=True)
def score_path(path, nodes):
    length = 0

    for i in range(len(path)):
        point0 = nodes[path[i]]
        point1 = nodes[path[i-1]]

        length += point_dist_sq(point0, point1)

    return length


def sol_len(sol):
    ''' an actual length of a solution (array of nodes)'''
    length = 0
    for i in range(len(sol)):
        point0 = sol[i]
        point1 = sol[i-1]

        length += point_dist_sq(point0, point1)

    return length


@njit
def point_dist_sq(a, b):
    # return np.sum((a-b)**2)
    dx = a[0] - b[0]
    dy = a[1] - b[1]
    return (dx*dx) + (dy*dy)


@jit(nopython=True, fastmath=True)
def shortest_paths(paths, points):
    n_nodes = len(points)
    best_path = np.empty((n_nodes,), dtype=np.uint8)
    best_paths = []
    best_score = math.inf

    for path in paths:
        score = score_path(path, points)
        if score < best_score:
            best_path = path
            best_score = score
            best_paths.append(path)

    return best_paths, best_path


@jit(nopython=True, fastmath=True)
def shortest_paths_gen(paths, points):
    n_nodes = len(points)
    best_path = np.empty((n_nodes,), dtype=np.uint8)
    best_score = math.inf

    for path in paths:
        score = score_path(path, points)
        if score < best_score:
            best_path = path
            best_score = score
            yield path


def shortest_path(paths, points):
    n_nodes = len(points)
    best_path = np.empty((n_nodes,), dtype=np.uint8)
    best_score = math.inf

    for path in paths:
        score = score_path(np.array(path), points)
        if score < best_score:
            best_path = path
            best_score = score

    return best_path


@cache
def permutations(n):
    try:
        with open(f"{n}_perm.pickle", "rb") as f:
            return pickle.load(f)
    except FileNotFoundError:
        pass

    FACT_LUT = np.array([
        1, 1, 2, 6, 24, 120, 720, 5040, 40320,
        362880, 3628800, 39916800, 479001600,
        6227020800, 87178291200, 1307674368000,
        20922789888000, 355687428096000, 6402373705728000,
        121645100408832000, 2432902008176640000], dtype='int64')

    if n < len(FACT_LUT)-1:
        a = np.zeros((FACT_LUT[n], n), np.uint8)
    else:
        a = np.zeros((np.math.factorial(n), n), np.uint8)

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
