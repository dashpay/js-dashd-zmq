/**
 * Disconnect socket from ZMQ.
 *
 * @returns {Promise<void>}
 */
async function disconnect() {
  const uri = `${this.protocol}://${this.host}:${this.port}`;
  this.isConnected = false;
  await this.socket.disconnect(uri);
}
module.exports = disconnect;
