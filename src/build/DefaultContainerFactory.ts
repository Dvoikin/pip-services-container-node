/** @module build */
import { IFactory } from 'pip-services-components-node';
import { CompositeFactory } from 'pip-services-components-node';
import { DefaultLoggerFactory } from 'pip-services-components-node';
import { DefaultCountersFactory } from 'pip-services-components-node';
import { DefaultConfigReaderFactory } from 'pip-services-components-node';
import { DefaultCacheFactory } from 'pip-services-components-node';
import { DefaultCredentialStoreFactory } from 'pip-services-components-node';
import { DefaultDiscoveryFactory } from 'pip-services-components-node';
import { DefaultInfoFactory } from 'pip-services-components-node';
import { DefaultTestFactory } from 'pip-services-components-node';
import { Descriptor } from 'pip-services-commons-node';

/**
 * The default container factory provides generic functionality on-demand, 
 * such as logging and performance monitoring.
 * 
 * Contains a static read-only "container" descriptor.
 * 
 * @see [[https://rawgit.com/pip-services-node/pip-services-components-node/master/doc/api/classes/build.factory.html Factory]] (in the PipServices "Components" package)
 */
export class DefaultContainerFactory extends CompositeFactory {
    public static readonly Descriptor: Descriptor = new Descriptor("pip-services", "factory", "container", "default", "1.0");

    /**
	 * Create a new DefaultContainerFactory object, containing the following factories:
     * - [[https://rawgit.com/pip-services-node/pip-services-components-node/master/doc/api/classes/info.defaultinfofactory.html DefaultInfoFactory]] (in the PipServices "Components" package)
     * - [[https://rawgit.com/pip-services-node/pip-services-components-node/master/doc/api/classes/log.defaultloggerfactory.html DefaultLoggerFactory]] (in the PipServices "Components" package)
     * - [[https://rawgit.com/pip-services-node/pip-services-components-node/master/doc/api/classes/count.defaultcountersfactory.html DefaultCountersFactory]] (in the PipServices "Components" package)
     * - [[https://rawgit.com/pip-services-node/pip-services-components-node/master/doc/api/classes/config.defaultconfigreaderfactory.html DefaultConfigReaderFactory]] (in the PipServices "Components" package)
     * - [[https://rawgit.com/pip-services-node/pip-services-components-node/master/doc/api/classes/cache.defaultcachefactory.html DefaultCacheFactory]] (in the PipServices "Components" package)
     * - [[https://rawgit.com/pip-services-node/pip-services-components-node/master/doc/api/classes/auth.defaultcredentialstorefactory.html DefaultCredentialStoreFactory]] (in the PipServices "Components" package)
     * - [[https://rawgit.com/pip-services-node/pip-services-components-node/master/doc/api/classes/connect.defaultdiscoveryfactory.html DefaultDiscoveryFactory]] (in the PipServices "Components" package)
     * - [[https://rawgit.com/pip-services-node/pip-services-components-node/master/doc/api/classes/test.defaulttestfactory.html DefaultTestFactory]] (in the PipServices "Components" package)
	 */
    public constructor(...factories: IFactory[]) {
        super(...factories);

        this.add(new DefaultInfoFactory());
        this.add(new DefaultLoggerFactory());
        this.add(new DefaultCountersFactory());
        this.add(new DefaultConfigReaderFactory());
        this.add(new DefaultCacheFactory());
        this.add(new DefaultCredentialStoreFactory());
        this.add(new DefaultDiscoveryFactory());
        this.add(new DefaultTestFactory());
    }

}
