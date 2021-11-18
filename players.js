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
    //not the best naming here..
    $img = () => document.querySelector(`.player${this.player} .character img`);
    $imgWrapper = () => document.querySelector(`.player${this.player} .character`);

    walking = async (direction) => {
        this.$img().src = `./assets/moves/${this.normalizeName()}/walking.gif`;
        this.$imgWrapper().style[direction] = '240px';

        await sleep(2000);
        this.$img().src = `./assets/moves/${this.normalizeName()}/stance.gif`;
    }
    attack = async (type) => {
        this.$img().src = `./assets/moves/${this.normalizeName()}/${type}.gif`;
        await sleep(600);
        this.$img().src = this.img;
    };
    block = async () => {
        this.$img().src = `./assets/moves/${this.normalizeName()}/block.gif`;
        await sleep(500);
        this.$img().src = this.img;
    };
    gothit = async () => {
        let $blood = createEl('img', 'blood-hit');
        $blood.src = `./assets/moves/blood-hit.gif`;
        this.$img().src = `./assets/moves/${this.normalizeName()}/gothit.gif`;

        this.$imgWrapper().appendChild($blood);

        await sleep(300);
        $blood.remove();

        await sleep(200);
        this.$img().src = this.img;
    };
    // fall = async () => {
    //     this.$img().src = `./assets/moves/${this.normalizeName()}/falling.gif`;
    // };
    // dizzy = async () => {
    //     this.$img().src = `./assets/moves/${this.normalizeName()}/dizzy.gif`;
    // };
    changeAnimation = async (type) => {
        this.$img().src = `./assets/moves/${this.normalizeName()}/${type}.gif`;
    };
    blood = async () => {
        this.$img().src = `./assets/moves/blood.gif`;
    };
    bones = async () => {
        this.$img().src = `./assets/moves/bones.gif`;
    };
    win = async () => {
        this.$img().style.height = '115%';
        this.$img().src = `./assets/moves/${this.normalizeName()}/win.gif`;
    };
    babality = async () => {
        this.$img().style.height = '20%';
        this.$img().src = `./assets/moves/${this.normalizeName()}/babality.gif`;
    };

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