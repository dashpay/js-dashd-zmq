/**
 * SocketMonitor will listen for all event and emit them to those listening
 * @param socket
 * @param emitter
 * @returns {{stop(): boolean, start(): Promise}}
 */
const createSocketMonitor = function createSocketMonitor(socket, client) {
  let isRunning = false;
  return {
    stop() {
      isRunning = false;
      return true;
    },
    async start() {
      isRunning = true;
      // eslint-disable-next-line no-restricted-syntax
      for await (const event of socket.events) {
        if (!isRunning) {
          return;
        }
        const { type } = event;
        client.emit(type, event);
      }
    },
  };
};
module.exports = createSocketMonitor;
