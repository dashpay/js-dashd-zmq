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
    it('should allow to set protocol, host and port', function () {
      const client = new ZMQClient({
        protocol: 'tcp',
        host: '1.1.1.1',
        port: '20000',
      });
      expect(client.constructor).to.equal(ZMQClient);
      expect(client.protocol).to.equal('tcp');
      expect(client.host).to.equal('1.1.1.1');
      expect(client.port).to.equal('20000');
    });
    it('should create from uri', () => {
      const client = new ZMQClient({
        uri: 'tcp://1.1.1.1:20000'
      });
      expect(client.constructor).to.equal(ZMQClient);
      expect(client.protocol).to.equal('tcp');
      expect(client.host).to.equal('1.1.1.1');
      expect(client.port).to.equal('20000');
    })
  });
});
