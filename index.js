const $parent = document.querySelector('.parent');
const $player = document.querySelector('.player');
const $playerAi = document.querySelector('.playerAi');

const createElement = (tag, className) => {
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

    return $tag;
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
        localStorage.setItem('player2', JSON.stringify(playerAi));
    }
}

async function init() {
    localStorage.removeItem('player1');

    const players = await fetch('https://reactmarathon-api.herokuapp.com/api/mk/players').then(res => res.json());

    let imgSrc = null;
    let choice = false;
    // let imgSrcAi = null;
    createEmptyPlayerBlock();

    players.forEach(item => {
        const el = createElement('div', ['character', `div${item.id}`]);
        const img = createElement('img');

        // console.log(item)

        el.addEventListener('mousemove', () => {
            if (imgSrc === null) {
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
            $player.innerHTML = '';//clear player img and set agaon on click;

            imgSrc = item.img;
            const $img = createElement('img');
            $img.src = imgSrc;
            $player.appendChild($img);
            console.log('set');
            choice = true;

            localStorage.setItem('player1', JSON.stringify(item));
            el.classList.add('active');

            setAiPlayer()//imitation of Ai choices, set localStorage on last one
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
                setAiPlayer(set = true)
            }, 2200);
            setTimeout(() => {
                setAiPlayer(set = true)
            }, 3400);

            setTimeout(() => {
                if (imgSrc) {
                    imgSrc = null;
                    $player.innerHTML = '';
                }//clear player img
            }, 3900);

            setTimeout(() => {
                window.location.pathname = './game.html';
            }, 4000);
        });

        img.src = item.avatar;
        img.alt = item.name;

        el.appendChild(img);
        $parent.appendChild(el);
    });
}

init();
