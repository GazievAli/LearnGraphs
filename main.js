var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var Edge = /** @class */ (function () {
    function Edge(from, to, weight, name) {
        this.from = from;
        this.to = to;
        this.weight = weight;
        this.name = name;
    }
    return Edge;
}());
var Vertex = /** @class */ (function () {
    function Vertex(name, mark) {
        if (mark === void 0) { mark = 0; }
        this.name = name;
        this.mark = mark;
    }
    Vertex.prototype.toString = function () {
        return "".concat(this.name, "(").concat(this.mark, ")");
    };
    return Vertex;
}());
var Graph = /** @class */ (function () {
    function Graph() {
        this.vertices = [];
        this.edges = [];
        this.nameToIndex = {};
    }
    Graph.prototype.getVertices = function () {
        return this.vertices;
    };
    Graph.prototype.FIRST = function (vertexName) {
        if (!this.nameToIndex.hasOwnProperty(vertexName)) {
            return null;
        }
        for (var i = 0; i < this.edges.length; i++) {
            var edge = this.edges[i];
            if (edge.from === vertexName) {
                return edge.to;
            }
        }
        return null;
    };
    Graph.prototype.NEXT = function (vertexName, currentAdjacent) {
        if (!this.nameToIndex.hasOwnProperty(vertexName)) {
            return null;
        }
        var found = false;
        for (var i = 0; i < this.edges.length; i++) {
            var edge = this.edges[i];
            if (edge.from === vertexName) {
                if (found) {
                    return edge.to;
                }
                if (edge.to === currentAdjacent) {
                    found = true;
                }
            }
        }
        return null;
    };
    Graph.prototype.VERTEX = function (vertexName, index) {
        if (!this.nameToIndex.hasOwnProperty(vertexName)) {
            return null;
        }
        var adjacent = [];
        for (var i = 0; i < this.edges.length; i++) {
            var edge = this.edges[i];
            if (edge.from === vertexName && adjacent.indexOf(edge.to) === -1) {
                adjacent.push(edge.to);
            }
        }
        if (index < 0 || index >= adjacent.length) {
            return null;
        }
        return adjacent[index];
    };
    Graph.prototype.ADD_V = function (name, mark) {
        if (mark === void 0) { mark = 0; }
        if (this.nameToIndex.hasOwnProperty(name)) {
            return false;
        }
        this.vertices.push(new Vertex(name, mark));
        this.nameToIndex[name] = this.vertices.length - 1;
        this.updateMatrix();
        return true;
    };
    Graph.prototype.ADD_E = function (from, to, weight) {
        if (!this.nameToIndex.hasOwnProperty(from) ||
            !this.nameToIndex.hasOwnProperty(to)) {
            return false;
        }
        for (var i = 0; i < this.edges.length; i++) {
            var edge = this.edges[i];
            if (edge.from === from && edge.to === to) {
                return false;
            }
        }
        var edgeName = "".concat(from, "_").concat(to);
        this.edges.push(new Edge(from, to, weight, edgeName));
        this.updateMatrix();
        return true;
    };
    Graph.prototype.DEL_V = function (name) {
        if (!this.nameToIndex.hasOwnProperty(name)) {
            return false;
        }
        this.edges = this.edges.filter(function (edge) { return edge.from !== name && edge.to !== name; });
        var indexToRemove = this.nameToIndex[name];
        this.vertices.splice(indexToRemove, 1);
        delete this.nameToIndex[name];
        this.nameToIndex = {};
        for (var i = 0; i < this.vertices.length; i++) {
            this.nameToIndex[this.vertices[i].name] = i;
        }
        this.updateMatrix();
        return true;
    };
    Graph.prototype.DEL_E = function (from, to) {
        var initialLength = this.edges.length;
        this.edges = this.edges.filter(function (edge) { return !(edge.from === from && edge.to === to); });
        if (this.edges.length < initialLength) {
            this.updateMatrix();
            return true;
        }
        return false;
    };
    Graph.prototype.EDIT_V = function (name, newMark) {
        if (!this.nameToIndex.hasOwnProperty(name)) {
            return false;
        }
        var index = this.nameToIndex[name];
        this.vertices[index].mark = newMark;
        return true;
    };
    Graph.prototype.EDIT_E = function (from, to, newWeight) {
        for (var i = 0; i < this.edges.length; i++) {
            var edge = this.edges[i];
            if (edge.from === from && edge.to === to) {
                edge.weight = newWeight;
                return true;
            }
        }
        return false;
    };
    Graph.prototype.updateMatrix = function () {
        this.incidenceMatrix = [];
        for (var i = 0; i < this.vertices.length; i++) {
            this.incidenceMatrix[i] = [];
            for (var j = 0; j < this.edges.length; j++) {
                if (this.edges[j].from === this.vertices[i].name) {
                    this.incidenceMatrix[i][j] = -1;
                }
                else if (this.edges[j].to === this.vertices[i].name) {
                    this.incidenceMatrix[i][j] = 1;
                }
                else {
                    this.incidenceMatrix[i][j] = 0;
                }
            }
        }
    };
    Graph.prototype.areAdjacent = function (v1, v2) {
        for (var i = 0; i < this.edges.length; i++) {
            var edge = this.edges[i];
            if ((edge.from === v1 && edge.to === v2) ||
                (edge.from === v2 && edge.to === v1)) {
                return true;
            }
        }
        return false;
    };
    Graph.prototype.getEdgeWeight = function (from, to) {
        for (var i = 0; i < this.edges.length; i++) {
            var edge = this.edges[i];
            if (edge.from === from && edge.to === to) {
                return edge.weight;
            }
        }
        return -1;
    };
    Graph.prototype.printGraph = function () {
        console.log('=== СТРУКТУРА ГРАФА ===');
        console.log('Вершины:');
        for (var i = 0; i < this.vertices.length; i++) {
            var vertex = this.vertices[i];
            console.log("  ".concat(vertex.name, " (\u043C\u0435\u0442\u043A\u0430: ").concat(vertex.mark, ")"));
        }
        console.log('\nДуги:');
        for (var i = 0; i < this.edges.length; i++) {
            var edge = this.edges[i];
            console.log("  ".concat(edge.from, " -> ").concat(edge.to, " (\u0432\u0435\u0441: ").concat(edge.weight, ")"));
        }
        console.log('\nМатрица инцидентности:');
        var header = '     ';
        for (var j = 0; j < this.edges.length; j++) {
            header += this.padString(this.edges[j].name, 8);
        }
        console.log(header);
        for (var i = 0; i < this.vertices.length; i++) {
            var row = this.padString(this.vertices[i].name, 4) + ' ';
            for (var j = 0; j < this.edges.length; j++) {
                row += this.padString(this.incidenceMatrix[i][j].toString(), 8);
            }
            console.log(row);
        }
        console.log();
    };
    Graph.prototype.padString = function (str, length) {
        var result = str;
        while (result.length < length) {
            result += ' ';
        }
        return result.substr(0, length);
    };
    Graph.prototype.getAllVertices = function () {
        return this.vertices.map(function (v) { return v.name; });
    };
    Graph.prototype.getOutgoingEdges = function (vertexName) {
        return this.edges.filter(function (edge) { return edge.from === vertexName; });
    };
    return Graph;
}());
var Path = /** @class */ (function () {
    function Path() {
        this.vertices = [];
        this.usedEdges = [];
        this.totalCost = 0;
    }
    Path.prototype.clone = function () {
        var newPath = new Path();
        newPath.vertices = __spreadArray([], this.vertices, true);
        newPath.usedEdges = __spreadArray([], this.usedEdges, true);
        newPath.totalCost = this.totalCost;
        return newPath;
    };
    Path.prototype.addEdge = function (edge) {
        if (this.vertices.length === 0) {
            this.vertices.push(edge.from);
        }
        this.vertices.push(edge.to);
        this.usedEdges.push(edge);
        this.totalCost += edge.weight;
    };
    Path.prototype.toString = function () {
        return "\u041F\u0443\u0442\u044C: ".concat(this.vertices.join(' -> '), ", \u0421\u0442\u043E\u0438\u043C\u043E\u0441\u0442\u044C: ").concat(this.totalCost.toFixed(2));
    };
    return Path;
}());
var PathFinder = /** @class */ (function () {
    function PathFinder() {
    }
    PathFinder.prototype.findMinPathThroughXEdges = function (graph, xEdges) {
        var bestPath = new Path();
        bestPath.totalCost = Number.MAX_VALUE;
        var allVertices = graph.getAllVertices();
        for (var k = 0; k < allVertices.length; k++) {
            var startVertex = allVertices[k];
            var stack = [];
            var initialPath = new Path();
            initialPath.vertices.push(startVertex);
            var initialUsedEdges = {};
            stack.push([startVertex, initialPath, initialUsedEdges]);
            while (stack.length > 0) {
                var _a = stack.pop(), current = _a[0], path = _a[1], usedEdges = _a[2];
                if (path.usedEdges.length === xEdges) {
                    var start = path.vertices[0];
                    var end = path.vertices[path.vertices.length - 1];
                    if (!graph.areAdjacent(start, end) &&
                        path.totalCost < bestPath.totalCost) {
                        bestPath = path;
                    }
                    continue;
                }
                var outgoingEdges = graph.getOutgoingEdges(current);
                for (var i = 0; i < outgoingEdges.length; i++) {
                    var edge = outgoingEdges[i];
                    var edgeId = "".concat(edge.from, "_").concat(edge.to);
                    if (!usedEdges[edgeId]) {
                        var newPath = path.clone();
                        var newUsedEdges = {};
                        for (var key in usedEdges) {
                            if (usedEdges.hasOwnProperty(key)) {
                                newUsedEdges[key] = usedEdges[key];
                            }
                        }
                        newPath.addEdge(edge);
                        newUsedEdges[edgeId] = true;
                        stack.push([edge.to, newPath, newUsedEdges]);
                    }
                }
            }
        }
        return bestPath.totalCost < Number.MAX_VALUE ? bestPath : null;
    };
    return PathFinder;
}());
var Program = /** @class */ (function () {
    function Program() {
    }
    Program.main = function () {
        console.log('=== ПРОГРАММА ДЛЯ РАБОТЫ С ГРАФОМ ===');
        console.log('\n=== ПРИМЕР 1 ===');
        this.testExample1();
        console.log('\n=== ПРИМЕР 2 ===');
        this.testExample2();
    };
    Program.testExample1 = function () {
        var graph = new Graph();
        graph.ADD_V('A', 1);
        graph.ADD_V('B', 2);
        graph.ADD_V('C', 3);
        graph.ADD_V('D', 4);
        graph.ADD_V('E', 5);
        graph.ADD_E('A', 'B', 2.5);
        graph.ADD_E('A', 'C', 1.0);
        graph.ADD_E('B', 'D', 3.0);
        graph.ADD_E('C', 'D', 2.0);
        graph.ADD_E('D', 'E', 4.0);
        graph.ADD_E('B', 'E', 5.0);
        graph.printGraph();
        console.log('Вершины:');
        var vertices = graph.getVertices();
        for (var i = 0; i < vertices.length; i++) {
            var vertex = vertices[i];
            console.log("  \u0412\u0435\u0440\u0448\u0438\u043D\u0430: ".concat(vertex.name, ", \u041C\u0435\u0442\u043A\u0430: ").concat(vertex.mark));
        }
        console.log('\nТестирование методов АТД:');
        console.log("FIRST(A) = ".concat(graph.FIRST('A')));
        console.log("NEXT(A, B) = ".concat(graph.NEXT('A', 'B')));
        console.log("VERTEX(A, 1) = ".concat(graph.VERTEX('A', 1)));
        console.log('\nПоиск минимального пути через 3 дуги:');
        var finder = new PathFinder();
        var result = finder.findMinPathThroughXEdges(graph, 3);
        if (result !== null) {
            console.log("\u041D\u0430\u0439\u0434\u0435\u043D: ".concat(result));
        }
        else {
            console.log('Путь не найден');
        }
    };
    Program.testExample2 = function () {
        var graph = new Graph();
        graph.ADD_V('1', 10);
        graph.ADD_V('2', 20);
        graph.ADD_V('3', 30);
        graph.ADD_V('4', 40);
        graph.ADD_V('5', 50);
        graph.ADD_E('1', '2', 1.0);
        graph.ADD_E('2', '3', 2.0);
        graph.ADD_E('3', '4', 3.0);
        graph.ADD_E('1', '3', 4.0);
        graph.ADD_E('2', '4', 5.0);
        graph.ADD_E('4', '5', 1.5);
        graph.ADD_E('5', '1', 2.5);
        graph.printGraph();
        console.log('Вершины:');
        var vertices = graph.getVertices();
        for (var i = 0; i < vertices.length; i++) {
            var vertex = vertices[i];
            console.log("  \u0412\u0435\u0440\u0448\u0438\u043D\u0430: ".concat(vertex.name, ", \u041C\u0435\u0442\u043A\u0430: ").concat(vertex.mark));
        }
        console.log('\nПоиск минимального пути через 2 дуги:');
        var finder = new PathFinder();
        var result = finder.findMinPathThroughXEdges(graph, 2);
        if (result !== null) {
            console.log("\u041D\u0430\u0439\u0434\u0435\u043D: ".concat(result));
        }
        else {
            console.log('Путь не найден');
        }
        console.log('\nТестирование редактирования:');
        graph.EDIT_V('1', 100);
        graph.EDIT_E('1', '2', 10.0);
        console.log('После редактирования:');
        graph.printGraph();
    };
    return Program;
}());
Program.main();
