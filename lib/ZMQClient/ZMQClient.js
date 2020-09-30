const { EventEmitter } = require('events');

/**
 * @class ZMQClient
 * @extends EventEmitter
 */
class ZMQClient extends EventEmitter {
  /**
   * @param {ClientOptions} options
   */
  constructor(options = {}) {
    super();
    this.protocol = options.protocol || 'tcp';
    this.host = options.host || '0.0.0.0';
    this.port = options.port || '29998';
    this.isConnected = false;
  }
}

ZMQClient.TOPICS = require('./topics.json');
ZMQClient.prototype.connect = require('./methods/connect');
ZMQClient.prototype.close = require('./methods/close');
ZMQClient.prototype.disconnect = require('./methods/disconnect');
ZMQClient.prototype.subscribe = require('./methods/subscribe');

module.exports = ZMQClient;
