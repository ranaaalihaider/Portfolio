// Global variables
let network = null;
let nodes = null;
let edges = null;
let data = null;
let lastResult = null;
let physicsEnabled = true;
let treeViewEnabled = false;
let windowNetwork = null;
let windowNodes = null;
let windowEdges = null;
let windowData = null;
let currentTreeDirection = 'up';
let currentTreeData = null;
let animationEnabled = false;
let darkModeEnabled = false;

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
    
    if (treeViewEnabled) {
        applyTreeLayout();
        return;
    }
    
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

// Apply tree layout similar to the reference image
function applyTreeLayout() {
    if (!network || nodes.length === 0) return;
    
    const nodeIds = nodes.getIds();
    if (nodeIds.length === 0) return;
    
    // Find a good root node (most connected or first node)
    const nodeConnections = {};
    nodeIds.forEach(id => {
        nodeConnections[id] = edges.get().filter(edge => 
            edge.from === id || edge.to === id
        ).length;
    });
    
    const rootNode = nodeIds.reduce((a, b) => nodeConnections[a] > nodeConnections[b] ? a : b);
    
    // Build proper tree structure with parent-child relationships
    const tree = buildProperTreeStructure(rootNode, nodeIds);
    currentTreeData = tree; // Store tree data for rotation
    
    // Calculate positions for tree layout
    const positions = calculateProperTreePositions(tree, rootNode, currentTreeDirection);
    
    // Disable physics for tree layout
    network.setOptions({
        physics: {
            enabled: false
        },
        layout: {
            hierarchical: {
                enabled: false  // We'll use our custom positioning
            }
        }
    });
    
    // Update positions with proper tree structure and level styling
    nodes.update(nodeIds.map(id => {
        const level = tree.levels[id] || 0;
        const levelClass = `tree-level-${level}`;
        
        return {
            id: id,
            x: positions[id] ? positions[id].x : 0,
            y: positions[id] ? positions[id].y : 0,
            fixed: true,
            color: {
                background: level === 0 ? '#1f2937' : level === 1 ? '#3b82f6' : '#8b5cf6',
                border: level === 0 ? '#111827' : level === 1 ? '#2563eb' : '#7c3aed',
                highlight: {
                    background: level === 0 ? '#374151' : level === 1 ? '#60a5fa' : '#a78bfa',
                    border: level === 0 ? '#1f2937' : level === 1 ? '#3b82f6' : '#8b5cf6'
                }
            },
            font: {
                size: level === 0 ? 16 : level === 1 ? 14 : 12,
                color: 'white',
                strokeWidth: 3,
                strokeColor: '#000000'
            },
            size: level === 0 ? 35 : level === 1 ? 30 : 25
        };
    }));
    
    // Add tree view styling
    document.getElementById('network').classList.add('tree-view-enabled');
    
    // Update edges to show proper tree structure
    updateTreeEdges(tree);
}

// Build proper tree structure with clear parent-child relationships
function buildProperTreeStructure(rootNode, allNodes) {
    const tree = {};
    const visited = new Set();
    const levels = {};
    const parentMap = {};
    
    // Initialize tree structure
    allNodes.forEach(node => {
        tree[node] = [];
        levels[node] = -1;
    });
    
    // BFS to assign levels and build tree
    const queue = [{ node: rootNode, level: 0, parent: null }];
    levels[rootNode] = 0;
    parentMap[rootNode] = null;
    
    while (queue.length > 0) {
        const { node: current, level, parent } = queue.shift();
        
        if (visited.has(current)) continue;
        visited.add(current);
        
        // Get all neighbors
        const neighbors = edges.get().filter(edge => 
            edge.from === current || edge.to === current
        ).map(edge => edge.from === current ? edge.to : edge.from);
        
        // Add unvisited neighbors as children
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor) && levels[neighbor] === -1) {
                levels[neighbor] = level + 1;
                parentMap[neighbor] = current;
                tree[current].push(neighbor);
                queue.push({ node: neighbor, level: level + 1, parent: current });
            }
        }
    }
    
    return { tree, levels, parentMap };
}

// Calculate positions for proper tree layout
function calculateProperTreePositions(treeData, rootNode, direction = 'up') {
    const { tree, levels } = treeData;
    const positions = {};
    const levelHeight = 250;
    const nodeSpacing = 200;
    
    // Group nodes by level
    const nodesByLevel = {};
    Object.keys(levels).forEach(node => {
        const level = levels[node];
        if (!nodesByLevel[level]) {
            nodesByLevel[level] = [];
        }
        nodesByLevel[level].push(node);
    });
    
    // Position nodes level by level based on direction
    Object.keys(nodesByLevel).sort((a, b) => parseInt(a) - parseInt(b)).forEach(level => {
        const levelNodes = nodesByLevel[level];
        const levelNum = parseInt(level);
        
        if (levelNum === 0) {
            // Root node at center
            positions[rootNode] = { x: 0, y: 0 };
        } else {
            // Calculate positions for this level based on direction
            const totalWidth = (levelNodes.length - 1) * nodeSpacing;
            const startX = -totalWidth / 2;
            
            levelNodes.forEach((node, index) => {
                let x, y;
                
                switch (direction) {
                    case 'up':
                        x = startX + index * nodeSpacing;
                        y = -levelNum * levelHeight;
                        break;
                    case 'down':
                        x = startX + index * nodeSpacing;
                        y = levelNum * levelHeight;
                        break;
                    case 'left':
                        x = -levelNum * levelHeight;
                        y = startX + index * nodeSpacing;
                        break;
                    case 'right':
                        x = levelNum * levelHeight;
                        y = startX + index * nodeSpacing;
                        break;
                    default:
                        x = startX + index * nodeSpacing;
                        y = -levelNum * levelHeight;
                }
                
                positions[node] = { x, y };
            });
        }
    });
    
    return positions;
}

