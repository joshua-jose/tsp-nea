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


FRONTEND_IDENTITY = b"FRONTEND"


algorithm_names = {
    "Brute Force": tsp_brute_force,
    "Held-Karp": tsp_held_karp,
    "Nearest Neighbour": tsp_nearest_neighbour
}


class BrowserIPC:
    def __init__(self, endpoint):
        self.context = Context()
        self.socket = self.context.socket(zmq.ROUTER)
        self.socket.connect(endpoint)

    # Performs initial handshake
    async def init(self, algorithms):
        # get ready packet
        packet = await recv_packet(self.socket)
        assert packet['type'] == "ready"

        # send list of algorithms
        await send_algorithms(self.socket, algorithms)

    async def send_path(self, path, final=False):
        pass

    async def send_algorithms(self, algorithms):
        pass

    async def recv_packet(self):
        pass

    async def send_packet(self, packet):
        pass


async def send_path(socket, path, final=False):
    if isinstance(path, np.ndarray):
        path = path.tolist()

    packet = {'type': 'path', 'path': path, 'final': final}

    await send_packet(socket, packet)


async def send_algorithms(socket, algorithms):
    await send_packet(socket, {'type': 'algorithms', 'algorithms': algorithms})


async def recv_packet(socket):
    # dealer sends ID alongside message
    (_, message) = await socket.recv_multipart()
    message = message.decode()
    return json.loads(message)


async def send_packet(socket, packet):
    bin_data = json.dumps(packet).encode()
    await socket.send_multipart([FRONTEND_IDENTITY, bin_data])


async def process_problem(data, socket):

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
        await send_path(socket, path)
        await asyncio.sleep(0.5)

    await send_path(socket, path, final=True)


async def run_as_daemon(endpoint):
    context = Context()
    socket = context.socket(zmq.ROUTER)
    socket.connect(endpoint)

    # get ready packet
    packet = await recv_packet(socket)
    assert packet['type'] == "ready"

    # send list of algorithms
    await send_algorithms(socket, list(algorithm_names.keys()))

    # Main loop
    task = None
    while True:
        packet = await recv_packet(socket)
        #print(f"py received: {json.dumps(packet)}", file=sys.stderr)

        if packet['type'] == "calculate":
            task = asyncio.create_task(process_problem(packet, socket))

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
        if isinstance(asyncio.get_event_loop_policy(), asyncio.WindowsProactorEventLoopPolicy):
            asyncio.set_event_loop_policy(
                asyncio.WindowsSelectorEventLoopPolicy())
        asyncio.run(run_as_daemon(args.daemon))
    else:

        run_tsp(9)
