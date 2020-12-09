const { Subscriber } = require('zeromq');

const runSocketMonitor = require('../utils/runSocketMonitor');
const runSocketReceiver = require('../utils/runSocketReceiver');

/**
 * Create a new Subscriber socket and connect to it.
 *
 * @param {SocketOptions<Subscriber>} [socketOptions]
 * @returns {Promise<Subscriber>}
 */
async function connect(socketOptions = {}) {
  const self = this;
  const uri = `${this.protocol}://${this.host}:${this.port}`;

  // By default, we don't set any max number of retries
  const maxRetries = socketOptions.maxRetries || -1;
  let connectionRetries = 0;

  if (this.socket) {
    await this.disconnect(uri);
  }

  const opts = { ...socketOptions };

  if (opts.maxRetries) {
    // Subscriber opts is not extensible, we need to remove that from opts we pass
    delete opts.maxRetries;
  }

  const socket = new Subscriber(opts);
  this.socket = socket;

  return new Promise(async (resolve, reject) => {
    // We only return socket when we actually established a connection
    function onConnectionListener() {
      self.isConnected = true;
      resolve(socket);
    }
    function onEndListener() {
      self.isConnected = false;
      resolve(socket);
    }
    self.on('connect', onConnectionListener);
    self.on('end', onEndListener);

    // If a max number of retries is set, we reject when exceeding retry number
    if (maxRetries !== -1) {
      const onRetryListener = async function onRetryListener() {
        connectionRetries += 1;
        if (connectionRetries > maxRetries) {
          if (self.isConnected) { await socket.disconnect(uri); }
          await socket.close();
          self.removeListener('connect:retry', onRetryListener);
          return reject(new Error('Connection dropped. Max retries exceeded.'));
        }
        return true;
      };
      self.on('connect:retry', onRetryListener);
    }

    await socket.connect(uri);

    runSocketMonitor(socket, self).catch(e => e);

    runSocketReceiver(socket, self)
      .catch((e) => {
        switch (e.code) {
          case 'EAGAIN':
            if (self.isConnected) {
              throw e;
            }
            break;
          default:
            throw e;
        }
      });
  });
}

module.exports = connect;
