// Global variables
let network = null;
let nodes = null;
let edges = null;
let data = null;
let lastResult = null;
let physicsEnabled = true;

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
            size: 25,
            font: {
                size: 12,
                color: '#2d3748',
                strokeWidth: 2,
                strokeColor: '#ffffff'
            },
            borderWidth: 3,
            shadow: {
                enabled: true,
                color: 'rgba(0,0,0,0.2)',
                size: 5,
                x: 2,
                y: 2
            },
            color: {
                border: '#4a5568',
                background: '#e2e8f0',
                highlight: {
                    border: '#2b6cb0',
                    background: '#bee3f8'
                },
                hover: {
                    border: '#2b6cb0',
                    background: '#bee3f8'
                }
            },
            margin: 10,
            scaling: {
                min: 15,
                max: 35
            }
        },
        edges: {
            width: 3,
            color: {
                color: '#718096',
                highlight: '#2b6cb0',
                hover: '#2b6cb0'
            },
            smooth: {
                type: 'continuous',
                forceDirection: 'none',
                roundness: 0.3
            },
            font: {
                size: 9,
                color: '#2d3748',
                strokeWidth: 3,
                strokeColor: '#ffffff',
                background: 'rgba(255,255,255,0.95)',
                border: '2px solid #e2e8f0',
                borderRadius: 6,
                padding: 4
            },
            arrows: {
                to: {
                    enabled: false
                }
            },
            selectionWidth: 4,
            hoverWidth: 4,
            labelHighlightBold: false
        },
        physics: {
            enabled: true,
            stabilization: { 
                iterations: 200,
                updateInterval: 25,
                onlyDynamicEdges: false,
                fit: true
            },
            barnesHut: {
                gravitationalConstant: -2000,
                centralGravity: 0.1,
                springLength: 120,
                springConstant: 0.04,
                damping: 0.09,
                avoidOverlap: 0.5
            },
            maxVelocity: 50,
            minVelocity: 0.1,
            solver: 'barnesHut',
            timestep: 0.35,
            adaptiveTimestep: true
        },
        interaction: {
            dragNodes: true,
            dragView: true,
            zoomView: true,
            hover: true,
            hoverConnectedEdges: true,
            selectConnectedEdges: false,
            multiselect: false,
            navigationButtons: true,
            keyboard: true
        },
        layout: {
            improvedLayout: true,
            clusterThreshold: 150,
            hierarchical: {
                enabled: false,
                levelSeparation: 150,
                nodeSpacing: 100,
                treeSpacing: 200,
                blockShifting: true,
                edgeMinimization: true,
                parentCentralization: true,
                direction: 'UD',
                sortMethod: 'directed'
            }
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

    // Add stabilization complete event to apply better layout
    network.on('stabilizationIterationsDone', function() {
        applyBetterLayout();
    });

    // Add click event to reset view
    network.on('click', function(params) {
        if (params.nodes.length === 0) {
            resetGraphStyles();
        }
    });
}

