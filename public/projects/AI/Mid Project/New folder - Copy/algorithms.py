import heapq
import random
import math
from collections import deque, defaultdict

class PathfindingAlgorithms:
    def __init__(self):
        self.algorithms = {
            'bfs': self.breadth_first_search,
            'dfs': self.depth_first_search,
            'a_star': self.a_star_search,
            'greedy': self.greedy_best_first_search,
            'dijkstra': self.dijkstra,
            'genetic': self.genetic_algorithm,
            'simulated_annealing': self.simulated_annealing
        }
    
    def find_path(self, graph, start, end, algorithm_name):
        """Find path using specified algorithm"""
        if algorithm_name not in self.algorithms:
            raise ValueError(f"Unknown algorithm: {algorithm_name}")
        
        algorithm_func = self.algorithms[algorithm_name]
        return algorithm_func(graph, start, end)
    
    def breadth_first_search(self, graph, start, end):
        """Breadth-First Search - finds shortest path in terms of number of edges"""
        if start == end:
            return {'path': [start], 'cost': 0, 'algorithm': 'BFS'}
        
        queue = deque([(start, [start])])
        visited = {start}
        
        while queue:
            current, path = queue.popleft()
            
            for neighbor in graph.get_neighbors(current):
                if neighbor == end:
                    full_path = path + [neighbor]
                    cost = self._calculate_path_cost(graph, full_path)
                    return {
                        'path': full_path,
                        'cost': cost,
                        'algorithm': 'Breadth-First Search',
                        'explanation': 'BFS explores all nodes at the current depth before moving to the next level'
                    }
                
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append((neighbor, path + [neighbor]))
        
        return {'error': 'No path found', 'algorithm': 'BFS'}
    
    def depth_first_search(self, graph, start, end):
        """Depth-First Search - explores as far as possible along each branch"""
        if start == end:
            return {'path': [start], 'cost': 0, 'algorithm': 'DFS'}
        
        stack = [(start, [start])]
        visited = {start}
        
        while stack:
            current, path = stack.pop()
            
            for neighbor in graph.get_neighbors(current):
                if neighbor == end:
                    full_path = path + [neighbor]
                    cost = self._calculate_path_cost(graph, full_path)
                    return {
                        'path': full_path,
                        'cost': cost,
                        'algorithm': 'Depth-First Search',
                        'explanation': 'DFS explores as far as possible along each branch before backtracking'
                    }
                
                if neighbor not in visited:
                    visited.add(neighbor)
                    stack.append((neighbor, path + [neighbor]))
        
        return {'error': 'No path found', 'algorithm': 'DFS'}
    
    def dijkstra(self, graph, start, end):
        """Dijkstra's algorithm - finds shortest path in terms of total distance"""
        if start == end:
            return {'path': [start], 'cost': 0, 'algorithm': 'Dijkstra'}
        
        distances = {city: float('inf') for city in graph.cities}
        distances[start] = 0
        previous = {}
        pq = [(0, start)]
        
        while pq:
            current_dist, current = heapq.heappop(pq)
            
            if current == end:
                path = self._reconstruct_path(previous, start, end)
                return {
                    'path': path,
                    'cost': current_dist,
                    'algorithm': "Dijkstra's Algorithm",
                    'explanation': 'Dijkstra finds the shortest path by always exploring the closest unvisited node'
                }
            
            if current_dist > distances[current]:
                continue
            
            for neighbor in graph.get_neighbors(current):
                distance = graph.get_distance(current, neighbor)
                new_dist = current_dist + distance
                
                if new_dist < distances[neighbor]:
                    distances[neighbor] = new_dist
                    previous[neighbor] = current
                    heapq.heappush(pq, (new_dist, neighbor))
        
        return {'error': 'No path found', 'algorithm': 'Dijkstra'}
    
    def a_star_search(self, graph, start, end):
        """A* search with heuristic function"""
        if start == end:
            return {'path': [start], 'cost': 0, 'algorithm': 'A*'}
        
        def heuristic(city1, city2):
            # Simple heuristic - could be improved with actual coordinates
            return 0  # For now, A* behaves like Dijkstra
        
        open_set = [(0, start)]
        came_from = {}
        g_score = {city: float('inf') for city in graph.cities}
        g_score[start] = 0
        f_score = {city: float('inf') for city in graph.cities}
        f_score[start] = heuristic(start, end)
        
        while open_set:
            current = heapq.heappop(open_set)[1]
            
            if current == end:
                path = self._reconstruct_path(came_from, start, end)
                cost = self._calculate_path_cost(graph, path)
                return {
                    'path': path,
                    'cost': cost,
                    'algorithm': 'A* Search',
                    'explanation': 'A* combines Dijkstra with a heuristic to find optimal paths efficiently'
                }
            
            for neighbor in graph.get_neighbors(current):
                tentative_g_score = g_score[current] + graph.get_distance(current, neighbor)
                
                if tentative_g_score < g_score[neighbor]:
                    came_from[neighbor] = current
                    g_score[neighbor] = tentative_g_score
                    f_score[neighbor] = g_score[neighbor] + heuristic(neighbor, end)
                    heapq.heappush(open_set, (f_score[neighbor], neighbor))
        
        return {'error': 'No path found', 'algorithm': 'A*'}
    
    def greedy_best_first_search(self, graph, start, end):
        """Greedy Best-First Search"""
        if start == end:
            return {'path': [start], 'cost': 0, 'algorithm': 'Greedy Best-First'}
        
        def heuristic(city1, city2):
            # Simple heuristic - could be improved
            return 0
        
        open_set = [(heuristic(start, end), start)]
        came_from = {}
        visited = {start}
        
        while open_set:
            current = heapq.heappop(open_set)[1]
            
            if current == end:
                path = self._reconstruct_path(came_from, start, end)
                cost = self._calculate_path_cost(graph, path)
                return {
                    'path': path,
                    'cost': cost,
                    'algorithm': 'Greedy Best-First Search',
                    'explanation': 'Greedy Best-First always chooses the node that appears closest to the goal'
                }
            
            for neighbor in graph.get_neighbors(current):
                if neighbor not in visited:
                    visited.add(neighbor)
                    came_from[neighbor] = current
                    heapq.heappush(open_set, (heuristic(neighbor, end), neighbor))
        
        return {'error': 'No path found', 'algorithm': 'Greedy Best-First'}
    
    def genetic_algorithm(self, graph, start, end):
        """Genetic Algorithm for pathfinding"""
        if start == end:
            return {'path': [start], 'cost': 0, 'algorithm': 'Genetic Algorithm'}
        
        def generate_random_path():
            """Generate a random valid path"""
            path = [start]
            current = start
            visited = {start}
            
            while current != end and len(path) < len(graph.cities):
                neighbors = [n for n in graph.get_neighbors(current) if n not in visited]
                if not neighbors:
                    break
                next_city = random.choice(neighbors)
                path.append(next_city)
                visited.add(next_city)
                current = next_city
            
            return path if current == end else None
        
        def fitness(path):
            """Calculate fitness of a path (lower is better)"""
            if not path or path[-1] != end:
                return float('inf')
            return self._calculate_path_cost(graph, path)
        
        def crossover(path1, path2):
            """Create offspring from two paths"""
            if len(path1) < 2 or len(path2) < 2:
                return path1
            
            # Find common cities
            common = set(path1) & set(path2)
            if len(common) < 2:
                return path1
            
            # Create crossover point
            common_list = [c for c in path1 if c in common]
            if len(common_list) < 2:
                return path1
            
            crossover_point = random.choice(common_list[1:-1])
            idx1 = path1.index(crossover_point)
            idx2 = path2.index(crossover_point)
            
            new_path = path1[:idx1] + path2[idx2:]
            return new_path
        
        def mutate(path):
            """Mutate a path"""
            if len(path) < 3:
                return path
            
            # Randomly change part of the path
            start_idx = random.randint(1, len(path) - 2)
            end_idx = random.randint(start_idx + 1, len(path) - 1)
            
            # Try to find alternative path between these points
            current = path[start_idx - 1]
            target = path[end_idx]
            
            # Simple mutation: try to find a different path
            for neighbor in graph.get_neighbors(current):
                if neighbor != path[start_idx]:
                    new_path = path[:start_idx] + [neighbor] + path[end_idx:]
                    if self._is_valid_path(graph, new_path):
                        return new_path
            
            return path
        
        # Genetic Algorithm parameters
        population_size = 50
        generations = 100
        mutation_rate = 0.1
        
        # Initialize population
        population = []
        for _ in range(population_size):
            path = generate_random_path()
            if path:
                population.append(path)
        
        if not population:
            return {'error': 'No valid paths found', 'algorithm': 'Genetic Algorithm'}
        
        best_path = min(population, key=fitness)
        
        for generation in range(generations):
            # Evaluate fitness
            fitness_scores = [(fitness(path), path) for path in population]
            fitness_scores.sort()
            
            # Keep best half
            population = [path for _, path in fitness_scores[:population_size // 2]]
            
            # Generate new population
            while len(population) < population_size:
                parent1 = random.choice(population)
                parent2 = random.choice(population)
                child = crossover(parent1, parent2)
                
                if random.random() < mutation_rate:
                    child = mutate(child)
                
                if child and self._is_valid_path(graph, child):
                    population.append(child)
            
            # Update best path
            current_best = min(population, key=fitness)
            if fitness(current_best) < fitness(best_path):
                best_path = current_best
        
        if best_path and best_path[-1] == end:
            cost = self._calculate_path_cost(graph, best_path)
            return {
                'path': best_path,
                'cost': cost,
                'algorithm': 'Genetic Algorithm',
                'explanation': 'Genetic Algorithm uses evolution-inspired techniques to find good solutions'
            }
        
        return {'error': 'No path found', 'algorithm': 'Genetic Algorithm'}
    
    def simulated_annealing(self, graph, start, end):
        """Simulated Annealing for pathfinding"""
        if start == end:
            return {'path': [start], 'cost': 0, 'algorithm': 'Simulated Annealing'}
        
        def generate_initial_solution():
            """Generate initial path using simple greedy approach"""
            path = [start]
            current = start
            visited = {start}
            
            while current != end:
                neighbors = [n for n in graph.get_neighbors(current) if n not in visited]
                if not neighbors:
                    return None
                
                # Choose neighbor with shortest distance to end (if we had coordinates)
                next_city = random.choice(neighbors)
                path.append(next_city)
                visited.add(next_city)
                current = next_city
            
            return path
        
        def get_neighbor_solution(path):
            """Generate a neighbor solution"""
            if len(path) < 3:
                return path
            
            # Randomly modify the path
            new_path = path.copy()
            
            # Try to find a different route between two points
            start_idx = random.randint(0, len(path) - 3)
            end_idx = random.randint(start_idx + 2, len(path) - 1)
            
            # Find alternative path between these points
            current = new_path[start_idx]
            target = new_path[end_idx]
            
            # Simple approach: try to find a 2-hop path
            for neighbor in graph.get_neighbors(current):
                if neighbor in graph.get_neighbors(target) and neighbor not in new_path[start_idx:end_idx]:
                    new_path = new_path[:start_idx + 1] + [neighbor] + new_path[end_idx:]
                    break
            
            return new_path
        
        def energy(path):
            """Calculate energy (cost) of a path"""
            if not path or path[-1] != end:
                return float('inf')
            return self._calculate_path_cost(graph, path)
        
        # Simulated Annealing parameters
        initial_temp = 1000
        final_temp = 1
        cooling_rate = 0.95
        max_iterations = 1000
        
        # Generate initial solution
        current_solution = generate_initial_solution()
        if not current_solution:
            return {'error': 'No initial solution found', 'algorithm': 'Simulated Annealing'}
        
        best_solution = current_solution
        current_energy = energy(current_solution)
        best_energy = current_energy
        temperature = initial_temp
        
        for iteration in range(max_iterations):
            # Generate neighbor
            neighbor_solution = get_neighbor_solution(current_solution)
            neighbor_energy = energy(neighbor_solution)
            
            # Accept or reject
            if neighbor_energy < current_energy or random.random() < math.exp(-(neighbor_energy - current_energy) / temperature):
                current_solution = neighbor_solution
                current_energy = neighbor_energy
                
                if current_energy < best_energy:
                    best_solution = current_solution
                    best_energy = current_energy
            
            # Cool down
            temperature *= cooling_rate
            
            if temperature < final_temp:
                break
        
        if best_solution and best_solution[-1] == end:
            return {
                'path': best_solution,
                'cost': best_energy,
                'algorithm': 'Simulated Annealing',
                'explanation': 'Simulated Annealing uses probabilistic acceptance to escape local optima'
            }
        
        return {'error': 'No path found', 'algorithm': 'Simulated Annealing'}
    
    def _calculate_path_cost(self, graph, path):
        """Calculate total cost of a path"""
        if len(path) < 2:
            return 0
        
        total_cost = 0
        for i in range(len(path) - 1):
            total_cost += graph.get_distance(path[i], path[i + 1])
        return total_cost
    
    def _reconstruct_path(self, came_from, start, end):
        """Reconstruct path from came_from dictionary"""
        path = []
        current = end
        
        while current is not None:
            path.append(current)
            current = came_from.get(current)
        
        path.reverse()
        return path
    
    def _is_valid_path(self, graph, path):
        """Check if a path is valid (all connections exist)"""
        if not path:
            return False
        
        for i in range(len(path) - 1):
            if path[i + 1] not in graph.get_neighbors(path[i]):
                return False
        return True
