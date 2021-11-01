import { getRandom } from "./utils.js";

const $form = document.querySelector('.control');

export const HIT = {
    head: 30,
    body: 25,
    foot: 20,
}
export const ATTACK = ['head', 'body', 'foot'];

export class Player {
    constructor(props) {
        this.player = props.player;
        this.name = props.name;
        this.hp = props.hp;
        this.img = props.img;
    }

    attack = () => {
        console.log(`${this.name} Fight`);
    };
    changeHP = (amount) => {
        this.hp -= amount;
    
        if (this.hp <= 0) {
            this.hp = 0;
        }
    }
    elHP = () => {
        return document.querySelector(`.player${this.player} .life`)
    }
    renderHP = () => {
        let $hpBar = this.elHP();
    
        $hpBar.style.width = `${this.hp}%`;
    }
}

export function enemyAttack() {
    const hit = ATTACK[getRandom(0, 2)];
    const defence = ATTACK[getRandom(0, 2)];

    return {
        value: getRandom(1, HIT[hit]),
        hit,
        defence,
    }
}
export function playerAttack() {
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