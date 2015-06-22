// Copyright 2002-2015, University of Colorado Boulder

/**
 * Circuit connection types for Capacitor Lab. Circuit connection names correspond to what element is connected to the
 * circuitThe photon target names correspond to molecules which the photons are
 * being fired at.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  var CircuitConnectionEnum = {
    BATTERY_CONNECTED: 'BATTERY_CONNECTED',
    LIGHTBULB_CONNECTED: 'LIGHTBULB_CONNECTED',
    OPEN_CIRCUIT: 'OPEN_CIRCUIT'
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( CircuitConnectionEnum ); }

  return CircuitConnectionEnum;
} );