let gridLevel = 2;

let tileColors = [
    "#fdfdfd",
    "#ff9595",
    "#e7ffa1",
    "#bcfff9",
    "#8bc9ff",
    "#b2abff",
    "#ffd3ff",
    "#ffc298",
    "#ffeba9",

    "#fdfdfd",  // temporary
    "#ff9595",
    "#e7ffa1",
    "#bcfff9",
    "#8bc9ff",
    "#b2abff",
    "#ffd3ff",
]

let level1 = {
    gridLevel: 2,
    data: [
        [ 2,  ,  ,  ],
        [  ,  , 3,  ],
        [  ,  ,  , 1],
        [  , 0,  ,  ],
    ]
}

let lvl = 0;

function checkWin() {
    let gamePanel = document.getElementById('gamePanel');
    let gridSize = gridLevel ** 2;
    
    for (let i = 0; i < gamePanel.children.length; i++) {
        let subgrid = gamePanel.children[i];
        let colors = [];
        for (let j = 0; j < subgrid.children.length; j++) {
            let c = subgrid.children[j].dataset.color;
            if (colors[c]) return false;                        // Duplicate colors in group
            colors[c] = true;
        }
    }

    let colorMapX = [];
    let colorMapY = [];
    let colorMapUR = [];    // diagonals
    let colorMapDR = [];
    for (let i = 0; i < gridSize; i++) {
        colorMapX[i] = [];
        colorMapY[i] = [];
    }

    let gridTiles = document.getElementsByClassName("gridTile");
    for (let i = 0; i < gridTiles.length; i++) {
        let button = gridTiles[i];
        let c = button.dataset.color;

        if (colorMapX[button.dataset.x][c]) return false;          // Duplicate colors in column
        if (colorMapY[button.dataset.y][c]) return false;          // Duplicate colors in row
        colorMapX[button.dataset.x][c] = true;
        colorMapY[button.dataset.y][c] = true;

        // if (button.dataset.x == button.dataset.y) {
        //     if (colorMapDR[c]) return false;
        //     colorMapDR[c] = true;
        // }
        // if (button.dataset.x == gridSize - button.dataset.y - 1) {
        //     if (colorMapUR[c]) return false;
        //     colorMapUR[c] = true;
        // }
    }

    return true;
}

function initLevel(levelObj) {
    gridLevel = levelObj.gridLevel;
    initGrid(gridLevel, levelObj.data);
}

function setTileColor(button, index) {
    button.style.backgroundColor = tileColors[index];
    button.dataset.color = index + "";
}

function gridButtonPress(event) {
    let button = event.target;
    let x = button.dataset.x;
    let y = button.dataset.y;
    let rightClick = (event.which == 3);

    if (button.dataset.isPermanent) return;

    let buttonColor = button.dataset.color * 1;
    setTileColor(button, mod(rightClick?  buttonColor - 1 : buttonColor + 1, gridLevel**2));

    if (checkWin()) {
        lvl++;

        if (!puzzles[lvl]) return;
        initLevel(loadLevel(puzzles[lvl]))
        console.log("You won!");

        document.getElementById("level").innerHTML = lvl + 1;
    }
}

function initGrid(level, data) {
    let gamePanel = document.getElementById('gamePanel');

    for (let i = gamePanel.children.length - 1; i >= 0; i--) {
        gamePanel.children[i].remove();
    }

    let period = "";
    for (let i = 0; i < level; i++) {
        period += "1fr ";
    }
    let gridTemplate = period + "/ " + period;
    gamePanel.style.gridTemplate = gridTemplate;

    for (let b = 0; b < level; b++) {
        for (let a = 0; a < level; a++) {
            let subGrid = document.createElement("div");
            subGrid.classList.add("gameInnerPanel");
            subGrid.style.gridTemplate = gridTemplate;

            for (let y = 0; y < level; y++) {
                for (let x = 0; x < level; x++) {
                    let button = document.createElement("button");
                    button.classList.add('gridTile');
                    button.dataset.x = (x + a * level) + "";
                    button.dataset.y = (y + b * level) + "";
                    // add in data
                    if (data && data[button.dataset.y][button.dataset.x] != undefined) {
                        button.dataset.isPermanent = true;
                        button.classList.add('permanentTile');
                        setTileColor(button, data[button.dataset.y][button.dataset.x]);
                    } else {
                        setTileColor(button, 0);
                    }
                    button.addEventListener("mousedown", gridButtonPress);
                    subGrid.appendChild(button);
                }
            }

            gamePanel.appendChild(subGrid);
        }
    }
}

