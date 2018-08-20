/* function: get max level of all elements */
function findMaxLevel(input) {
    var num = 0;
    input.forEach(function (node) {
        num = Math.max(num, node.level);
    });
    return num;
}

/* function: calculate how number of ndoes at each level */
function calculateTreeLevel(input) {
    var levels = new Map();
    input.forEach(function (element) {
        // check if the element exists
        if (levels.has(element.level)) {
            // has the node already, calculate corresponding value
            // the level only
            var current_level = levels.get(element.level);
            levels.set(element.level, current_level + 1);
        } else {
            // create new map entry
            levels.set(element.level, 1);
        }
    });

    return levels;
}

/* remove duplicates in an array */
function removeDuplicates(arr) {
    let unique_array = [];
    for (let i = 0;i < arr.length; i++) {
        if (unique_array.indexOf(arr[i]) == -1) {
            unique_array.push(arr[i]);
        }
    }
    return unique_array;
}

// count appearance of each node at its level
function calculateNodeAppearance(prior_data, level_map, max_level) {
    var formal_data = [];
    var appear_count = 1;
    for (var i = 1; i <= max_level; i++) {
        var current_level_count = level_map.get(i);
        for (var j = 0; j < prior_data.length; j++) {
            if (prior_data[j].level == i) {
                formal_data.push({
                    name: prior_data[j].name,
                    descendant: prior_data[j].descendant,
                    ascendant: prior_data[j].ascendant,
                    level: prior_data[j].level,
                    x: width / (current_level_count + 1) * appear_count,
                    y: prior_data[j].level * height_factor,
                    expanded: prior_data[j].expanded,
                    highlighted: prior_data[j].highlighted
                });
                appear_count++;
            }
        }
        appear_count = 1;
    }
    console.log(formal_data);
    return formal_data;
}


/* remove duplicates in an array */
function removeDuplicates(arr){
    let unique_array = []
    for(let i = 0;i < arr.length; i++){
        if(unique_array.indexOf(arr[i]) == -1){
            unique_array.push(arr[i])
        }
    }
    return unique_array;
}


/* MARK: - construct a map full of lines */
/* function: construct a map of all lines that have to be drawn */
function constructLineArray() {
    // draw line
    for (var i = 0; i < complete_data_example.length; i++) {
        // get all descendants that has to be drawn
        var descendants = complete_data_example[i].descendant;
        if (descendants.length == 0) {
            continue;
        }
        // iterate through all descendants
        for (var j = 0; j < descendants.length; j++) {
            for (var k = 0; k < complete_data_example.length; k++) {
                if (complete_data_example[k].name == descendants[j]) {
                    if (!edge_array.includes(complete_data_example[i].name + "-" + descendants[j])) {
                        // add into array as well
                        edge_array.push({
                            id: complete_data_example[i].name + "-" + descendants[j],
                            x1: complete_data_example[i].x,
                            y1: complete_data_example[i].y,
                            x2: complete_data_example[k].x,
                            y2: complete_data_example[k].y
                        });
                    }
                }
            }
        }
    }
}

// MARK: - drawing functions related to graphs

// function: draw basic lines on the graph
function drawLines() {
    // draw line using each entry, assign id, x1, y1, x2, y2 correspondingly
    var lines = svg.selectAll("line").data(edge_array);
    lines.enter()
    .append("line")
    .attr("id", function (line) { return line.id; })
    .attr("x1", function (line) { return line.x1; })
    .attr("y1", function (line) { return line.y1; })
    .attr("x2", function (line) { return line.x2; })
    .attr("y2", function (line) { return line.y2; })
    .attr("stroke", "black")
    .attr("stroke-width", 2);
}

// function: draw basic nodes on the canvas
function drawNodes(color, radius) {
    // draw all nodes through binding with data
    var circles = svg.selectAll("circle").data(complete_data_example);
    circles.enter()
    .append("circle")
    .attr("id", function (node) { return node.name; })
    .attr("cx", function (node) { return node.x; })
    .attr("cy", function (node) { return node.y; })
    .attr("fill", color)
    .attr("r", radius)
    .on("mouseover", hightlightAscDesc)
    .on("mouseout", resumeHighlights)
    .on("click", collapseGraph);
}

// draw basic nodes
function drawBasicNodes() {
    drawNodes("royalblue", 15);
}

// function: draw name tags on top-right of a node
function drawLabels() {
    // get all the nodes and then draw the text on top right
    var texts = svg.selectAll("text").data(complete_data_example);
    texts.enter()
    .append("text")
    .attr("id", function (d) { return "t_" + d.name; })
    .attr("x", function (d) { return d.x + 17; })
    .attr("y", function (d) { return d.y - 17; })
    .attr("fill", "black")
    .text(function (d) { return d.name; });
}


