const $parent = document.querySelector('.parent');
const $player = document.querySelector('.player');
const $playerAi = document.querySelector('.playerAi');
const $audio = document.querySelector('.audio');
const $music = $audio.querySelector('.choose');
const $soundBtn = $parent.querySelector('.sound-btn');

let soundOn = false;

const createElement = (tag, className, srcName) => {
    const $tag = document.createElement(tag);
    if (className) {
        if (Array.isArray(className)) {
            className.forEach(item => {
                $tag.classList.add(item);
            })
        } else {
            $tag.classList.add(className);
        }
    }
    if (srcName) {
        $tag.src = `assets/sounds/${srcName}.mp3`;
    }

    return $tag;
}
const createPlayerNameSound = async (tag, className, srcName, errSrc) => {
    try {
        let $audioName = createElement(tag, className, srcName);
        $audio.appendChild($audioName);
        await $audioName.play();
    } catch (e) {
        let errName = createElement('audio', errSrc, errSrc);
        $audio.appendChild(errName);
        errName.play();
    }
}

function createEmptyPlayerBlock() {
    const el = createElement('div', ['character', 'div11', 'disabled']);
    const img = createElement('img');
    img.src = 'http://reactmarathon-api.herokuapp.com/assets/mk/avatar/11.png';
    el.appendChild(img);
    $parent.appendChild(el);
}

const clearAiPlayer = () => {
    let el = document.querySelector('.activeAi');
    if (el) {
        imgSrcAi = null;
        $playerAi.innerHTML = '';
        el.classList.remove('activeAi');
    }
}
const setAiPlayer = async (set = false) => {
    clearAiPlayer();

    const playerAi = await fetch('https://reactmarathon-api.herokuapp.com/api/mk/player/choose').then(res => res.json());
    const avatarAi = document.querySelector(`.parent .div${playerAi.id}`)
    avatarAi.classList.add('activeAi');

    let imgSrcAi = playerAi.img;
    const $img = createElement('img');
    $img.src = imgSrcAi;
    $playerAi.appendChild($img);

    if (set) {
        if (soundOn) {
            let name = playerAi.name.replace(/[^a-zа-яё]/gi, '').toLowerCase();//SUB-ZERO => subzero
            createPlayerNameSound('audio', name, name);
        }
        localStorage.setItem('player2', JSON.stringify(playerAi));
    }
}

$soundBtn.addEventListener('click', () => {
    if (!$soundBtn.classList.contains('on')) {
        $soundBtn.classList.add('on');
        $music.play();
        soundOn = true;
    } else {
        $soundBtn.classList.remove('on');
        $music.pause();
        soundOn = false;
    }
    localStorage.setItem('soundOn', soundOn);
    console.log(localStorage.getItem('soundOn'));
})

async function init() {
    localStorage.removeItem('player1');
    localStorage.removeItem('player2');
    localStorage.removeItem('soundOn');

    const players = await fetch('https://reactmarathon-api.herokuapp.com/api/mk/players').then(res => res.json());

    let imgSrc = null;
    let choice = false;
    // let imgSrcAi = null;
    createEmptyPlayerBlock();

    players.forEach(item => {
        const el = createElement('div', ['character', `div${item.id}`]);
        const img = createElement('img');

        el.addEventListener('mousemove', () => {
            if (imgSrc === null && choice === false) {
                imgSrc = item.img;
                const $img = createElement('img');
                $img.src = imgSrc;
                $player.appendChild($img);
            }
        });

        el.addEventListener('mouseout', () => {
            if (imgSrc && choice === false) {
                imgSrc = null;
                $player.innerHTML = '';
            }
        });

        el.addEventListener('click', () => {
            imgSrc = null;
            $player.innerHTML = '';//clear player img and set again on click;

            imgSrc = item.img;
            const $img = createElement('img');
            $img.src = imgSrc;
            $player.appendChild($img);//render player preview

            choice = true;
            el.classList.add('active');
            localStorage.setItem('player1', JSON.stringify(item));

            if (soundOn) {
                let name = item.name.replace(/[^a-zа-яё]/gi, '').toLowerCase();//SUB-ZERO => subzero
                createPlayerNameSound('audio', name, name, 'excellent');
            }

            //imitation of Ai choices, set localStorage on last one
            setAiPlayer()
            setTimeout(() => {
                setAiPlayer()
            }, 400);
            setTimeout(() => {
                setAiPlayer()
            }, 800);
            setTimeout(() => {
                setAiPlayer()
            }, 1500);
            setTimeout(() => {
                setAiPlayer()
            }, 2200);
            setTimeout(() => {
                setAiPlayer(set = true)
            }, 3400);

            // setTimeout(() => {
            //     if (imgSrc) {
            //         imgSrc = null;
            //         $player.innerHTML = '';
            //     }//clear player img
            // }, 3900);

            setTimeout(() => {
                window.location.pathname = './game.html';
            }, 4500);
        });

        img.src = item.avatar;
        img.alt = item.name;

        el.appendChild(img);
        $parent.appendChild(el);
    });
}

init();
