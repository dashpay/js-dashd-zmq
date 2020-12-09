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
    if (options.uri) {
      const [protocol, path] = options.uri.split('://');
      const [host, port] = path.split(':');
      return new ZMQClient({ host, port, protocol });
    }
    this.protocol = (options && options.protocol) ? options.protocol.toString() : 'tcp';
    this.host = (options && options.host) ? options.host.toString() : '0.0.0.0';
    this.port = (options && options.port) ? options.port.toString() : '29998';

    this.isConnected = false;
  }
}

ZMQClient.TOPICS = require('./topics.json');
ZMQClient.prototype.connect = require('./methods/connect');
ZMQClient.prototype.close = require('./methods/close');
ZMQClient.prototype.disconnect = require('./methods/disconnect');
ZMQClient.prototype.subscribe = require('./methods/subscribe');

module.exports = ZMQClient;