// function: since there is no guarantee our graph is a tree, make this a recursive function
function findAscNodesRecursive(data_point, data_input) {
    asc_nodes.push(data_point.name);
    if (data_point.ascendant.length == 0) {
        return;
    }
    for (var i = 0; i < data_point.ascendant.length; i++) {
        for (var item in data_input) {
            if (item.name == data_point.ascendant[i]) {
                findAscNodesRecursive(item, data_input);
            }
        }
    }
    return;
}

// function: find descendant nodes recursively
function findDescNodesRecursive(data_point, data_input) {
    desc_nodes.push(data_point.name);
    if (data_point.descendant.length == 0) {
        return;
    }
    for (var i = 0; i < data_point.descendant.length; i++) {
        // find descendants in the data input
        for (var item in data_input) {
            if (item.name == data_point.descendant[i]) {
                // if not included yet,
                if (!desc_nodes.includes(item.name)) {
                    findDescNodesRecursive(item, data_input);
                }
            }
        }
    }
    return;
}

// function: iterate through properties to get data
function findAllNodes(data_point) {
    var all_nodes = [];
    asc_nodes = [];
    desc_nodes = [];
    // find ascendant nodes and descendant nodes
    for (var i = 0; i < data_point.ascendant.length; i++) {
        asc_nodes.push(data_point.ascendant[i]);
        all_nodes.push(data_point.ascendant[i]);
    }
    for (var i = 0; i < data_point.descendant.length; i++) {
        desc_nodes.push(data_point.descendant[i]);
        all_nodes.push(data_point.descendant[i]);
    }
    all_nodes.push(data_point.name);
    return all_nodes;
}

// function: find ascendant edges by first accessing the ascendant property of data_point
function findAscendantEdges(data_point) {
    asc_edges = [];
    var temp_edges = [];
    // update ascendant nodes
    asc_nodes = [];
    for (var i = 0; i < data_point.ascendant.length; i++) {
        asc_nodes.push(data_point.ascendant[i]);
    }
    // include current node
    asc_nodes.push(data_point.name);
    // iterate through asc_nodes
    for (var i = 0; i < asc_nodes.length - 1; i++) {
        // construct an array of edge-ids
        // check if the combination of edges are in the edge_array
        for (var j = i + 1; j < asc_nodes.length; j++) {
            for (var k = 0; k < edge_array.length; k++) {
                if (edge_array[k].id == (asc_nodes[i] + "-" + asc_nodes[j])) {
                    temp_edges.push(edge_array[k].id);
                }
                if (edge_array[k].id == asc_nodes[j] + "-" + asc_nodes[i]) {
                    temp_edges.push(edge_array[k].id);
                }
            }
        }
    }
    asc_edges = removeDuplicates(temp_edges);
}

// function: iterate and check if any two combinations of current data_point's descendants are in the edge array
function findDescendantEdges(data_point) {
    desc_edges = [];
    var temp_edges = [];
    // update descendant nodes
    for (var i = 0; i < data_point.descendant.length; i++) {
        desc_nodes.push(data_point.descendant[i]);
    }
    desc_nodes.push(data_point.name);
    // search for appearance
    for (var i = 0; i < desc_nodes.length - 1; i++) {
        for (var j = i + 1; j < desc_nodes.length; j++) {
            for (var k = 0; k < edge_array.length; k++) {
                if (edge_array[k].id == (desc_nodes[i] + "-" + desc_nodes[j])) {
                    temp_edges.push(edge_array[k].id);
                } else if (edge_array[k].id == desc_nodes[j] + "-" + desc_nodes[i]) {
                    temp_edges.push(edge_array[k].id);
                }
            }
        }
    }
    desc_edges = removeDuplicates(temp_edges);
}

// function: find all ascendant and descendant edges
function findAllEdges(data_point, data_input) {
    // re-init highlight_lines
    var all_edges = [];
    findAscendantEdges(data_point);
    for (var i = 0; i < asc_edges.length; i++) {
        all_edges.push(asc_edges[i]);
    }
    findDescendantEdges(data_point);
    for (var i = 0; i < desc_edges.length; i++) {
        all_edges.push(desc_edges[i]);
    }
    return all_edges;
}

function findEdgesToCollapse() {
    var target_edges = [];
    console.log("nodes to collapse in findEdgesToCollapse");
    console.log(nodes_to_collapse);
    // console.log("all edges in findEdgesToCollapse");
    // console.log(edge_array);
    for (var i = 0; i < nodes_to_collapse.length; i++) {
        // search in edge array, if the node name appears in any edge, it should also be removed
        edge_array.forEach(function (datum) {
            console.log("datum type: " + typeof datum.id);
            // fixed bug
            var split_var = datum.id.split("-");
            split_var.forEach(function (str) {
                if (str == nodes_to_collapse[i]) {
                    target_edges.push(datum.id);
                }
            });
        });
    }
    var edges_to_collapse = removeDuplicates(target_edges);
    console.log("edges to collapse in findEdgesToCollapse");
    console.log(edges_to_collapse);
    return edges_to_collapse;
}

