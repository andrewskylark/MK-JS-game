import { generateLogs } from "./logs.js";
import { createPlayer, createResultsTitle, createReloadBtn } from "./dom.js";
import { Player, playerAttack } from "./players.js";

const arenas = document.querySelector('.arenas');
let player1;
let player2;

class Game {
    constructor(selector, event) {
        this.$el = document.querySelector(selector);
        this.evt = event;
    }

    getPlayers = async () => {
        const body = fetch('https://reactmarathon-api.herokuapp.com/api/mk/players').then(res => res.json());
        return body;
    }
    start = async () => {
        const players = await this.getPlayers();
        // const p1 = players[getRandom(0, players.length)];
        const p1 = JSON.parse(localStorage.getItem('player1'))
        // const p2 = players[getRandom(0, players.length)];
        const p2 = JSON.parse(localStorage.getItem('player2'))

        player1 = new Player({
            ...p1,
            player: 1,
        });
        player2 = new Player({
            ...p2,
            player: 2,
        });

        arenas.appendChild(createPlayer(player1));
        arenas.appendChild(createPlayer(player2));

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
            generateLogs('end', player2, player1)
        } else if (player2.hp === 0 && player2.hp < player1.hp) {
            arenas.appendChild(createResultsTitle(player1.name));
            generateLogs('end', player1, player2)
        } else if (player1.hp === 0 && player2.hp === 0) {
            arenas.appendChild(createResultsTitle());
            generateLogs('draw')
        }
    }

    gameHandler = async (evt) => {
        evt.preventDefault();

        const playerMoveObj = playerAttack();//get data from checkboxes
        const movesData = await this.getMoves(playerMoveObj);
        console.log(movesData)
        let playerMove = movesData.player1;
        let enemyMove = movesData.player2;

        if (playerMove.hit !== enemyMove.defence) {
            player2.changeHP(enemyMove.value);
            player2.renderHP();
            generateLogs('hit', player1, player2, playerMove.value);
        } else {
            generateLogs('defence', player1, player2);
        }
        if (enemyMove.hit !== playerMove.defence) {
            player1.changeHP(playerMove.value);
            player1.renderHP();
            generateLogs('hit', player2, player1, enemyMove.value);
        } else {
            generateLogs('defence', player2, player1);
        }

        this.showResults();
    };
}

export default Game;