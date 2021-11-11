const socket = io('ws://localhost:3000');

const trueWords = document.getElementById('true-words');
const truthButton = document.getElementById('truth-button');
const truthInput = document.getElementById('truth-input');
// const words = ['test', 'test 1', 'test 2', 'test 3'];

socket.on('truth', async (truth) => {
    let pTag = document.createElement('p');

    addTruthToDOM(pTag, truth); //Step 1
    await delay(5000); //Step 3
    removeTruthFromDOM(pTag); //Step 4
});

truthButton.addEventListener('click', (e) => {
    const data = { message: truthInput.value };

    socket.emit('truth', data.message); //Socket
    handleHTTP('http://localhost:3000/truth-message', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    //Save on db

    cleanInput(); //Reset
});

truthInput.addEventListener('input', (e) => {
    //Hide or unhide button if theres input
    if (!e.target.value.trim().length && !truthButton.classList.contains('hidden')) {
        truthButton.classList.add('hidden');
    } else if (e.target.value.trim().length && truthButton.classList.contains('hidden')) {
        truthButton.classList.remove('hidden');
    }
});

const delay = (ms) => new Promise((res) => setTimeout(res, ms));

function randomBetween(min = 0, max = 1) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function addTruthToDOM(pTag, truth) {
    let randomPositionX = randomBetween(0, trueWords.offsetWidth);
    let randomPositionY = randomBetween(0, trueWords.offsetHeight);

    trueWords.append(pTag);

    pTag.classList.add('truth');

    trueWords.offsetWidth; //JS magic

    pTag.classList.add('visible');
    pTag.innerText = truth;

    pTag.style.left = `${randomPositionX}px`;
    pTag.style.top = `${randomPositionY}px`;
}

async function removeTruthFromDOM(pTag) {
    pTag.classList.remove('visible');

    await delay(5000); //Wait for text to fade

    pTag.remove();
}

function cleanInput() {
    truthInput.value = '';
    truthButton.classList.add('hidden');
}

// async function main() {
//   for (let truth of words) {
//     let pTag = document.createElement('p');
//     let randomPositionX = randomBetween(0, wordsDiv.offsetWidth);
//     let randomPositionY = randomBetween(0, wordsDiv.offsetHeight);

//     wordsDiv.append(pTag);

//     pTag.classList.add('truth');

//     wordsDiv.offsetWidth; //JS magic

//     pTag.classList.add('visible');
//     pTag.innerText = truth;

//     pTag.style.left = `${randomPositionX - (randomPositionX > 100 ? pTag.offsetWidth : 0)}px`;
//     pTag.style.top = `${randomPositionY - (randomPositionY > 100 ? pTag.offsetHeight : 0)}px`;

//     await delay(3000);
//   }
// }

async function handleHTTP(url, options = {}) {
    try {
        const res = await fetch(url, options);

        const data = await res.json();

        if (!res.ok) {
            console.log('Error', data);
            throw new Error('Truth not found');
        }

        console.log('success', data);
    } catch (err) {
        console.log(err);
    }
}

async function main() {
    await handleHTTP('http://localhost:3000/truth-message/617052f589e3168b8d942eb8');

    // for (let i = 0; i < 1000; i++) {
    //     let pTag = document.createElement('p');

    //     addTruthToDOM(pTag, 'Test ' + i); //Step 1
    // }
}

main();
