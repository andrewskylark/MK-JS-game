export const getRandom = (min, max) => {
    return Math.floor(Math.random() * (max + 1 - min) + min);
}
export const normilizeTime = (num) => (num.toString().length > 1 ? num : `0${num}`);
export const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));