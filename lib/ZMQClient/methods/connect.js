// eslint-disable-next-line
const { Subscriber, SocketOptions } = require('zeromq');

/**
 * Create a new Subscriber socket and connect to it.
 *
 * @param {SocketOptions<Subscriber>} [socketOption]
 * @returns {Promise<Subscriber>}
 */
async function connect(socketOption) {
  const self = this;
  if (this.socket) {
    await this.disconnect();
  }
  const uri = `${this.protocol}://${this.host}:${this.port}`;

  const opts = { ...socketOption };

  const socket = new Subscriber(opts);
  this.socket = socket;

  await socket.connect(uri);

  this.isConnected = true;

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

  runReceiver();

  return socket;
}
module.exports = connect;
