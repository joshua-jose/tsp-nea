import numpy as np


class Solution:
    def __init__(self, problem) -> None:
        self.problem = problem
        # list of points in terms of index in solution array
        self.path = np.empty((problem.size,), dtype=np.uint8)

        self.solution = []  # list of points
        self.iterations = []

    def set_path(self, path):
        self.path = np.array(path, dtype=np.uint8)
        self.solution = []
        for i in path:
            self.solution.append(self.problem.points[i])

    def add_iteration(self, path):
        self.iterations.append(path)
