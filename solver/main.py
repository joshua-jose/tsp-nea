import argparse
import asyncio
import numpy as np
import sys

from brute import tsp_brute_force
from nearest_neighbour import tsp_nearest_neighbour
from held_karp import tsp_held_karp
from problem import Problem
from BrowserIPC import BrowserIPC

algorithm_names = {
    "Brute Force": tsp_brute_force,
    "Held-Karp": tsp_held_karp,
    "Nearest Neighbour": tsp_nearest_neighbour
}


async def process_problem(data, IPC):

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
        await IPC.send_path(path)
        await asyncio.sleep(0.5)

    await IPC.send_path(path, final=True)


async def run_as_daemon(endpoint):
    IPC = BrowserIPC(endpoint)
    await IPC.init(list(algorithm_names.keys()))

    # Main loop
    task = None
    while True:
        packet = await IPC.recv_packet()

        if packet['type'] == "calculate":
            task = asyncio.create_task(process_problem(packet, IPC))

        elif packet['type'] == "stop":
            if task is not None:
                task.cancel()
            task = None

        await asyncio.sleep(0)


if __name__ == "__main__":
    parser = argparse.ArgumentParser(
        description='Calculates solutions for the Travelling Salesman Problem')

    parser.add_argument('--daemon', metavar='port',
                        help='Run as a daemon (default: runs as a standalone solver)')

    args = parser.parse_args()

    if args.daemon:
        # If we're on windows, we need to change the event loop type because zmq wants us to
        if isinstance(asyncio.get_event_loop_policy(), asyncio.WindowsProactorEventLoopPolicy):
            asyncio.set_event_loop_policy(
                asyncio.WindowsSelectorEventLoopPolicy())

        asyncio.run(run_as_daemon(args.daemon))
    else:
        from tsp import run_tsp, tsp_score
        asyncio.run(run_tsp(9))
