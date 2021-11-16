import { generateLogs } from "./logs.js";
import { createPlayer, createResultsTitle, createReloadBtn, createFinisherTitle, createEl, createAudioEl } from "./dom.js";
import { Player, playerAttack } from "./players.js";
import { getRandom, sleep } from "./utils.js";

const ARENAS = 5;
const hitTypeMap = {
    head: `high`,
    body: `mid`,
    foot: `low`
};
const arenas = document.querySelector('.arenas');
const $audio = document.querySelector('.audio');
const $finisherForm = document.querySelector('.finisher-form');
const $allMusic = $audio.querySelectorAll('.music');
const $hit = $audio.querySelector('.hit');
const $block = $audio.querySelector('.block');
const $pathetic = $audio.querySelector('.pathetic');
const $wellDone = $audio.querySelector('.welldone');
const $neverWin = $audio.querySelector('.neverwin');
const FINISHERS = ['fatality', 'babality', 'animality', 'friendship', 'high', 'low', 'mid'];

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
    doFinisher = async (winner, type, loser) => {
        const getSound = () => {
            const $sound = createEl('audio');
            $sound.src = `./assets/sounds/${type}-sound.mp3`;
            $audio.appendChild($sound);
            $sound.play()
        }
        const getLoserAnimation = async () => {
            switch (type) {
                case 'babality':
                    await sleep(400);
                    loser.babality();
                    getSound();
                    await sleep(600);
                    winner.win();
                    break;
                case 'friendship':
                    getSound();
                    await sleep(400);
                    winner.changeAnimation(type);
                    return;
                case 'animality':
                    getSound();
                    await sleep(700);
                    winner.changeAnimation(type);
                    await sleep(900);
                    loser.blood();
                    break;
                case 'fatality':
                    getSound();
                    await sleep(400);
                    winner.changeAnimation(type);
                    await sleep(600);
                    loser.bones();
                    break;
                case 'high':
                    winner.changeAnimation(type);
                    soundOn ? $hit.play() : '';
                    await sleep(200);
                    loser.gothit();
                    await sleep(801);
                    winner.win();
                    loser.changeAnimation('falling');
                    break;
                case 'mid':
                    winner.changeAnimation(type);
                    await sleep(200);
                    loser.gothit();
                    soundOn ? $hit.play() : '';
                    await sleep(801);
                    winner.changeAnimation('win');
                    loser.changeAnimation('falling');
                    break;
                case 'low':
                    winner.changeAnimation(type);
                    await sleep(200);
                    loser.gothit();
                    soundOn ? $hit.play() : '';
                    await sleep(801);
                    winner.win();
                    loser.changeAnimation('falling');
                    break;
                default:
                    break;
            }
        }
      
        getLoserAnimation();
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
            $allMusic[getRandom(1, $allMusic.length - 1)].play();
        }
        await sleep (1600);
        player1.walking('left');
        player2.walking('right');

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

    showResults = async () => {
        if ((player1.hp === 0 && player2.hp !== 0) || ((player1.hp !== 0 && player2.hp === 0))) {
            // arenas.appendChild(createReloadBtn());
            arenas.appendChild(createFinisherTitle('finish-him', 'finish-him'));
        }
        if (player1.hp === 0 || player2.hp === 0) {
            await sleep(4000);
            arenas.appendChild(createReloadBtn());
        }
        //p1 lost
        if (player1.hp === 0 && player1.hp < player2.hp) {
            // arenas.appendChild(createResultsTitle(player2.name));
            await sleep(601);
            player1.changeAnimation('dizzy');
            let finisherType = FINISHERS[getRandom(0, FINISHERS.length - 1)];
            
            await sleep(2000);
            this.doFinisher(player2, finisherType, player1); //random finisher by AI
            
            await sleep(1500);
            arenas.appendChild(createResultsTitle(player2.name));
            soundOn ? $pathetic.play() : '';
            await sleep(3000);
            if (finisherType !== 'high' && finisherType !== 'mid' && finisherType !== 'low') {
                arenas.appendChild(createFinisherTitle(finisherType, 'finisher'));
            }
            generateLogs('end', player2, player1);
        //p1 wins
        } else if (player2.hp === 0 && player2.hp < player1.hp) {
            generateLogs('end', player1, player2)
            player2.dizzy();
            await sleep(1000);
            $finisherForm.style.display = 'flex';
            $finisherForm.addEventListener('submit', (evt) => {
                evt.preventDefault();
                let finisher;
                for (let item of $finisherForm) {
                    if (item.checked) {
                        finisher = item.value;
                    }
                }
                this.doFinisher(player1, finisher, player2);
                $finisherForm.style.display = 'none';

                setTimeout(() => {
                    let name = player1.name.replace(/[^a-zа-яё]/gi, '').toLowerCase()
                    arenas.appendChild(createResultsTitle(player1.name));
                    if (soundOn) {
                        createAudioEl($audio, name);
                        setTimeout(() => {
                            createAudioEl($audio, 'wins');
                        }, 900);
                    }

                }, 3000);
                setTimeout(() => {
                    arenas.appendChild(createFinisherTitle(finisher, 'finisher'));
                }, 5000);
                
            })
            // player1.win();
            // soundOn ? $wellDone.play() : '';
        } else if (player1.hp === 0 && player2.hp === 0) {
            arenas.appendChild(createResultsTitle());
            generateLogs('draw', player1, player2);
            player1.changeAnimation('dizzy');
            player2.changeAnimation('dizzy');
            soundOn ? $neverWin.play() : '';
        }
    }

    gameHandler = async (evt) => {
        evt.preventDefault();

        const playerMoveObj = playerAttack();//get data from checkboxes
        const movesData = await this.getMoves(playerMoveObj);

        let playerMove = movesData.player1;
        let enemyMove = movesData.player2;
        // let playerHit = hitTypeMap[playerMove.hit];
        // let enemyHit = hitTypeMap[enemyMove.hit];

        if (playerMove.hit !== enemyMove.defence) {
            player2.changeHP(enemyMove.value);
            player2.renderHP();
            generateLogs('hit', player1, player2, playerMove.value);

            soundOn ? $hit.play() : '';

            player1.attack(hitTypeMap[playerMove.hit]);
            player2.gothit();
        } else { //if p2 blocks
            generateLogs('defence', player1, player2);
            player1.attack(hitTypeMap[playerMove.hit]);
            player2.block();
            soundOn ? $block.play() : '';
        }
        //p2 attack move
        setTimeout(() => {
            if (enemyMove.hit !== playerMove.defence) {
                player1.changeHP(playerMove.value);
                player1.renderHP();
                generateLogs('hit', player2, player1, enemyMove.value);

                player2.attack(hitTypeMap[enemyMove.hit]);
                player1.gothit();

                soundOn ? $hit.play() : '';
            } else {
                generateLogs('defence', player2, player1);
                player2.attack(hitTypeMap[enemyMove.hit]);
                player1.block();
                soundOn ? $block.play() : '';
            }
        }, 750);

        setTimeout(() => {
            this.showResults();
        }, 800);
    };
}

export default Game;