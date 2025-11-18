class Edge {
	from: string
	to: string
	weight: number
	name: string

	constructor(from: string, to: string, weight: number, name: string) {
		this.from = from
		this.to = to
		this.weight = weight
		this.name = name
	}
}

class Vertex {
	name: string
	mark: number

	constructor(name: string, mark: number = 0) {
		this.name = name
		this.mark = mark
	}

	toString(): string {
		return `${this.name}(${this.mark})`
	}
}

class Graph {
	private vertices: Vertex[]
	private edges: Edge[]
	private nameToIndex: { [key: string]: number }
	private incidenceMatrix: number[][]

	constructor() {
		this.vertices = []
		this.edges = []
		this.nameToIndex = {}
	}

	getVertices(): Vertex[] {
		return this.vertices
	}

	FIRST(vertexName: string): string | null {
		if (!this.nameToIndex.hasOwnProperty(vertexName)) {
			return null
		}

		for (let i = 0; i < this.edges.length; i++) {
			const edge = this.edges[i]
			if (edge.from === vertexName) {
				return edge.to
			}
		}

		return null
	}

	NEXT(vertexName: string, currentAdjacent: string): string | null {
		if (!this.nameToIndex.hasOwnProperty(vertexName)) {
			return null
		}

		let found = false

		for (let i = 0; i < this.edges.length; i++) {
			const edge = this.edges[i]
			if (edge.from === vertexName) {
				if (found) {
					return edge.to
				}
				if (edge.to === currentAdjacent) {
					found = true
				}
			}
		}

		return null
	}

	VERTEX(vertexName: string, index: number): string | null {
		if (!this.nameToIndex.hasOwnProperty(vertexName)) {
			return null
		}

		const adjacent: string[] = []

		for (let i = 0; i < this.edges.length; i++) {
			const edge = this.edges[i]
			if (edge.from === vertexName && adjacent.indexOf(edge.to) === -1) {
				adjacent.push(edge.to)
			}
		}

		if (index < 0 || index >= adjacent.length) {
			return null
		}

		return adjacent[index]
	}

	ADD_V(name: string, mark: number = 0): boolean {
		if (this.nameToIndex.hasOwnProperty(name)) {
			return false
		}

		this.vertices.push(new Vertex(name, mark))
		this.nameToIndex[name] = this.vertices.length - 1
		this.updateMatrix()
		return true
	}

	ADD_E(from: string, to: string, weight: number): boolean {
		if (
			!this.nameToIndex.hasOwnProperty(from) ||
			!this.nameToIndex.hasOwnProperty(to)
		) {
			return false
		}

		for (let i = 0; i < this.edges.length; i++) {
			const edge = this.edges[i]
			if (edge.from === from && edge.to === to) {
				return false
			}
		}

		const edgeName = `${from}_${to}`
		this.edges.push(new Edge(from, to, weight, edgeName))
		this.updateMatrix()
		return true
	}

	DEL_V(name: string): boolean {
		if (!this.nameToIndex.hasOwnProperty(name)) {
			return false
		}

		this.edges = this.edges.filter(
			edge => edge.from !== name && edge.to !== name
		)

		const indexToRemove = this.nameToIndex[name]
		this.vertices.splice(indexToRemove, 1)
		delete this.nameToIndex[name]

		this.nameToIndex = {}
		for (let i = 0; i < this.vertices.length; i++) {
			this.nameToIndex[this.vertices[i].name] = i
		}

		this.updateMatrix()
		return true
	}

	DEL_E(from: string, to: string): boolean {
		const initialLength = this.edges.length
		this.edges = this.edges.filter(
			edge => !(edge.from === from && edge.to === to)
		)

		if (this.edges.length < initialLength) {
			this.updateMatrix()
			return true
		}
		return false
	}

	EDIT_V(name: string, newMark: number): boolean {
		if (!this.nameToIndex.hasOwnProperty(name)) {
			return false
		}

		const index = this.nameToIndex[name]
		this.vertices[index].mark = newMark
		return true
	}

	EDIT_E(from: string, to: string, newWeight: number): boolean {
		for (let i = 0; i < this.edges.length; i++) {
			const edge = this.edges[i]
			if (edge.from === from && edge.to === to) {
				edge.weight = newWeight
				return true
			}
		}
		return false
	}

