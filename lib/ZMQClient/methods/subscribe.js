const TOPICS = require('../topics.json');

/**
 * Subscribe a connected socket to a specific topicName.
 *
 * @param {string} topicName - Valid topic name to subscribe to
 * @param {function} [callback?] - Will be executed on events for the provided topicName
 */
function subscribe(topicName, callback) {
  const isValidTopic = Object.keys(TOPICS).includes(topicName);
  if (!this.isConnected) { throw new Error('Socket not connected. Call .connect(uri)'); }
  if (!isValidTopic) {
    throw new Error('Invalid topic name');
  }
  this.socket.subscribe(topicName);

  if (callback) {
    this.on(topicName, callback);
  }
}
module.exports = subscribe;
