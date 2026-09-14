// Global variables
let network = null;
let nodes = null;
let edges = null;
let data = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    initializeNetwork();
    loadGraphData();
    loadSavedFiles();
});

// Initialize the network visualization
function initializeNetwork() {
    const container = document.getElementById('network');
    
    // Create an array with nodes
    nodes = new vis.DataSet([]);
    
    // Create an array with edges
    edges = new vis.DataSet([]);
    
    // Create a network
    data = {
        nodes: nodes,
        edges: edges
    };
    
    const options = {
        nodes: {
            shape: 'circle',
            size: 20,
            font: {
                size: 14,
                color: '#343434'
            },
            borderWidth: 2,
            shadow: true,
            color: {
                border: '#2B7CE9',
                background: '#97C2FC',
                highlight: {
                    border: '#2B7CE9',
                    background: '#D2E5FF'
                }
            }
        },
        edges: {
            width: 2,
            color: {
                color: '#848484',
                highlight: '#848484'
            },
            smooth: {
                type: 'continuous'
            },
            font: {
                size: 12,
                color: '#343434'
            },
            arrows: {
                to: {
                    enabled: false
                }
            }
        },
        physics: {
            enabled: true,
            stabilization: { iterations: 100 }
        },
        interaction: {
            dragNodes: true,
            dragView: true,
            zoomView: true
        }
    };
    
    network = new vis.Network(container, data, options);
    
    // Add event listeners
    network.on('selectNode', function(params) {
        if (params.nodes.length > 0) {
            const selectedNode = params.nodes[0];
            highlightNode(selectedNode);
        }
    });
}

// Load graph data from server
async function loadGraphData() {
    try {
        const response = await fetch('/api/get_graph');
        const graphData = await response.json();
        
        nodes.clear();
        edges.clear();
        
        nodes.add(graphData.nodes);
        edges.add(graphData.edges);
        
        updateCitySelects();
    } catch (error) {
        console.error('Error loading graph:', error);
        showMessage('Error loading graph data', 'error');
    }
}

// Add a new city
async function addCity() {
    const cityName = document.getElementById('cityName').value.trim();
    
    if (!cityName) {
        showMessage('Please enter a city name', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/add_city', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ name: cityName })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage(result.message, 'success');
            document.getElementById('cityName').value = '';
            loadGraphData();
        } else {
            showMessage(result.error, 'error');
        }
    } catch (error) {
        console.error('Error adding city:', error);
        showMessage('Error adding city', 'error');
    }
}

// Add a connection between cities
async function addConnection() {
    const fromCity = document.getElementById('fromCity').value;
    const toCity = document.getElementById('toCity').value;
    const distance = document.getElementById('distance').value;
    
    if (!fromCity || !toCity || !distance) {
        showMessage('Please fill in all connection fields', 'error');
        return;
    }
    
    if (fromCity === toCity) {
        showMessage('Cannot connect a city to itself', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/add_connection', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                from: fromCity,
                to: toCity,
                distance: parseFloat(distance)
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage(result.message, 'success');
            document.getElementById('distance').value = '';
            loadGraphData();
        } else {
            showMessage(result.error, 'error');
        }
    } catch (error) {
        console.error('Error adding connection:', error);
        showMessage('Error adding connection', 'error');
    }
}

// Find path using selected algorithm
async function findPath() {
    const startCity = document.getElementById('startCity').value;
    const endCity = document.getElementById('endCity').value;
    const algorithm = document.getElementById('algorithm').value;
    
    if (!startCity || !endCity || !algorithm) {
        showMessage('Please select start city, end city, and algorithm', 'error');
        return;
    }
    
    if (startCity === endCity) {
        showMessage('Start and end cities must be different', 'error');
        return;
    }
    
    // Show loading
    const resultContent = document.getElementById('resultContent');
    resultContent.innerHTML = '<div class="loading"></div> Finding path...';
    
    try {
        const response = await fetch('/api/find_path', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                start: startCity,
                end: endCity,
                algorithm: algorithm
            })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            displayResult(result);
            highlightPath(result.path);
        } else {
            showMessage(result.error, 'error');
            resultContent.innerHTML = '<p>Add cities and connections, then select an algorithm to find paths!</p>';
        }
    } catch (error) {
        console.error('Error finding path:', error);
        showMessage('Error finding path', 'error');
        resultContent.innerHTML = '<p>Add cities and connections, then select an algorithm to find paths!</p>';
    }
}

