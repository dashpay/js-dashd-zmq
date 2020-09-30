const { expect } = require('chai');
const { Subscriber } = require('zeromq');
const connect = require('./connect');

const client = {
  protocol: 'tcp',
  host: '0.0.0.0',
  port: '29998',
  socket: null,
  isConnected: false,
};
const uri = `${client.protocol}://${client.host}:${client.port}`;

describe('ZMQClient - #connect', () => {
  it('should connect to ZMQ', () => {
    connect.call(client);
    expect(client.socket).to.not.equal(null);
  });
  it('should disconnect and connect if a socket is open', async () => {
    let disconnectionCalled = false;
    client.disconnect = async function disconnectClient() {
      disconnectionCalled = true;
      client.isConnected = false;
      await client.socket.disconnect(uri);
      await client.socket.close();
    };
    await connect.call(client);
    expect(disconnectionCalled).to.equal(true);
    expect(client.socket.constructor.name).to.equal(Subscriber.name);
    expect(client.isConnected).to.equal(true);
  });
  after(async () => {
    client.isConnected = false;
    await client.socket.disconnect(uri);
    await client.socket.close();
  });
});
