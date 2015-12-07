// Copyright 2015, University of Colorado Boulder

/**
 * Circuit connection types for Capacitor Lab. Circuit connection names correspond to what element is connected to the
 * the capacitor.  'OPEN_CIRCUIT' means that the capacitor is disconnected from all circuit components.
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  var CircuitConnectionEnum = {
    BATTERY_CONNECTED: 'BATTERY_CONNECTED',
    LIGHT_BULB_CONNECTED: 'LIGHT_BULB_CONNECTED',
    OPEN_CIRCUIT: 'OPEN_CIRCUIT'
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( CircuitConnectionEnum ); }

  capacitorLabBasics.register( 'CircuitConnectionEnum', CircuitConnectionEnum );
  
  return CircuitConnectionEnum;
} );