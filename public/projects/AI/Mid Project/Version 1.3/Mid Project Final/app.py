from flask import Flask, render_template, request, jsonify
import json
from algorithms import PathfindingAlgorithms
from graph import Graph

app = Flask(__name__)

# Initialize the graph and algorithms
graph = Graph()
algorithms = PathfindingAlgorithms()

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/add_city', methods=['POST'])
def add_city():
    data = request.json
    city_name = data.get('name')
    
    if not city_name:
        return jsonify({'error': 'City name is required'}), 400
    
    if graph.add_city(city_name):
        return jsonify({'message': f'City {city_name} added successfully'})
    else:
        return jsonify({'error': f'City {city_name} already exists'}), 400

@app.route('/api/add_connection', methods=['POST'])
def add_connection():
    data = request.json
    from_city = data.get('from')
    to_city = data.get('to')
    distance = data.get('distance')
    
    if not all([from_city, to_city, distance]):
        return jsonify({'error': 'All fields (from, to, distance) are required'}), 400
    
    try:
        distance = float(distance)
        if distance <= 0:
            return jsonify({'error': 'Distance must be positive'}), 400
    except ValueError:
        return jsonify({'error': 'Distance must be a valid number'}), 400
    
    if graph.add_connection(from_city, to_city, distance):
        return jsonify({'message': f'Connection added: {from_city} -> {to_city} ({distance})'})
    else:
        return jsonify({'error': 'One or both cities do not exist'}), 400

@app.route('/api/get_graph', methods=['GET'])
def get_graph():
    return jsonify(graph.get_graph_data())

@app.route('/api/find_path', methods=['POST'])
def find_path():
    data = request.json
    start_city = data.get('start')
    end_city = data.get('end')
    algorithm = data.get('algorithm')
    
    if not all([start_city, end_city, algorithm]):
        return jsonify({'error': 'Start city, end city, and algorithm are required'}), 400
    
    if start_city not in graph.cities or end_city not in graph.cities:
        return jsonify({'error': 'One or both cities do not exist'}), 400
    
    try:
        result = algorithms.find_path(graph, start_city, end_city, algorithm)
        return jsonify(result)
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/clear_graph', methods=['POST'])
def clear_graph():
    graph.clear()
    return jsonify({'message': 'Graph cleared successfully'})

@app.route('/api/save_graph', methods=['POST'])
def save_graph():
    data = request.json
    filename = data.get('filename')
    
    if not filename:
        return jsonify({'error': 'Filename is required'}), 400
    
    # Ensure filename has .json extension
    if not filename.endswith('.json'):
        filename += '.json'
    
    success, message = graph.save_to_file(filename)
    
    if success:
        return jsonify({'message': message})
    else:
        return jsonify({'error': message}), 500

@app.route('/api/load_graph', methods=['POST'])
def load_graph():
    data = request.json
    filename = data.get('filename')
    
    if not filename:
        return jsonify({'error': 'Filename is required'}), 400
    
    success, message = graph.load_from_file(filename)
    
    if success:
        return jsonify({'message': message})
    else:
        return jsonify({'error': message}), 500

@app.route('/api/get_saved_files', methods=['GET'])
def get_saved_files():
    files = graph.get_saved_files()
    return jsonify({'files': files})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
