var dot = require('graphlib-dot');

module.exports.parseDOT = function (dotfile) {
    var graph = dot.read(dotfile);
    let obj = Object(), incounts = {};
    graph.nodes().forEach(node => {
        incounts[node] = 0;
    });
    graph.edges().forEach(item => {
        if (obj[item.v]) {
            obj[item.v].push(item.w);
        } else {
            obj[item.v] = [item.w];
        }
        incounts[item.w] += 1;
    });
    // Sort each set of edges by the node they connect to
    Object.keys(obj).forEach(key => obj[key].sort());
    let sources = Object.keys(incounts).filter(node => incounts[node] === 0);
    return [obj, sources];
};

module.exports.parseRSF = function (rsffile) {
    let lines = rsffile.split(/\r?\n/);
    let graph = {}, nodes = new Set(), incounts = new Set();
    lines.map(l => l.split(' ')).forEach(([_, parent, child]) => {
        if (!graph[parent]) {
            graph[parent] = [];
        }
        graph[parent].push(child);
        nodes.add(parent).add(child);
        incounts.add(child);
    });
    // Find the set difference nodes \ incounts
    Object.keys(graph).forEach(key => graph[key].sort());
    let sources = [...nodes].filter(node => !incounts.has(node));
    return [graph, sources];
};