from tsp import run_tsp, tsp_score
import argparse
#import websockets
import asyncio
import numpy as np
import json
import sys
import zmq
from zmq.asyncio import Context
from aioconsole import ainput, aprint

from brute import tsp_brute_force
from nearest_neighbour import tsp_nearest_neighbour
from held_karp import tsp_held_karp
from problem import Problem


async def send_path(path, final=False):
    if isinstance(path, np.ndarray):
        path = path.tolist()

    message = {'path': path, 'final': final}
    await aprint(json.dumps(message))


algorithm_names = {
    "Brute Force": tsp_brute_force,
    "Held-Karp": tsp_held_karp,
    "Nearest Neighbour": tsp_nearest_neighbour
}


async def process_problem(data):

    if not('points' in data.keys() and 'algorithm' or data.keys()):
        return

    points = data["points"]
    name = data["algorithm"]

    problem = Problem(np.array(points))

    if name in algorithm_names.keys():
        algorithm = algorithm_names[name]
        solution = await algorithm(problem)
    else:
        return

    path = []
    for i in solution.iterations:
        path = i
        await send_path(path)
        await asyncio.sleep(0.5)

    await send_path(path, final=True)

    '''
    for i in solution.iteration_paths:
        message = {'path': i.tolist(), 'final': False}
        # time.sleep(0.75)
        print(json.dumps(message))
    
    message = {'path': solution.path.tolist(), 'final': True}
    print(json.dumps(message))
    '''

async def run_server(endpoint):
    context = Context()
    socket = context.socket(zmq.REP)
    socket.connect(endpoint)
    while True:
        message = await socket.recv()
        data = json.loads(message)

        print(f"zmq received: {message}", file=sys.stderr)
        #await socket.send_json({'test':'test'})
        await asyncio.sleep(0)

async def run_as_daemon(endpoint):
    asyncio.create_task(run_server(endpoint))

    while True:
        data = json.loads(await ainput())

        await process_problem(data)
        await asyncio.sleep(0)
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

    parser.add_argument('--daemon', metavar='port',
                        help='Run as a daemon (default: runs as a standalone solver)')

    args = parser.parse_args()
    if args.daemon:
        if isinstance(asyncio.get_event_loop_policy(), asyncio.WindowsProactorEventLoopPolicy):
            asyncio.set_event_loop_policy(asyncio.WindowsSelectorEventLoopPolicy())
        asyncio.run(run_as_daemon(args.daemon))
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
