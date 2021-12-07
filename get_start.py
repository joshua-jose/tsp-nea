import numpy as np

def get_start(nodes):
    return nodes[get_start_index(nodes)]

def get_start_index(nodes):
    centre = np.mean(nodes,0)

    start = np.empty((2,))
    best_score = 0
    for j, i in enumerate(nodes):
        #score = np.sum(np.abs(i - centre))
        score = np.sum((i - centre)**2) # furthest from centre
        score += np.sum([np.sum((i - j)**2) for j in nodes])/(len(nodes)**2)
        if score > best_score:
            start = j
            best_score = score
    return start