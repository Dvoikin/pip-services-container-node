"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const pip_services_components_node_1 = require("pip-services-components-node");
const pip_services_components_node_2 = require("pip-services-components-node");
const pip_services_components_node_3 = require("pip-services-components-node");
const pip_services_components_node_4 = require("pip-services-components-node");
const pip_services_components_node_5 = require("pip-services-components-node");
const pip_services_components_node_6 = require("pip-services-components-node");
const pip_services_components_node_7 = require("pip-services-components-node");
const pip_services_components_node_8 = require("pip-services-components-node");
const pip_services_components_node_9 = require("pip-services-components-node");
const pip_services_commons_node_1 = require("pip-services-commons-node");
class DefaultContainerFactory extends pip_services_components_node_1.CompositeFactory {
    constructor(...factories) {
        super(...factories);
        this.add(new pip_services_components_node_8.DefaultInfoFactory());
        this.add(new pip_services_components_node_2.DefaultLoggerFactory());
        this.add(new pip_services_components_node_3.DefaultCountersFactory());
        this.add(new pip_services_components_node_4.DefaultConfigReaderFactory());
        this.add(new pip_services_components_node_5.DefaultCacheFactory());
        this.add(new pip_services_components_node_6.DefaultCredentialStoreFactory());
        this.add(new pip_services_components_node_7.DefaultDiscoveryFactory());
        this.add(new pip_services_components_node_9.DefaultTestFactory());
    }
}
DefaultContainerFactory.Descriptor = new pip_services_commons_node_1.Descriptor("pip-services", "factory", "container", "default", "1.0");
exports.DefaultContainerFactory = DefaultContainerFactory;
//# sourceMappingURL=DefaultContainerFactory.js.map