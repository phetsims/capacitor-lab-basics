// Copyright 2020-2021, University of Colorado Boulder

/**
 * Enumeration of wire connection points for Capacitor Lab: Basics
 *
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import capacitorLabBasics from '../../capacitorLabBasics.js';

const CircuitPosition = {
  BATTERY_TOP: 'BATTERY_TOP',
  BATTERY_BOTTOM: 'BATTERY_BOTTOM',
  LIGHT_BULB_TOP: 'LIGHT_BULB_TOP',
  LIGHT_BULB_BOTTOM: 'LIGHT_BULB_BOTTOM',
  CAPACITOR_TOP: 'CAPACITOR_TOP',
  CAPACITOR_BOTTOM: 'CAPACITOR_BOTTOM',
  CIRCUIT_SWITCH_TOP: 'CIRCUIT_SWITCH_TOP',
  CIRCUIT_SWITCH_BOTTOM: 'CIRCUIT_SWITCH_BOTTOM'
};

// @public {Array.<CircuitPosition>}
CircuitPosition.VALUES = [
  CircuitPosition.BATTERY_TOP,
  CircuitPosition.BATTERY_BOTTOM,
  CircuitPosition.LIGHT_BULB_TOP,
  CircuitPosition.LIGHT_BULB_BOTTOM,
  CircuitPosition.CAPACITOR_TOP,
  CircuitPosition.CAPACITOR_BOTTOM,
  CircuitPosition.CIRCUIT_SWITCH_TOP,
  CircuitPosition.CIRCUIT_SWITCH_BOTTOM
];

CircuitPosition.isTop = circuitPosition => {
  assert && assert( _.includes( CircuitPosition.VALUES, circuitPosition ) );
  return circuitPosition === CircuitPosition.BATTERY_TOP ||
         circuitPosition === CircuitPosition.LIGHT_BULB_TOP ||
         circuitPosition === CircuitPosition.CAPACITOR_TOP ||
         circuitPosition === CircuitPosition.CIRCUIT_SWITCH_TOP;
};

CircuitPosition.isBattery = circuitPosition => {
  assert && assert( _.includes( CircuitPosition.VALUES, circuitPosition ) );
  return circuitPosition === CircuitPosition.BATTERY_TOP ||
         circuitPosition === CircuitPosition.BATTERY_BOTTOM;
};

CircuitPosition.isLightBulb = circuitPosition => {
  assert && assert( _.includes( CircuitPosition.VALUES, circuitPosition ) );
  return circuitPosition === CircuitPosition.LIGHT_BULB_TOP ||
         circuitPosition === CircuitPosition.LIGHT_BULB_BOTTOM;
};

CircuitPosition.isCapacitor = circuitPosition => {
  assert && assert( _.includes( CircuitPosition.VALUES, circuitPosition ) );
  return circuitPosition === CircuitPosition.CAPACITOR_TOP ||
         circuitPosition === CircuitPosition.CAPACITOR_BOTTOM;
};

// Verify that enum is immutable without runtime penalty in production code
if ( assert ) {
  Object.freeze( CircuitPosition );
}

capacitorLabBasics.register( 'CircuitPosition', CircuitPosition );

export default CircuitPosition;
