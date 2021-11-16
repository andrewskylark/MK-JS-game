import { getRandom, sleep } from "./utils.js";
import { createEl } from "./dom.js";

const $form = document.querySelector('.control');

export const HIT = {
    head: 200,
    body: 25,
    foot: 20,
}
export const ATTACK = ['head', 'body', 'foot'];

export class Player {
    constructor(props) {
        this.id = props.id;
        this.player = props.player;
        this.name = props.name;
        this.hp = props.hp;
        this.img = props.img;
    }

    normalizeName = () => this.id === 12 ? //SUB-ZERO => subzero
        'subzero2' :
        this.name.replace(/[^a-zа-яё]/gi, '').toLowerCase();// I have 2 sub-zero :/

    attack = async (type) => {
        let $img = document.querySelector(`.player${this.player} .character img`);
        $img.src = `./assets/moves/${this.normalizeName()}/${type}.gif`;
        await sleep(600);
        $img.src = this.img;
    };
    block = async () => {
        let $img = document.querySelector(`.player${this.player} .character img`);
        $img.src = `./assets/moves/${this.normalizeName()}/block.gif`;
        await sleep(600);
        $img.src = this.img;
    };
    gothit = async () => {
        let $img = document.querySelector(`.player${this.player} .character img`);
        let $wrapper = document.querySelector(`.player${this.player} .character`);
        let $blood = createEl('img', 'blood-hit');
        $blood.src = `./assets/moves/blood-hit.gif`;
        $img.src = `./assets/moves/${this.normalizeName()}/gothit.gif`;

        $wrapper.appendChild($blood);

        await sleep(300);

        $blood.remove();
        
        await sleep(200);
        $img.src = this.img;
    };
    fall = async () => {
        let $img = document.querySelector(`.player${this.player} .character img`);
        // await sleep(801);
        $img.src = `./assets/moves/${this.normalizeName()}/falling.gif`;
    };
    win = async () => {
        let $img = document.querySelector(`.player${this.player} .character img`);
        $img.style.height = '110%';
        // await sleep(710);
        $img.src = `./assets/moves/${this.normalizeName()}/win.gif`;
    };
    dizzy = async () => {
        let $img = document.querySelector(`.player${this.player} .character img`);
        $img.src = `./assets/moves/${this.normalizeName()}/dizzy.gif`;
    };
    changeAnimation = async (type) => {
        let $img = document.querySelector(`.player${this.player} .character img`);
        // await sleep(710);
        $img.src = `./assets/moves/${this.normalizeName()}/${type}.gif`;
    };
    blood = async () => {
        let $img = document.querySelector(`.player${this.player} .character img`);
        // await sleep(710);
        $img.src = `./assets/moves/blood.gif`;
    };
    bones = async () => {
        let $img = document.querySelector(`.player${this.player} .character img`);
        // await sleep(710);
        $img.src = `./assets/moves/bones.gif`;
    };
    babality = async () => {
        let $img = document.querySelector(`.player${this.player} .character img`);
        $img.style.height = '20%';
        $img.src = `./assets/moves/${this.normalizeName()}/babality.gif`;
    };
    walking = async (direction) => {
        let $wrapper = document.querySelector(`.player${this.player} .character`);
        let $img = document.querySelector(`.player${this.player} .character img`);

        $img.src = `./assets/moves/${this.normalizeName()}/walking.gif`;
        $wrapper.style[direction] = '240px';
        await sleep(2000);
        $img.src = `./assets/moves/${this.normalizeName()}/stance.gif`;
    }

    changeHP = (amount) => this.hp >= amount ? this.hp -= amount : this.hp = 0;
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