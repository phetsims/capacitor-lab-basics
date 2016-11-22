// Copyright 2016, University of Colorado Boulder

/**
 * Circuit connection types for Capacitor Lab: Basics. Circuit connection names correspond to what element is
 * connected to the the capacitor.  'OPEN_CIRCUIT' means that the capacitor is disconnected from circuit
 * components, and the switch is connected to teh 'open' point.  'IN_TRANSIT' means that the capacitor
 * is disconnected from all other components.  This is usually the case while dragging the switch.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  var CircuitConnectionEnum = {
    BATTERY_CONNECTED: 'BATTERY_CONNECTED',
    LIGHT_BULB_CONNECTED: 'LIGHT_BULB_CONNECTED',
    OPEN_CIRCUIT: 'OPEN_CIRCUIT',
    IN_TRANSIT: 'IN_TRANSIT'
  };

  // verify that enum is immutable, without the runtime penalty in production code
  if ( assert ) { Object.freeze( CircuitConnectionEnum ); }

  capacitorLabBasics.register( 'CircuitConnectionEnum', CircuitConnectionEnum );

  return CircuitConnectionEnum;
} );