/**
 * Close the open socket releasing any pointer and listeners.
 * If connected, the client will also disconnect.
 *
 * @returns {Promise<boolean>}
 */
async function close() {
  if (this.socket) {
    if (this.isConnected) {
      await this.disconnect();
    }

    await this.socket.close();
    this.socket = null;

    return true;
  }
  return false;
}
module.exports = close;
