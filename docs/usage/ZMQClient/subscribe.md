## .subscribe(topicName, [callback])

**Description**: Subscribe a connected socket to a specific topicName

**Parameters**:

| parameter                                 | type            | required           | Description                                                                                                                                                                    |
|-------------------------------------------|-----------------|--------------------| ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| **topicName**                             | [TopicsTypeMap](https://raw.githubusercontent.com/dashevo/js-dashd-zmq/master/lib/ZMQClient/topics.json)          | yes                |  Valid topic name to subscribe to                                                                                                                                   |
| **callback**                              | Function          | no                |       if provided, will be executed on events for the provided topicName                                                                                                                              |

**Returns**: [Promise<zeromq.Subscriber>](http://zeromq.github.io/zeromq.js/classes/subscriber.html)
