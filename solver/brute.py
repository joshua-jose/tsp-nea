from numba import jit


from solution import Solution
from misc import shortest_paths, shortest_paths_gen, permutations


async def tsp_brute_force(problem):
    solution = Solution(problem)
    paths = permutations(problem.size)

    '''
    iterations = []
    for i in shortest_paths_gen(paths, problem.points):
        iterations.append(i)
        yield i

    best_path = iterations[-1]
    #iterations, best_path = shortest_paths(paths, problem.points)

    # Could just set the solution.path to shortest_paths_gen
    for i in iterations:
        solution.add_iteration(i)
    
    solution.set_path(best_path)
    
    '''
    solution.iterations = shortest_paths_gen(paths, problem.points)
    return solution
