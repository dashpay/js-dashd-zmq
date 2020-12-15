const { Subscriber } = require('zeromq');

const createSocketMonitor = require('../utils/createSocketMonitor');
const createSocketReceiver = require('../utils/createSocketReceiver');

/**
 * Create a new Subscriber socket and connect to it.
 *
 * @param {ClientConnectionOptions} [connectionOptions]
 * @returns {Promise<Subscriber>}
 */
async function connect(connectionOptions = {}) {
  const self = this;

  const uri = `${this.protocol}://${this.host}:${this.port}`;

  // By default, we don't set any max number of retries
  const maxRetries = connectionOptions.maxRetries || -1;
  let connectionRetries = 0;

  if (this.socket) {
    await this.disconnect(uri);
  }

  const socketOptions = { ...connectionOptions.socketOptions };

  const socket = new Subscriber(socketOptions);
  this.socket = socket;

  function onEndListener() {
    self.isConnected = false;
  }

  function onConnectionListener() {
    self.isConnected = true;
    // Reset retries to 0 in order to perform same expected nb of retries on further disconnection
    connectionRetries = 0;
  }

  async function onReconnectionListener() {
    connectionRetries += 1;
    if (connectionRetries > maxRetries) {
      self.removeListener('connect:retry', onReconnectionListener);
      const event = {
        type: 'connect:max_retry_exceeded',
        address: uri,
      };
      self.emit(event.type, event);
    }
  }

  self.on('connect', onConnectionListener);
  self.on('end', onEndListener);
  self.on('connect:retry', onReconnectionListener);

  return new Promise(async (resolve, reject) => {
    // If a max number of retries is set, we reject when exceeding retry number
    if (maxRetries !== -1) {
      self.on('connect:max_retry_exceeded', async () => {
        await socket.unbind(uri);
        await socket.close();
        return reject(new Error('Connection dropped. Max retries exceeded.'));
      });
    }

    await socket.connect(uri);

    const monitor = createSocketMonitor(socket, self);
    monitor.start();

    const receiver = createSocketReceiver(socket, self);
    receiver.start();

    // We only return socket when we actually established a connection
    self.on('connect', () => {
      self.on('connect:max_retry_exceeded', async () => {
        await socket.close();
        monitor.stop();
        receiver.stop();
      });
      return resolve(socket);
    });
  });
}

module.exports = connect;
