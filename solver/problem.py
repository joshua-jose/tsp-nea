import numpy as np


class Problem:
    def __init__(self, points) -> None:
        self.size = len(points)
        self.points = points
        # self.points = np.random.rand(n, 2)  # n random tuples of (x,y)
        self.centre = np.mean(self.points, 0)
        self.start = get_start(self.points)
        self.start_index = get_start_index(self.points)


def get_start(points):
    return points[get_start_index(points)]


def get_start_index(points):
    centre = np.mean(points, 0)

    start = np.empty((2,))
    best_score = 0
    for j, i in enumerate(points):
        #score = np.sum(np.abs(i - centre))
        score = np.sum((i - centre)**2)  # furthest from centre
        score += np.sum([np.sum((i - j)**2) for j in points])/(len(points)**2)
        if score > best_score:
            start = j
            best_score = score
    return start
