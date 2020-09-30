const { expect } = require('chai');
const disconnect = require('./disconnect');

const client = {
  protocol: 'tcp',
  host: '0.0.0.0',
  port: '29998',
  socket: { receive: () => Buffer.from('0000', 'hex') },
};

describe('ZMQClient - #disconnect', () => {
  it('should disconnect connected client', () => {
    let disconnectionCalled = false;
    client.socket.disconnect = () => {
      disconnectionCalled = true;
    };
    disconnect.call(client);
    expect(disconnectionCalled).to.equal(true);
    expect(client.isConnected).to.equal(false);
  });
});
