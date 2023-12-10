const Engine = require('./src/engine');

const engine = new Engine();

engine.start();

// TODO: Initialize teapot

const intervalId = setInterval(function() {
    const message = '';
    // TODO: Make and set a message.
    engine.writeMessage(message);
}, 500);

engine.onCommand('exit', function () {
    clearInterval(intervalId);
    engine.close();
});

engine.onCommand('error', function () {
    throw new Error('Error message');
});

// TODO: Add event listeners.
