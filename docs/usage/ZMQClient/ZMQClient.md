**Usage**: `new ZMQClient([options])`
**Description**: Instantiate an address from an address String or Buffer, a public key or script hash Buffer.
Extends EventEmitter.

**Parameters**:

| parameters                                | type            | required           | Description                                                                                                                                                                    |
|-------------------------------------------|-----------------|--------------------| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **options**                               | Object          | no                 |                                                                                                                                   |
| **options.protocol**                      | string          | no[=tcp]           | Overrides tcp default protocol                                                               |
| **options.host**                          | string          | no[=0.0.0.0]       | Overrides default host (0.0.0.0)                                                              |
| **options.port**                          | string          | no[=29998]         | Overrides default port (29998)                                                              |

**Returns** : A new instance of ZMQClient


## Listen to a subscribed topic

```js
const client = new ZMQClient();
await client.connect();
await client.subscribe(ZMQClient.TOPICS.hashblock);
client.on(ZMQClient.TOPICS.hashblock, console.log);
```

## Listenable topics

-  hashblock
-  hashchainlock
-  hashchainlock
-  hashtx
-  hashtxlock
-  hashgovernancevote
-  hashgovernanceobject
-  hashinstantsenddoublespend
-  rawblock
-  rawchainlock
-  rawchainlocksig
-  rawtx
-  rawtxlock
-  rawtxlocksig
-  rawgovernancevote
-  rawgovernanceobject
-  rawinstantsenddoublespend
