// Copyright 2016-2020, University of Colorado Boulder

/**
 * Enumeration of wire connection points for Capacitor Lab: Basics
 *
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import capacitorLabBasics from '../../capacitorLabBasics.js';

const CircuitLocation = {
  BATTERY_TOP: 'BATTERY_TOP',
  BATTERY_BOTTOM: 'BATTERY_BOTTOM',
  LIGHT_BULB_TOP: 'LIGHT_BULB_TOP',
  LIGHT_BULB_BOTTOM: 'LIGHT_BULB_BOTTOM',
  CAPACITOR_TOP: 'CAPACITOR_TOP',
  CAPACITOR_BOTTOM: 'CAPACITOR_BOTTOM',
  CIRCUIT_SWITCH_TOP: 'CIRCUIT_SWITCH_TOP',
  CIRCUIT_SWITCH_BOTTOM: 'CIRCUIT_SWITCH_BOTTOM'
};

// @public {Array.<CircuitLocation>}
CircuitLocation.VALUES = [
  CircuitLocation.BATTERY_TOP,
  CircuitLocation.BATTERY_BOTTOM,
  CircuitLocation.LIGHT_BULB_TOP,
  CircuitLocation.LIGHT_BULB_BOTTOM,
  CircuitLocation.CAPACITOR_TOP,
  CircuitLocation.CAPACITOR_BOTTOM,
  CircuitLocation.CIRCUIT_SWITCH_TOP,
  CircuitLocation.CIRCUIT_SWITCH_BOTTOM
];

CircuitLocation.isTop = function( circuitLocation ) {
  assert && assert( _.includes( CircuitLocation.VALUES, circuitLocation ) );
  return circuitLocation === CircuitLocation.BATTERY_TOP ||
         circuitLocation === CircuitLocation.LIGHT_BULB_TOP ||
         circuitLocation === CircuitLocation.CAPACITOR_TOP ||
         circuitLocation === CircuitLocation.CIRCUIT_SWITCH_TOP;
};

CircuitLocation.isBattery = function( circuitLocation ) {
  assert && assert( _.includes( CircuitLocation.VALUES, circuitLocation ) );
  return circuitLocation === CircuitLocation.BATTERY_TOP ||
         circuitLocation === CircuitLocation.BATTERY_BOTTOM;
};

CircuitLocation.isLightBulb = function( circuitLocation ) {
  assert && assert( _.includes( CircuitLocation.VALUES, circuitLocation ) );
  return circuitLocation === CircuitLocation.LIGHT_BULB_TOP ||
         circuitLocation === CircuitLocation.LIGHT_BULB_BOTTOM;
};

CircuitLocation.isCapacitor = function( circuitLocation ) {
  assert && assert( _.includes( CircuitLocation.VALUES, circuitLocation ) );
  return circuitLocation === CircuitLocation.CAPACITOR_TOP ||
         circuitLocation === CircuitLocation.CAPACITOR_BOTTOM;
};

// Verify that enum is immutable without runtime penalty in production code
if ( assert ) {
  Object.freeze( CircuitLocation );
}

capacitorLabBasics.register( 'CircuitLocation', CircuitLocation );

export default CircuitLocation;