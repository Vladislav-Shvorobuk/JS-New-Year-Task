
const first = document.querySelector('.first');
const second = document.querySelector('.second');
const third = document.querySelector('.third');
const fourth = document.querySelector('.fourth');

const h1 = document.querySelector('h1');
const p = document.querySelector('p');

const socket = new WebSocket('ws://178.20.156.145:3000');
socket.onopen = () => console.log('Connection has opened');

let levers = [false, false, false, false];
let leverForCheck = 1;

socket.onmessage = function (event) {

  const data = JSON.parse(event.data);
  console.log(data);

  if (data.pulled !== undefined) {
    levers[data.pulled] = !levers[data.pulled];
    tumbler();
    socket.send(JSON.stringify({ action: 'check', 'lever1': 0, 'lever2': leverForCheck, stateId: data.stateId }));
  };

  if (data.newState == 'poweredOn') {
    levers.forEach((item, i) => levers[i] = !levers[i]);
  } else if (data.newState === 'poweredOff') {
    tumbler();

    h1.style.opacity = 1;
    p.innerText = `\nToken:   ${data.token}\n`;
    console.log(`\nМЫ СПАСЕНЫ !\n\nToken:   ${data.token}\n`);
    socket.close();
  };

  if (data.same) {
    levers[leverForCheck] = levers[0];

    if (levers.every((item) => item === false)) {
      socket.send(JSON.stringify({ action: 'powerOff', stateId: data.stateId }));
    };
    if (leverForCheck < 3) leverForCheck += 1;

  };
}

function tumbler() {
  levers[0] ? first.classList.add('on') : first.classList.remove('on');
  levers[1] ? second.classList.add('on') : second.classList.remove('on');
  levers[2] ? third.classList.add('on') : third.classList.remove('on');
  levers[3] ? fourth.classList.add('on') : fourth.classList.remove('on');
}

socket.onclose = () => console.log('Connection has closed');