// Clear the entire graph
async function clearGraph() {
    if (!confirm('Are you sure you want to clear the entire graph? This action cannot be undone.')) {
        return;
    }
    
    try {
        const response = await fetch('/api/clear_graph', {
            method: 'POST'
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage(result.message, 'success');
            loadGraphData();
            document.getElementById('resultContent').innerHTML = '<p>Add cities and connections, then select an algorithm to find paths!</p>';
        } else {
            showMessage('Error clearing graph', 'error');
        }
    } catch (error) {
        console.error('Error clearing graph:', error);
        showMessage('Error clearing graph', 'error');
    }
}

// Update city select dropdowns
function updateCitySelects() {
    const citySelects = ['fromCity', 'toCity', 'startCity', 'endCity'];
    
    citySelects.forEach(selectId => {
        const select = document.getElementById(selectId);
        const currentValue = select.value;
        
        // Clear existing options except the first one
        select.innerHTML = select.innerHTML.split('</option>')[0] + '</option>';
        
        // Add cities from the graph
        nodes.forEach(node => {
            const option = document.createElement('option');
            option.value = node.id;
            option.textContent = node.label;
            select.appendChild(option);
        });
        
        // Restore previous selection if it still exists
        if (currentValue && Array.from(select.options).some(option => option.value === currentValue)) {
            select.value = currentValue;
        }
    });
}

// Display pathfinding result
function displayResult(result) {
    const resultContent = document.getElementById('resultContent');
    
    if (result.error) {
        resultContent.innerHTML = `
            <div class="error-result">
                <h4>❌ ${result.algorithm}</h4>
                <p>${result.error}</p>
            </div>
        `;
        return;
    }
    
    const pathString = result.path.join(' → ');
    const cost = result.cost.toFixed(2);
    
    resultContent.innerHTML = `
        <div class="path-result">
            <h4>✅ ${result.algorithm}</h4>
            <div class="path">${pathString}</div>
            <div class="cost">Total Cost: ${cost}</div>
            ${result.explanation ? `<div class="explanation">${result.explanation}</div>` : ''}
        </div>
    `;
}

// Highlight the found path on the network
function highlightPath(path) {
    if (!path || path.length < 2) return;
    
    // Reset all edges to default color
    edges.forEach(edge => {
        edges.update({
            id: edge.id,
            color: {
                color: '#848484',
                highlight: '#848484'
            },
            width: 2
        });
    });
    
    // Reset all nodes to default color
    nodes.forEach(node => {
        nodes.update({
            id: node.id,
            color: {
                border: '#2B7CE9',
                background: '#97C2FC',
                highlight: {
                    border: '#2B7CE9',
                    background: '#D2E5FF'
                }
            }
        });
    });
    
    // Highlight path edges
    for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];
        
        // Find and highlight the edge
        edges.forEach(edge => {
            if ((edge.from === from && edge.to === to) || (edge.from === to && edge.to === from)) {
                edges.update({
                    id: edge.id,
                    color: {
                        color: '#ff6b6b',
                        highlight: '#ff6b6b'
                    },
                    width: 4
                });
            }
        });
    }
    
    // Highlight path nodes
    path.forEach(city => {
        nodes.update({
            id: city,
            color: {
                border: '#ff6b6b',
                background: '#ffb3b3',
                highlight: {
                    border: '#ff6b6b',
                    background: '#ffb3b3'
                }
            }
        });
    });
    
    // Fit the network to show the highlighted path
    network.fit();
}

// Highlight a specific node
function highlightNode(nodeId) {
    nodes.update({
        id: nodeId,
        color: {
            border: '#ff6b6b',
            background: '#ffb3b3',
            highlight: {
                border: '#ff6b6b',
                background: '#ffb3b3'
            }
        }
    });
}

// Show success/error messages
function showMessage(message, type) {
    // Remove existing messages
    const existingMessages = document.querySelectorAll('.message');
    existingMessages.forEach(msg => msg.remove());
    
    // Create new message
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${type}`;
    messageDiv.textContent = message;
    
    // Insert at the top of the control panel
    const controlPanel = document.querySelector('.control-panel');
    controlPanel.insertBefore(messageDiv, controlPanel.firstChild);
    
    // Auto-remove after 5 seconds
    setTimeout(() => {
        if (messageDiv.parentNode) {
            messageDiv.remove();
        }
    }, 5000);
}

// Save graph to file
async function saveGraph() {
    const filename = document.getElementById('saveFilename').value.trim();
    
    if (!filename) {
        showMessage('Please enter a filename', 'error');
        return;
    }
    
    // Check if graph has any data
    if (nodes.length === 0) {
        showMessage('Cannot save empty graph', 'error');
        return;
    }
    
    try {
        const response = await fetch('/api/save_graph', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filename: filename })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage(result.message, 'success');
            document.getElementById('saveFilename').value = '';
            loadSavedFiles(); // Refresh the load dropdown
        } else {
            showMessage(result.error, 'error');
        }
    } catch (error) {
        console.error('Error saving graph:', error);
        showMessage('Error saving graph', 'error');
    }
}

// Load graph from file
async function loadGraph() {
    const filename = document.getElementById('loadFilename').value;
    
    if (!filename) {
        showMessage('Please select a file to load', 'error');
        return;
    }
    
    if (!confirm('Loading a graph will replace your current graph. Continue?')) {
        return;
    }
    
    try {
        const response = await fetch('/api/load_graph', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filename: filename })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage(result.message, 'success');
            loadGraphData(); // Reload the visualization
            document.getElementById('resultContent').innerHTML = '<p>Graph loaded! Select cities and algorithm to find paths.</p>';
        } else {
            showMessage(result.error, 'error');
        }
    } catch (error) {
        console.error('Error loading graph:', error);
        showMessage('Error loading graph', 'error');
    }
}

// Load list of saved files
async function loadSavedFiles() {
    try {
        const response = await fetch('/api/get_saved_files');
        const result = await response.json();
        
        const loadSelect = document.getElementById('loadFilename');
        loadSelect.innerHTML = '<option value="">Select file to load</option>';
        
        if (result.files && result.files.length > 0) {
            result.files.forEach(file => {
                const option = document.createElement('option');
                option.value = file.filename;
                option.textContent = `${file.filename} (${formatFileSize(file.size)})`;
                loadSelect.appendChild(option);
            });
        } else {
            const option = document.createElement('option');
            option.value = '';
            option.textContent = 'No saved files found';
            option.disabled = true;
            loadSelect.appendChild(option);
        }
    } catch (error) {
        console.error('Error loading saved files:', error);
    }
}

// Format file size for display
function formatFileSize(bytes) {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Allow Enter key to submit forms
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        const target = e.target;
        if (target.id === 'cityName') {
            addCity();
        } else if (target.id === 'distance') {
            addConnection();
        } else if (target.id === 'saveFilename') {
            saveGraph();
        }
    }
});