	private updateMatrix(): void {
		this.incidenceMatrix = []

		for (let i = 0; i < this.vertices.length; i++) {
			this.incidenceMatrix[i] = []
			for (let j = 0; j < this.edges.length; j++) {
				if (this.edges[j].from === this.vertices[i].name) {
					this.incidenceMatrix[i][j] = -1
				} else if (this.edges[j].to === this.vertices[i].name) {
					this.incidenceMatrix[i][j] = 1
				} else {
					this.incidenceMatrix[i][j] = 0
				}
			}
		}
	}

	areAdjacent(v1: string, v2: string): boolean {
		for (let i = 0; i < this.edges.length; i++) {
			const edge = this.edges[i]
			if (
				(edge.from === v1 && edge.to === v2) ||
				(edge.from === v2 && edge.to === v1)
			) {
				return true
			}
		}
		return false
	}

	getEdgeWeight(from: string, to: string): number {
		for (let i = 0; i < this.edges.length; i++) {
			const edge = this.edges[i]
			if (edge.from === from && edge.to === to) {
				return edge.weight
			}
		}
		return -1
	}

	printGraph(): void {
		console.log('=== СТРУКТУРА ГРАФА ===')
		console.log('Вершины:')
		for (let i = 0; i < this.vertices.length; i++) {
			const vertex = this.vertices[i]
			console.log(`  ${vertex.name} (метка: ${vertex.mark})`)
		}

		console.log('\nДуги:')
		for (let i = 0; i < this.edges.length; i++) {
			const edge = this.edges[i]
			console.log(`  ${edge.from} -> ${edge.to} (вес: ${edge.weight})`)
		}

		console.log('\nМатрица инцидентности:')
		let header = '     '
		for (let j = 0; j < this.edges.length; j++) {
			header += this.padString(this.edges[j].name, 8)
		}
		console.log(header)

		for (let i = 0; i < this.vertices.length; i++) {
			let row = this.padString(this.vertices[i].name, 4) + ' '
			for (let j = 0; j < this.edges.length; j++) {
				row += this.padString(this.incidenceMatrix[i][j].toString(), 8)
			}
			console.log(row)
		}
		console.log()
	}

	private padString(str: string, length: number): string {
		let result = str
		while (result.length < length) {
			result += ' '
		}
		return result.substr(0, length)
	}

	getAllVertices(): string[] {
		return this.vertices.map(v => v.name)
	}

	getOutgoingEdges(vertexName: string): Edge[] {
		return this.edges.filter(edge => edge.from === vertexName)
	}
}

class Path {
	vertices: string[]
	usedEdges: Edge[]
	totalCost: number

	constructor() {
		this.vertices = []
		this.usedEdges = []
		this.totalCost = 0
	}

	clone(): Path {
		const newPath = new Path()
		newPath.vertices = [...this.vertices]
		newPath.usedEdges = [...this.usedEdges]
		newPath.totalCost = this.totalCost
		return newPath
	}

	addEdge(edge: Edge): void {
		if (this.vertices.length === 0) {
			this.vertices.push(edge.from)
		}
		this.vertices.push(edge.to)
		this.usedEdges.push(edge)
		this.totalCost += edge.weight
	}

	toString(): string {
		return `Путь: ${this.vertices.join(
			' -> '
		)}, Стоимость: ${this.totalCost.toFixed(2)}`
	}
}

