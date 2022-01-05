from tsp import run_tsp, tsp_score
import argparse
#import websockets
#import asyncio

from brute import tsp_brute_force
from nearest_neighbour import tsp_nearest_neighbour
from held_karp import tsp_held_karp
from problem import Problem
import numpy as np
import json


def send_path(path, final=False):
    if isinstance(path, np.ndarray):
        path = path.tolist()

    message = {'path': path, 'final': final}
    print(json.dumps(message))


algorithm_names = {
    "Brute Force": tsp_brute_force,
    "Held-Karp": tsp_held_karp,
    "Nearest Neighbour": tsp_nearest_neighbour
}


def process_problem():
    data = json.loads(input())

    if not('points' in data.keys() and 'algorithm' or data.keys()):
        return

    points = data["points"]
    problem = Problem(np.array(points))

    name = data["algorithm"]

    if name in algorithm_names.keys():
        algorithm = algorithm_names[name]
        solution = algorithm(problem)
    else:
        return

    path = []
    for i in solution.iterations:
        path = i
        send_path(path)

    send_path(path, final=True)

    '''
    for i in solution.iteration_paths:
        message = {'path': i.tolist(), 'final': False}
        # time.sleep(0.75)
        print(json.dumps(message))
    
    message = {'path': solution.path.tolist(), 'final': True}
    print(json.dumps(message))
    '''


def run_as_daemon():
    while True:
        process_problem()
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

    parser.add_argument('--daemon', action='store_true',
                        help='Run as a daemon (default: runs as a standalone solver)')

    args = parser.parse_args()
    if args.daemon:
        run_as_daemon()
    else:

        run_tsp(9)

    '''
    parser.add_argument('--data', nargs='*',
                        help='Run as a solver process, passing in a JSON string of data')

    

    args = parser.parse_args()
    if args.data:
        run_as_daemon(' '.join(args.data))
    else:

        run_tsp(9)
    '''
