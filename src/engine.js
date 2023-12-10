const process = require('node:process');
const readline = require('readline');
const EventEmitter = require('node:events');

function Engine() {
    this._emitter = new EventEmitter();
}

Engine.prototype._rl = null;
Engine.prototype._emitter = null;

Engine.prototype.start = function start() {
    this._rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
    });

    readline.cursorTo(process.stdout, 0, 0);

    this._rl.on('line', (line) => {
        const command = typeof line === 'string' ? line.trim() : '';
        readline.cursorTo(process.stdout, 0, 0);

        if (this._emitter.listeners(command).length === 0) {
            const currentPrompt = this._rl.getPrompt();
            const promptWithError = currentPrompt.replace(/(\n|^)(>\s*$)/, '$1***Unknown command***\n$2');
            this._rl.setPrompt(promptWithError);
            this._rl.prompt(true);
        }
        try {
            this._emitter.emit(command);
        } catch (error) {
            readline.cursorTo(process.stdout, 0, 0);
            this._rl.close();
            console.error(error);
            process.exit(1);
        }
    });
}

Engine.prototype.writeMessage = function writeStatus(message) {
    if (!this._rl) {
        throw new Error('Engine is not started.');
    }

    message = typeof message === 'string' ? (message.trim() + '\n') : '';
    this._rl.setPrompt(message + '> ');
    this._rl.prompt(true);
}

Engine.prototype.onCommand = function (command, fn) {
    this._emitter.on(command, fn);
}

Engine.prototype.close = function close() {
    readline.cursorTo(process.stdout, 0, 0);
    this._rl.close();
    process.exit(0);
}

module.exports = Engine;
