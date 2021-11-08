import { generateLogs } from "./logs.js";
import { createPlayer, createResultsTitle, createReloadBtn } from "./dom.js";
import { Player, playerAttack } from "./players.js";
import { getRandom } from "./utils.js";
// import { createElement, createPlayerNameSound } from "./index.js";

const ARENAS = 5;
const arenas = document.querySelector('.arenas');
const $audio = document.querySelector('.audio');
const $allMusic = $audio.querySelectorAll('.music');
const $hit = $audio.querySelector('.hit');
const $block = $audio.querySelector('.block');
const $pathetic = $audio.querySelector('.pathetic');
const $wellDone = $audio.querySelector('.welldone');
const $neverWin = $audio.querySelector('.neverwin');

let player1;
let player2;
let soundOn = localStorage.getItem('soundOn');

class Game {
    constructor(selector, event) {
        this.$el = document.querySelector(selector);
        this.evt = event;
    }

    getPlayers = async () => {
        const playersData = fetch('https://reactmarathon-api.herokuapp.com/api/mk/players').then(res => res.json());
        return playersData;
    }
    start = async () => {
        // const players = await this.getPlayers();
        // const p1 = players[getRandom(0, players.length)];//get random player from data
        const p1 = JSON.parse(localStorage.getItem('player1'))//parse player data from local storage
        const p2 = JSON.parse(localStorage.getItem('player2'))

        player1 = new Player({
            ...p1,
            player: 1,
        });
        player2 = new Player({
            ...p2,
            player: 2,
        });

        arenas.classList.replace('arena1', `arena${getRandom(1, ARENAS)}`);//random arena bg
        arenas.appendChild(createPlayer(player1));
        arenas.appendChild(createPlayer(player2));
        
        if (soundOn) {
            $allMusic[getRandom(1, $allMusic.length)].play();
        }
        
        generateLogs('start', player1, player2);
        this.$el.addEventListener(this.evt, this.gameHandler);
    }
    getMoves = async ({ hit, defence }) => {
        const body = await fetch('http://reactmarathon-api.herokuapp.com/api/mk/player/fight', {
            method: 'POST',
            body: JSON.stringify({
                hit,
                defence,
            })
        }).then(res => res.json());

        return body;
    }

    showResults = () => {
        if (player1.hp === 0 || player2.hp === 0) {
            arenas.appendChild(createReloadBtn());
        }

        if (player1.hp === 0 && player1.hp < player2.hp) {
            arenas.appendChild(createResultsTitle(player2.name));
            generateLogs('end', player2, player1);

            soundOn ? $pathetic.play() : '';
        } else if (player2.hp === 0 && player2.hp < player1.hp) {
            arenas.appendChild(createResultsTitle(player1.name));
            generateLogs('end', player1, player2)

            soundOn ? $wellDone.play() : '';
        } else if (player1.hp === 0 && player2.hp === 0) {
            arenas.appendChild(createResultsTitle());
            generateLogs('draw');

            soundOn ? $neverWin.play() : '';
        }
    }

    gameHandler = async (evt) => {
        evt.preventDefault();

        const playerMoveObj = playerAttack();//get data from checkboxes
        const movesData = await this.getMoves(playerMoveObj);

        let playerMove = movesData.player1;
        let enemyMove = movesData.player2;

        if (playerMove.hit !== enemyMove.defence) {
            player2.changeHP(enemyMove.value);
            player2.renderHP();
            generateLogs('hit', player1, player2, playerMove.value);

            soundOn ? $hit.play() : '';
        } else {
            generateLogs('defence', player1, player2);

            soundOn ? $block.play() : '';
        }
        setTimeout(() => {
            if (enemyMove.hit !== playerMove.defence) {
                player1.changeHP(playerMove.value);
                player1.renderHP();
                generateLogs('hit', player2, player1, enemyMove.value);
    
                soundOn ? $hit.play() : '';
            } else {
                generateLogs('defence', player2, player1);
    
                soundOn ? $block.play() : '';
            }
        }, 700);
        
        setTimeout(() => {
            this.showResults();
        }, 800);
    };
}

export default Game;