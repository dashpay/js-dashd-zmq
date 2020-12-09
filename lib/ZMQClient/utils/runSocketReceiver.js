/**
 * SocketReceiver will listen for receivable message, and return message to listeners of the topic.
 *
 * @param socket
 * @param emitter
 * @returns {Promise<void>}
 */
const runSocketReceiver = async function runSocketReceiver(socket, emitter) {
  const [rawTopic, rawMsg] = await socket.receive();
  const topic = rawTopic.toString('utf-8');
  const message = rawMsg.toString('hex');
  emitter.emit(topic, message);
  await runSocketReceiver(socket, emitter);
};
module.exports = runSocketReceiver;
