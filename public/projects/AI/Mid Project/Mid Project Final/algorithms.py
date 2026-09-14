import heapq
import random
import math
from collections import deque, defaultdict

class PathfindingAlgorithms:
    def __init__(self):
        self.algorithms = {
            'bfs': self.breadth_first_search,
            'dfs': self.depth_first_search,
            # 'a_star': self.a_star_search,
            # 'greedy': self.greedy_best_first_search,
            # 'dijkstra': self.dijkstra,
            # 'genetic': self.genetic_algorithm,
            # 'simulated_annealing': self.simulated_annealing
        }
        # Cache for city positions (for heuristic)
        self.city_positions = {}
    
    def find_path(self, graph, start, end, algorithm_name):
        """Find path using specified algorithm with validation"""
        # Validate inputs
        if start not in graph.cities:
            return {'error': f'Start city "{start}" not found', 'algorithm': algorithm_name}
        if end not in graph.cities:
            return {'error': f'End city "{end}" not found', 'algorithm': algorithm_name}
        
        if algorithm_name not in self.algorithms:
            return {'error': f'Unknown algorithm: {algorithm_name}', 'algorithm': 'Unknown'}
        
        # Generate positions for heuristic if not already done
        if not self.city_positions or len(self.city_positions) != len(graph.cities):
            self._generate_city_positions(graph)
        
        algorithm_func = self.algorithms[algorithm_name]
        return algorithm_func(graph, start, end)
    
    def _generate_city_positions(self, graph):
        """Generate pseudo-positions for cities for heuristic calculations"""
        cities = list(graph.cities.keys())
        n = len(cities)
        
        # Place cities in a circle for consistent heuristic
        for i, city in enumerate(cities):
            angle = 2 * math.pi * i / n
            self.city_positions[city] = (
                math.cos(angle) * 100,
                math.sin(angle) * 100
            )
    
    def _heuristic(self, city1, city2):
        """Calculate Euclidean distance heuristic between two cities"""
        if city1 not in self.city_positions or city2 not in self.city_positions:
            return 0
        
        x1, y1 = self.city_positions[city1]
        x2, y2 = self.city_positions[city2]
        return math.sqrt((x2 - x1)**2 + (y2 - y1)**2)
    
    def breadth_first_search(self, graph, start, end):
        """Breadth-First Search - finds shortest path in terms of number of edges"""
        if start == end:
            return {'path': [start], 'cost': 0, 'algorithm': 'BFS'}
        
        queue = deque([(start, [start])])
        visited = {start}
        parents = {start: None}
        expansion_order = []
        
        while queue:
            current, path = queue.popleft()
            if current not in expansion_order:
                expansion_order.append(current)
            
            for neighbor in graph.get_neighbors(current):
                if neighbor == end:
                    full_path = path + [neighbor]
                    cost = self._calculate_path_cost(graph, full_path)
                    return {
                        'path': full_path,
                        'cost': cost,
                        'algorithm': 'Breadth-First Search',
                        'explanation': 'BFS explores all nodes at the current depth before moving to the next level',
                        'parents': parents,
                        'expansionOrder': expansion_order
                    }
                
                if neighbor not in visited:
                    visited.add(neighbor)
                    parents[neighbor] = current
                    queue.append((neighbor, path + [neighbor]))
        
        return {'error': 'No path found', 'algorithm': 'BFS', 'parents': parents, 'expansionOrder': expansion_order}
    
    def depth_first_search(self, graph, start, end):
        """Depth-First Search - explores as far as possible along each branch"""
        if start == end:
            return {'path': [start], 'cost': 0, 'algorithm': 'DFS'}
        
        stack = [(start, [start])]
        visited = set()
        parents = {start: None}
        expansion_order = []
        
        while stack:
            current, path = stack.pop()
            
            if current in visited:
                continue
                
            visited.add(current)
            if current not in expansion_order:
                expansion_order.append(current)
            
            if current == end:
                cost = self._calculate_path_cost(graph, path)
                return {
                    'path': path,
                    'cost': cost,
                    'algorithm': 'Depth-First Search',
                    'explanation': 'DFS explores as far as possible along each branch before backtracking',
                    'parents': parents,
                    'expansionOrder': expansion_order
                }
            
            # Add neighbors in reverse order so they're popped in correct order
            neighbors = list(graph.get_neighbors(current))
            for neighbor in reversed(neighbors):
                if neighbor not in visited:
                    if neighbor not in parents:
                        parents[neighbor] = current
                    stack.append((neighbor, path + [neighbor]))
        
        return {'error': 'No path found', 'algorithm': 'DFS', 'parents': parents, 'expansionOrder': expansion_order}
    
    # COMMENTED OUT ALGORITHMS - Only BFS and DFS are active
    # All other algorithms are commented out but preserved for future use
    
    # def dijkstra(self, graph, start, end):
    #     """Dijkstra's algorithm - finds shortest path in terms of total distance"""
    #     # [COMMENTED OUT - DIJKSTRA IMPLEMENTATION]
    #     return {'error': 'Dijkstra is disabled', 'algorithm': 'Dijkstra'}
    
    # def a_star_search(self, graph, start, end):
    #     """A* search with Euclidean distance heuristic"""
    #     # [COMMENTED OUT - A* IMPLEMENTATION]
    #     return {'error': 'A* is disabled', 'algorithm': 'A*'}
    
    # def greedy_best_first_search(self, graph, start, end):
    #     """Greedy Best-First Search using heuristic only"""
    #     # [COMMENTED OUT - GREEDY IMPLEMENTATION]
    #     return {'error': 'Greedy Best-First is disabled', 'algorithm': 'Greedy Best-First'}
    
    # def genetic_algorithm(self, graph, start, end):
    #     """Genetic Algorithm for pathfinding"""
    #     # [COMMENTED OUT - GENETIC ALGORITHM IMPLEMENTATION]
    #     return {'error': 'Genetic Algorithm is disabled', 'algorithm': 'Genetic Algorithm'}
    
    # def simulated_annealing(self, graph, start, end):
    #     """Simulated Annealing for pathfinding"""
    #     # [COMMENTED OUT - SIMULATED ANNEALING IMPLEMENTATION]
    #     return {'error': 'Simulated Annealing is disabled', 'algorithm': 'Simulated Annealing'}
    
    def _calculate_path_cost(self, graph, path):
        """Calculate total cost of a path"""
        if not path or len(path) < 2:
            return 0
        
        total_cost = 0
        for i in range(len(path) - 1):
            distance = graph.get_distance(path[i], path[i + 1])
            if distance == float('inf'):
                return float('inf')
            total_cost += distance
        return total_cost
    
    def _reconstruct_path(self, came_from, start, end):
        """Reconstruct path from came_from dictionary"""
        path = []
        current = end
        
        while current is not None:
            path.append(current)
            current = came_from.get(current)
        
        path.reverse()
        return path if path and path[0] == start else []
    
    def _is_valid_path(self, graph, path):
        """Check if a path is valid (all connections exist)"""
        if not path or len(path) < 1:
            return False
        
        for i in range(len(path) - 1):
            if path[i + 1] not in graph.get_neighbors(path[i]):
                return False
        
        return True
