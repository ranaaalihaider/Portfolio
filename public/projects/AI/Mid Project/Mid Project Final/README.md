# 🗺️ Pathfinding Algorithms Visualizer

A web-based application that allows you to create graphs of cities and find optimal paths using various pathfinding algorithms.

## Features

### 🏙️ Graph Management
- Add cities to your graph
- Create connections between cities with distances
- Visual graph representation with interactive nodes and edges
- **Save and load graphs** - Persist your work between sessions
- Clear entire graph functionality

### 🧠 Pathfinding Algorithms
- **Breadth-First Search (BFS)** - Finds shortest path in terms of number of edges
- **Depth-First Search (DFS)** - Explores as far as possible along each branch
- **Dijkstra's Algorithm** - Finds shortest path in terms of total distance
- **A* Search** - Combines Dijkstra with heuristic function
- **Greedy Best-First Search** - Always chooses the node closest to the goal
- **Genetic Algorithm** - Uses evolution-inspired techniques
- **Simulated Annealing** - Uses probabilistic acceptance to escape local optima

### 🎨 User Interface
- Modern, responsive web interface
- Interactive graph visualization
- Real-time path highlighting
- Algorithm explanations and information
- Mobile-friendly design

## Installation

1. **Clone or download the project files**

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Run the application:**
   ```bash
   python app.py
   ```

4. **Open your browser and go to:**
   ```
   http://localhost:5000
   ```

## How to Use

### 1. Add Cities
- Enter a city name in the "Add Cities" section
- Click "Add City" to add it to your graph

### 2. Create Connections
- Select a "from" city and "to" city
- Enter the distance between them
- Click "Add Connection" to create the link

### 3. Save Your Work
- Enter a filename in the "Save & Load" section
- Click "💾 Save Graph" to save your current graph
- Files are saved in the `saved_graphs` folder

### 4. Load Previous Work
- Select a saved file from the dropdown
- Click "📂 Load Graph" to restore your graph
- Your graph will be restored exactly as you saved it

### 5. Find Paths
- Select a start city and end city
- Choose your preferred algorithm
- Click "Find Path" to see the result

### 6. View Results
- The optimal path will be highlighted on the graph
- Path details, cost, and algorithm explanation will be shown
- Compare different algorithms on the same graph

## Project Structure

```
pathfinding-visualizer/
├── app.py                 # Flask web application
├── graph.py              # Graph data structure with save/load
├── algorithms.py         # All pathfinding algorithms
├── requirements.txt      # Python dependencies
├── saved_graphs/         # Directory for saved graph files
├── templates/
│   └── index.html       # Main web interface
└── static/
    ├── style.css        # Styling
    └── script.js        # Frontend JavaScript
```

## Algorithm Details

### Uninformed Search
- **BFS**: Explores all nodes at current depth before moving to next level
- **DFS**: Explores as far as possible along each branch before backtracking

### Heuristic Search
- **A***: Combines Dijkstra with heuristic function for efficiency
- **Greedy Best-First**: Always chooses the node that appears closest to the goal

### Optimization-Based
- **Genetic Algorithm**: Uses crossover and mutation to evolve better solutions
- **Simulated Annealing**: Uses probabilistic acceptance to escape local optima

## Technical Details

- **Backend**: Python Flask
- **Frontend**: HTML5, CSS3, JavaScript
- **Visualization**: vis.js network library
- **Data Structure**: Adjacency list representation
- **Algorithms**: Implemented from scratch with detailed explanations

## Example Usage

1. Add cities: "New York", "Boston", "Philadelphia", "Washington"
2. Add connections:
   - New York ↔ Boston (200 miles)
   - New York ↔ Philadelphia (100 miles)
   - Boston ↔ Washington (400 miles)
   - Philadelphia ↔ Washington (150 miles)
3. Find path from New York to Washington using Dijkstra's algorithm
4. Compare with other algorithms to see different approaches

## Contributing

Feel free to add more algorithms, improve the UI, or enhance the visualization features!

## License

This project is open source and available under the MIT License.
