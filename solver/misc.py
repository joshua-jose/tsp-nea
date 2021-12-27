import pickle
import numpy as np

from numba import jit
from functools import cache
from os import path

basepath = path.dirname(__file__)
PERM_FOLDER = path.abspath(path.join(basepath, "../..", "permutation"))


@jit(nopython=True, fastmath=True, cache=True)
def score_solution(path, nodes):
    length = 0

    for i in range(len(path)):
        node0 = nodes[path[i]]
        node1 = nodes[path[i-1]]

        dx = node0[0] - node1[0]
        dy = node0[1] - node1[1]
        length += (dx*dx) + (dy*dy)

    return length


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