// MARK: - functionalities of highlighting
function highlightNodes() {
    nodes_to_highlight.forEach(function (entry) {
        d3.select("#" + entry).attr("fill", "orange").attr("r", 20);
    });
}

function hightlightEdges(edges) {
    edges.forEach(function (entry) {
        d3.select("#" + entry).attr("stroke", "lightpink").attr("stroke-width", 4);
    });
}

function highlightTextLabels() {
    nodes_to_highlight.forEach(function (entry) {
        d3.select("#t_" + entry).attr("fill", "red");
    });
}

function resumeNodes() {
    nodes_to_highlight.forEach(function (entry) {
        d3.select("#" + entry).attr("fill", "royalblue").attr("r", 15);
    });
}

function resumeEdges(edges) {
    edges.forEach(function (entry) {
        d3.select("#" + entry).attr("stroke", "black").attr("stroke-width", 2);
    });
}

function resumeTextLabels() {
    nodes_to_highlight.forEach(function (entry) {
        d3.select("#t_" + entry).attr("fill", "black");
    });
}

// function: highlight all ascendant & descendant nodes, edges
function hightlightAscDesc(data_point, index) {
    nodes_to_highlight = [];
    // directly access nodes and edges that should be highlighted
    nodes_to_highlight = findAllNodes(data_point);
    var edges_to_highlight = findAllEdges(data_point);
    // change attributes of those nodes and edges
    highlightNodes();
    hightlightEdges(edges_to_highlight);
    highlightTextLabels();
    // update the status of each node to be highlighted
    for (var node in nodes_to_highlight) {
        for (var target in complete_data_example) {
            if (node == target.name) {
                target.highlighted = true;
            }
        }
    }
}

// function: find all nodes and edges and set their attribute back to original
function resumeHighlights(data_point, index) {
    var edges_to_resume = findAllEdges(data_point);
    resumeNodes();
    resumeEdges(edges_to_resume);
    resumeTextLabels();
    // update status of each node to be unhighlighted
    for (var node in nodes_to_highlight) {
        for (var target in complete_data_example) {
            if (node == target.name) {
                target.highlighted = false;
            }
        }
    }
    // reset nodes to highlight
    nodes_to_highlight = [];
}


// MARK: - functionality of collapsing nodes
// function: collapse nodes
function collapseNodes(nodes, toExpand) {
    if (toExpand == true) {
        nodes.forEach(function (entry) {
            d3.select("#" + entry).attr("visibility", "visible");
        });
    } else {
        nodes.forEach(function (entry) {
            d3.select("#" + entry).attr("visibility", "hidden");
        });
    }
}

// function: collapse edges
function collapseEdges(edges, toExpand) {
    if (toExpand == true) {
        edges.forEach(function (entry) {
            d3.select("#" + entry).attr("visibility", "visible");
        });
    } else {
        edges.forEach(function (entry) {
            d3.select("#" + entry).attr("visibility", "hidden");
        });
    }
}

// function: collapse text labels
function collapseTexts(texts, toExpand) {
    if (toExpand == true) {
        texts.forEach(function (entry) {
            d3.select("#t_" + entry).attr("visibility", "visible");
        });
    } else {
        texts.forEach(function (entry) {
            d3.select("#t_" + entry).attr("visibility", "hidden");
        });
    }
}

// function: wrapper function for collapsing all elements
// MARK: - this function should be called whenever a node is clicked
function collapseGraph(data_point, index) {
    // nodes that have to be hidden
    nodes_to_collapse = data_point.descendant.slice();
    nodes_to_collapse = [];
    for (var i = 0; i < data_point.descendant.length; i++) {
        nodes_to_collapse.push(data_point.descendant[i]);
    }
    // remove current node in the list, we are not hiding that one
    // findDescendantEdges(data_point);
    var edges_to_collapse = findEdgesToCollapse();
    // check collapse status of current data_point
    if (data_point.expanded == true) {
        // should collapse
        collapseNodes(nodes_to_collapse, false);
        collapseEdges(edges_to_collapse, false);
        collapseTexts(nodes_to_collapse, false);
        // update collapse edges
        for (var node in nodes_to_collapse) {
            for (var target in complete_data_example) {
                if (node == target.name) {
                    target.expanded = false;
                }
            }
        }
        // update current node's status
        data_point.expanded = false;
    } else {
        // should expand
        collapseNodes(nodes_to_collapse, true);
        collapseEdges(edges_to_collapse, true);
        collapseTexts(nodes_to_collapse, true);
        // update collapse edges
        for (var node in nodes_to_collapse) {
            for (var target in complete_data_example) {
                if (node == target.name) {
                    target.expanded = true;
                }
            }
        }
        // update current node's status
        data_point.expanded = true;
    }
}

// MARK: - wrapper function to be called at the beginning of drawing
// this function should be called when the graph has to be drawn for the first time
function startDrawingGraph() {
    drawLines();
    drawBasicNodes();
    drawLabels();
}
