/**
 * SocketMonitor will listen for all event and emit them to those listening
 * @param socket
 * @param emitter
 * @returns {{stop(): boolean, start(): Promise}}
 */
const createSocketReceiver = function createSocketReceiver(socket, emitter) {
  let stopped = false;
  return {
    async stop() {
      stopped = true;
    },
    async start() {
      while (!stopped && !socket.closed) {
        try {
          // eslint-disable-next-line no-await-in-loop
          const [rawTopic, rawMsg] = await socket.receive();
          const topic = rawTopic.toString('utf-8');
          const message = rawMsg.toString('hex');
          emitter.emit(topic, message);
        } catch (e) {
          if (e.code !== 'EAGAIN') { throw e; }
        }
      }
    },
  };
};
module.exports = createSocketReceiver;
