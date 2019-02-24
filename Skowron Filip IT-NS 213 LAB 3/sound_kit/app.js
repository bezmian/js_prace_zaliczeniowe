window.addEventListener("keydown", playSoundFromKey);

class Sound {
    buffer;

    constructor(url) {
        this.url = url;
    }
}

class Channel {
    constructor() {
        this.capturedSounds = [];
    }
}

class CapturedSound {
    constructor(name, time) {
        this.name = name;
        this.time = time;
    }
}

const keyToSound = new Map([
    ["1", new Sound("./sounds/boom.wav")],
    ["2", new Sound("./sounds/clap.wav")],
    ["3", new Sound("./sounds/hihat.wav")],
    ["4", new Sound("./sounds/kick.wav")],
    ["5", new Sound("./sounds/openhat.wav")],
    ["6", new Sound("./sounds/ride.wav")],
    ["7", new Sound("./sounds/snare.wav")],
    ["8", new Sound("./sounds/tink.wav")],
    ["9", new Sound("./sounds/tom.wav")],
]);

const soundContext = new AudioContext();
const channels = [new Channel(), new Channel(), new Channel(), new Channel()];
let isRecording = false;
let currentChannelRecording = 0;
let recordingStartTime = 0;
keyToSound.forEach(value => loadSound(value));

function loadSound(sound) {
    const request = new XMLHttpRequest();
    request.open('GET', sound.url, true);
    request.responseType = 'arraybuffer';
    request.onload = function () {
        soundContext.decodeAudioData(request.response, function (newBuffer) {
            sound.buffer = newBuffer;
        });
    };
    request.send();
}

function playSoundFromKey(e) {
    if (!keyToSound.has(e.key)) {
        return
    }
    playSound(e.key)
}

function playSound(name) {
    if (isRecording) {
        channels[currentChannelRecording].capturedSounds.push(new CapturedSound(name, new Date().getTime() - recordingStartTime))
    }
    const sound = keyToSound.get(name);
    const buffer = sound.buffer;
    if (buffer) {
        const source = soundContext.createBufferSource();
        source.buffer = buffer;

        const volume = soundContext.createGain();
        volume.connect(soundContext.destination);
        source.connect(volume);
        source.start(0);
    }
}

document.getElementById('playAll').addEventListener('click', () => {
    channels.forEach(value => value.capturedSounds.forEach(value => {
        setTimeout(() => playSound(value.name), value.time);
    }))
});

for (let i = 0; i < 4; i++) {
    document.getElementById('startRecord' + i).addEventListener('click', () => {
        if (isRecording) {
            return;
        }

        isRecording = true;
        recordingStartTime = new Date().getTime();
        currentChannelRecording = i;
        channels[currentChannelRecording].capturedSounds = [];
    });

    document.getElementById('stop' + i).addEventListener('click', () => {
        if (!isRecording) {
            return;
        }

        isRecording = false;
    });


    document.getElementById('play' + i).addEventListener('click', () => {
        if (isRecording) {
            return;
        }
        channels[i].capturedSounds.forEach(value => {
            setTimeout(() => playSound(value.name), value.time);
        })
    });
}