const width = 800;
const height = 600;

const svg = d3.select("svg")
    .attr("width", width)
    .attr("height", height);

let nodes = [
    { id: "Alice" },
    { id: "Bob" },
    { id: "Carol" },
    { id: "David" },
    { id: "Eve" }
];

let links = [
    { source: "Alice", target: "Bob" },
    { source: "Bob", target: "Carol" },
    { source: "Carol", target: "David" },
    { source: "David", target: "Eve" },
    { source: "Eve", target: "Alice" }
];

let nodeIdCounter = nodes.length;
let selectedNode = null;
let currentAction = null;

// ---------------------------- Force Directed Graph Drawing ------------------------------------------
// Needs "nodes" and "links"
let simulation, link, node;

function initializeGraph() {
    const simulation = d3.forceSimulation(nodes)
    .force("link", d3.forceLink(links).id(d => d.id).distance(100))
    .force("charge", d3.forceManyBody().strength(-10)) // Reduced the repelling force
    .force("center", d3.forceCenter(width / 2, height / 2))
    .force("collide", d3.forceCollide().radius(15))
    .force("bounds", boundingBox);

    let link = svg.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line");

    let node = svg.append("g")
        .attr("class", "nodes")
        .selectAll("circle")
        .data(nodes)
        .enter().append("circle")
        .attr("r", 10)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on("contextmenu", showContextMenu);

    let label = svg.append("g")
        .attr("class", "labels")
        .selectAll("text")
        .data(nodes)
        .enter().append("text")
        .attr("dy", -15)
        .attr("text-anchor", "middle")
        .text(d => d.id);

    simulation.on("tick", () => {
        link
            .attr("x1", d => d.source.x)
            .attr("y1", d => d.source.y)
            .attr("x2", d => d.target.x)
            .attr("y2", d => d.target.y);

        node
            .attr("cx", d => d.x)
            .attr("cy", d => d.y);

        label
            .attr("x", d => d.x)
            .attr("y", d => d.y)
            .text(d => d.id);  // Ensure labels are updated on each tick
    });
}

function restart() {
    console.log("Restarting simulation");
    link = link.data(links);
    link.exit().remove();
    link = link.enter().append("line").merge(link);

    updateNodes();
    updateLabels();

    simulation.nodes(nodes);
    simulation.force("link").links(links);
    simulation.alpha(1).restart();
}

// ----------------------------------------------------------------------------------------------------------------


// -------------------------------- Controls ----------------------------------------------------------------
document.getElementById("addNodeButton").addEventListener("click", () => {
    const nodeName = prompt("Enter node name:");
    if (nodeName && !nodes.find(n => n.id === nodeName)) {
        addNode(nodeName);
    } else if (nodes.find(n => n.id === nodeName)) {
        alert("This name already exists!");
    }
});

document.getElementById("editNode").addEventListener("click", () => {
    if (selectedNode) {
        showPrompt("Enter new name:", selectedNode.id);
        currentAction = "edit";
    }
});

document.getElementById("deleteNode").addEventListener("click", () => {
    if (selectedNode) {
        nodes = nodes.filter(n => n.id !== selectedNode.id);
        links = links.filter(l => l.source.id !== selectedNode.id && l.target.id !== selectedNode.id);
        restart();
        closeContextMenu();
    }
});

document.getElementById("addEdge").addEventListener("click", () => {
    if (selectedNode) {
        showPrompt("Enter the target node name:");
        currentAction = "addEdge";
    }
});

document.getElementById("removeEdge").addEventListener("click", () => {
    if (selectedNode) {
        showPrompt("Enter the target node name:");
        currentAction = "removeEdge";
    }
});

document.getElementById("closeMenu").addEventListener("click", closeContextMenu);

