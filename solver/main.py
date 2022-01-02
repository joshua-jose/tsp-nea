from tsp import run_tsp, tsp_score
import argparse
#import websockets
#import asyncio
from time import sleep

from brute import tsp_brute_force
from nearest_neighbour import tsp_nearest_neighbour
from held_karp import tsp_held_karp
from problem import Problem
import numpy as np
import json
import sys


def run_as_daemon(data):
    data = json.loads(data)

    if not('points' in data.keys() and 'algorithm' or data.keys()):
        return

    points = data["points"]
    problem = Problem(len(points))
    problem.points = np.array(points)

    if data["algorithm"] == "Brute Force":
        solution = tsp_brute_force(problem)

    message = {'path': solution.path.tolist(), 'final': True}
    print(json.dumps(message))

    #nn_solution = tsp_nearest_neighbour(problem)
    #hk_solution = tsp_held_karp(problem)

    # asyncio.run(client(port))


'''
async def client(port):
    async with websockets.connect("ws://localhost:"+str(port)) as websocket:
        await websocket.send("Hello world!")
        while True:
            r = await websocket.recv()
            print("Python recieved: ", r)
'''

if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='Calculates solutions for the Travelling Salesman Problem')

    '''
    parser.add_argument('--daemon', nargs=1, metavar="port", type=int,
                        help='Run as a daemon (default: runs as a standalone solver)')
    '''

    parser.add_argument('--data', nargs='*',
                        help='Run as a solver process, passing in a JSON string of data')

    args = parser.parse_args()
    if args.data:
        run_as_daemon(' '.join(args.data))
    else:

        run_tsp(9)
