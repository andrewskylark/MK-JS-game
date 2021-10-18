const arenas = document.querySelector('.arenas');
const btn = document.querySelector('.button');

let gameOver = false;
let looser = null;
let winner = null;

const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}
const createResultsTitle = (name) => {
    const $resultTitle = createEl('div', 'loseTitle');

    if (name) {
        $resultTitle.innerText = `${name} wins!`;
    } else {
        $resultTitle.innerText = `DRAW!`;
    }

    return $resultTitle;
}
const createEl = (tagName, className) => {
    const el = document.createElement(tagName);
    if (className) {
        el.classList.add(className);
    }

    return el
}
function reduceHP(amount) {
    this.hp -= amount;

    if (this.hp <= 0) {
        this.hp = 0;
        looser = this.name
        gameOver = true;
    }
}
function elHP() {
    return document.querySelector(`.player${this.player} .life`)
}
function renderHP() {
    let $hpBar = this.elHP();

    $hpBar.style.width = `${this.hp}%`;
}

const player1 = {
    player: 1,
    name: 'kitana',
    hp: 100,
    img: 'http://reactmarathon-api.herokuapp.com/assets/kitana.gif',
    weapon: ['1', '2', '3'],
    attack: function() {
        console.log(`${this.name} Fight`)
    },
    reduceHP: reduceHP,
    elHP: elHP,
    renderHP: renderHP
}
const player2 = {
    player: 2,
    name: 'liukang',
    hp: 100,
    img: 'http://reactmarathon-api.herokuapp.com/assets/liukang.gif',
    weapon: ['1', '2', '3'],
    attack: function() {
        console.log(`${this.name} Fight`)
    },
    reduceHP: reduceHP,
    elHP: elHP,
    renderHP: renderHP,
}

const createPlayer = (data) => {
    const $player = createEl('div', `player${data.player}`);
    const $progressbar = createEl('div', 'progressbar');
    const $life = createEl('div', 'life');
    const $name = createEl('div', 'name');
    const $character = createEl('div', 'character');
    const $img = createEl('img');

    $life.style.width = `${data.hp}%`
    $name.innerText = data.name
    $img.src = data.img;

    $progressbar.appendChild($life);
    $progressbar.appendChild($name);
    $character.appendChild($img);
    $player.appendChild($progressbar);
    $player.appendChild($character);

    return $player;
}

arenas.appendChild(createPlayer(player1));
arenas.appendChild(createPlayer(player2));

btn.addEventListener('click', () => {
    player1.reduceHP(getRandom(1, 20));
    player1.renderHP();
    player2.reduceHP(getRandom(1, 20));
    player2.renderHP();

    if (gameOver) {
        btn.disabled = true;
        
        if (player1.hp === 0 && player2.hp === 0) {
            arenas.appendChild(createResultsTitle());
        } else {
            winner = (player1.name === looser ? player2.name : player1.name);
        
            arenas.appendChild(createResultsTitle(winner));
        }
        
    }
});
