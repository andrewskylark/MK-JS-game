const arenas = document.querySelector('.arenas');
const btn = document.querySelector('.button');

const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min);
}

const reduceHP = (player, amount) => {
    const $hpBar = document.querySelector(`.player${player.player} .life`);

    player.hp -= amount;

    if (player.hp <= 0) {
        $hpBar.style.width = 0;
        player.hp = 0;
    }
    $hpBar.style.width = `${player.hp}%`;
    console.log($hpBar)
    console.log(player.hp)
    console.log(amount)

} 

const createEl = (tagName, className) => {
    const el = document.createElement(tagName);
    if (className) {
        el.classList.add(className);
    }

    return el
}

const player1 = {
    player: 1,
    name: 'kitana',
    hp: 100,
    img: 'http://reactmarathon-api.herokuapp.com/assets/kitana.gif',
    weapon: ['1', '2', '3'],
    attack: () => {
        console.log(`${player1.name} Fight`)
    }
}
const player2 = {
    player: 2,
    name: 'liukang',
    hp: 100,
    img: 'http://reactmarathon-api.herokuapp.com/assets/liukang.gif',
    weapon: ['1', '2', '3'],
    attack: () => {
        console.log(`${player2.name} Fight`)
    }
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
    reduceHP(player1, getRandom(1, 20));
});
