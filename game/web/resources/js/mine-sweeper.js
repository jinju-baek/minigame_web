
const $swpTbody = document.querySelector('#swpTable tbody');

const row = 10; // 줄
const cell = 10; // 칸
const mine = 10;
const CODE = {
    NORMAL: -1, // 닫힌 칸(지뢰 없음)
    QUESTION: -2,
    FLAG: -3,
    QUESTION_MINE: -4,
    FLAG_MINE: -5,
    MINE: -6,
    OPENED: 0, // 0이상이면 모두 열린 칸
}
let data;

function plantMine() {
    const candidate = Array(row * cell).fill().map((arr, i) => { return i });
    const shuffle = [];
    while (candidate.length > row * cell - mine) {
        const chosen = candidate.splice(Math.floor(Math.random() * candidate.length), 1)[0];
        shuffle.push(chosen);
    }
    const data = [];
    for (let i = 0; i < row; i++) {
        const rowData = [];
        for (let j = 0; j < cell; j++) {
            rowData.push(CODE.NORMAL);
        }
        data.push(rowData);
    }

    for (let k = 0; k < shuffle.length; k++) {
        const ver = Math.floor(shuffle[k] / cell);
        const hor = shuffle[k] % cell;
        data[ver][hor] = CODE.MINE;
    }
    return data;

}

function onRightClick(event) {
    event.preventDefault();
    const target = event.target;
    const rowIndex = target.parentNode.rowIndex;
    const cellIndex = target.cellIndex;
    const cellData = data[rowIndex][cellIndex];
    if (cellData === CODE.MINE) { // 지뢰면
        data[rowIndex][cellIndex] = CODE.QUESTION_MINE; // 물음표 지뢰로
        target.className = 'question';
        target.textContent = '?';
    } else if (cellData === CODE.QUESTION_MINE) { // 물음표 지뢰면
        data[rowIndex][cellIndex] = CODE.FLAG_MINE; // 깃발 지뢰로
        target.className = 'flag';
        target.textContent = '!';
    } else if (cellData === CODE.FLAG_MINE) { // 깃발 지뢰면
        data[rowIndex][cellIndex] = CODE.MINE; // 지뢰로
        target.className = '';
        target.textContent = 'X';
    } else if (cellData === CODE.NORMAL) { // 닫힌 칸이면
        data[rowIndex][cellIndex] = CODE.QUESTION; // 물음표로
        target.className = 'question';
        target.textContent = '?';
    } else if (cellData === CODE.QUESTION) { // 물음표면
        data[rowIndex][cellIndex] = CODE.FLAG; // 깃발이면
        target.className = 'flag';
        target.textContent = '!';
    } else if (cellData === CODE.FLAG) { // 깃발이면
        data[rowIndex][cellIndex] = CODE.NORMAL; // 닫힌 칸으로
        target.className = '';
        target.textContent = '';
    }
}

function countMine(rowIndex, cellIndex) {
    const mines = [CODE.MINE, CODE.QUESTION_MINE, CODE.FLAG_MINE];
    let i = 0;
    mines.includes(data[rowIndex - 1]?.[cellIndex - 1]) && i++;
    mines.includes(data[rowIndex - 1]?.[cellIndex]) && i++;
    mines.includes(data[rowIndex - 1]?.[cellIndex + 1]) && i++;
    mines.includes(data[rowIndex][cellIndex - 1]) && i++;
    mines.includes(data[rowIndex][cellIndex + 1]) && i++;
    mines.includes(data[rowIndex + 1]?.[cellIndex - 1]) && i++;
    mines.includes(data[rowIndex + 1]?.[cellIndex]) && i++;
    mines.includes(data[rowIndex + 1]?.[cellIndex + 1]) && i++;
    return i;
}

function onLeftClick(event) {
    const target = event.target;
    const rowIndex = target.parentNode.rowIndex;
    const cellIndex = target.cellIndex;
    const cellData = data[rowIndex][cellIndex];
    if (celllData === CODE.NORMAL) { // 닫힌 칸이면
        const count = countMine(rowIndex, cellIndex);
        target.textContent = count || '';
        target.className = 'opened';
        data[rowIndex][cellIndex] = count;
    } else if (cellData === CODE.MINE) { // 지뢰 칸이면
        // 펑~
    } // 나머지는 무시
}

function drawTable() {
    data = plantMine();
    data.forEach((row) => {
        const $tr = document.createElement('tr');
        row.forEach((cell) => {
            const $td = document.createElement('td');
            if (cell === CODE.MINE) {
                $td.textContent = 'X'; // 개발 편의를 위해
            }
            $tr.append($td);
        });
        $swpTbody.append($tr);
        $swpTbody.addEventListener('contextmenu', onRightClick);
        $swpTbody.addEventListener('click', onLeftClick);
    });
}

drawTable();