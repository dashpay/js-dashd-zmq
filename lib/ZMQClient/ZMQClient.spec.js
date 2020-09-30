const { expect } = require('chai');
const ZMQClient = require('./ZMQClient');
const TOPICS = require('./topics.json');

describe('ZMQClient', () => {
  it('should have a map of topics', () => {
    expect(ZMQClient.TOPICS).to.equal(TOPICS);
  });
  describe('constructor', () => {
    it('should create new ZMQClient', () => {
      const client = new ZMQClient();
      expect(client.constructor).to.equal(ZMQClient);
      expect(client.protocol).to.equal('tcp');
      expect(client.host).to.equal('0.0.0.0');
      expect(client.port).to.equal('29998');
    });
  });
});
