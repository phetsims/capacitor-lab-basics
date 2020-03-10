// Copyright 2015-2020, University of Colorado Boulder

/**
 * Creates a wire that connects a capacitor to a circuit switch.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import inherit from '../../../../../phet-core/js/inherit.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';
import CircuitPosition from '../CircuitPosition.js';
import Wire from './Wire.js';
import WireSegment from './WireSegment.js';

/**
 * @constructor
 *
 * @param {CircuitPosition} connectionPoint
 * @param {CircuitConfig} config
 * @param {Capacitor} capacitor
 * @param {CircuitSwitch} circuitSwitch
 */
function CapacitorToSwitchWire( connectionPoint, config, capacitor, circuitSwitch ) {

  // add the vertical segment.
  const switchConnectionPoint = circuitSwitch.hingePoint;
  let segment;
  if ( connectionPoint === CircuitPosition.CAPACITOR_TOP ) {
    segment = WireSegment.createComponentTopWireSegment(
      capacitor,
      switchConnectionPoint
    );
  }
  else {
    segment = WireSegment.createComponentBottomWireSegment(
      capacitor,
      switchConnectionPoint
    );
  }

  Wire.call( this, config.modelViewTransform, [ segment ], connectionPoint );
}

capacitorLabBasics.register( 'CapacitorToSwitchWire', CapacitorToSwitchWire );

export default inherit( Wire, CapacitorToSwitchWire, {}, {

  /**
   * Factory method for top CapacitorToSwitchWire instance
   * @public
   *
   * @param {CircuitConfig} config
   * @param {Capacitor} capacitor
   * @param {CircuitSwitch} circuitSwitch
   * @returns {CapacitorToSwitchWire}
   */
  createCapacitorToSwitchWireTop: function( config, capacitor, circuitSwitch ) {
    return new CapacitorToSwitchWire( CircuitPosition.CAPACITOR_TOP, config, capacitor, circuitSwitch );
  },

  /**
   * Factory method for bottom CapacitorToSwitchWire instance
   * @public
   *
   * @param {CircuitConfig} config
   * @param {Capacitor} capacitor
   * @param {CircuitSwitch} circuitSwitch
   * @returns {CapacitorToSwitchWire}
   */
  createCapacitorToSwitchWireBottom: function( config, capacitor, circuitSwitch ) {
    return new CapacitorToSwitchWire( CircuitPosition.CAPACITOR_BOTTOM, config, capacitor, circuitSwitch );
  }
} );
