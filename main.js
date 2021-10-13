"use strict";

const player1 = {
    name: 'name',
    hp: 100,
    img: 'src',
    weapon: ['1', '2', '3'],
    attack: () => {
        console.log(`${player1.name} Fight`)
    }
}

const player2 = {
    name: 'name2',
    hp: 200,
    img: 'src',
    weapon: ['1', '2', '3'],
    attack: () => {
        console.log(`${player2.name} Fight`)
    }
}

const createPlayer = (player, name, hp) => {
    const $player = document.createElement('div');
    $player.classList.add(player);
    const $progressbar = document.createElement('div');
    $progressbar.classList.add('progressbar');
    const $life = document.createElement('div');
    $life.classList.add('life');
    $life.innerText= hp
    const $name = document.createElement('div');
    $name.classList.add('name');
    const $character = document.createElement('div');
    $character.classList.add('character');
    $name.innerText = name
    const $img = document.createElement('img');
    $img.src = 'http://reactmarathon-api.herokuapp.com/assets/scorpion.gif';

    const arenas = document.querySelector('.arenas');

    arenas.appendChild($player);
    $player.appendChild($progressbar);
    $progressbar.appendChild($life);
    $progressbar.appendChild($name);
    $player.appendChild($character);
    $character.appendChild($img);
}

createPlayer('player1', 'SCORPION', 50);
createPlayer('player2', 'SUB-ZERO', 80);