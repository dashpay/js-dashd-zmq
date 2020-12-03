const runSocketReceiver = async function runSocketReceiver(socket, emitter) {
  const [rawTopic, rawMsg] = await socket.receive();
  const topic = rawTopic.toString('utf-8');
  const message = rawMsg.toString('hex');
  emitter.emit(topic, message);
  await runSocketReceiver();
};
module.exports = runSocketReceiver;
