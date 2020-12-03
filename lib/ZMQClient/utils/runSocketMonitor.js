const runSocketMonitor = async function runSocketMonitor(socket, emitter) {
  // eslint-disable-next-line no-restricted-syntax
  for await (const event of socket.events) {
    const { type } = event;
    emitter.emit(type, event);
  }
};
module.exports = runSocketMonitor;
