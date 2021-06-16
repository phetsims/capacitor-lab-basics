// Copyright 2015-2021, University of Colorado Boulder

/**
 * A straight segment of wire. One or more segments are joined to create a Wire.  Contains factory functions to
 * construct wire segments for each of the circuit components, since segments will need unique functions to update
 * their geometry depending on the components they connect.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Property from '../../../../../axon/js/Property.js';
import Vector3 from '../../../../../dot/js/Vector3.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';

class WireSegment {
  /**
   * @param {Vector3} startPoint
   * @param {Vector3} endPoint
   */
  constructor( startPoint, endPoint ) {

    assert && assert( startPoint instanceof Vector3 );
    assert && assert( endPoint instanceof Vector3 );

    // @public {Property.<Vector3>}
    this.startPointProperty = new Property( startPoint );

    // @public {Property.<Vector3>}
    this.endPointProperty = new Property( endPoint );
  }


  /**
   * No-op function to provide a uniform interface for all descendants
   * @public
   */
  update() {}


  // Factory methods for specific wire segments

  /**
   * Factory for a ComponentWireSegment that attaches to the top of a circuit component
   * @public
   *
   * @param {Capacitor|LightBulb} component
   * @param {Vector3} endPoint
   * @returns {WireSegment}
   */
  static createComponentTopWireSegment( component, endPoint ) {
    return new ComponentTopWireSegment( component, endPoint );
  }

  /**
   * Factory for a ComponentWireSegment that attaches to the bottom of a circuit component
   * @public
   *
   * @param {Capacitor|LightBulb} component
   * @param {Vector3} endPoint
   * @returns {ComponentBottomWireSegment}
   */
  static createComponentBottomWireSegment( component, endPoint ) {
    return new ComponentBottomWireSegment( component, endPoint );
  }
}

capacitorLabBasics.register( 'WireSegment', WireSegment );

class ComponentTopWireSegment extends WireSegment {
  /**
   * This is a wire segment whose start point is connected to the top
   * connection point of a component.  Adjusts the wire geometry when the component changes geometry or orientation.
   * @public
   *
   * @param {Capacitor|LightBulb} component
   * @param {Vector3} endPoint
   */
  constructor( component, endPoint ) {
    super( component.getTopConnectionPoint(), endPoint );

    // @private
    this.component = component;
  }


  /**
   * Update the start point of the segment. Called when the component geometry changes.
   * @public
   */
  update() {
    const connectionPoint = this.component.getTopConnectionPoint();
    if ( !this.startPointProperty.value.equals( connectionPoint ) ) {
      this.startPointProperty.value = connectionPoint;
    }
  }
}

capacitorLabBasics.register( 'ComponentTopWireSegment', ComponentTopWireSegment );

class ComponentBottomWireSegment extends WireSegment {
  /**
   * Wire segment whose start point is connected to the bottom connection
   * point of a component.  Adjusts the start point when the component geometry changes.
   * @public
   *
   * @param {Capacitor|LightBulb} component
   * @param {Vector3} endPoint
   */
  constructor( component, endPoint ) {
    super( component.getBottomConnectionPoint(), endPoint );

    // @private
    this.component = component;
  }


  /**
   * Update the start point of the segment. Called when the component geometry changes
   * @public
   */
  update() {
    const connectionPoint = this.component.getBottomConnectionPoint();
    if ( !this.startPointProperty.value.equals( connectionPoint ) ) {
      this.startPointProperty.value = connectionPoint;
    }
  }
}

capacitorLabBasics.register( 'ComponentBottomWireSegment', ComponentBottomWireSegment );

export default WireSegment;