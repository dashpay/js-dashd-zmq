## Usage example

```js
const { ChainLock } = require('@dashevo/dashcore-lib');
const ZMQClient = require('@dashevo/dashd-zmq');
const client = new ZMQClient({
  protocol: 'tcp',
  host: '0.0.0.0',
  port: '29998',
});

(async () => {
    await client.connect();
    client.subscribe(ZMQClient.TOPICS.rawchainlock);
    client.on(ZMQClient.TOPICS.rawchainlock, async (rawChainLockMessage) => {
      const socketChainLock = new ChainLock(rawChainLockMessage);
    });
})();
```
