'''
def reverse_segment_if_improvement(path, i, j):
    "If reversing path[i:j] would make the path shorter, then do it."
    # Given path [...A,B...C,D...], consider reversing B...C to get [...A,C...B,D...]
    A, B, C, D = path[i-1], path[i], path[j-1], path[j % len(path)]
    # Is the new path shorter? if so, reverse
    if distance(A, B) + distance(C, D) > distance(A, C) + distance(B, D):
        path[i:j] = reversed(path[i:j])
        return True



def improve_tour(tour):
    "Try to alter tour for the better by reversing segments."
    while True:
        improvements = {reverse_segment_if_improvement(tour, i, j)
                        for (i, j) in subsegments(len(tour))}
        if improvements == {None}:
            return tour


def subsegments(N):
    "Return (i, j) pairs denoting tour[i:j] subsegments of a tour of length N."
    return [(i, i + length)
            for length in reversed(range(2, N))
            for i in reversed(range(N - length + 1))]

'''