const canvas = document.getElementById('canvas')
const ctx = canvas.getContext('2d')

let gameState = [
    '2,2', '3,2', '4,3','3,4', '2,4', '1,3',
]

drawGrid()
render()
let timerId = setInterval(next, 500)
let running = true

document.body.onkeydown = event => {
    if (event.code === 'Space') {
        if (running) {
            clearInterval(timerId)
            running = false
        } else {
            timerId = setInterval(next, 500)
            running = true
        }
    }
} 

canvas.onclick = event => {
    const x = event.layerX
    const y = event.layerY
    const { row, column } = convertCoords(x, y)
    toggleCell(row + ',' + column)
    clear()
    drawGrid()
    render()
}

function drawGrid() {
    for (let x = 0; x <= canvas.width; x += 20) {
        ctx.moveTo(x, 0)
        ctx.lineTo(x, canvas.height)
        ctx.stroke()
    }
    for (let y = 0; y <= canvas.height; y += 20) {
        ctx.moveTo(0, y)
        ctx.lineTo(canvas.width, y)
        ctx.stroke()
    }
}

function fillCell(cellName) {
    const [row, column] = getRowColumn(cellName)
    ctx.fillRect(column * 20, row * 20, 20, 20)
}

function render() {
    for (let i = 0; i < gameState.length; i++) {
        fillCell(gameState[i])
    }
}

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

}
function convertCoords(x, y) {
    const column = Math.floor(x / 20);
    const row = Math.floor(y / 20);
    return { row, column };
}
function toggleCell(cellName) {
    const removed = removeItem(gameState, cellName)
    if (removed) return false
    gameState.push(cellName)
    return true
}

function enableCell(cellName) {
    if (!gameState.includes(cellName)) {
        gameState.push(cellName)
    }
}

function disableCell(cellName) {
    const i = gameState.indexOf(cellName)
    if (i !== -1) {
        gameState.splice(i, 1)
    }
}

function tick() {
    const newGameState = []
    let allNeighbors = []
    for (let i = 0; i < gameState.length; i++) {
        const neighbors = findNeighbors(gameState[i])
        allNeighbors.push(...neighbors)
        let count = 0
        for (let j = 0; j < neighbors.length && count < 4; j++) {
            const neighbor = neighbors[j]
            if (gameState.includes(neighbor)) count++
        }
        if (count > 1 && count < 4) newGameState.push(gameState[i])
    }
    allNeighbors = [...new Set(allNeighbors)]
    for (let i = 0; i < allNeighbors.length; i++) {
        const neighbors = findNeighbors(allNeighbors[i])
        let count = 0
        for (let j = 0; j < neighbors.length && count < 4; j++) {
            const neighbor = neighbors[j]
            if (gameState.includes(neighbor)) count++
        }
        if (count == 3) newGameState.push(allNeighbors[i])

    }
    gameState = newGameState;
}

function findNeighbors(cellName) {
    const [row,column] = getRowColumn(cellName)
    const neighbors = []
    if (row > 0) neighbors.push(`${row - 1},${column}`)
    if (row > 0, column > 0) neighbors.push(`${row - 1},${column - 1}`)
    if (row < 34 && column > 0) neighbors.push(`${row + 1},${column - 1}`)
    if (row > 0 && column < 49) neighbors.push(`${row - 1},${column + 1}`)
    if (column > 0) neighbors.push(`${row},${column - 1}`)
    if (row < 34 && column < 49) neighbors.push(`${row + 1},${column + 1}`)
    if (row < 34) neighbors.push(`${row + 1},${column}`)
    if (column < 49) neighbors.push(`${row},${column + 1}`)
    return neighbors
}

function getRowColumn(cellName) {
    return cellName.split(',').map(Number)
}
function removeItem(arr, item) {
    const i = arr.indexOf(item)
    if (i === -1) return false
    arr.splice(i,1) 
    return true
}

function next() {
    tick()
    clear()
    drawGrid()
    render()
}

