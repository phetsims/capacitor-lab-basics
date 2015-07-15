/**
 * Shared constants used in multiple locations within the sim.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var Range = require( 'DOT/Range' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );

  // constants
  var PLATE_WIDTH_RANGE = new Range( 0.01, 0.02, 0.01 ); // meters

  return {

    //----------------------------------------------------------------------------
    // Model
    //----------------------------------------------------------------------------

    EPSILON_0: 8.854E-12, // vacuum permittivity, aka electric constant (Farads/meter)

    // world
    WORLD_DRAG_MARGIN: 0.001, // meters

    // battery
    BATTERY_VOLTAGE_RANGE: new Range( -1.5, 1.5, 0 ), // Volts
    BATTERY_VOLTAGE_SNAP_TO_ZERO_THRESHOLD: 0.1, // Volts
    POLARITY: {
      POSITIVE: 'POSITIVE',
      NEGATIVE: 'NEGATIVE'
    },

    // capacitor
    PLATE_WIDTH_RANGE: new Range( 0.01, 0.02, 0.01 ), // meters
    PLATE_HEIGHT: 0.0005, // meters
    PLATE_SEPARATION_RANGE: new Range( 0.005, 0.01, 0.01 ), // meters
    CAPACITANCE_RANGE: new Range( 1E-13, 3E-13 ), // Farads

    // dielectric
    DIELECTRIC_CONSTANT_RANGE: new Range( 1, 5, 5 ), // dimensionless
    DIELECTRIC_OFFSET_RANGE: new Range( 0, PLATE_WIDTH_RANGE.max, PLATE_WIDTH_RANGE.defaultValue ), // meters

    // dielectric constants (dimensionless)
    EPSILON_VACUUM: 1,
    EPSILON_GLASS: 4.7,
    EPSILON_PAPER: 3.5,
    EPSILON_TEFLON: 2.1,

    /*
     * The dielectric constant of air is actually 1.0005896. The model for this sim specified that
     * the circuit was in air.  But we discovered late in the development of this sim that we should
     * have modeled the circuit in a vacuum, because we want the E-Field component due to the
     * environment to be zero.  With air, we have a small Dielectric vector of up to 4 V/m shown
     * on the E-Field Detector when the Plate Charge control is set to its maximum.
     *
     * Rather than change "air" to "vacuum" in numerous places throughout the code and design doc,
     * it was suggested that we simply set the dielectric constant of air to 1.0.  I was hesitant to
     * do this, since I think it's going to cause future problems.  But Kathy P. bet me a 6-pack of
     * beer that it will never be a problem.  Any developer who needs to change this in the future
     * is hereby bound by the Developer Code of Ethics to inform me, so that I can collect on
     * this wager.
     */
    EPSILON_AIR: 1.0,

    // Wire
    WIRE_THICKNESS: 0.0005, // meters

    // Plate Charge control
    PLATE_CHARGE_CONTROL_SNAP_TO_ZERO_THRESHOLD: 1.5E-13,

    //----------------------------------------------------------------------------
    // View
    //----------------------------------------------------------------------------

    // reference coordinate frame size for world nodes
    CANVAS_RENDERING_SIZE: new Dimension2( 1024, 864 ),

    // model-view transform.  Note explicit conversion to radians
    MVT_SCALE: 15000, // scale factor when going from model to view
    MVT_YAW: -45 * Math.PI / 180, // rotation about the vertical axis, right-hand rule determines sign.
    MVT_PITCH: 30 * Math.PI / 180, // rotation about the horizontal axis, right-hand rule determines sign

    DRAG_HANDLE_ARROW_LENGTH: 45, // pixels

    // default exponents for the meters
    CAPACITANCE_METER_VALUE_EXPONENT: -12,
    PLATE_CHARGE_METER_VALUE_EXPONENT: -13,
    STORED_ENERGY_METER_VALUE_EXPONENT: -13,

    // plate charges
    NUMBER_OF_PLATE_CHARGES: new Range( 1, 625 ),
    NEGATIVE_CHARGE_SIZE: new Dimension2( 7, 2 ),
    PLATE_CHARGES_VISIBLE: true,

    // E-field
    NUMBER_OF_EFIELD_LINES: new Range( 4, 900 ), // number of lines on smallest plate
    EFIELD_VISIBLE: false,
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
    CUSTOM_DIELECTRIC_COLOR: 'rgb( 255, 255, 125 )', // pale yellow
    AIR_COLOR: 'rgba( 255, 0, 0, 1 )' // This should never be seen so pick something obviously wrong.

  };
} );
