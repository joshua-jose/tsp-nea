import zmq
from zmq.asyncio import Context
import json
import numpy as np

FRONTEND_IDENTITY = b"FRONTEND"


class BrowserIPC:
    def __init__(self, endpoint):
        self.context = Context()
        self.socket = self.context.socket(zmq.ROUTER)
        self.socket.connect(endpoint)
        self.identity = FRONTEND_IDENTITY

    # Performs initial handshake
    async def init(self, algorithms):
        # get ready packet
        packet = await self.recv_packet()
        assert packet['type'] == "ready"

        # send list of algorithms
        await self.send_algorithms(algorithms)

    async def send_path(self, path, final=False):
        if isinstance(path, np.ndarray):
            path = path.tolist()

        await self.send_packet({'type': 'path', 'path': path, 'final': final})

    async def send_algorithms(self, algorithms):
        await self.send_packet({'type': 'algorithms', 'algorithms': algorithms})

    async def recv_packet(self):
        # dealer sends ID alongside message
        (_, message) = await self.socket.recv_multipart()
        message = message.decode()
        return json.loads(message)

    async def send_packet(self, packet):
        bin_data = json.dumps(packet).encode()
        await self.socket.send_multipart([self.identity, bin_data])
