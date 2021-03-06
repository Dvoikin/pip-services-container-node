/** @module refer */
import { IReferences } from 'pip-services-commons-node';
import { Opener } from 'pip-services-commons-node';
import { Closer } from 'pip-services-commons-node';
import { IOpenable } from 'pip-services-commons-node';

import { ReferencesDecorator } from './ReferencesDecorator';

/**
 * Decorates run references (run stage) as a [[ReferencesDecorator]] and, in addition, opens 
 * and closes the components that are referenced.
 */
export class RunReferencesDecorator extends ReferencesDecorator implements IOpenable {
    public _opened: boolean = false;

    /**
     * Creates a new RunReferencesDecorator object, which will decorate the 
     * given base and/or parent references.
     * 
     * @param baseReferences 		the base references that this object will be decorating.
	 * @param parentReferences 		the parent references that this object will be decorating.
	 */
    public constructor(baseReferences: IReferences, parentReferences: IReferences) {
    	super(baseReferences, parentReferences);
    }

    /**
     * @returns whether or not all referenced components have been opened.
     */
    public isOpen(): boolean {
        return this._opened;
    }

    /**
     * Opens all referenced components. If a component fails to be opened, this object will not be 
     * considered open.
     * 
	 * @param correlationId 	unique business transaction id to trace calls across components.
     * @param callback 			(optional) the function to call when the opening process is complete. 
     *                          It will be called with an error if one is raised.
	 * 
     */
    public open(correlationId: string, callback?: (err: any) => void): void {
        if (!this._opened) {
            let components = this.getAll();
            Opener.open(correlationId, components, (err) => {
                if (err == null)
                    this._opened = true;
                if (callback) callback(err);
            });
        } else {
            if (callback) callback(null);
        }
    }

    /**
     * Closes all referenced components. If a component fails to be closed, this object will not be 
     * considered closed.
     * 
	 * @param correlationId 	unique business transaction id to trace calls across components.
     * @param callback 			(optional) the function to call when the closing process is complete. 
     *                          It will be called with an error if one is raised.
     */
    public close(correlationId: string, callback?: (err: any) => void): void {
        if (this._opened) {
            let components = this.getAll();
            Closer.close(correlationId, components, (err) => {
                this._opened = false;
                if (callback) callback(err);
            });
        } else {
            if (callback) callback(null);
        }
    }

    /**
	 * Puts a new component reference into the base set of references. If this object
     * has already been opened, the added component will be opened.
	 * 
	 * @param locator 	the locator to find the component reference by.
	 * @param component the component that is to be added.
	 */
    public put(locator: any, component: any): void {
        super.put(locator, component);

        if (this._opened)
            Opener.openOne(null, component, null);
    }

    /**
	 * Removes a component reference from the base set of references. If this object
     * has already been opened, the removed component will be closed.
	 * 
	 * @param locator 	the locator of the component that is to be removed.
	 * @returns the removed component.
	 * 
	 * @see [[removeAll]]
	 */
    public remove(locator: any): any {
        let component = super.remove(locator);

        if (this._opened)
            Closer.closeOne(null, component, null);

        return component;
    }

    /**
	 * Removes all component references with the given locator from the base 
	 * set of references. If this object has already been opened, the removed 
     * components will be closed.
	 * 
	 * @param locator 	the locator to remove components by.
	 * @returns a list, containing all removed components.
	 */
    public removeAll(locator: any): any[] {
        let components = super.removeAll(locator);

        if (this._opened)
            Closer.close(null, components, null);

        return components;
    }

}