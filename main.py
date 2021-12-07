from matplotlib import pyplot
import numpy as np
import time

from brute import tsp_brute_force
from nearest_neighbour import tsp_nearest_neighbour
from get_start import get_start
from gui import *
from problem import Problem

pyplot.ion()


def run_tsp(n):
    problem = Problem(n)
    gui = GUI(problem)

    brute_solution = tsp_brute_force(problem)
    gui.draw_solution(brute_solution)
    # gui.draw_iterations(brute_solution)

    nn_solution = tsp_nearest_neighbour(problem)
    gui.draw_iterations(nn_solution)

    gui.loop()


if __name__ == "__main__":
    run_tsp(10)
