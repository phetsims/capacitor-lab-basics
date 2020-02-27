// Copyright 2015-2019, University of Colorado Boulder

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
import inherit from '../../../../../phet-core/js/inherit.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';

/**
 * @param {Vector3} startPoint
 * @param {Vector3} endPoint
 * @constructor
 */
function WireSegment( startPoint, endPoint ) {

  assert && assert( startPoint instanceof Vector3 );
  assert && assert( endPoint instanceof Vector3 );

  // @public {Property.<Vector3>}
  this.startPointProperty = new Property( startPoint );

  // @public {Property.<Vector3>}
  this.endPointProperty = new Property( endPoint );
}

capacitorLabBasics.register( 'WireSegment', WireSegment );

inherit( Object, WireSegment, {

  /**
   * No-op function to provide a uniform interface for all descendants
   * @public
   */
  update: function() {}

}, {

  // Factory methods for specific wire segments

  /**
   * Factory for a ComponentWireSegment that attaches to the top of a circuit component
   * @public
   *
   * @param {Capacitor|LightBulb} component
   * @param {Vector3} endPoint
   * @returns {WireSegment}
   */
  createComponentTopWireSegment: function( component, endPoint ) {
    return new ComponentTopWireSegment( component, endPoint );
  },

  /**
   * Factory for a ComponentWireSegment that attaches to the bottom of a circuit component
   * @public
   *
   * @param {Capacitor|LightBulb} component
   * @param {Vector3} endPoint
   * @returns {ComponentBottomWireSegment}
   */
  createComponentBottomWireSegment: function( component, endPoint ) {
    return new ComponentBottomWireSegment( component, endPoint );
  }
} );

/**
 * This is a wire segment whose start point is connected to the top
 * connection point of a component.  Adjusts the wire geometry when the component changes geometry or orientation.
 * @public
 * @constructor
 *
 * @param {Capacitor|LightBulb} component
 * @param {Vector3} endPoint
 */
function ComponentTopWireSegment( component, endPoint ) {
  WireSegment.call( this, component.getTopConnectionPoint(), endPoint );

  // @private
  this.component = component;
}

capacitorLabBasics.register( 'ComponentTopWireSegment', ComponentTopWireSegment );

inherit( WireSegment, ComponentTopWireSegment, {

  /**
   * Update the start point of the segment. Called when the component geometry changes.
   * @public
   */
  update: function() {
    const connectionPoint = this.component.getTopConnectionPoint();
    if ( !this.startPointProperty.value.equals( connectionPoint ) ) {
      this.startPointProperty.value = connectionPoint;
    }
  }
} );

/**
 * Wire segment whose start point is connected to the bottom connection
 * point of a component.  Adjusts the start point when the component geometry changes.
 * @public
 * @constructor
 *
 * @param {Capacitor|LightBulb} component
 * @param {Vector3} endPoint
 */
function ComponentBottomWireSegment( component, endPoint ) {
  WireSegment.call( this, component.getBottomConnectionPoint(), endPoint );

  // @private
  this.component = component;
}

capacitorLabBasics.register( 'ComponentBottomWireSegment', ComponentBottomWireSegment );

inherit( WireSegment, ComponentBottomWireSegment, {

  /**
   * Update the start point of the segment. Called when the component geometry changes
   * @public
   */
  update: function() {
    const connectionPoint = this.component.getBottomConnectionPoint();
    if ( !this.startPointProperty.value.equals( connectionPoint ) ) {
      this.startPointProperty.value = connectionPoint;
    }
  }
} );

export default WireSegment;