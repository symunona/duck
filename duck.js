const duck = document.getElementById('duck')
const output = document.getElementById("chat")
const action = document.getElementById("talking")

const TIMEOUT = 4000

duck.onclick = toggleRecognition;


let recognition;

const SpeechRecognition = window.webkitSpeechRecognition;
recognition = new SpeechRecognition();

recognition.continuous = true

// This runs when the speech recognition service starts
// recognition.onstart = function () {
//     // action.innerHTML = "<small>quack quack quack...</small>"
// };

// recognition.addEventListener('audioend', ()=>{
//     // recognition.start()
// })


let timer

recognition.addEventListener('soundstart', (evt)=>console.log('soundstart', evt))
recognition.addEventListener('soundend', (evt)=>console.log('soundend', evt))
recognition.addEventListener('audiostart', (evt)=>console.log('audiostart', evt))
recognition.addEventListener('audioend', (evt)=>console.log('audioend', evt))
recognition.addEventListener('speechstart', (evt)=>console.log('speechstart', evt))
recognition.addEventListener('speechend', (evt)=>console.log('speechend',evt))
recognition.addEventListener('nomatch', (evt)=>console.log('nomatch', evt))
recognition.addEventListener('end', (evt)=>console.log('end', evt))

recognition.addEventListener('soundstart', ()=>{
    // recognition.start()
    console.log('soundstart')
    if (timer){
        timer.clearTimeout(timer)
    }
})

function tick() {
    if (timer) {
        clearTimeout(timer)
    }

    timer = setTimeout(() => {
        timer = null
        onResponseTimeout()
    }, TIMEOUT)
}

function onResponseTimeout() {
    addMessage('quack', 'duck')
}


function addMessage(msg, who){
    const messageContainer = document.createElement('div')
    messageContainer.classList.add(who)
    const message = document.createElement('div')
    message.classList.add('message')
    message.innerText = msg
    messageContainer.append(message)
    output.append(messageContainer)
}

let lastLength = 0
// This runs when the speech recognition service returns result
recognition.onresult = function (event) {
    console.warn(event.results)
    let transcript = []
    Object.keys(event.results).forEach((key) => {
        Object.keys(event.results[key]).forEach(subList => {
            const result = event.results[key][subList]
            if (result.transcript) {
                isThereAColor(result.transcript)
                transcript.push(result.transcript)
            }
        })
    })

    if (lastLength < transcript.length ){
        lastLength = transcript.length
        addMessage(transcript[transcript.length - 1], 'me')
    }
    tick()
}


let capturing = false

function toggleRecognition() {
    duck.classList.toggle('active')

    if (capturing) {
        capturing = false
        recognition.stop()
        return
    } else {
        capturing = true
        recognition.start();
    }
};



const COLORS = ['red', 'green', 'blue', 'yellow', 'black', 'white', 'pink', 'purple', 'brown'];
const SPLITTER = /[ ,.!?]+/


/**
 * @param {string} text
 */
function isThereAColor(text) {
    const words = text.toLocaleLowerCase().split(SPLITTER).reverse()
    words.find((word) => {
        if (COLORS.indexOf(word) > -1) {
            document.body.style.backgroundImage = `repeating-conic-gradient(${word} 0deg 10deg,#c9e100 10deg 20deg)`
            console.warn(document.body.style.backgroundImage)
            return true
        }
    })
}