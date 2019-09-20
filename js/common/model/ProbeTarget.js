// Copyright 2018-2019, University of Colorado Boulder

/**
 * Enumeration for what the voltmeter probes can be touching.
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( require => {
  'use strict';

  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const CircuitLocation = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitLocation' );

  const ProbeTarget = {
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

  /**
   * Given a probe target, it returns the general {CircuitLocation} which it is part of. This ignores the
   * CIRCUIT_SWITCH locations, only using the CAPACITOR ones for simplicity (since they are connected)
   * @public
   *
   * @param {ProbeTarget} probeTarget
   * @returns {CircuitLocation}
   */
  ProbeTarget.getCircuitLocation = function( probeTarget ) {
    switch ( probeTarget ) {
      case ProbeTarget.BATTERY_TOP_TERMINAL: return CircuitLocation.BATTERY_TOP;
      case ProbeTarget.LIGHT_BULB_TOP: return CircuitLocation.LIGHT_BULB_TOP;
      case ProbeTarget.LIGHT_BULB_BOTTOM: return CircuitLocation.LIGHT_BULB_BOTTOM;
      case ProbeTarget.CAPACITOR_TOP: return CircuitLocation.CAPACITOR_TOP;
      case ProbeTarget.CAPACITOR_BOTTOM: return CircuitLocation.CAPACITOR_BOTTOM;
      case ProbeTarget.SWITCH_TOP: return CircuitLocation.CAPACITOR_TOP;
      case ProbeTarget.SWITCH_BOTTOM: return CircuitLocation.CAPACITOR_BOTTOM;
      case ProbeTarget.SWITCH_CONNECTION_TOP: return CircuitLocation.CAPACITOR_TOP;
      case ProbeTarget.SWITCH_CONNECTION_BOTTOM: return CircuitLocation.CAPACITOR_BOTTOM;
      case ProbeTarget.WIRE_CAPACITOR_TOP: return CircuitLocation.CAPACITOR_TOP;
      case ProbeTarget.WIRE_CAPACITOR_BOTTOM: return CircuitLocation.CAPACITOR_BOTTOM;
      case ProbeTarget.WIRE_BATTERY_TOP: return CircuitLocation.BATTERY_TOP;
      case ProbeTarget.WIRE_BATTERY_BOTTOM: return CircuitLocation.BATTERY_BOTTOM;
      case ProbeTarget.WIRE_LIGHT_BULB_TOP: return CircuitLocation.LIGHT_BULB_TOP;
      case ProbeTarget.WIRE_LIGHT_BULB_BOTTOM: return CircuitLocation.LIGHT_BULB_BOTTOM;
      case ProbeTarget.WIRE_SWITCH_TOP: return CircuitLocation.CAPACITOR_TOP;
      case ProbeTarget.WIRE_SWITCH_BOTTOM: return CircuitLocation.CAPACITOR_BOTTOM;
      default: throw new Error( 'Unsupported probe target (no circuit location for it): ' + probeTarget );
    }
  };

  // Verify that enum is immutable without runtime penalty in production code
  if ( assert ) {
    Object.freeze( ProbeTarget );
  }

  capacitorLabBasics.register( 'ProbeTarget', ProbeTarget );

  return ProbeTarget;
} );
