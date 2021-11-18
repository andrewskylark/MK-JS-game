import { generateLogs } from "./logs.js";
import { createPlayer, createResultsTitle, createReloadBtn, createFinisherTitle, createEl, createAudioEl } from "./dom.js";
import { Player, playerAttack } from "./players.js";
import { getRandom, sleep } from "./utils.js";

const ARENAS = 5;
const FINISHERS = ['fatality', 'babality', 'animality', 'friendship', 'high', 'low', 'mid'];
const hitTypeMap = {
    head: `high`,
    body: `mid`,
    foot: `low`
};
const arenas = document.querySelector('.arenas');
const $audio = document.querySelector('.audio');
const $allMusic = $audio.querySelectorAll('.music');
const $hit = $audio.querySelector('.hit');
const $block = $audio.querySelector('.block');
const $neverWin = $audio.querySelector('.neverwin');
const $pathetic = $audio.querySelector('.pathetic');
const $finisherForm = document.querySelector('.finisher-form');
const $hitFormBtn = document.querySelector('.control button[type="submit"]');

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
            soundOn ? $sound.play() : '';
        }
        const onFinisherSimpleHit = async () => {
            winner.changeAnimation(type);
            
            await sleep(200);
            loser.gothit();
            soundOn ? $hit.play() : '';

            await sleep(801);
            loser.changeAnimation('falling');
            winner.win();
        }
        const renderPlayersAnimations = async () => {
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

                    await sleep(1000);
                    loser.blood();
                    break;
                case 'fatality':
                    getSound();

                    await sleep(400);
                    winner.changeAnimation(type);

                    await sleep(800);
                    loser.bones();
                    break;
                case 'high': case 'mid': case 'low':
                    onFinisherSimpleHit();
                    break;
                // case 'mid': 
                //     onFinisherSimpleHit();
                //     break;
                // case 'low':
                //     onFinisherSimpleHit();
                //     break;
                default:
                    break;
            }
        }
        renderPlayersAnimations();
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
        soundOn ? $allMusic[getRandom(1, $allMusic.length - 1)].play() : '';

        await sleep(2000);
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
    getGameResults = async () => {
        let p1Wins = (player2.hp === 0 && player2.hp < player1.hp);
        let p2Wins = (player1.hp === 0 && player1.hp < player2.hp);
        let draw = (player1.hp === 0 && player2.hp === 0);

        if ((player1.hp === 0 && player2.hp !== 0) || ((player1.hp !== 0 && player2.hp === 0))) {
            arenas.appendChild(createFinisherTitle('finish-him', 'finish-him', soundOn));
        }//only one of players down
        if (player1.hp === 0 || player2.hp === 0) {
            arenas.appendChild(createReloadBtn());
            $hitFormBtn.disabled = true;
        }//either one or both of players down

        if (p2Wins) {
            await sleep(501);//delay for gothit / block animation
            player1.changeAnimation('dizzy');
            let finisherType = FINISHERS[getRandom(0, FINISHERS.length - 1)];

            await sleep(2000);
            this.doFinisher(player2, finisherType, player1); //random finisher by AI

            await sleep(1500);
            arenas.appendChild(createResultsTitle(player2.name));
            soundOn ? $pathetic.play() : '';

            await sleep(3000);
            if (finisherType !== 'high' && finisherType !== 'mid' && finisherType !== 'low') {
                arenas.appendChild(createFinisherTitle(finisherType, 'finisher', soundOn));
            }
            generateLogs('end', player2, player1);

        } else if (p1Wins) {
            await sleep(501);//delay for gothit / block animation
            player2.changeAnimation('dizzy');

            await sleep(1000);
            $finisherForm.style.display = 'flex';
            $finisherForm.addEventListener('submit', (evt) => {
                evt.preventDefault();
                let finisherType;
                for (let item of $finisherForm) {
                    if (item.checked) {
                        finisher = item.value;
                    }
                }
                this.doFinisher(player1, finisherType, player2);
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
                    arenas.appendChild(createFinisherTitle(finisherType, 'finisher', soundOn));
                }, 5000);
                generateLogs('end', player1, player2)
            })

        } else if (draw) {
            await sleep(601);
            player1.changeAnimation('dizzy');
            player2.changeAnimation('dizzy');
            arenas.appendChild(createResultsTitle());
            soundOn ? $neverWin.play() : '';
            generateLogs('draw', player1, player2);
        }
    }

    gameHandler = async (evt) => {
        evt.preventDefault();

        const playerMoveObj = playerAttack();//get data from checkboxes
        const movesData = await this.getMoves(playerMoveObj);

        let playerMove = movesData.player1;
        let enemyMove = movesData.player2;
        //p1 move
        if (playerMove.hit !== enemyMove.defence) {//clear hit
            player1.attack(hitTypeMap[playerMove.hit]);

            await sleep(200);
            player2.gothit();
            player2.changeHP(enemyMove.value);
            player2.renderHP();
            soundOn ? $hit.play() : '';
            generateLogs('hit', player1, player2, playerMove.value);
        } else { //if p2 blocks
            player1.attack(hitTypeMap[playerMove.hit]);
            player2.block();

            await sleep(200);
            soundOn ? $block.play() : '';
            generateLogs('defence', player1, player2);
        }
        //p2 attack move
        setTimeout(() => {
            if (enemyMove.hit !== playerMove.defence) {
                player2.attack(hitTypeMap[enemyMove.hit]);

                player1.gothit();
                player1.changeHP(playerMove.value);
                player1.renderHP();
                soundOn ? $hit.play() : '';
                generateLogs('hit', player2, player1, enemyMove.value);
            } else {
                player2.attack(hitTypeMap[enemyMove.hit]);
                player1.block();

                soundOn ? $block.play() : '';
                generateLogs('defence', player2, player1);
            }
        }, 750);

        setTimeout(() => {
            this.getGameResults();
        }, 800);
    };
}

export default Game;