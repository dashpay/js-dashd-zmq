const { expect } = require('chai');
const subscribe = require('./subscribe');
const TOPICS = require('../topics.json');

const client = {
  TOPICS,
  protocol: 'tcp',
  host: '0.0.0.0',
  port: '29998',
  socket: { },
};
let subscribeCalled = false;

client.socket.subscribe = function subscribeSocket() {
  subscribeCalled = true;
};

describe('ZMQClient - #subscribe', () => {
  it('should verify client is connected', () => {
    expect(() => subscribe.call(client, TOPICS.hashblock)).to.throw('Socket not connected. Call .connect(uri)');
    expect(subscribeCalled).to.equal(false);
  });
  it('should subscribe to topic', () => {
    client.isConnected = true;
    subscribe.call(client, TOPICS.hashblock);
    expect(subscribeCalled).to.equal(true);
  });
});
