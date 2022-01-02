from math import inf

from solution import Solution
from misc import point_dist_sq


def tsp_nearest_neighbour(problem):
    solution = Solution(problem)
    start = problem.start_index

    path = [start]

    unused_nodes = list(range(problem.size))
    curr_node = problem.points[start]
    unused_nodes.remove(start)

    while len(unused_nodes) > 0:
        nearest_neighbour_index = 0
        nearest_distance = inf

        for i in unused_nodes:
            distance = point_dist_sq(problem.points[i], curr_node)
            if distance < nearest_distance:
                nearest_distance = distance
                nearest_neighbour_index = i

        #print(unused_nodes, nearest_neighbour_index)
        unused_nodes.remove(nearest_neighbour_index)
        path.append(nearest_neighbour_index)
        curr_node = problem.points[nearest_neighbour_index]
        solution.add_iteration(path)

    solution.set_path(path)
    return solution
