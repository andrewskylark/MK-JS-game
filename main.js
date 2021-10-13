"use strict";

const player1 = {
    name: 'kitana',
    hp: 100,
    img: 'http://reactmarathon-api.herokuapp.com/assets/kitana.gif',
    weapon: ['1', '2', '3'],
    attack: () => {
        console.log(`${player1.name} Fight`)
    }
}
const player2 = {
    name: 'liukang',
    hp: 99,
    img: 'http://reactmarathon-api.herokuapp.com/assets/liukang.gif',
    weapon: ['1', '2', '3'],
    attack: () => {
        console.log(`${player2.name} Fight`)
    }
}

const createPlayer = (player, data) => {
    const $player = document.createElement('div');
    $player.classList.add(player);
    
    const $progressbar = document.createElement('div');
    $progressbar.classList.add('progressbar');
    
    const $life = document.createElement('div');
    $life.classList.add('life');
    $life.innerText= data.hp
    
    const $name = document.createElement('div');
    $name.classList.add('name');
    
    const $character = document.createElement('div');
    $character.classList.add('character');
    $name.innerText = data.name
    
    const $img = document.createElement('img');
    $img.src = data.img;

    const arenas = document.querySelector('.arenas');

    arenas.appendChild($player);
    $player.appendChild($progressbar);
    $progressbar.appendChild($life);
    $progressbar.appendChild($name);
    $player.appendChild($character);
    $character.appendChild($img);
}

createPlayer('player1', player1);
createPlayer('player2', player2);