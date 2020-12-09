const { expect } = require('chai');
const { Subscriber, Publisher } = require('zeromq');
const { EventEmitter } = require('events');
const connect = require('./connect');

const client = Object.assign({
  protocol: 'tcp',
  host: '0.0.0.0',
  port: '29998',
  socket: null,
  isConnected: false,
  disconnect: () => { client.isConnected = false; },
}, EventEmitter.prototype);

const uri = `${client.protocol}://${client.host}:${client.port}`;

describe('ZMQClient - #connect', function suite() {
  this.timeout(5000);
  it('should create a ZMQ Subscriber', async () => {
    setTimeout(() => {
      client.socket.close();
    }, 1000);
    await connect.call(client);
    expect(client.socket).to.not.equal(null);
    expect(client.socket.constructor).to.be.equal(Subscriber);
  });
  it('should have a max retries', async () => new Promise(async (resolve, reject) => {
    try {
      await connect.call(client, { maxRetries: 1 });
      reject(new Error('Expected to reject with error'));
    } catch (e) {
      expect(e.message).to.equal('Connection dropped. Max retries exceeded.');
      resolve(true);
    }
  }));
  it('should connect', async () => {
    const publisher = new Publisher();
    await publisher.bind('tcp://127.0.0.1:29998');
    await connect.call(client, { maxRetries: 1 });
    expect(client.isConnected).to.equal(true);
    publisher.disconnect('tcp://127.0.0.1:29998');
  });
  after(async () => {
    client.isConnected = false;
    await client.socket.disconnect(uri);
    await client.socket.close();
  });
});
