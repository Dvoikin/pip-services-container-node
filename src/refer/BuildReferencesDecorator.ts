/** @module refer */
/** @hidden */
let _ = require('lodash');

import { IReferences } from 'pip-services-commons-node';
import { ReferenceException } from 'pip-services-commons-node';
import { Descriptor } from 'pip-services-commons-node';
import { IFactory } from 'pip-services-components-node';

import { ReferencesDecorator } from './ReferencesDecorator';

/**
 * Decorates build references (build stage) as a [[ReferencesDecorator]] and, in addition, 
 * creates object instances using the referenced factories.
 */
export class BuildReferencesDecorator extends ReferencesDecorator {
    /**
	 * Creates a new BuildReferencesDecorator object using the given base and/or parent references.
	 * 
	 * @param baseReferences 		the base references that this object will be decorating.
	 * @param parentReferences 		the parent references that this object will be decorating.
	 */
    public constructor(baseReferences: IReferences, parentReferences: IReferences) {
    	super(baseReferences, parentReferences);
    }
    
    /**
     * Checks whether or not any of the referenced factories can create an object
     * by the given locator.
     * 
     * @param locator   the object locator to find a factory by.
     * @returns the build reference (factory) that can create an object by the 
     *          given locator.
     */
    public findFactory(locator: any): IFactory {
        let components = this.getAll();
        for (let index = 0; index < components.length; index++) {
            let component = components[index];
            if (_.isFunction(component.canCreate) && _.isFunction(component.create)) {
                if (component.canCreate(locator))
                    return component;
            }
        }

        return null;
    }

    /**
     * Creates an instance of the object whose locator is given, using the provided 
     * factory. 
     * 
     * To find out whether or not an object with the given locator can be created by 
     * a build reference that is set in this object, use [[findFactory]], which will 
     * return the factory to pass to this method.
     * 
     * @param locator   the locator for the object that is to be created.
     * @param factory   the factory to use to create the object.
     * 
     * @see [[findFactory]]
     */
    public create(locator: any, factory: IFactory): any {
        if (factory == null) return null;

        try {
            // Create component
            return factory.create(locator);
        } catch (ex) {
            return null;
        }
    }

    /**
     * Clarifies an object's locator. Used when a component can be found using [[findFactory]] 
     * but cannot be found using [[find]]. The method [[find]] uses the clarified locator to 
     * update this object's references, so that the component can be found in future calls.
     * 
     * @param locator   the object locator to clarify.
     * @param factory   the factory that can create an object by the given locator.
     * @returns the new locator (a [[https://rawgit.com/pip-services-node/pip-services-commons-node/master/doc/api/classes/refer.descriptor.html Descriptor object]]).
     *          If factory is <code>null</code>, locator is not an instance of 
     *          Descriptor, or the given factory cannot create objects by the provided
     *          locator - the given locator will be returned as is.
     */
    public clarifyLocator(locator: any, factory: IFactory): any {
        if (factory == null) return locator;
        if (!(locator instanceof Descriptor)) return locator;
        
        let anotherLocator = factory.canCreate(locator);
    	if (anotherLocator == null) return locator;
    	if (!(anotherLocator instanceof Descriptor)) return locator;
    	
    	let descriptor: Descriptor = locator;
    	let anotherDescriptor: Descriptor = anotherLocator;
    	
    	return new Descriptor(
    		descriptor.getGroup() != null ? descriptor.getGroup() : anotherDescriptor.getGroup(),
    		descriptor.getType() != null ? descriptor.getType() : anotherDescriptor.getType(),
    		descriptor.getKind() != null ? descriptor.getKind() : anotherDescriptor.getKind(),
    		descriptor.getName() != null ? descriptor.getName() : anotherDescriptor.getName(),
    		descriptor.getVersion() != null ? descriptor.getVersion() : anotherDescriptor.getVersion()
		);
    }

    /**
     * Searches for all build component references (factories) that can create objects by 
     * the given locator.
     * 
     * @param locator   the object locator to find a build component (factory) by.
     * @param required  defines whether or not an exception should be thrown if no components
     *                  are found.
     * 
     * @throws  a [[https://rawgit.com/pip-services-node/pip-services-commons-node/master/doc/api/classes/refer.referenceexception.html ReferenceException]]
     *          if no components are found and required is set to <code>true</code>.
     */
    public find<T>(locator: any, required: boolean): T[] {
        let components = super.find<T>(locator, false);

        // Try to create the component
        if (required && components.length == 0) {
            let factory = this.findFactory(locator);
            let component = this.create(locator, factory);
            if (component != null) {
                try {
                	locator = this.clarifyLocator(locator, factory);
                    this.parentReferences.put(locator, component);
                    components.push(component);
                } catch (ex) {
                    // Ignore exception
                }
            }
        }

        // Throw exception is no required components found
        if (required && components.length == 0)
            throw new ReferenceException(null, locator);

        return components;
    }
}