// Apply better layout algorithm for improved organization
function applyBetterLayout() {
    if (!network || nodes.length === 0) return;
    
    // Get current positions
    const positions = network.getPositions();
    const nodeIds = Object.keys(positions);
    
    if (nodeIds.length === 0) return;
    
    // Calculate center point
    let centerX = 0, centerY = 0;
    nodeIds.forEach(id => {
        centerX += positions[id].x;
        centerY += positions[id].y;
    });
    centerX /= nodeIds.length;
    centerY /= nodeIds.length;
    
    // Apply hierarchical circular layout for better organization
    const baseRadius = Math.max(250, nodeIds.length * 20);
    
    // Group nodes by connectivity (degree)
    const nodeConnections = {};
    nodeIds.forEach(id => {
        nodeConnections[id] = edges.get().filter(edge => 
            edge.from === id || edge.to === id
        ).length;
    });
    
    // Sort nodes by connectivity (most connected in center)
    const sortedNodes = nodeIds.sort((a, b) => nodeConnections[b] - nodeConnections[a]);
    
    const newPositions = {};
    const innerCircle = Math.min(8, Math.ceil(sortedNodes.length / 3));
    
    // Place most connected nodes in inner circle
    sortedNodes.slice(0, innerCircle).forEach((id, index) => {
        const angle = (index * 2 * Math.PI) / innerCircle;
        newPositions[id] = {
            x: centerX + (baseRadius * 0.4) * Math.cos(angle),
            y: centerY + (baseRadius * 0.4) * Math.sin(angle)
        };
    });
    
    // Place remaining nodes in outer circle with better spacing
    const outerNodes = sortedNodes.slice(innerCircle);
    const outerRadius = baseRadius * 0.8;
    const angleStep = (2 * Math.PI) / outerNodes.length;
    
    outerNodes.forEach((id, index) => {
        const angle = index * angleStep;
        // Add some variation to prevent perfect alignment
        const variation = (Math.random() - 0.5) * 50;
        newPositions[id] = {
            x: centerX + outerRadius * Math.cos(angle) + variation,
            y: centerY + outerRadius * Math.sin(angle) + variation
        };
    });
    
    // Apply the new positions with animation
    network.setOptions({
        physics: {
            enabled: false
        }
    });
    
    // Update positions
    nodes.update(nodeIds.map(id => ({
        id: id,
        x: newPositions[id].x,
        y: newPositions[id].y,
        fixed: false
    })));
    
    // Re-enable physics with better settings
    setTimeout(() => {
        network.setOptions({
            physics: {
                enabled: true,
                stabilization: { iterations: 100 },
                barnesHut: {
                    gravitationalConstant: -1500,
                    centralGravity: 0.03,
                    springLength: 150,
                    springConstant: 0.015,
                    damping: 0.15,
                    avoidOverlap: 1.0
                }
            }
        });
    }, 200);
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
        
        // Apply better layout after a short delay
        setTimeout(() => {
            applyBetterLayout();
        }, 500);
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
            lastResult = result;
            applyExplorationVisualization();
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
            ${result.expansionOrder ? `<div class="explanation">Expansion order: ${result.expansionOrder.join(' → ')}</div>` : ''}
        </div>
    `;
}

function resetGraphStyles() {
    const toRemove = [];
    edges.forEach(e => { if (e.overlay === true) toRemove.push(e.id); });
    if (toRemove.length) edges.remove(toRemove);
    edges.forEach(edge => {
        edges.update({ 
            id: edge.id, 
            color: { color: '#718096', highlight: '#2b6cb0' }, 
            width: 3, 
            dashes: false, 
            arrows: { to: { enabled: false } },
            font: {
                size: 9,
                color: '#2d3748',
                strokeWidth: 3,
                strokeColor: '#ffffff',
                background: 'rgba(255,255,255,0.95)',
                border: '2px solid #e2e8f0',
                borderRadius: 6,
                padding: 4
            }
        });
    });
    nodes.forEach(node => {
        nodes.update({ 
            id: node.id, 
            color: { 
                border: '#4a5568', 
                background: '#e2e8f0', 
                highlight: { border: '#2b6cb0', background: '#bee3f8' } 
            }, 
            title: node.label,
            size: 25
        });
    });
}

function applyExplorationVisualization() {
    if (!lastResult) return;
    resetGraphStyles();
    const showTree = document.getElementById('showExplorationTree')?.checked;
    const path = lastResult.path || [];
    const pathSet = new Set(path);
    const expansion = lastResult.expansionOrder || [];
    const visitedSet = new Set(expansion.length ? expansion : Object.keys(lastResult.parents || {}));
    const parents = lastResult.parents || {};
    
    // Color visited nodes (but not path nodes)
    visitedSet.forEach(city => {
        if (pathSet.has(city)) return;
        nodes.update({ 
            id: city, 
            color: { 
                border: '#f59e0b', 
                background: '#fde68a', 
                highlight: { border: '#f59e0b', background: '#fde68a' } 
            }, 
            title: `${city} (visited${expansion.length ? ` #${expansion.indexOf(city)+1}` : ''})`,
            size: 25
        });
    });
    
    // Color path nodes with distinct colors for start and end
    path.forEach((city, idx) => {
        let nodeColor;
        let nodeSize = 30;
        
        if (idx === 0) {
            // Starting node - bright green
            nodeColor = { 
                border: '#059669', 
                background: '#10b981', 
                highlight: { border: '#047857', background: '#34d399' }
            };
        } else if (idx === path.length - 1) {
            // Ending node - bright red
            nodeColor = { 
                border: '#dc2626', 
                background: '#ef4444', 
                highlight: { border: '#b91c1c', background: '#f87171' }
            };
        } else {
            // Intermediate nodes - blue
            nodeColor = { 
                border: '#2563eb', 
                background: '#3b82f6', 
                highlight: { border: '#1d4ed8', background: '#60a5fa' }
            };
        }
        
        nodes.update({ 
            id: city, 
            color: nodeColor, 
            size: nodeSize,
            title: `${city} ${idx===0?'(START)':''} ${idx===path.length-1?'(END)':''} ${idx>0 && idx<path.length-1?'(PATH)':''}`.trim() 
        });
    });
    
    // Highlight path edges
    for (let i = 0; i < path.length - 1; i++) {
        const a = path[i], b = path[i+1];
        edges.forEach(edge => {
            if ((edge.from === a && edge.to === b) || (edge.from === b && edge.to === a)) {
                edges.update({ 
                    id: edge.id, 
                    color: { color: '#dc2626', highlight: '#dc2626' }, 
                    width: 5,
                    font: {
                        color: '#dc2626',
                        strokeColor: '#ffffff',
                        background: 'rgba(255,255,255,0.95)',
                        border: '2px solid #dc2626'
                    }
                });
            }
        });
    }
    
    // Show exploration tree if enabled
    if (showTree && parents) {
        Object.keys(parents).forEach(child => {
            const parent = parents[child];
            if (!parent) return;
            edges.add({ 
                id: `tree-${parent}-${child}-${Date.now()}-${Math.random()}`, 
                from: parent, 
                to: child, 
                arrows: { to: { enabled: true, scaleFactor: 0.8 } }, 
                dashes: true, 
                color: { color: '#8b5cf6' }, 
                width: 2, 
                overlay: true, 
                smooth: { enabled: false } 
            });
        });
    }
    
    if (path.length) network.fit({ nodes: path, animation: true, maxZoomLevel: 2 });
}

// Render or clear the exploration tree overlay
// Use edges dataset for tree overlay; no canvas drawing functions

// Toggle exploration tree overlay
document.addEventListener('change', function(e) {
    if (e.target && e.target.id === 'showExplorationTree') {
        applyExplorationVisualization();
    }
});

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

// Toggle physics simulation
function togglePhysics() {
    if (!network) return;
    
    physicsEnabled = !physicsEnabled;
    const button = document.querySelector('.physics-btn');
    
    network.setOptions({
        physics: {
            enabled: physicsEnabled,
            stabilization: physicsEnabled ? { iterations: 100 } : false,
            barnesHut: physicsEnabled ? {
                gravitationalConstant: -1000,
                centralGravity: 0.05,
                springLength: 100,
                springConstant: 0.02,
                damping: 0.1,
                avoidOverlap: 0.8
            } : false
        }
    });
    
    if (physicsEnabled) {
        button.textContent = '⚡ Disable Physics';
        button.style.background = 'linear-gradient(135deg, #ff6b6b 0%, #ee5a24 100%)';
        showMessage('Physics simulation enabled', 'success');
    } else {
        button.textContent = '⚡ Enable Physics';
        button.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
        showMessage('Physics simulation disabled', 'success');
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
