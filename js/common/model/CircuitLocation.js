// Copyright 2016, University of Colorado Boulder

/**
 * Enumeration of wire connection points for Capacitor Lab: Basics
 *
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  var CircuitLocation = {
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

  // Verify that enum is immutable without runtime penalty in production code
  if ( assert ) {
    Object.freeze( CircuitLocation );
  }

  capacitorLabBasics.register( 'CircuitLocation', CircuitLocation );

  return CircuitLocation;
} );
