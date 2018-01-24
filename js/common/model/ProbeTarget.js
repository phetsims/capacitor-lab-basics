// Copyright 2016-2017, University of Colorado Boulder

/**
 * Enumeration for what the voltmeter probes can be touching.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  var ProbeTarget = {
    NONE: 'NONE',

    OTHER_PROBE: 'OTHER_PROBE',

    BATTERY_TOP_TERMINAL: 'BATTERY_TOP_TERMINAL',

    LIGHT_BULB_TOP: 'LIGHT_BULB_TOP',
    LIGHT_BULB_BOTTOM: 'LIGHT_BULB_BOTTOM',

    CAPACITOR_TOP: 'CAPACITOR_TOP',
    CAPACITOR_BOTTOM: 'CAPACITOR_BOTTOM',

    SWITCH_CONNECTION_TOP: 'SWITCH_CONNECTION_TOP',
    SWITCH_CONNECTION_BOTTOM: 'SWITCH_CONNECTION_BOTTOM',

    WIRE_SWITCH_TOP: 'WIRE_SWITCH_TOP',
    WIRE_SWITCH_BOTTOM: 'WIRE_SWITCH_BOTTOM',

    WIRE_CAPACITOR_TOP: 'WIRE_CAPACITOR_TOP',
    WIRE_CAPACITOR_BOTTOM: 'WIRE_CAPACITOR_BOTTOM',

    WIRE_BATTERY_TOP: 'WIRE_BATTERY_TOP',
    WIRE_BATTERY_BOTTOM: 'WIRE_BATTERY_BOTTOM',

    WIRE_LIGHT_BULB_TOP: 'WIRE_LIGHT_BULB_TOP',
    WIRE_LIGHT_BULB_BOTTOM: 'WIRE_LIGHT_BULB_BOTTOM'
  };

  // @public {Array.<ProbeTarget>}
  ProbeTarget.VALUES = [
    ProbeTarget.NONE,
    ProbeTarget.OTHER_PROBE,
    ProbeTarget.BATTERY_TOP_TERMINAL,
    ProbeTarget.LIGHT_BULB_TOP,
    ProbeTarget.LIGHT_BULB_BOTTOM,
    ProbeTarget.CAPACITOR_TOP,
    ProbeTarget.CAPACITOR_BOTTOM,
    ProbeTarget.SWITCH_TOP,
    ProbeTarget.SWITCH_BOTTOM,
    ProbeTarget.SWITCH_CONNECTION_TOP,
    ProbeTarget.SWITCH_CONNECTION_BOTTOM,
    ProbeTarget.WIRE_CAPACITOR_TOP,
    ProbeTarget.WIRE_CAPACITOR_BOTTOM,
    ProbeTarget.WIRE_BATTERY_TOP,
    ProbeTarget.WIRE_BATTERY_BOTTOM,
    ProbeTarget.WIRE_LIGHT_BULB_TOP,
    ProbeTarget.WIRE_LIGHT_BULB_BOTTOM,
    ProbeTarget.WIRE_SWITCH_TOP,
    ProbeTarget.WIRE_SWITCH_BOTTOM
  ];

  // Verify that enum is immutable without runtime penalty in production code
  if ( assert ) {
    Object.freeze( ProbeTarget );
  }

  capacitorLabBasics.register( 'ProbeTarget', ProbeTarget );

  return ProbeTarget;
} );
