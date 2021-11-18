import { getRandom, normilizeTime } from "./utils.js";

const logs = {
    start: 'Time was [time], when [player1] и [player2] started a fight.',
    hit: [
        '[playerDefence] tried to concentrate, but [playerKick] executed successful [hitAim]-hit.',
        '[playerDefence] blinked and got hit into [hitAim] by [playerKick].',
        '[playerDefence] started to yawn, and fearless [playerKick] sent mighty [hitAim] hit.',
        '[playerDefence] got tired so [playerKick]\'s [hitAim] hit was taken.',
        '[playerDefence] really tried to block [playerKick]\'s [hitAim] hit, but it was too strong.',
        '[playerDefence] just realized something and missed [playerKick]\'s mighty [hitAim] hit.',
        '[playerDefence] failed to see [playerKick]\'s [hitAim] hit.',
        '[playerDefence] got played by [playerKick] - [hitAim] hit.',
        '[playerDefence] tried to say something, when merciless [playerKick] showed successful [hitAim] hit.',
        '[playerKick] executed [hitAim] hit, but [playerDefence] tried to block something else.',
        '[playerDefence] tried to block [playerKick] [hitAim] hit, but he could not',
        '[playerDefence] staggered, while [playerKick] executed cruel [hitAim] hit.',
    ],
    defence: [
        '[playerKick] lost momentum and [playerDefence] jumped away from [hitAim] hit.',
        '[playerKick] was not in control of situation, so [playerDefence] blocked [hitAim] hit.',
        '[playerKick] lost momentum and [playerDefence] masterfully blocked [hitAim] hit.',
        '[playerKick] slipped [playerDefence] successfully blocked [hitAim] hit.',
        '[playerKick] really tried to execute a move, but [playerDefence] evaded sneaky [hitAim] hit.',
        '[playerKick] got played and cruel [playerDefence] blocked [hitAim] hit.',
        '[playerKick] wasn not thinking about the fight, so [playerDefence] simply jumped away from [hitAim] hit.',
        '[playerKick] aimed to hit [playerDefence] [hitAim], but the attempt was blocked.'
    ],
    end: '[playerWins] wins. [finisherType]',
    draw: 'better luck next time!'
};

const $chat = document.querySelector('.chat');

export const generateLogs = (type, { name, player } = {}, { name: P2Name, player: player2, hp}, hitAim, kickValue, finisherType) => {
    const date = new Date();
    const time = `<span class="time">${normilizeTime(date.getHours())}:${normilizeTime(date.getMinutes())}</span>`;
    let finisher = () => {
        if (finisherType !== 'high' && finisherType !== 'mid' && finisherType !== 'low') {
            return `<img src="./assets/${finisherType}.gif"></img>`;
        } else {
            return '';
        }
    }
    const getText = () => {
        switch (type) {
            case 'start':
                return logs[type].replace('[time]', time)
                .replace('[player1]', `<span class="p1">${name}</span>`)
                .replace('[player2]', `<span class="p2">${P2Name}</span>`);

            case 'hit':
                let log = logs[type][getRandom(0, logs[type].length - 1)]
                .replace('[playerKick]', `<span class="p${player}">${name}</span>`)
                .replace('[playerDefence]', `<span class="p${player2}">${P2Name}</span>`)
                .replace('[hitAim]', `<span class="hit-aim">${hitAim}</span>`);

                return `${time}: ${log} <span class="p${player2}">${P2Name}</span> - ${kickValue}hp, (${hp}/100)`

            case 'defence':
                return `${time}: ${logs[type][getRandom(0, logs[type].length - 1)]
                .replace('[playerKick]', `<span class="p${player}">${name}</span>`)
                .replace('[playerDefence]', `<span class="p${player2}">${P2Name}</span>`)
                .replace('[hitAim]', `<span class="hit-aim">${hitAim}</span>`)}`;

            case 'end':
                return logs[type].replace('[playerWins]', `<span class="p${player}">${name}</span>`)
                .replace('[finisherType]', finisher());

            case 'draw':
                return logs[type];

            default:
                break;
        }
    }

    const text = getText();
    const el = `<p>${text}</p>`;

    $chat.insertAdjacentHTML('afterbegin', el)
}