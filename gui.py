from matplotlib import pyplot
import time

pyplot.ion()


class GUI:

    def __init__(self, problem) -> None:
        self.figure, self.ax = pyplot.subplots(figsize=(8, 6))
        self.problem = problem
        self.xs = [i[0] for i in problem.nodes]
        self.ys = [i[1] for i in problem.nodes]

        self.ax.plot(self.xs, self.ys, 'o')
        self.ax.plot(problem.centre[0], problem.centre[1], 'ro')
        self.ax.plot(problem.start[0], problem.start[1], 'go')

    def draw_solution(self, solution):
        line, = self.ax.plot(self.xs, self.ys)

        edgesx = []
        edgesy = []

        for i in solution.solution:
            edgesx.append(i[0])
            edgesy.append(i[1])

        line.set_xdata(edgesx)
        line.set_ydata(edgesy)
        self.figure.canvas.draw()
        self.figure.canvas.flush_events()

    def draw_iterations(self, solution):
        line, = self.ax.plot(self.xs, self.ys)

        for sol in solution.iterations:
            edgesx = []
            edgesy = []

            for i in sol:
                edgesx.append(i[0])
                edgesy.append(i[1])

            line.set_xdata(edgesx)
            line.set_ydata(edgesy)
            self.update()

    def update(self):

        self.figure.canvas.draw()
        self.figure.canvas.flush_events()

    def loop(self):
        while True:
            self.update()
            time.sleep(0.2)
