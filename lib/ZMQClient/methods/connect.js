// eslint-disable-next-line
const { Subscriber, SocketOptions } = require('zeromq');

/**
 * Create a new Subscriber socket and connect to it.
 *
 * @param {ConnectionOptions} [socketOption]
 * @returns {Promise<Subscriber>}
 */
async function connect(socketOption) {
  const self = this;

  // By default, we don't set any max
  let maxRetries = -1;
  let connectionRetries = 0;

  if (this.socket) {
    await this.disconnect();
  }

  const uri = `${this.protocol}://${this.host}:${this.port}`;
  const opts = { ...socketOption };

  if(opts.maxRetries){
    maxRetries = opts.maxRetries;
    // Subscriber opts is not extensible, we need to remove that from opts we pass
    delete opts.maxRetries;
  }

  const socket = new Subscriber(opts);
  this.socket = socket;

  return new Promise(async (resolve, reject) => {
    await socket.connect(uri);

    const runSocketMonitor = async function runSocketMonitor(){
      for await (const event of socket.events) {
        const type = event.type;
        self.emit(type, event);
      }
    }

    // We only return socket when we actually established a connection
    const onConnectionListener = function (){
      self.isConnected = true;
      resolve(socket);
    };
    // If a max number of retries is set, we reject when exceeding retry number
    const onRetryListener = async function (){
      connectionRetries += 1;
      if(connectionRetries > maxRetries){
        await socket.disconnect(uri);
        return reject(new Error('Connection dropped. Max retries exceeded.'));
      }
    }
    self.on('connect', onConnectionListener);

    if(maxRetries !== -1){
      self.on('connect:retry', onRetryListener);
    }

    const runReceiver = async function runReceiver() {
      try {
        const [rawTopic, rawMsg] = await socket.receive();
        const topic = rawTopic.toString('utf-8');
        const message = rawMsg.toString('hex');
        self.emit(topic, message);
        await runReceiver();
      } catch (e) {
        switch (e.code) {
          case 'EAGAIN':
            if (this.isConnected) { throw e; }
            break;
          default:
            throw e;
        }
      }
    };

    runSocketMonitor();
    runReceiver();

    return socket;
  });
}
module.exports = connect;
