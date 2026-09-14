import json
import os

class Graph:
    def __init__(self):
        self.cities = {}  # Dictionary to store cities and their connections
        self.connections = {}  # Dictionary to store all connections with distances
    
    def add_city(self, city_name):
        """Add a new city to the graph"""
        if city_name in self.cities:
            return False
        
        self.cities[city_name] = []
        self.connections[city_name] = {}
        return True
    
    def add_connection(self, from_city, to_city, distance):
        """Add a connection between two cities with a distance"""
        if from_city not in self.cities or to_city not in self.cities:
            return False
        
        # Add connection in both directions (undirected graph)
        self.cities[from_city].append(to_city)
        self.cities[to_city].append(from_city)
        
        # Store distances
        self.connections[from_city][to_city] = distance
        self.connections[to_city][from_city] = distance
        
        return True
    
    def get_neighbors(self, city):
        """Get all neighbors of a city"""
        return self.cities.get(city, [])
    
    def get_distance(self, from_city, to_city):
        """Get distance between two cities"""
        return self.connections.get(from_city, {}).get(to_city, float('inf'))
    
    def get_graph_data(self):
        """Get graph data for visualization"""
        nodes = []
        edges = []
        
        # Create nodes
        for city in self.cities:
            nodes.append({
                'id': city,
                'label': city,
                'title': city
            })
        
        # Create edges (avoid duplicates)
        added_edges = set()
        for from_city, neighbors in self.cities.items():
            for to_city in neighbors:
                edge_key = tuple(sorted([from_city, to_city]))
                if edge_key not in added_edges:
                    distance = self.get_distance(from_city, to_city)
                    edges.append({
                        'from': from_city,
                        'to': to_city,
                        'label': str(distance),
                        'title': f'{from_city} to {to_city}: {distance}'
                    })
                    added_edges.add(edge_key)
        
        return {
            'nodes': nodes,
            'edges': edges
        }
    
    def clear(self):
        """Clear all cities and connections"""
        self.cities.clear()
        self.connections.clear()
    
    def save_to_file(self, filename):
        """Save graph data to a JSON file"""
        try:
            data = {
                'cities': self.cities,
                'connections': self.connections
            }
            
            # Create data directory if it doesn't exist
            data_dir = 'saved_graphs'
            if not os.path.exists(data_dir):
                os.makedirs(data_dir)
            
            filepath = os.path.join(data_dir, filename)
            with open(filepath, 'w') as f:
                json.dump(data, f, indent=2)
            
            return True, f"Graph saved successfully to {filepath}"
        except Exception as e:
            return False, f"Error saving graph: {str(e)}"
    
    def load_from_file(self, filename):
        """Load graph data from a JSON file"""
        try:
            filepath = os.path.join('saved_graphs', filename)
            
            if not os.path.exists(filepath):
                return False, f"File {filepath} not found"
            
            with open(filepath, 'r') as f:
                data = json.load(f)
            
            # Validate data structure
            if 'cities' not in data or 'connections' not in data:
                return False, "Invalid file format"
            
            # Clear current graph
            self.clear()
            
            # Load new data
            self.cities = data['cities']
            self.connections = data['connections']
            
            return True, f"Graph loaded successfully from {filepath}"
        except Exception as e:
            return False, f"Error loading graph: {str(e)}"
    
    def get_saved_files(self):
        """Get list of saved graph files"""
        try:
            data_dir = 'saved_graphs'
            if not os.path.exists(data_dir):
                return []
            
            files = []
            for filename in os.listdir(data_dir):
                if filename.endswith('.json'):
                    filepath = os.path.join(data_dir, filename)
                    file_size = os.path.getsize(filepath)
                    files.append({
                        'filename': filename,
                        'size': file_size,
                        'path': filepath
                    })
            
            return sorted(files, key=lambda x: x['filename'])
        except Exception as e:
            return []
    
    def __str__(self):
        return f"Graph with {len(self.cities)} cities: {list(self.cities.keys())}"
