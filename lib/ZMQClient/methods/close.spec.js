const { expect } = require('chai');
const close = require('./close');

let socketDisconnectionCalled;
let socketCloseCalled;
const client = {
  protocol: 'tcp',
  host: '0.0.0.0',
  port: '29998',
  isConnected: false,
};

const uri = `${client.protocol}://${client.host}:${client.port}`;

beforeEach(() => {
  socketDisconnectionCalled = false;
  socketCloseCalled = false;
  client.socket = {

  };
  client.socket.disconnect = async function disconnectSocket() {
    socketDisconnectionCalled = true;
  };
  client.socket.close = async function closeSocket() {
    socketCloseCalled = true;
  };
  client.disconnect = async function disconnectClient() {
    this.isConnected = false;
    await this.socket.disconnect(uri);
    await this.socket.close();
  };
});
describe('ZMQClient - #close', () => {
  it('should close socket', async () => {
    await close.call(client);
    expect(client.isConnected).to.equal(false);
    expect(socketDisconnectionCalled).to.equal(false);
    expect(socketCloseCalled).to.equal(true);
    expect(client.socket).to.equal(null);
  });
  it('should disconnect if connected', async () => {
    client.isConnected = true;
    await close.call(client);
    expect(socketDisconnectionCalled).to.equal(true);
    expect(socketCloseCalled).to.equal(true);
    expect(client.isConnected).to.equal(false);
    expect(client.socket).to.equal(null);
  });
});