document.getElementById("submitPrompt").addEventListener("click", () => {
    const inputValue = document.getElementById("promptInput").value;
    const errorText = document.getElementById("errorText");
    if (currentAction === "edit") {
        if (inputValue && !nodes.find(n => n.id === inputValue)) {
            selectedNode.id = inputValue;
            restart();
            closePromptDialog();
            closeContextMenu();
        } else if (nodes.find(n => n.id === inputValue)) {
            errorText.textContent = "This name already exists!";
            errorText.style.display = "block";
        }
    } else if (currentAction === "addEdge") {
        if (inputValue) {
            let targetNode = nodes.find(n => n.id === inputValue);
            if (!targetNode) {
                targetNode = { id: inputValue, x: width / 2, y: height / 2, fx: width / 2, fy: width / 2 };
                nodes.push(targetNode);
                updateNodes();
                updateLabels();
                targetNode.fx = null;
                targetNode.fy = null;
                simulation.alpha(0.5).restart();
            }
            links.push({ source: selectedNode.id, target: targetNode.id });
            restart();
            closePromptDialog();
            closeContextMenu();
        }
    } else if (currentAction === "removeEdge") {
        if (inputValue) {
            const targetNode = nodes.find(n => n.id === inputValue);
            if (targetNode) {
                links = links.filter(l => !(l.source.id === selectedNode.id && l.target.id === targetNode.id) && !(l.source.id === targetNode.id && l.target.id === selectedNode.id));
                restart();
                closePromptDialog();
                closeContextMenu();
            } else {
                errorText.textContent = "Target node does not exist!";
                errorText.style.display = "block";
            }
        }
    }
});

document.getElementById("cancelPrompt").addEventListener("click", closePromptDialog);

document.getElementById("searchInput").addEventListener("input", () => {
    const searchValue = document.getElementById("searchInput").value.toLowerCase();
    if (searchValue === "") {
        removeHighlights(); // Clear highlights if the search input is empty
    } else {
        node.classed("highlight", d => d.id.toLowerCase().includes(searchValue));
        label.classed("highlight", d => d.id.toLowerCase().includes(searchValue));
    }
});

function removeHighlights() {
    node.classed("highlight", false);
    label.classed("highlight", false);
}

function dragstarted(event, d) {
    console.log("Drag started:", d);
    if (!event.active) simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
}

function dragged(event, d) {
    d.fx = event.x;
    d.fy = event.y;
}

function dragended(event, d) {
    console.log("Drag ended:", d);
    if (!event.active) simulation.alphaTarget(0);
    d.fx = null;
    d.fy = null;
}

function addNode(name) {
    const coords = [width / 2, height / 2];
    const newNode = { id: name, x: coords[0], y: coords[1], fx: coords[0], fy: coords[1] };

    console.log("Adding node:", newNode);
    nodes.push(newNode);

    updateNodes();
    updateLabels();
    
    newNode.fx = null;
    newNode.fy = null;

    simulation.alpha(0.1).restart();
    restart();
}

function showContextMenu(event, d) {
    event.preventDefault();
    selectedNode = d;
    const menu = document.getElementById("contextMenu");
    menu.style.display = "block";
    menu.style.left = `${event.pageX}px`;
    menu.style.top = `${event.pageY}px`;
}

function closeContextMenu() {
    const menu = document.getElementById("contextMenu");
    menu.style.display = "none";
    selectedNode = null;
}

function showPrompt(text, defaultValue = "") {
    const promptDialog = document.getElementById("promptDialog");
    document.getElementById("promptText").textContent = text;
    document.getElementById("promptInput").value = defaultValue;
    document.getElementById("errorText").style.display = "none";
    promptDialog.style.display = "block";
    promptDialog.style.left = `${parseInt(document.getElementById("contextMenu").style.left) + 150}px`;
    promptDialog.style.top = `${document.getElementById("contextMenu").style.top}`;
}

function closePromptDialog() {
    const promptDialog = document.getElementById("promptDialog");
    promptDialog.style.display = "none";
    currentAction = null;
}

function boundingBox() {
    nodes.forEach(d => {
        d.x = Math.max(15, Math.min(width - 15, d.x));
        d.y = Math.max(15, Math.min(height - 15, d.y));
    });
}

function updateNodes() {
    console.log("Updating nodes");
    node = node.data(nodes, d => d.id);
    node.exit().remove();
    node = node.enter().append("circle")
        .attr("r", 10)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended))
        .on("contextmenu", showContextMenu)
        .merge(node);

    node.attr("cx", d => d.x)
        .attr("cy", d => d.y);
}

function updateLabels() {
    console.log("Updating labels");
    label = label.data(nodes, d => d.id);
    label.exit().remove();
    label = label.enter().append("text")
        .attr("dy", -15)
        .attr("text-anchor", "middle")
        .merge(label);

    label.text(d => d.id)
        .attr("x", d => d.x)
        .attr("y", d => d.y);
}
