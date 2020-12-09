import { EventEmitter } from 'events';
import { Subscriber, SocketOptions } from "zeromq";

interface TopicsTypeMap {
    hashblock: 'hashblock';
    hashchainlock: 'hashchainlock';
    hashtx: 'hashtx';
    hashtxlock: 'hashtxlock';
    hashgovernancevote: 'hashgovernancevote';
    hashgovernanceobject: 'hashgovernanceobject';
    hashinstantsenddoublespend: 'hashinstantsenddoublespend';
    rawblock: 'rawblock';
    rawchainlock: 'rawchainlock';
    rawchainlocksig: 'rawchainlocksig';
    rawtx: 'rawtx';
    rawtxlock: 'rawtxlock';
    rawtxlocksig: 'rawtxlocksig';
    rawgovernancevote: 'rawgovernancevote';
    rawgovernanceobject: 'rawgovernanceobject';
    rawinstantsenddoublespend: 'rawinstantsenddoublespend';
}

export interface ClientConnectionOptions {
  maxRetries?: number,
  socketOptions: SocketOptions<Subscriber>
}

/**
 * @class ZMQClient
 */
export default class ZMQClient extends EventEmitter {
    constructor(options?: {
        /**
         * Overrides tcp default protocol
         */
        protocol?: string;
        /**
         * Overrides default host (0.0.0.0)
         */
        host?: string;
        /**
         * Overrides default port (29998)
         */
        port?: string;
    });


    static TOPICS: TopicsTypeMap;

    isConnected: boolean;
    protocol: string;
    host: string;
    port: string;


    /**
      * Close the open socket releasing any pointer and listeners.
      * If connected, the client will also disconnect.
      *
      * @returns {Promise<boolean>}
      */
    close(): Promise<boolean>;

    /**
     * Create a new Subscriber socket and connect to it.
     *
     * @param {ClientConnectionOptions} [connectionOptions]
     * @returns {Promise<Subscriber>}
     */
    connect(connectionOptions?: ClientConnectionOptions): Promise<Subscriber>;

    /**
     * Disconnect socket from ZMQ.
     *
     * @returns {Promise<void>}
     */
    disconnect(): Promise<void>;

    /**
     * Subscribe a connected socket to a specific topicName.
     *
     * @param {keyof TopicsTypeMap} topicName - Valid topic name to subscribe to
     * @param {function} [callback?] - if provided, will be executed on events for the provided topicName
     */
    subscribe(topicName: keyof TopicsTypeMap, callback?: Function ): void;
}
