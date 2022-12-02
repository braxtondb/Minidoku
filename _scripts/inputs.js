let keyboard = {};
let mouse = {};

window.addEventListener('keydown', event => keyboard[event.key] = true);
window.addEventListener('keyup', event => keyboard[event.key] = false);