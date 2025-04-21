import random
grid = [[random.randint(0, 255) for _ in range(50)] for _ in range(50)]
for row in grid:
    print(" ".join(f"{num:3}" for num in row))