function getTile(x, y) {
    let gridTiles = document.getElementsByClassName("gridTile");
    for (let i = 0; i < gridTiles.length; i++) {
        let g = gridTiles[i];
        if (g.dataset.x == x && g.dataset.y == y) return g;
    }
}

function copyGrid(grid) {
    let out = [];
    for (let i = 0; i < grid.length; i++) {
        out[i] = [];
        for (let j = 0; j < grid[i].length; j++) {
            out[i][j] = grid[i][j];
        }    
    }
    return out;
}

function printGrid(grid) {
    let gridSize = gridLevel ** 2;
    let str = "";
    for (let y = 0; y < gridSize; y++) {
        for (let x = 0; x < gridSize; x++) {
            let g = grid[y][x];
            str += (g == undefined? "." : g) + " ";
        }
        str += " ";
    }
    console.log(str);
}

// It starts counting the number of possible solutions
// When this number is small, it has no problem finding it, and you can terminate it at a maximum threshold (like 4096, etc.)
// Given a difficulty level, i.e. a desired number of solutions, it can do the below process but in a RANDOMLY selected order 
// Finding solutions is also done randomly, but thouroughly by shuffling the order of checks
// For each step, a given color choice is valid if it produces > than the # of desired solutions, so you can find the valid ones and choose randomly
// By the end, it should terminate at a point where the chosen tile doesn't have any colors that wouldn't make the puzzle easier than desired
// It can continue here by eliminating that tile from the remaining pool and choosing the next one
// By now it terminates by optimizing the solution set to be as close to the desired number as possible, without going beneath it, and ends by eliminating all remaining tile choices
// Remember that once selected, a tile's color can't be changed and is already part of the final puzzle (so long as it is valid)

// Method 1
// Vine approach
// 

// Picks tiles one by one and counts solutions for each, eliminating the rest
// Recursion tree - each tile knows how many solutions it produces
// first path 
//
//

// Import strings ..3..1...5.8.01.

// Mode: up to 3 of each color in each group

// Dad's card: What?
// Umm, what? (what the Golf?)

let count = 0;
let max = 2 ** 4; // 65536
let solutionCount = 0;  // by far easier to make this global

function generateGrid(gridState, initialIdx, batchIdx) {
    let gridSize = gridLevel ** 2;
    if (initialIdx >= gridSize ** 2) {
        solutionCount++;
        console.log(gridState)
        return gridState;
    }
    let x = initialIdx % gridSize;
    let y = Math.floor(initialIdx / gridSize);
    
    let badColors = [];

        // I'll clean this up after
    for (let u = x - 1; u >= 0; u--) badColors[gridState[y][u]] = true;
    for (let v = y - 1; v >= 0; v--) badColors[gridState[v][x]] = true;
    for (let v = y - y % gridLevel; v < y; v++) {
        for (let u = x - x % gridLevel; u < x; u++) {
            badColors[gridState[v][u]] = true;
        }
    }
    if (x == y) for (let i = x - 1; i >= 0; i--) badColors[gridState[i][i]] = true;
    if (x == gridSize - y - 1) for (let i = x - 1; i >= 0; i--) badColors[gridState[gridSize - i - 1][i]] = true;

    for (let i = 0; i < gridSize; i++) {
        if (!badColors[i]) {
            let newGrid = copyGrid(gridState);
            newGrid[y][x] = i;
            let grid = generateGrid(newGrid, initialIdx + 1, batchIdx + 1);
            if (solutionCount >= max) return grid;
        }
    }

    count++;
}

function loadLevel(levelStr) {
    let out = [];
    let size = levelStr.charAt(0) * 1;

    for (let y = 0; y < size * size; y++) {
        out[y] = [];
        for (let x = 0; x < size * size; x++) {
            let c = levelStr.charAt(2 + y * 4 + x);
            if (c != ".") out[y][x] = c;
        }
    }

    return {
        gridLevel: size,
        data: out
    }
}

function makeLevel() {
    solutionCount = 0;
    console.log(generateGrid([[],[],[],[],[],[],[],[],[]], 0, 0));
    console.log(solutionCount);
    console.log(count)
}

