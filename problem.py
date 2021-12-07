import numpy as np
from get_start import get_start


class Problem:
    def __init__(self, n) -> None:
        self.size = n
        self.nodes = np.random.rand(n, 2)
        self.centre = np.mean(self.nodes, 0)
        self.start = get_start(self.nodes)
