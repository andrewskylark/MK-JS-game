const createEl = (tagName, className) => {
    const el = document.createElement(tagName);
    if (className) {
        el.classList.add(className);
    }

    return el
}

export const createPlayer = (data) => {
    const $player = createEl('div', `player${data.player}`);
    const $progressbar = createEl('div', 'progressbar');
    const $life = createEl('div', 'life');
    const $name = createEl('div', 'name');
    const $character = createEl('div', 'character');
    const $img = createEl('img');

    $life.style.width = `${data.hp}%`
    $name.innerText = data.name
    $img.src = data.img;

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
        window.location.reload();
    })
    $div.appendChild($btn);

    return $div;
}