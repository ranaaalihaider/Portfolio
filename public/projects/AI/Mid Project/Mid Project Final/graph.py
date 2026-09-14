import json
import os
from datetime import datetime

class Graph:
    def __init__(self):
        self.cities = {}  # Dictionary to store cities and their connections
        self.connections = {}  # Dictionary to store all connections with distances
    
    def add_city(self, city_name):
        """Add a new city to the graph"""
        if not city_name or not isinstance(city_name, str):
            return False
        
        # Trim whitespace
        city_name = city_name.strip()
        
        if not city_name:
            return False
        
        if city_name in self.cities:
            return False
        
        self.cities[city_name] = []
        self.connections[city_name] = {}
        return True
    
    def remove_city(self, city_name):
        """Remove a city and all its connections"""
        if city_name not in self.cities:
            return False
        
        # Remove all connections to this city from other cities
        for other_city in list(self.cities.keys()):
            if other_city != city_name:
                if city_name in self.cities[other_city]:
                    self.cities[other_city].remove(city_name)
                if city_name in self.connections[other_city]:
                    del self.connections[other_city][city_name]
        
        # Remove the city itself
        del self.cities[city_name]
        del self.connections[city_name]
        return True
    
    def add_connection(self, from_city, to_city, distance):
        """Add a connection between two cities with a distance"""
        # Validation
        if from_city not in self.cities or to_city not in self.cities:
            return False
        
        if from_city == to_city:
            return False  # No self-loops
        
        try:
            distance = float(distance)
            if distance <= 0:
                return False
        except (ValueError, TypeError):
            return False
        
        # Check if connection already exists - if so, update it
        if to_city in self.cities[from_city]:
            # Connection exists, just update the distance
            self.connections[from_city][to_city] = distance
            self.connections[to_city][from_city] = distance
            return True
        
        # Add new connection in both directions (undirected graph)
        self.cities[from_city].append(to_city)
        self.cities[to_city].append(from_city)
        
        # Store distances
        self.connections[from_city][to_city] = distance
        self.connections[to_city][from_city] = distance
        
        return True
    
    def remove_connection(self, from_city, to_city):
        """Remove a connection between two cities"""
        if from_city not in self.cities or to_city not in self.cities:
            return False
        
        # Remove connection in both directions
        if to_city in self.cities[from_city]:
            self.cities[from_city].remove(to_city)
        
        if from_city in self.cities[to_city]:
            self.cities[to_city].remove(from_city)
        
        # Remove distances
        if to_city in self.connections.get(from_city, {}):
            del self.connections[from_city][to_city]
        
        if from_city in self.connections.get(to_city, {}):
            del self.connections[to_city][from_city]
        
        return True
    
    def update_connection(self, from_city, to_city, new_distance):
        """Update the distance of an existing connection"""
        if from_city not in self.cities or to_city not in self.cities:
            return False
        
        if to_city not in self.cities[from_city]:
            return False
        
        try:
            new_distance = float(new_distance)
            if new_distance <= 0:
                return False
        except (ValueError, TypeError):
            return False
        
        # Update distances in both directions
        self.connections[from_city][to_city] = new_distance
        self.connections[to_city][from_city] = new_distance
        
        return True
    
    def get_neighbors(self, city):
        """Get all neighbors of a city"""
        return self.cities.get(city, [])
    
    def get_distance(self, from_city, to_city):
        """Get distance between two cities"""
        return self.connections.get(from_city, {}).get(to_city, float('inf'))
    
    def city_exists(self, city_name):
        """Check if a city exists in the graph"""
        return city_name in self.cities
    
    def connection_exists(self, from_city, to_city):
        """Check if a connection exists between two cities"""
        return (from_city in self.cities and 
                to_city in self.cities and 
                to_city in self.cities[from_city])
    
    def get_all_cities(self):
        """Get list of all cities"""
        return list(self.cities.keys())
    
    def get_city_count(self):
        """Get the number of cities in the graph"""
        return len(self.cities)
    
    def get_connection_count(self):
        """Get the number of connections (edges) in the graph"""
        # Count unique connections (undirected graph)
        count = 0
        counted = set()
        for from_city, neighbors in self.cities.items():
            for to_city in neighbors:
                edge = tuple(sorted([from_city, to_city]))
                if edge not in counted:
                    counted.add(edge)
                    count += 1
        return count
    
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
    
    def get_graph_statistics(self):
        """Get statistics about the graph"""
        stats = {
            'cities': len(self.cities),
            'connections': self.get_connection_count(),
            'isolated_cities': 0,
            'max_connections': 0,
            'min_connections': float('inf') if self.cities else 0,
            'avg_connections': 0
        }
        
        if not self.cities:
            stats['min_connections'] = 0
            return stats
        
        total_connections = 0
        for city, neighbors in self.cities.items():
            num_neighbors = len(neighbors)
            total_connections += num_neighbors
            
            if num_neighbors == 0:
                stats['isolated_cities'] += 1
            
            stats['max_connections'] = max(stats['max_connections'], num_neighbors)
            stats['min_connections'] = min(stats['min_connections'], num_neighbors)
        
        stats['avg_connections'] = round(total_connections / len(self.cities), 2)
        
        return stats
    
    def is_connected(self):
        """Check if the graph is connected (all cities are reachable from any city)"""
        if not self.cities:
            return True
        
        # BFS from first city
        start = next(iter(self.cities))
        visited = {start}
        queue = [start]
        
        while queue:
            current = queue.pop(0)
            for neighbor in self.get_neighbors(current):
                if neighbor not in visited:
                    visited.add(neighbor)
                    queue.append(neighbor)
        
        return len(visited) == len(self.cities)
    
    def clear(self):
        """Clear all cities and connections"""
        self.cities.clear()
        self.connections.clear()
    
    def validate_graph_integrity(self):
        """Validate the internal consistency of the graph data structure"""
        errors = []
        
        # Check that all cities in connections are in cities dict
        for city in self.connections:
            if city not in self.cities:
                errors.append(f"City '{city}' in connections but not in cities")
        
        # Check that all neighbors have reciprocal connections
        for city, neighbors in self.cities.items():
            for neighbor in neighbors:
                if neighbor not in self.cities:
                    errors.append(f"Neighbor '{neighbor}' of '{city}' does not exist")
                    continue
                
                # Check reciprocal connection
                if city not in self.cities.get(neighbor, []):
                    errors.append(f"Missing reciprocal connection: '{neighbor}' -> '{city}'")
                
                # Check distance symmetry
                dist1 = self.connections.get(city, {}).get(neighbor)
                dist2 = self.connections.get(neighbor, {}).get(city)
                
                if dist1 is None:
                    errors.append(f"Missing distance: '{city}' -> '{neighbor}'")
                elif dist2 is None:
                    errors.append(f"Missing distance: '{neighbor}' -> '{city}'")
                elif dist1 != dist2:
                    errors.append(f"Distance mismatch: '{city}' <-> '{neighbor}': {dist1} vs {dist2}")
        
        return errors
    
    def save_to_file(self, filename):
        """Save graph data to a JSON file"""
        try:
            # Validate graph integrity before saving
            errors = self.validate_graph_integrity()
            if errors:
                return False, f"Graph integrity errors: {'; '.join(errors[:3])}"
            
            data = {
                'cities': self.cities,
                'connections': self.connections,
                'metadata': {
                    'saved_at': datetime.now().isoformat(),
                    'city_count': len(self.cities),
                    'connection_count': self.get_connection_count()
                }
            }
            
            # Create data directory if it doesn't exist
            data_dir = 'saved_graphs'
            if not os.path.exists(data_dir):
                os.makedirs(data_dir)
            
            # Ensure filename has .json extension
            if not filename.endswith('.json'):
                filename += '.json'
            
            filepath = os.path.join(data_dir, filename)
            
            with open(filepath, 'w') as f:
                json.dump(data, f, indent=2)
            
            return True, f"Graph saved successfully to {filepath}"
        except Exception as e:
            return False, f"Error saving graph: {str(e)}"
    
    def load_from_file(self, filename):
        """Load graph data from a JSON file"""
        try:
            # Ensure filename has .json extension
            if not filename.endswith('.json'):
                filename += '.json'
            
            filepath = os.path.join('saved_graphs', filename)
            
            if not os.path.exists(filepath):
                return False, f"File {filepath} not found"
            
            with open(filepath, 'r') as f:
                data = json.load(f)
            
            # Validate data structure
            if 'cities' not in data or 'connections' not in data:
                return False, "Invalid file format: missing 'cities' or 'connections'"
            
            # Clear current graph
            self.clear()
            
            # Load cities
            if not isinstance(data['cities'], dict):
                return False, "Invalid cities data format"
            
            for city, neighbors in data['cities'].items():
                if not isinstance(neighbors, list):
                    return False, f"Invalid neighbors format for city '{city}'"
                self.cities[city] = neighbors.copy()
            
            # Load connections
            if not isinstance(data['connections'], dict):
                return False, "Invalid connections data format"
            
            for city, connections_dict in data['connections'].items():
                if city not in self.cities:
                    self.cities[city] = []
                
                if not isinstance(connections_dict, dict):
                    return False, f"Invalid connections format for city '{city}'"
                
                self.connections[city] = {}
                for neighbor, distance in connections_dict.items():
                    try:
                        self.connections[city][neighbor] = float(distance)
                    except (ValueError, TypeError):
                        return False, f"Invalid distance value for '{city}' -> '{neighbor}'"
            
            # Validate graph integrity after loading
            errors = self.validate_graph_integrity()
            if errors:
                self.clear()  # Clear invalid data
                return False, f"Loaded graph has integrity issues: {'; '.join(errors[:3])}"
            
            # Get metadata info
            metadata_info = ""
            if 'metadata' in data:
                metadata = data['metadata']
                if 'saved_at' in metadata:
                    metadata_info = f" (saved at {metadata['saved_at']})"
            
            return True, f"Graph loaded successfully from {filepath}{metadata_info}"
        except json.JSONDecodeError as e:
            return False, f"Invalid JSON format: {str(e)}"
        except Exception as e:
            self.clear()  # Clear any partially loaded data
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
                    
                    # Try to get metadata
                    try:
                        with open(filepath, 'r') as f:
                            data = json.load(f)
                            metadata = data.get('metadata', {})
                            saved_at = metadata.get('saved_at', 'Unknown')
                            city_count = metadata.get('city_count', 0)
                            connection_count = metadata.get('connection_count', 0)
                    except:
                        saved_at = 'Unknown'
                        city_count = 0
                        connection_count = 0
                    
                    files.append({
                        'filename': filename,
                        'size': file_size,
                        'path': filepath,
                        'saved_at': saved_at,
                        'city_count': city_count,
                        'connection_count': connection_count
                    })
            
            return sorted(files, key=lambda x: x['filename'])
        except Exception as e:
            print(f"Error getting saved files: {e}")
            return []
    
    def export_to_dict(self):
        """Export graph to a dictionary format"""
        return {
            'cities': self.cities.copy(),
            'connections': self.connections.copy()
        }
    
    def import_from_dict(self, data):
        """Import graph from a dictionary format"""
        try:
            if 'cities' not in data or 'connections' not in data:
                return False, "Invalid data format"
            
            self.clear()
            self.cities = data['cities'].copy()
            self.connections = data['connections'].copy()
            
            # Validate
            errors = self.validate_graph_integrity()
            if errors:
                self.clear()
                return False, f"Invalid graph data: {'; '.join(errors[:3])}"
            
            return True, "Graph imported successfully"
        except Exception as e:
            self.clear()
            return False, f"Error importing graph: {str(e)}"
    
    def clone(self):
        """Create a deep copy of the graph"""
        new_graph = Graph()
        new_graph.cities = {k: v.copy() for k, v in self.cities.items()}
        new_graph.connections = {k: v.copy() for k, v in self.connections.items()}
        return new_graph
    
    def __str__(self):
        """String representation of the graph"""
        return f"Graph with {len(self.cities)} cities and {self.get_connection_count()} connections"
    
    def __repr__(self):
        """Detailed representation of the graph"""
        return f"Graph(cities={len(self.cities)}, connections={self.get_connection_count()}, connected={self.is_connected()})"