class PathFinder {
	findMinPathThroughXEdges(graph: Graph, xEdges: number): Path | null {
		let bestPath = new Path()
		bestPath.totalCost = Number.MAX_VALUE
		const allVertices = graph.getAllVertices()

		for (let k = 0; k < allVertices.length; k++) {
			const startVertex = allVertices[k]
			const stack: [string, Path, { [key: string]: boolean }][] = []

			const initialPath = new Path()
			initialPath.vertices.push(startVertex)
			const initialUsedEdges: { [key: string]: boolean } = {}

			stack.push([startVertex, initialPath, initialUsedEdges])

			while (stack.length > 0) {
				const [current, path, usedEdges] = stack.pop()!

				if (path.usedEdges.length === xEdges) {
					const start = path.vertices[0]
					const end = path.vertices[path.vertices.length - 1]

					if (
						!graph.areAdjacent(start, end) &&
						path.totalCost < bestPath.totalCost
					) {
						bestPath = path
					}
					continue
				}

				const outgoingEdges = graph.getOutgoingEdges(current)

				for (let i = 0; i < outgoingEdges.length; i++) {
					const edge = outgoingEdges[i]
					const edgeId = `${edge.from}_${edge.to}`

					if (!usedEdges[edgeId]) {
						const newPath = path.clone()
						const newUsedEdges: { [key: string]: boolean } = {}

						for (const key in usedEdges) {
							if (usedEdges.hasOwnProperty(key)) {
								newUsedEdges[key] = usedEdges[key]
							}
						}

						newPath.addEdge(edge)
						newUsedEdges[edgeId] = true

						stack.push([edge.to, newPath, newUsedEdges])
					}
				}
			}
		}

		return bestPath.totalCost < Number.MAX_VALUE ? bestPath : null
	}
}

class Program {
	static main(): void {
		console.log('=== ПРОГРАММА ДЛЯ РАБОТЫ С ГРАФОМ ===')

		console.log('\n=== ПРИМЕР 1 ===')
		this.testExample1()

		console.log('\n=== ПРИМЕР 2 ===')
		this.testExample2()
	}

	static testExample1(): void {
		const graph = new Graph()

		graph.ADD_V('A', 1)
		graph.ADD_V('B', 2)
		graph.ADD_V('C', 3)
		graph.ADD_V('D', 4)
		graph.ADD_V('E', 5)

		graph.ADD_E('A', 'B', 2.5)
		graph.ADD_E('A', 'C', 1.0)
		graph.ADD_E('B', 'D', 3.0)
		graph.ADD_E('C', 'D', 2.0)
		graph.ADD_E('D', 'E', 4.0)
		graph.ADD_E('B', 'E', 5.0)

		graph.printGraph()

		console.log('Вершины:')
		const vertices = graph.getVertices()
		for (let i = 0; i < vertices.length; i++) {
			const vertex = vertices[i]
			console.log(`  Вершина: ${vertex.name}, Метка: ${vertex.mark}`)
		}

		console.log('\nТестирование методов АТД:')
		console.log(`FIRST(A) = ${graph.FIRST('A')}`)
		console.log(`NEXT(A, B) = ${graph.NEXT('A', 'B')}`)
		console.log(`VERTEX(A, 1) = ${graph.VERTEX('A', 1)}`)

		console.log('\nПоиск минимального пути через 3 дуги:')
		const finder = new PathFinder()
		const result = finder.findMinPathThroughXEdges(graph, 3)

		if (result !== null) {
			console.log(`Найден: ${result}`)
		} else {
			console.log('Путь не найден')
		}
	}

	static testExample2(): void {
		const graph = new Graph()

		graph.ADD_V('1', 10)
		graph.ADD_V('2', 20)
		graph.ADD_V('3', 30)
		graph.ADD_V('4', 40)
		graph.ADD_V('5', 50)

		graph.ADD_E('1', '2', 1.0)
		graph.ADD_E('2', '3', 2.0)
		graph.ADD_E('3', '4', 3.0)
		graph.ADD_E('1', '3', 4.0)
		graph.ADD_E('2', '4', 5.0)
		graph.ADD_E('4', '5', 1.5)
		graph.ADD_E('5', '1', 2.5)

		graph.printGraph()

		console.log('Вершины:')
		const vertices = graph.getVertices()
		for (let i = 0; i < vertices.length; i++) {
			const vertex = vertices[i]
			console.log(`  Вершина: ${vertex.name}, Метка: ${vertex.mark}`)
		}

		console.log('\nПоиск минимального пути через 2 дуги:')
		const finder = new PathFinder()
		const result = finder.findMinPathThroughXEdges(graph, 2)

		if (result !== null) {
			console.log(`Найден: ${result}`)
		} else {
			console.log('Путь не найден')
		}

		console.log('\nТестирование редактирования:')
		graph.EDIT_V('1', 100)
		graph.EDIT_E('1', '2', 10.0)
		console.log('После редактирования:')
		graph.printGraph()
	}
}

Program.main()
