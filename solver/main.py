from matplotlib import pyplot
import numpy as np
import time

from brute import tsp_brute_force
from nearest_neighbour import tsp_nearest_neighbour
from held_karp import tsp_held_karp
from gui import *
from problem import Problem

pyplot.ion()


def sol_len(sol):
    length = 0
    for i in range(len(sol)):
        dx = sol[i][0] - sol[i-1][0]
        dy = sol[i][1] - sol[i-1][1]
        length += (dx*dx) + (dy*dy)

    return length


def run_tsp(n):
    problem = Problem(n)
    print(problem.nodes)
    gui = GUI(problem)

    brute_solution = tsp_brute_force(problem)
    gui.draw_solution(brute_solution, name="Brute force")
    # gui.draw_iterations(brute_solution)

    nn_solution = tsp_nearest_neighbour(problem)
    gui.draw_iterations(nn_solution, name="Nearest Neighbour")

    hk_solution = tsp_held_karp(problem)
    gui.draw_solution(hk_solution, name="Held Karp")

    brute_score = sol_len(brute_solution.solution)
    hk_score = sol_len(hk_solution.solution)
    print(brute_score, hk_score)

    gui.loop()


def tsp_score(n):
    problem = Problem(n)

    brute_solution = tsp_brute_force(problem)
    hk_solution = tsp_held_karp(problem)

    brute_score = sol_len(brute_solution.solution)
    hk_score = sol_len(hk_solution.solution)

    print(brute_score, hk_score)
    if round(hk_score, 4) != round(brute_score, 4):
        gui = GUI(problem)
        gui.draw_solution(brute_solution, name="Brute force")
        gui.draw_solution(hk_solution, name="Held Karp")
        gui.loop()


if __name__ == "__main__":
    run_tsp(10)
