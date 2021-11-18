export const createEl = (tagName, className) => {
    const el = document.createElement(tagName);
    if (className) {
        el.classList.add(className);
    }

    return el
}
export const createAudioEl = async (root, srcName) => {
    const $el = document.createElement('audio');
    $el.src = `assets/sounds/${srcName}.mp3`;

    root.appendChild($el);
    await $el.play();
}
export const createPlayer = ({ player, hp, name, img }) => {
    const $player = createEl('div', `player${player}`);
    const $progressbar = createEl('div', 'progressbar');
    const $life = createEl('div', 'life');
    const $name = createEl('div', 'name');
    const $character = createEl('div', 'character');
    const $img = createEl('img');

    $life.style.width = `${hp}%`;
    $name.innerText = name;
    $img.src = img;

    $progressbar.appendChild($life);
    $progressbar.appendChild($name);
    $character.appendChild($img);
    $player.appendChild($progressbar);
    $player.appendChild($character);

    return $player;
}
export const createResultsTitle = (name) => {
    const $resultTitle = createEl('div', 'loseTitle');

    if (name) {
        $resultTitle.innerText = `${name} wins!`;
    } else {
        $resultTitle.innerText = `DRAW!`;
    }

    return $resultTitle;
}
export const createReloadBtn = () => {
    const $div = createEl('div', 'reloadWrap');
    const $btn = createEl('button', 'button');

    $btn.innerText = 'RESTART';
    $btn.addEventListener('click', () => {
        window.location.pathname = './index.html';
    })
    $div.appendChild($btn);

    return $div;
}
export const createFinisherTitle = (type, className, soundOn) => {
    const $div = createEl('div', className);
    const $img = createEl('img', 'finisher-img');
    const $audio = createEl('audio');

    $img.src = `./assets/${type}.gif`
    $audio.src = `./assets/sounds/${type}.mp3`

    $div.appendChild($img);
    $div.appendChild($audio);
    soundOn ? $audio.play() : '';

    return $div;
}