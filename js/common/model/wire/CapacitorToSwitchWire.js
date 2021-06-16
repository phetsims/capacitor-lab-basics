// Copyright 2015-2021, University of Colorado Boulder

/**
 * Creates a wire that connects a capacitor to a circuit switch.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import capacitorLabBasics from '../../../capacitorLabBasics.js';
import CircuitPosition from '../CircuitPosition.js';
import Wire from './Wire.js';
import WireSegment from './WireSegment.js';

class CapacitorToSwitchWire extends Wire {
  /**
   * @param {CircuitPosition} connectionPoint
   * @param {CircuitConfig} config
   * @param {Capacitor} capacitor
   * @param {CircuitSwitch} circuitSwitch
   */
  constructor( connectionPoint, config, capacitor, circuitSwitch ) {

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

    super( config.modelViewTransform, [ segment ], connectionPoint );
  }

  /**
   * Factory method for top CapacitorToSwitchWire instance
   * @public
   *
   * @param {CircuitConfig} config
   * @param {Capacitor} capacitor
   * @param {CircuitSwitch} circuitSwitch
   * @returns {CapacitorToSwitchWire}
   */
  static createCapacitorToSwitchWireTop( config, capacitor, circuitSwitch ) {
    return new CapacitorToSwitchWire( CircuitPosition.CAPACITOR_TOP, config, capacitor, circuitSwitch );
  }

  /**
   * Factory method for bottom CapacitorToSwitchWire instance
   * @public
   *
   * @param {CircuitConfig} config
   * @param {Capacitor} capacitor
   * @param {CircuitSwitch} circuitSwitch
   * @returns {CapacitorToSwitchWire}
   */
  static createCapacitorToSwitchWireBottom( config, capacitor, circuitSwitch ) {
    return new CapacitorToSwitchWire( CircuitPosition.CAPACITOR_BOTTOM, config, capacitor, circuitSwitch );
  }
}

capacitorLabBasics.register( 'CapacitorToSwitchWire', CapacitorToSwitchWire );

export default CapacitorToSwitchWire;
