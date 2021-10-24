const HIT = {
    head: 30,
    body: 25,
    foot: 20,
}
const ATTACK = ['head', 'body', 'foot'];
const player1 = {
    player: 1,
    name: 'Kitana',
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
    name: 'Liu Kang',
    hp: 100,
    img: 'http://reactmarathon-api.herokuapp.com/assets/liukang.gif',
    weapon: ['1', '2', '3'],
    attack,
    changeHP,
    elHP,
    renderHP
}
const logss = {
    start: 'Часы показывали [time], когда [player1] и [player2] бросили вызов друг другу.',
    end: [
        'Результат удара [playerWins]: [playerLose] - труп',
        '[playerLose] погиб от удара бойца [playerWins]',
        'Результат боя: [playerLose] - жертва, [playerWins] - убийца',
    ],
    hit: [
        '[playerDefence] пытался сконцентрироваться, но [playerKick] разбежавшись раздробил копчиком левое ухо врага.',
        '[playerDefence] расстроился, как вдруг, неожиданно [playerKick] случайно раздробил грудью грудину противника.',
        '[playerDefence] зажмурился, а в это время [playerKick], прослезившись, раздробил кулаком пах оппонента.',
        '[playerDefence] чесал <вырезано цензурой>, и внезапно неустрашимый [playerKick] отчаянно размозжил грудью левый бицепс оппонента.',
        '[playerDefence] задумался, но внезапно [playerKick] случайно влепил грубый удар копчиком в пояс оппонента.',
        '[playerDefence] ковырялся в зубах, но [playerKick] проснувшись влепил тяжелый удар пальцем в кадык врага.',
        '[playerDefence] вспомнил что-то важное, но внезапно [playerKick] зевнув, размозжил открытой ладонью челюсть противника.',
        '[playerDefence] осмотрелся, и в это время [playerKick] мимоходом раздробил стопой аппендикс соперника.',
        '[playerDefence] кашлянул, но внезапно [playerKick] показав палец, размозжил пальцем грудь соперника.',
        '[playerDefence] пытался что-то сказать, а жестокий [playerKick] проснувшись размозжил копчиком левую ногу противника.',
        '[playerDefence] забылся, как внезапно безумный [playerKick] со скуки, влепил удар коленом в левый бок соперника.',
        '[playerDefence] поперхнулся, а за это [playerKick] мимоходом раздробил коленом висок врага.',
        '[playerDefence] расстроился, а в это время наглый [playerKick] пошатнувшись размозжил копчиком губы оппонента.',
        '[playerDefence] осмотрелся, но внезапно [playerKick] робко размозжил коленом левый глаз противника.',
        '[playerDefence] осмотрелся, а [playerKick] вломил дробящий удар плечом, пробив блок, куда обычно не бьют оппонента.',
        '[playerDefence] ковырялся в зубах, как вдруг, неожиданно [playerKick] отчаянно размозжил плечом мышцы пресса оппонента.',
        '[playerDefence] пришел в себя, и в это время [playerKick] провел разбивающий удар кистью руки, пробив блок, в голень противника.',
        '[playerDefence] пошатнулся, а в это время [playerKick] хихикая влепил грубый удар открытой ладонью по бедрам врага.',
    ],
    defence: [
        '[playerKick] потерял момент и храбрый [playerDefence] отпрыгнул от удара открытой ладонью в ключицу.',
        '[playerKick] не контролировал ситуацию, и потому [playerDefence] поставил блок на удар пяткой в правую грудь.',
        '[playerKick] потерял момент и [playerDefence] поставил блок на удар коленом по селезенке.',
        '[playerKick] поскользнулся и задумчивый [playerDefence] поставил блок на тычок головой в бровь.',
        '[playerKick] старался провести удар, но непобедимый [playerDefence] ушел в сторону от удара копчиком прямо в пятку.',
        '[playerKick] обманулся и жестокий [playerDefence] блокировал удар стопой в солнечное сплетение.',
        '[playerKick] не думал о бое, потому расстроенный [playerDefence] отпрыгнул от удара кулаком куда обычно не бьют.',
        '[playerKick] обманулся и жестокий [playerDefence] блокировал удар стопой в солнечное сплетение.'
    ],
    draw: 'Ничья - это тоже победа!'
};

const arenas = document.querySelector('.arenas');
// const btn = document.querySelector('.button');
const $form = document.querySelector('.control');
const $chat = document.querySelector('.chat');

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
function playerAttack() {
    const playerMove = {};

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

    return playerMove;
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

function generateLogs(type, player1, player2, kickValue) {
    const date = new Date();
    const normilizeTime = (num) => (num.toString().length > 1 ? num : `0${num}`);
    const time = `${normilizeTime(date.getHours())}:${normilizeTime(date.getMinutes())}`;

    function getText() {
        switch (type) {
            case 'start':
                return logs[type].replace('[time]', time).replace('[player1]', player1.name).replace('[player2]', player2.name);

            case 'hit':
                let log = logs[type][getRandom(0, type.length)].replace('[playerKick]', player1.name).replace('[playerDefence]', player2.name);
                return `${time} - ${log} ${player2.name} - ${kickValue}hp, (${player2.hp}/100)`

            case 'defence':
                return logs[type][getRandom(0, type.length)].replace('[playerKick]', player1.name).replace('[playerDefence]', player2.name);

            case 'end':
                return logs[type][getRandom(0, type.length)].replace('[playerWins]', player1.name).replace('[playerLose]', player2.name);

            case 'draw':
                return logs[type];

            default:
                break;
        }
    }

    const text = getText();
    const el = `<p>${text}</p>`;

    $chat.insertAdjacentHTML('afterbegin', el)
}

function showResults() {
    if (player1.hp === 0 || player2.hp === 0) {
        arenas.appendChild(createReloadBtn());
    }

    if (player1.hp === 0 && player1.hp < player2.hp) {
        arenas.appendChild(createResultsTitle(player2.name));
        generateLogs('end', player2, player1)
    } else if (player2.hp === 0 && player2.hp < player1.hp) {
        arenas.appendChild(createResultsTitle(player1.name));
        generateLogs('end', player1, player2)
    } else if (player1.hp === 0 && player2.hp === 0) {
        arenas.appendChild(createResultsTitle());
        generateLogs('draw')
    }
}

generateLogs('start', player1, player2)

$form.addEventListener('submit', function (evt) {
    evt.preventDefault();

    const enemyMove = enemyAttack();
    const playerMove = playerAttack();

    if (playerMove.hit !== enemyMove.defence) {
        player2.changeHP(enemyMove.value);
        player2.renderHP();
        generateLogs('hit', player1, player2, enemyMove.value);
    } else {
        generateLogs('defence', player1, player2);
    }
    if (enemyMove.hit !== playerMove.defence) {
        player1.changeHP(playerMove.value);
        player1.renderHP();
        generateLogs('hit', player2, player1, playerMove.value);
    } else {
        generateLogs('defence', player2, player1);
    }

    showResults();
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