function onInit() {
    initLevel(loadLevel(puzzles[lvl]));

    // initLevel(level1);

    // makeLevel();
    // console.log(count)

    // let data = ["33010020300004005060070000008006900070000100002030048000500006040000800106008000000",
    // "33010020300002003040050000006004700050000100003070068000300004090000600104006000000",
    // "33010020300002003040080000006004700030000600008070098000300004090000800104006000000",
    // "33010020300002003040050000006004200050000100007020087000300004080000600105006000000",
    // "33010020300002003040050000006004700050000100008070098000300004090000900804006000000",
    // "33010020300004003020050000006002700050000100008070098000300007090000600102007000000",
    // "33010020300002003040050000006004700050000100008070038000300005090000600104006000000",
    // "33010020300004001050060000007005400060000100002080092000300005090000700106007000000",
    // "33010020300003004050060000007005800060000100009080092000400005090000700106007000000",
    // "33010020300004003050050000006005700040000100002070082000300005090000600105006000000",
    // "33010020300002003040050000006004700050000100008070068000300004060000500104009000000",
    // "33010020300002003040050000006004700050000100008070095000300004090000900104006000000",
    // "33010020300004005060070000008006300070000100002030092000900006040000800106008000000",
    // "33080070100003002090060000004009500060000700005020041000100005020000200901004000000",
    // "33010020300002003040040000006004700050000600008070098000300005080000800104009000000",
    // "33020010700003008060010000003008600050000900004030021000400009080000500901007000000",
    // "33010020300003004050060000007005800060000100002080072000400005090000700104007000000",
    // "33010020300002003040050000006007800050000100004080094000300007090000400105006000000",
    // "33010020300004003020050000006007600050000100002060072000300008070000900108009000000",
    // "33010020300004003050060000007005800060000900001080012000300005010000700506002000000",
    // "33010020300004003050020000006005700020000100008070098000300005090000900205006000000",
    // "33010020300004003020050000006007800050000100002080042000300007040000600807006000000",
    // "33070050800005008020010000009008100050000200001090034000900002030000600107006000000",
    // "33010020300004005060070000004006800070000900002050017000400006050000400906008000000",
    // "33010020300004005060070000008006900080000100002090032000200006030000800105008000000",
    // "33010020300002003040050000006004700050000100008070098000200004090000600704006000000",
    // "33010020300002003040050000006004700050000100008070068000300004090000800104006000000",
    // "33010020300004001050060000007005800070000900002080014000300005010000700905007000000",
    // "33010020300004003020050000006002700050000800009070019000300002010000600805006000000",
    // "33010020300003004050060000007008900070000100002090082000200005080000700105007000000",
    // "33010020300004003050020000006007800040000100005080095000300007090000600107006000000",
    // "33010020300002003040050000006004700080000100003070068000300004090000600104006000000",
    // "33090020500004005010060000003001800060000900002080072000500001070000300901003000000",
    // "33010020300004001050060000007005800060000100003080092000300005090000700102007000000",
    // "33010020300002003040050000006004700050000100008020098000700004090000600104006000000",
    // "33010020300003004050060000004005700060000100002070032000400005080000900105009000000",
    // "33010020300004003050060000007005800040000100002080092000600005090000700105002000000",
    // "33010020300004003050060000007005100060000800002080092000300006090000700205007000000",
    // "33010020300004005060070000008006900030000100002090042000500006040000800106008000000",
    // "33010020300004003050060000007005200060000100008020048000300005090000700205009000000",
    // "33070040800009005060060000003004100070000200006020034000100008090000600401007000000",
    // "33010020300004003050060000007005200040000800001020091000300005090000700805007000000",
    // "33010020300004001050060000007005200060000800009020019000300005010000700805007000000",
    // "33010020300004001050060000007005800060000900002080014000300005010000700905007000000",
    // "33010020300004003050060000007005800060000100002070092000400005090000700105007000000",
    // "33010020300004005060050000004006700040000100002070082000300006080000900106009000000",
    // "33010020300004003050020000006005700080000100002070098000800005090000600105006000000",
    // "33010020300004003050060000007005800040000100008080092000300005090000700605007000000",
    // "33010020300004005060070000008006900040000100002090032000500006030000800906008000000",
    // "33010020300004003050060000007005800060000100002070092000300005090000700105007000000",
    // "33010020300002003040050000006004700050000600008070098000300004090000800104006000000",
    // "33010020300004003050060000007005800060000100009080042000300005040000700908001000000",
    // "33070060900006002030020000006003100040000200008050034000900003020000700105008000000",
    // "33010020300004003050060000001005700060000800002070012000400005090000400805007000000",]
    // let out = [];
    // for (let i = 0; i < data.length; i++) {
    //     let set = data[i];
    //     set = set.replace(/0/g, ".");
    //     for (let i = 2; i < set.length; i++) {
    //         if (set.charAt(i) != ".")   set = set.slice(0, i) + (set.charAt(i) * 1 - 1) + set.slice(i + 1, set.length);
    //     }
    //     // set = "22" + set;
    //     out.push(set);
    // }
    // console.log(out)

    document.getElementById("panelContainer").addEventListener('contextmenu', e => e.preventDefault());
}

window.onload = onInit;
