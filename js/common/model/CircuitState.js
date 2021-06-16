// Copyright 2015-2021, University of Colorado Boulder

/**
 * Circuit connection types for Capacitor Lab: Basics. Circuit connection names correspond to what element is
 * connected to the capacitor.  'OPEN_CIRCUIT' means that the capacitor is disconnected from circuit
 * components, and the switch is connected to the 'open' point.  'SWITCH_IN_TRANSIT' means that the capacitor
 * is disconnected from all other components, which is the case while dragging the switch.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import capacitorLabBasics from '../../capacitorLabBasics.js';

const CircuitState = {
  BATTERY_CONNECTED: 'BATTERY_CONNECTED',
  LIGHT_BULB_CONNECTED: 'LIGHT_BULB_CONNECTED',
  OPEN_CIRCUIT: 'OPEN_CIRCUIT',
  SWITCH_IN_TRANSIT: 'SWITCH_IN_TRANSIT'
};

CircuitState.VALUES = _.keys( CircuitState );

// verify that enum is immutable, without the runtime penalty in production code
if ( assert ) { Object.freeze( CircuitState ); }

capacitorLabBasics.register( 'CircuitState', CircuitState );

export default CircuitState;