// Update edges to show proper tree structure
function updateTreeEdges(treeData) {
    const { tree, parentMap } = treeData;
    
    // Remove all existing edges
    const allEdges = edges.get();
    const edgeIds = allEdges.map(edge => edge.id);
    if (edgeIds.length > 0) {
        edges.remove(edgeIds);
    }
    
    // Add tree edges (parent-child relationships only)
    Object.keys(parentMap).forEach(child => {
        const parent = parentMap[child];
        if (parent !== null) {
            // Find the original edge to get distance
            const originalEdge = allEdges.find(edge => 
                (edge.from === parent && edge.to === child) || 
                (edge.from === child && edge.to === parent)
            );
            
            const distance = originalEdge ? originalEdge.label : '1';
            
            edges.add({
                from: parent,
                to: child,
                label: distance,
                color: { color: '#059669', highlight: '#059669' },
                width: 4,
                arrows: { to: { enabled: true, scaleFactor: 0.8 } },
                font: {
                    size: 12,
                    color: '#059669',
                    strokeWidth: 3,
                    strokeColor: '#ffffff',
                    background: 'rgba(255,255,255,0.95)',
                    border: '2px solid #059669',
                    borderRadius: 6,
                    padding: 4
                }
            });
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
            
            // Apply animations if enabled
            if (animationEnabled) {
                setTimeout(() => {
                    applyAnimatedPathVisualization();
                }, 500);
            }
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
    
    let dfsExplanation = '';
    if (result.algorithm === 'Depth-First Search' && result.expansionOrder) {
        const visitedNotInPath = result.expansionOrder.filter(city => !result.path.includes(city));
        if (visitedNotInPath.length > 0) {
            dfsExplanation = `
                <div class="explanation" style="background: #fef3c7; border: 1px solid #f59e0b; padding: 10px; border-radius: 6px; margin-top: 10px;">
                    <strong>🔍 Why DFS visited extra cities:</strong><br>
                    DFS explores <strong>as far as possible</strong> along each branch before backtracking.<br>
                    It visited: <strong>${visitedNotInPath.join(', ')}</strong> but they weren't on the optimal path.<br>
                    This is normal DFS behavior - it explores all possibilities deeply!
                </div>
            `;
        }
    }

    resultContent.innerHTML = `
        <div class="path-result">
            <h4>✅ ${result.algorithm}</h4>
            <div class="path">${pathString}</div>
            <div class="cost">Total Cost: ${cost}</div>
            ${result.explanation ? `<div class="explanation">${result.explanation}</div>` : ''}
            ${result.expansionOrder ? `<div class="explanation">Expansion order: ${result.expansionOrder.join(' → ')}</div>` : ''}
            ${dfsExplanation}
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
                background: 'transparent', // Empty circles for unvisited
                highlight: { border: '#2b6cb0', background: 'transparent' } 
            }, 
            title: node.label,
            size: 25,
            shape: 'circle'
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
    
    // Color visited nodes (but not path nodes) - YELLOW
    visitedSet.forEach(city => {
        if (pathSet.has(city)) return;
        nodes.update({ 
            id: city, 
            color: { 
                border: '#f59e0b', 
                background: '#fde68a', // YELLOW for visited
                highlight: { border: '#f59e0b', background: '#fde68a' } 
            }, 
            title: `${city} (visited${expansion.length ? ` #${expansion.indexOf(city)+1}` : ''})`,
            size: 25
        });
    });
    
    // Color path nodes with improved color scheme
    path.forEach((city, idx) => {
        let nodeColor;
        let nodeSize = 30;
        
        if (idx === 0) {
            // Starting node - GREEN
            nodeColor = { 
                border: '#059669', 
                background: '#10b981', 
                highlight: { border: '#047857', background: '#34d399' }
            };
        } else if (idx === path.length - 1) {
            // Ending node - RED
            nodeColor = { 
                border: '#dc2626', 
                background: '#ef4444', 
                highlight: { border: '#b91c1c', background: '#f87171' }
            };
        } else {
            // Intermediate path nodes - BLUE
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
    
    // Highlight path edges - BLUE
    for (let i = 0; i < path.length - 1; i++) {
        const a = path[i], b = path[i+1];
        edges.forEach(edge => {
            if ((edge.from === a && edge.to === b) || (edge.from === b && edge.to === a)) {
                edges.update({ 
                    id: edge.id, 
                    color: { color: '#2563eb', highlight: '#2563eb' }, // BLUE for path
                    width: 5,
                    font: {
                        color: '#2563eb',
                        strokeColor: '#ffffff',
                        background: 'rgba(255,255,255,0.95)',
                        border: '2px solid #2563eb'
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

// Toggle tree view
function toggleTreeView() {
    treeViewEnabled = !treeViewEnabled;
    const button = document.querySelector('.tree-btn');
    const rotationControls = document.getElementById('treeRotationControls');
    
    if (treeViewEnabled) {
        button.textContent = '🌳 Normal View';
        button.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
        rotationControls.style.display = 'block';
        
        // Set default active state for up direction
        document.querySelectorAll('.rotate-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector('.rotate-btn[onclick="rotateTree(\'up\')"]').classList.add('active');
        
        showMessage('Tree view enabled', 'success');
        applyTreeLayout();
    } else {
        button.textContent = '🌳 Tree View';
        button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        rotationControls.style.display = 'none';
        showMessage('Tree view disabled', 'success');
        document.getElementById('network').classList.remove('tree-view-enabled');
        restoreOriginalGraph();
    }
}

// Restore original graph structure
function restoreOriginalGraph() {
    // Reload the original graph data
    loadGraphData();
}

// Load sample tree data
async function loadSampleTree() {
    try {
        const response = await fetch('/api/load_graph', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filename: 'tree_cities.json' })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Sample tree loaded! Click "Tree View" to see the hierarchical structure.', 'success');
            loadGraphData(); // Reload the visualization
            document.getElementById('resultContent').innerHTML = '<p>Sample tree loaded! Try the Tree View to see the parent-child relationships.</p>';
        } else {
            showMessage(result.error, 'error');
        }
    } catch (error) {
        console.error('Error loading sample tree:', error);
        showMessage('Error loading sample tree', 'error');
    }
}

// Load binary tree data
async function loadBinaryTree() {
    try {
        const response = await fetch('/api/load_graph', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ filename: 'binary_tree_cities.json' })
        });
        
        const result = await response.json();
        
        if (response.ok) {
            showMessage('Binary tree loaded! Perfect for tree view - each node has 2 children!', 'success');
            loadGraphData(); // Reload the visualization
            document.getElementById('resultContent').innerHTML = '<p>Binary tree loaded! This creates a balanced tree structure with 2 children per node. Try the Tree View to see the perfect hierarchical layout!</p>';
        } else {
            showMessage(result.error, 'error');
        }
    } catch (error) {
        console.error('Error loading binary tree:', error);
        showMessage('Error loading binary tree', 'error');
    }
}

// Rotate tree in different directions
function rotateTree(direction) {
    if (!treeViewEnabled || !currentTreeData) {
        showMessage('Please enable tree view first', 'error');
        return;
    }
    
    currentTreeDirection = direction;
    
    // Update active button
    document.querySelectorAll('.rotate-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');
    
    // Get root node
    const nodeIds = nodes.getIds();
    const nodeConnections = {};
    nodeIds.forEach(id => {
        nodeConnections[id] = edges.get().filter(edge => 
            edge.from === id || edge.to === id
        ).length;
    });
    const rootNode = nodeIds.reduce((a, b) => nodeConnections[a] > nodeConnections[b] ? a : b);
    
    // Recalculate positions with new direction
    const positions = calculateProperTreePositions(currentTreeData, rootNode, direction);
    
    // Update node positions
    nodes.update(nodeIds.map(id => {
        const level = currentTreeData.levels[id] || 0;
        
        return {
            id: id,
            x: positions[id] ? positions[id].x : 0,
            y: positions[id] ? positions[id].y : 0,
            fixed: true,
            color: {
                background: level === 0 ? '#1f2937' : level === 1 ? '#3b82f6' : '#8b5cf6',
                border: level === 0 ? '#111827' : level === 1 ? '#2563eb' : '#7c3aed',
                highlight: {
                    background: level === 0 ? '#374151' : level === 1 ? '#60a5fa' : '#a78bfa',
                    border: level === 0 ? '#1f2937' : level === 1 ? '#3b82f6' : '#8b5cf6'
                }
            },
            font: {
                size: level === 0 ? 16 : level === 1 ? 14 : 12,
                color: 'white',
                strokeWidth: 3,
                strokeColor: '#000000'
            },
            size: level === 0 ? 35 : level === 1 ? 30 : 25
        };
    }));
    
    // Update window view if open
    if (windowNetwork && windowNodes) {
        updateWindowTreeRotation(direction);
    }
    
    showMessage(`Tree rotated to ${direction} direction`, 'success');
}

// Update window tree rotation
function updateWindowTreeRotation(direction) {
    if (!windowNetwork || !windowNodes || !currentTreeData) return;
    
    const nodeIds = windowNodes.getIds();
    const nodeConnections = {};
    nodeIds.forEach(id => {
        nodeConnections[id] = windowEdges.get().filter(edge => 
            edge.from === id || edge.to === id
        ).length;
    });
    const rootNode = nodeIds.reduce((a, b) => nodeConnections[a] > nodeConnections[b] ? a : b);
    
    // Recalculate positions with new direction
    const positions = calculateWindowProperTreePositions(currentTreeData, rootNode, direction);
    
    // Update node positions
    windowNodes.update(nodeIds.map(id => {
        const level = currentTreeData.levels[id] || 0;
        
        return {
            id: id,
            x: positions[id] ? positions[id].x : 0,
            y: positions[id] ? positions[id].y : 0,
            fixed: true,
            color: {
                background: level === 0 ? '#1f2937' : level === 1 ? '#3b82f6' : '#8b5cf6',
                border: level === 0 ? '#111827' : level === 1 ? '#2563eb' : '#7c3aed',
                highlight: {
                    background: level === 0 ? '#374151' : level === 1 ? '#60a5fa' : '#a78bfa',
                    border: level === 0 ? '#1f2937' : level === 1 ? '#3b82f6' : '#8b5cf6'
                }
            },
            font: {
                size: level === 0 ? 18 : level === 1 ? 16 : 14,
                color: 'white',
                strokeWidth: 4,
                strokeColor: '#000000'
            },
            size: level === 0 ? 45 : level === 1 ? 40 : 35
        };
    }));
}

// Open window view
function openWindowView() {
    const modal = document.getElementById('windowModal');
    modal.style.display = 'block';
    
    // Initialize window network if not already done
    if (!windowNetwork) {
        initializeWindowNetwork();
    } else {
        // Update window network with current data
        updateWindowNetwork();
    }
    
    showMessage('Window view opened', 'success');
}

// Close window view
function closeWindowView() {
    const modal = document.getElementById('windowModal');
    modal.style.display = 'none';
    showMessage('Window view closed', 'success');
}

// Initialize window network
function initializeWindowNetwork() {
    const container = document.getElementById('windowNetwork');
    
    // Create datasets for window network
    windowNodes = new vis.DataSet([]);
    windowEdges = new vis.DataSet([]);
    
    windowData = {
        nodes: windowNodes,
        edges: windowEdges
    };
    
    const options = {
        nodes: {
            shape: 'circle',
            size: 35,
            font: {
                size: 16,
                color: '#2d3748',
                strokeWidth: 3,
                strokeColor: '#ffffff'
            },
            borderWidth: 4,
            shadow: {
                enabled: true,
                color: 'rgba(0,0,0,0.3)',
                size: 8,
                x: 3,
                y: 3
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
            margin: 15,
            scaling: {
                min: 25,
                max: 50
            }
        },
        edges: {
            width: 4,
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
                size: 12,
                color: '#2d3748',
                strokeWidth: 4,
                strokeColor: '#ffffff',
                background: 'rgba(255,255,255,0.95)',
                border: '3px solid #e2e8f0',
                borderRadius: 8,
                padding: 6
            },
            arrows: {
                to: {
                    enabled: false
                }
            },
            selectionWidth: 6,
            hoverWidth: 6,
            labelHighlightBold: false
        },
        physics: {
            enabled: true,
            stabilization: { 
                iterations: 300,
                updateInterval: 25,
                onlyDynamicEdges: false,
                fit: true
            },
            barnesHut: {
                gravitationalConstant: -3000,
                centralGravity: 0.1,
                springLength: 200,
                springConstant: 0.05,
                damping: 0.09,
                avoidOverlap: 0.8
            },
            maxVelocity: 80,
            minVelocity: 0.1,
            solver: 'barnesHut',
            timestep: 0.4,
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
            clusterThreshold: 200,
            hierarchical: {
                enabled: false,
                levelSeparation: 200,
                nodeSpacing: 150,
                treeSpacing: 250,
                blockShifting: true,
                edgeMinimization: true,
                parentCentralization: true,
                direction: 'UD',
                sortMethod: 'directed'
            }
        }
    };
    
    windowNetwork = new vis.Network(container, windowData, options);
    
    // Add event listeners for window network
    windowNetwork.on('selectNode', function(params) {
        if (params.nodes.length > 0) {
            const selectedNode = params.nodes[0];
            highlightWindowNode(selectedNode);
        }
    });
    
    windowNetwork.on('click', function(params) {
        if (params.nodes.length === 0) {
            resetWindowGraphStyles();
        }
    });
    
    // Update with current data
    updateWindowNetwork();
}

// Update window network with current graph data
function updateWindowNetwork() {
    if (!windowNodes || !windowEdges) return;
    
    // Copy current data to window network
    windowNodes.clear();
    windowEdges.clear();
    
    windowNodes.add(nodes.get());
    windowEdges.add(edges.get());
    
    // Apply current visualization if available
    if (lastResult) {
        setTimeout(() => {
            applyWindowExplorationVisualization();
        }, 200);
    }
    
    // Apply layout
    setTimeout(() => {
        if (treeViewEnabled) {
            applyWindowTreeLayout();
        } else {
            applyWindowBetterLayout();
        }
    }, 100);
}

// Apply better layout for window network
function applyWindowBetterLayout() {
    if (!windowNetwork || windowNodes.length === 0) return;
    
    const positions = windowNetwork.getPositions();
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
    
    // Apply hierarchical circular layout
    const baseRadius = Math.max(400, nodeIds.length * 30);
    
    // Group nodes by connectivity
    const nodeConnections = {};
    nodeIds.forEach(id => {
        nodeConnections[id] = windowEdges.get().filter(edge => 
            edge.from === id || edge.to === id
        ).length;
    });
    
    const sortedNodes = nodeIds.sort((a, b) => nodeConnections[b] - nodeConnections[a]);
    const newPositions = {};
    const innerCircle = Math.min(10, Math.ceil(sortedNodes.length / 3));
    
    // Place most connected nodes in inner circle
    sortedNodes.slice(0, innerCircle).forEach((id, index) => {
        const angle = (index * 2 * Math.PI) / innerCircle;
        newPositions[id] = {
            x: centerX + (baseRadius * 0.5) * Math.cos(angle),
            y: centerY + (baseRadius * 0.5) * Math.sin(angle)
        };
    });
    
    // Place remaining nodes in outer circle
    const outerNodes = sortedNodes.slice(innerCircle);
    const outerRadius = baseRadius * 0.9;
    const angleStep = (2 * Math.PI) / outerNodes.length;
    
    outerNodes.forEach((id, index) => {
        const angle = index * angleStep;
        const variation = (Math.random() - 0.5) * 80;
        newPositions[id] = {
            x: centerX + outerRadius * Math.cos(angle) + variation,
            y: centerY + outerRadius * Math.sin(angle) + variation
        };
    });
    
    // Apply positions
    windowNetwork.setOptions({
        physics: { enabled: false }
    });
    
    windowNodes.update(nodeIds.map(id => ({
        id: id,
        x: newPositions[id].x,
        y: newPositions[id].y,
        fixed: false
    })));
    
    // Re-enable physics
    setTimeout(() => {
        windowNetwork.setOptions({
            physics: {
                enabled: true,
                stabilization: { iterations: 150 },
                barnesHut: {
                    gravitationalConstant: -2000,
                    centralGravity: 0.05,
                    springLength: 200,
                    springConstant: 0.03,
                    damping: 0.12,
                    avoidOverlap: 1.2
                }
            }
        });
    }, 300);
}

// Apply tree layout for window network
function applyWindowTreeLayout() {
    if (!windowNetwork || windowNodes.length === 0) return;
    
    const nodeIds = windowNodes.getIds();
    if (nodeIds.length === 0) return;
    
    // Find root node
    const nodeConnections = {};
    nodeIds.forEach(id => {
        nodeConnections[id] = windowEdges.get().filter(edge => 
            edge.from === id || edge.to === id
        ).length;
    });
    
    const rootNode = nodeIds.reduce((a, b) => nodeConnections[a] > nodeConnections[b] ? a : b);
    
    // Build proper tree structure
    const treeData = buildWindowProperTreeStructure(rootNode, nodeIds);
    const positions = calculateWindowProperTreePositions(treeData, rootNode, currentTreeDirection);
    
    // Apply tree layout
    windowNetwork.setOptions({
        physics: { enabled: false },
        layout: {
            hierarchical: {
                enabled: false  // Use our custom positioning
            }
        }
    });
    
    // Update positions with level-based styling
    windowNodes.update(nodeIds.map(id => {
        const level = treeData.levels[id] || 0;
        
        return {
            id: id,
            x: positions[id] ? positions[id].x : 0,
            y: positions[id] ? positions[id].y : 0,
            fixed: true,
            color: {
                background: level === 0 ? '#1f2937' : level === 1 ? '#3b82f6' : '#8b5cf6',
                border: level === 0 ? '#111827' : level === 1 ? '#2563eb' : '#7c3aed',
                highlight: {
                    background: level === 0 ? '#374151' : level === 1 ? '#60a5fa' : '#a78bfa',
                    border: level === 0 ? '#1f2937' : level === 1 ? '#3b82f6' : '#8b5cf6'
                }
            },
            font: {
                size: level === 0 ? 18 : level === 1 ? 16 : 14,
                color: 'white',
                strokeWidth: 4,
                strokeColor: '#000000'
            },
            size: level === 0 ? 45 : level === 1 ? 40 : 35
        };
    }));
    
    // Update edges to show proper tree structure
    updateWindowTreeEdges(treeData);
}

// Build proper tree structure for window network
function buildWindowProperTreeStructure(rootNode, allNodes) {
    const tree = {};
    const visited = new Set();
    const levels = {};
    const parentMap = {};
    
    // Initialize tree structure
    allNodes.forEach(node => {
        tree[node] = [];
        levels[node] = -1;
    });
    
    // BFS to assign levels and build tree
    const queue = [{ node: rootNode, level: 0, parent: null }];
    levels[rootNode] = 0;
    parentMap[rootNode] = null;
    
    while (queue.length > 0) {
        const { node: current, level, parent } = queue.shift();
        
        if (visited.has(current)) continue;
        visited.add(current);
        
        // Get all neighbors
        const neighbors = windowEdges.get().filter(edge => 
            edge.from === current || edge.to === current
        ).map(edge => edge.from === current ? edge.to : edge.from);
        
        // Add unvisited neighbors as children
        for (const neighbor of neighbors) {
            if (!visited.has(neighbor) && levels[neighbor] === -1) {
                levels[neighbor] = level + 1;
                parentMap[neighbor] = current;
                tree[current].push(neighbor);
                queue.push({ node: neighbor, level: level + 1, parent: current });
            }
        }
    }
    
    return { tree, levels, parentMap };
}

// Calculate proper tree positions for window network
function calculateWindowProperTreePositions(treeData, rootNode, direction = 'up') {
    const { tree, levels } = treeData;
    const positions = {};
    const levelHeight = 350;
    const nodeSpacing = 250;
    
    // Group nodes by level
    const nodesByLevel = {};
    Object.keys(levels).forEach(node => {
        const level = levels[node];
        if (!nodesByLevel[level]) {
            nodesByLevel[level] = [];
        }
        nodesByLevel[level].push(node);
    });
    
    // Position nodes level by level based on direction
    Object.keys(nodesByLevel).sort((a, b) => parseInt(a) - parseInt(b)).forEach(level => {
        const levelNodes = nodesByLevel[level];
        const levelNum = parseInt(level);
        
        if (levelNum === 0) {
            // Root node at center
            positions[rootNode] = { x: 0, y: 0 };
        } else {
            // Calculate positions for this level based on direction
            const totalWidth = (levelNodes.length - 1) * nodeSpacing;
            const startX = -totalWidth / 2;
            
            levelNodes.forEach((node, index) => {
                let x, y;
                
                switch (direction) {
                    case 'up':
                        x = startX + index * nodeSpacing;
                        y = -levelNum * levelHeight;
                        break;
                    case 'down':
                        x = startX + index * nodeSpacing;
                        y = levelNum * levelHeight;
                        break;
                    case 'left':
                        x = -levelNum * levelHeight;
                        y = startX + index * nodeSpacing;
                        break;
                    case 'right':
                        x = levelNum * levelHeight;
                        y = startX + index * nodeSpacing;
                        break;
                    default:
                        x = startX + index * nodeSpacing;
                        y = -levelNum * levelHeight;
                }
                
                positions[node] = { x, y };
            });
        }
    });
    
    return positions;
}

// Update edges to show proper tree structure for window network
function updateWindowTreeEdges(treeData) {
    const { tree, parentMap } = treeData;
    
    // Remove all existing edges
    const allEdges = windowEdges.get();
    const edgeIds = allEdges.map(edge => edge.id);
    if (edgeIds.length > 0) {
        windowEdges.remove(edgeIds);
    }
    
    // Add tree edges (parent-child relationships only)
    Object.keys(parentMap).forEach(child => {
        const parent = parentMap[child];
        if (parent !== null) {
            // Find the original edge to get distance
            const originalEdge = allEdges.find(edge => 
                (edge.from === parent && edge.to === child) || 
                (edge.from === child && edge.to === parent)
            );
            
            const distance = originalEdge ? originalEdge.label : '1';
            
            windowEdges.add({
                from: parent,
                to: child,
                label: distance,
                color: { color: '#059669', highlight: '#059669' },
                width: 5,
                arrows: { to: { enabled: true, scaleFactor: 1.0 } },
                font: {
                    size: 14,
                    color: '#059669',
                    strokeWidth: 4,
                    strokeColor: '#ffffff',
                    background: 'rgba(255,255,255,0.95)',
                    border: '3px solid #059669',
                    borderRadius: 8,
                    padding: 6
                }
            });
        }
    });
}

// Apply exploration visualization to window network
function applyWindowExplorationVisualization() {
    if (!lastResult || !windowNodes || !windowEdges) return;
    
    // Don't reset styles if we're in tree view - preserve tree structure
    if (!treeViewEnabled) {
        resetWindowGraphStyles();
    }
    
    const showTree = document.getElementById('showExplorationTree')?.checked;
    const path = lastResult.path || [];
    const pathSet = new Set(path);
    const expansion = lastResult.expansionOrder || [];
    const visitedSet = new Set(expansion.length ? expansion : Object.keys(lastResult.parents || {}));
    const parents = lastResult.parents || {};
    
    // Color visited nodes (but not path nodes) - YELLOW
    visitedSet.forEach(city => {
        if (pathSet.has(city)) return;
        const level = currentTreeData ? currentTreeData.levels[city] || 0 : 0;
        const baseSize = level === 0 ? 45 : level === 1 ? 40 : 35;
        
        windowNodes.update({ 
            id: city, 
            color: { 
                border: '#f59e0b', 
                background: '#fde68a', // YELLOW for visited
                highlight: { border: '#f59e0b', background: '#fde68a' } 
            }, 
            title: `${city} (visited${expansion.length ? ` #${expansion.indexOf(city)+1}` : ''})`,
            size: baseSize
        });
    });
    
    // Color path nodes with enhanced visibility
    path.forEach((city, idx) => {
        let nodeColor;
        const level = currentTreeData ? currentTreeData.levels[city] || 0 : 0;
        let nodeSize = level === 0 ? 50 : level === 1 ? 45 : 40;
        
        if (idx === 0) {
            // Start node - bright green with glow effect
            nodeColor = { 
                border: '#059669', 
                background: '#10b981', 
                highlight: { border: '#047857', background: '#34d399' }
            };
            nodeSize += 5; // Make start node extra large
        } else if (idx === path.length - 1) {
            // End node - bright red with glow effect
            nodeColor = { 
                border: '#dc2626', 
                background: '#ef4444', 
                highlight: { border: '#b91c1c', background: '#f87171' }
            };
            nodeSize += 5; // Make end node extra large
        } else {
            // Path nodes - bright blue
            nodeColor = { 
                border: '#2563eb', 
                background: '#3b82f6', 
                highlight: { border: '#1d4ed8', background: '#60a5fa' }
            };
        }
        
        windowNodes.update({ 
            id: city, 
            color: nodeColor, 
            size: nodeSize,
            title: `${city} ${idx===0?'(START)':''} ${idx===path.length-1?'(END)':''} ${idx>0 && idx<path.length-1?'(PATH)':''}`.trim(),
            font: {
                size: level === 0 ? 18 : level === 1 ? 16 : 14,
                color: 'white',
                strokeWidth: 4,
                strokeColor: '#000000'
            }
        });
    });
    
    // Highlight path edges with enhanced visibility - BLUE
    for (let i = 0; i < path.length - 1; i++) {
        const a = path[i], b = path[i+1];
        windowEdges.forEach(edge => {
            if ((edge.from === a && edge.to === b) || (edge.from === b && edge.to === a)) {
                windowEdges.update({ 
                    id: edge.id, 
                    color: { color: '#2563eb', highlight: '#2563eb' }, // BLUE for path
                    width: 8, // Thicker path edges
                    font: {
                        color: '#2563eb',
                        strokeColor: '#ffffff',
                        background: 'rgba(255,255,255,0.95)',
                        border: '3px solid #2563eb',
                        size: 16,
                        weight: 'bold'
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
            windowEdges.add({ 
                id: `window-tree-${parent}-${child}-${Date.now()}-${Math.random()}`, 
                from: parent, 
                to: child, 
                arrows: { to: { enabled: true, scaleFactor: 1.0 } }, 
                dashes: true, 
                color: { color: '#8b5cf6' }, 
                width: 3, 
                overlay: true, 
                smooth: { enabled: false } 
            });
        });
    }
    
    // Fit to path with animation
    if (path.length) {
        setTimeout(() => {
            windowNetwork.fit({ 
                nodes: path, 
                animation: { duration: 1000, easingFunction: 'easeInOutQuad' }, 
                maxZoomLevel: 1.2 
            });
        }, 300);
    }
}

// Reset window graph styles
function resetWindowGraphStyles() {
    if (!windowNodes || !windowEdges) return;
    
    const toRemove = [];
    windowEdges.forEach(e => { if (e.overlay === true) toRemove.push(e.id); });
    if (toRemove.length) windowEdges.remove(toRemove);
    
    windowEdges.forEach(edge => {
        windowEdges.update({ 
            id: edge.id, 
            color: { color: '#718096', highlight: '#2b6cb0' }, 
            width: 4, 
            dashes: false, 
            arrows: { to: { enabled: false } },
            font: {
                size: 12,
                color: '#2d3748',
                strokeWidth: 4,
                strokeColor: '#ffffff',
                background: 'rgba(255,255,255,0.95)',
                border: '3px solid #e2e8f0',
                borderRadius: 8,
                padding: 6
            }
        });
    });
    
    windowNodes.forEach(node => {
        windowNodes.update({ 
            id: node.id, 
            color: { 
                border: '#4a5568', 
                background: '#e2e8f0', 
                highlight: { border: '#2b6cb0', background: '#bee3f8' } 
            }, 
            title: node.label,
            size: 35
        });
    });
}

// Highlight window node
function highlightWindowNode(nodeId) {
    if (!windowNodes) return;
    
    windowNodes.update({
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

// Close modal when clicking outside
window.onclick = function(event) {
    const windowModal = document.getElementById('windowModal');
    const statsModal = document.getElementById('statsModal');
    
    if (event.target === windowModal) {
        closeWindowView();
    } else if (event.target === statsModal) {
        closeStatsModal();
    }
}

// Toggle animation mode
function toggleAnimation() {
    animationEnabled = !animationEnabled;
    const button = document.querySelector('.animation-btn');
    
    if (animationEnabled) {
        button.textContent = '🎬 Disable Animation';
        button.style.background = 'linear-gradient(135deg, #10b981 0%, #059669 100%)';
        showMessage('Animation enabled - paths will animate!', 'success');
    } else {
        button.textContent = '🎬 Toggle Animation';
        button.style.background = 'linear-gradient(135deg, #ec4899 0%, #be185d 100%)';
        showMessage('Animation disabled', 'success');
    }
}

// Export graph as image
function exportGraph() {
    if (!network) {
        showMessage('No graph to export', 'error');
        return;
    }
    
    try {
        // Get the network canvas
        const canvas = document.querySelector('#network canvas');
        if (!canvas) {
            showMessage('Unable to export - canvas not found', 'error');
            return;
        }
        
        // Create download link
        const link = document.createElement('a');
        link.download = `graph-${new Date().toISOString().slice(0, 10)}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        
        showMessage('Graph exported successfully!', 'success');
    } catch (error) {
        console.error('Export error:', error);
        showMessage('Export failed', 'error');
    }
}

// Show statistics modal
function showStatistics() {
    const modal = document.getElementById('statsModal');
    const statsContent = document.getElementById('statsContent');
    
    // Calculate statistics
    const stats = calculateGraphStatistics();
    
    // Generate statistics HTML
    statsContent.innerHTML = `
        <div class="stats-grid">
            <div class="stat-card">
                <div class="stat-value">${stats.cities}</div>
                <div class="stat-label">Cities</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.connections}</div>
                <div class="stat-label">Connections</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.avgConnections}</div>
                <div class="stat-label">Avg Connections</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.isConnected ? 'Yes' : 'No'}</div>
                <div class="stat-label">Connected</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.maxConnections}</div>
                <div class="stat-label">Max Connections</div>
            </div>
            <div class="stat-card">
                <div class="stat-value">${stats.minConnections}</div>
                <div class="stat-label">Min Connections</div>
            </div>
        </div>
        <div style="margin-top: 20px;">
            <h3 style="color: #4a5568; margin-bottom: 15px;">📈 Additional Info</h3>
            <div style="background: #f8fafc; padding: 15px; border-radius: 8px; border: 1px solid #e2e8f0;">
                <p><strong>Most Connected City:</strong> ${stats.mostConnectedCity}</p>
                <p><strong>Least Connected City:</strong> ${stats.leastConnectedCity}</p>
                <p><strong>Graph Density:</strong> ${stats.density}%</p>
                <p><strong>Tree View:</strong> ${treeViewEnabled ? 'Enabled' : 'Disabled'}</p>
                <p><strong>Animation:</strong> ${animationEnabled ? 'Enabled' : 'Disabled'}</p>
                <p><strong>Dark Mode:</strong> ${darkModeEnabled ? 'Enabled' : 'Disabled'}</p>
            </div>
        </div>
    `;
    
    modal.style.display = 'block';
    showMessage('Statistics displayed', 'success');
}

// Close statistics modal
function closeStatsModal() {
    const modal = document.getElementById('statsModal');
    modal.style.display = 'none';
}

// Calculate graph statistics
function calculateGraphStatistics() {
    const nodeIds = nodes.getIds();
    const edgeIds = edges.getIds();
    
    // Basic counts
    const cities = nodeIds.length;
    const connections = edgeIds.length;
    
    // Connection analysis
    const nodeConnections = {};
    nodeIds.forEach(id => {
        nodeConnections[id] = edges.get().filter(edge => 
            edge.from === id || edge.to === id
        ).length;
    });
    
    const connectionCounts = Object.values(nodeConnections);
    const avgConnections = connectionCounts.length > 0 ? 
        (connectionCounts.reduce((a, b) => a + b, 0) / connectionCounts.length).toFixed(1) : 0;
    
    const maxConnections = Math.max(...connectionCounts, 0);
    const minConnections = Math.min(...connectionCounts, 0);
    
    // Most/least connected cities
    const mostConnectedCity = Object.keys(nodeConnections).reduce((a, b) => 
        nodeConnections[a] > nodeConnections[b] ? a : b, 'None');
    const leastConnectedCity = Object.keys(nodeConnections).reduce((a, b) => 
        nodeConnections[a] < nodeConnections[b] ? a : b, 'None');
    
    // Graph density (percentage of possible connections)
    const maxPossibleConnections = cities * (cities - 1) / 2;
    const density = maxPossibleConnections > 0 ? 
        ((connections / maxPossibleConnections) * 100).toFixed(1) : 0;
    
    // Check if graph is connected (simplified)
    const isConnected = cities <= 1 || connections >= cities - 1;
    
    return {
        cities,
        connections,
        avgConnections,
        maxConnections,
        minConnections,
        mostConnectedCity,
        leastConnectedCity,
        density,
        isConnected
    };
}

// Toggle dark mode
function toggleDarkMode() {
    darkModeEnabled = !darkModeEnabled;
    const button = document.querySelector('.dark-btn');
    const body = document.body;
    
    if (darkModeEnabled) {
        body.classList.add('dark-mode');
        button.textContent = '☀️ Light Mode';
        button.style.background = 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)';
        showMessage('Dark mode enabled', 'success');
    } else {
        body.classList.remove('dark-mode');
        button.textContent = '🌙 Dark Mode';
        button.style.background = 'linear-gradient(135deg, #6366f1 0%, #4f46e5 100%)';
        showMessage('Dark mode disabled', 'success');
    }
}

// Enhanced path visualization with animations
function applyAnimatedPathVisualization() {
    if (!lastResult || !nodes || !edges) return;
    
    const path = lastResult.path || [];
    const pathSet = new Set(path);
    
    // Apply animations to path nodes
    path.forEach((city, idx) => {
        const nodeElement = document.querySelector(`[data-node-id="${city}"]`);
        if (nodeElement && animationEnabled) {
            nodeElement.classList.add('animated-node');
            setTimeout(() => {
                nodeElement.classList.remove('animated-node');
            }, 1000);
        }
    });
    
    // Apply animations to path edges
    for (let i = 0; i < path.length - 1; i++) {
        const a = path[i], b = path[i+1];
        edges.forEach(edge => {
            if ((edge.from === a && edge.to === b) || (edge.from === b && edge.to === a)) {
                if (animationEnabled) {
                    // Add pulsing animation to path edges
                    const edgeElement = document.querySelector(`[data-edge-id="${edge.id}"]`);
                    if (edgeElement) {
                        edgeElement.classList.add('animated-path');
                    }
                }
            }
        });
    }
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
