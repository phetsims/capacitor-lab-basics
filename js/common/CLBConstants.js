// Copyright 2015-2017, University of Colorado Boulder

/**
 * Shared constants used in multiple locations within the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var RangeWithValue = require( 'DOT/RangeWithValue' );
  var Vector3 = require( 'DOT/Vector3' );

  var CLBConstants = {

    //----------------------------------------------------------------------------
    // Model
    //----------------------------------------------------------------------------

    EPSILON_0: 8.854E-12, // vacuum permittivity, aka electric constant (Farads/meter)

    // world
    WORLD_DRAG_MARGIN: 0.001, // meters

    // battery
    BATTERY_VOLTAGE_RANGE: new RangeWithValue( -1.5, 1.5, 0 ), // Volts
    BATTERY_VOLTAGE_SNAP_TO_ZERO_THRESHOLD: 0.15, // Volts
    POLARITY: {
      POSITIVE: 'POSITIVE',
      NEGATIVE: 'NEGATIVE'
    },

    // capacitor
    PLATE_WIDTH_RANGE: new RangeWithValue( 0.01, 0.02, 0.01 ), // meters
    PLATE_HEIGHT: 0.0005, // meters
    PLATE_SEPARATION_RANGE: new RangeWithValue( 0.002, 0.01, 0.01 ), // meters
    CAPACITANCE_RANGE: new RangeWithValue( 1E-13, 3E-13 ), // Farads

    LIGHT_BULB_X_SPACING: 0.023, // meters
    BATTERY_LOCATION: new Vector3( 0.0065, 0.030, 0 ), // meters
    LIGHT_BULB_RESISTANCE: 5e12, // Ohms. Artificially large to stretch discharge time

    // switch
    SWITCH_WIRE_LENGTH: 0.0064, // in meters
    SWITCH_Y_SPACING: 0.0025, // spacing between circuit components and the switch

    // dielectric constants (dimensionless)
    EPSILON_VACUUM: 1,

    // Wire
    WIRE_THICKNESS: 0.0005, // meters

    //----------------------------------------------------------------------------
    // View
    //----------------------------------------------------------------------------

    // colors used by ConnectionNode
    DISCONNECTED_POINT_COLOR: 'rgb( 200, 230, 255 )',
    DISCONNECTED_POINT_STROKE: PhetColorScheme.RED_COLORBLIND,
    CONNECTION_POINT_HIGHLIGHTED: 'yellow',

    // model-view transform.  Note explicit conversion to radians
    MVT_SCALE: 12000, // scale factor when going from model to view
    MVT_YAW: -45 * Math.PI / 180, // rotation about the vertical axis, right-hand rule determines sign.
    MVT_PITCH: 30 * Math.PI / 180, // rotation about the horizontal axis, right-hand rule determines sign

    DRAG_HANDLE_ARROW_LENGTH: 45, // pixels

    // Model values at which the bar meters have their maximum length in the view.
    // They are currently set to follow a common scale.
    CAPACITANCE_METER_MAX_VALUE: 2.7e-12,
    PLATE_CHARGE_METER_MAX_VALUE: 2.7e-12,
    STORED_ENERGY_METER_MAX_VALUE: 2.7e-12,

    CONNECTION_POINT_RADIUS: 8, // px - dashed circles at switch contacts

    // plate charges
    NUMBER_OF_PLATE_CHARGES: new RangeWithValue( 1, 625 ),
    NEGATIVE_CHARGE_SIZE: new Dimension2( 7, 2 ),
    ELECTRON_CHARGE: 1.60218E-19,
    MIN_PLATE_CHARGE: 0.01E-12, // absolute minimum plate charge in coulombs

    // E-field
    NUMBER_OF_EFIELD_LINES: new RangeWithValue( 1, 900 ), // number of lines on smallest plate
    DIRECTION: {
      UP: 'UP',
      DOWN: 'DOWN'
    },

    // capacitance control
    CAPACITANCE_CONTROL_EXPONENT: -13,

    // colors used throughout the sim, each representing a physical quantity
    CAPACITANCE_COLOR: 'rgb( 61, 179, 79 )',
    E_FIELD_COLOR: 'black',
    STORED_ENERGY_COLOR: 'yellow',
    POSITIVE_CHARGE_COLOR: PhetColorScheme.RED_COLORBLIND,
    NEGATIVE_CHARGE_COLOR: 'blue',

    // other common colors
    METER_PANEL_FILL: 'rgb( 255, 245, 237)',
    CONNECTION_POINT_COLOR: 'black',
    PIN_COLOR: 'lightgray',
    SCREEN_VIEW_BACKGROUND_COLOR: 'rgb( 151, 208, 255 )'

  };

  capacitorLabBasics.register( 'CLBConstants', CLBConstants );

  return CLBConstants;
} );
