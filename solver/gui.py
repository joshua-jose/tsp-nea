from matplotlib import pyplot
import time

pyplot.ion()


class GUI:

    def __init__(self, problem) -> None:
        self.problem = problem
        self.xs = [i[0] for i in problem.nodes]
        self.ys = [i[1] for i in problem.nodes]

        self.figure = pyplot.figure(figsize=(12, 6))
        self.gs = self.figure.add_gridspec(2, 2)
        self.subplots = []

    def draw_solution(self, solution, name=None):

        ax = self.figure.add_subplot(self.gs[len(self.subplots)], title=name)
        self.subplots.append(ax)

        ax.plot(self.xs, self.ys, 'o')
        #ax.plot(self.problem.centre[0], self.problem.centre[1], 'ro')
        #ax.plot(self.problem.start[0], self.problem.start[1], 'go')

        line, = ax.plot(self.xs, self.ys)

        edgesx = []
        edgesy = []

        for i in solution.solution:
            edgesx.append(i[0])
            edgesy.append(i[1])
        edgesx.append(solution.solution[0][0])
        edgesy.append(solution.solution[0][1])

        line.set_xdata(edgesx)
        line.set_ydata(edgesy)
        self.figure.canvas.draw()
        self.figure.canvas.flush_events()

    def draw_iterations(self, solution, name=None):
        ax = self.figure.add_subplot(self.gs[len(self.subplots)], title=name)
        self.subplots.append(ax)

        ax.plot(self.xs, self.ys, 'o')
        #ax.plot(self.problem.centre[0], self.problem.centre[1], 'ro')
        #ax.plot(self.problem.start[0], self.problem.start[1], 'go')

        line, = ax.plot(self.xs, self.ys)

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
