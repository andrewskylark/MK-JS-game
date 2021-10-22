const HIT = {
    head: 30,
    body: 25,
    foot: 20,
}
const ATTACK = ['head', 'body', 'foot'];
const arenas = document.querySelector('.arenas');
// const btn = document.querySelector('.button');
const $form = document.querySelector('.control');

const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}
function attack() {
    console.log(`${this.name} Fight`)
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
function changeHP(amount) {
    this.hp -= amount;

    if (this.hp <= 0) {
        this.hp = 0;
    }
}
function elHP() {
    return document.querySelector(`.player${this.player} .life`)
}
function renderHP() {
    let $hpBar = this.elHP();

    $hpBar.style.width = `${this.hp}%`;
}
function enemyAttack() {
    const hit = ATTACK[getRandom(0, 2)];
    const defence = ATTACK[getRandom(0, 2)];

    return {
        value: getRandom(1, HIT[hit]),
        hit,
        defence,
    }
}

const player1 = {
    player: 1,
    name: 'kitana',
    hp: 100,
    img: 'http://reactmarathon-api.herokuapp.com/assets/kitana.gif',
    weapon: ['1', '2', '3'],
    attack,
    changeHP,
    elHP,
    renderHP
}
const player2 = {
    player: 2,
    name: 'liukang',
    hp: 100,
    img: 'http://reactmarathon-api.herokuapp.com/assets/liukang.gif',
    weapon: ['1', '2', '3'],
    attack,
    changeHP,
    elHP,
    renderHP
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
const createReloadBtn = () => {
    const $div = createEl('div', 'reloadWrap');
    const $btn = createEl('button', 'button');

    $btn.innerText = 'RESTART';
    $btn.addEventListener('click', () => {
        window.location.reload();
    })
    $div.appendChild($btn);

    return $div;
}

arenas.appendChild(createPlayer(player1));
arenas.appendChild(createPlayer(player2));

$form.addEventListener('submit', function (evt) {
    evt.preventDefault();

    const enemyMove = enemyAttack();
    const playerMove= {};

    for (let item of $form) {
        if (item.checked && item.name === 'hit') {
            playerMove.value = getRandom(1, HIT[item.value]);
            playerMove.hit = item.value;
        }
        if (item.checked && item.name === 'defence') {
            playerMove.defence = item.value;
        }

        item.checked = false;//reset form on click
    }

    if (playerMove.hit !== enemyMove.defence) {
        player2.changeHP(enemyMove.value);
        player2.renderHP();
    }
    if (enemyMove.hit !== playerMove.defence) {
        player1.changeHP(playerMove.value);
        player1.renderHP();
    }

    if (player1.hp === 0 || player2.hp === 0) {
        arenas.appendChild(createReloadBtn());
    }

    if (player1.hp === 0 && player1.hp < player2.hp) {
        arenas.appendChild(createResultsTitle(player2.name));
    } else if (player2.hp === 0 && player2.hp < player1.hp) {
        arenas.appendChild(createResultsTitle(player1.name));
    } else if (player1.hp === 0 && player2.hp === 0) {
        arenas.appendChild(createResultsTitle());
    }
});

// btn.addEventListener('click', () => {
//     player1.changeHP(getRandom(1, 20));
//     player1.renderHP();
//     player2.changeHP(getRandom(1, 20));
//     player2.renderHP();

//     if (player1.hp === 0 || player2.hp === 0) {
//         btn.disabled = true;
//         arenas.appendChild(createReloadBtn());
//     }

//     if (player1.hp === 0 && player1.hp < player2.hp) {
//         arenas.appendChild(createResultsTitle(player2.name));
//     } else if (player2.hp === 0 && player2.hp < player1.hp) {
//         arenas.appendChild(createResultsTitle(player1.name));
//     } else if (player1.hp === 0 && player2.hp === 0) {
//         arenas.appendChild(createResultsTitle());
//     }
// });
