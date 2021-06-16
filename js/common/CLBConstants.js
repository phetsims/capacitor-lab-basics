// Copyright 2015-2021, University of Colorado Boulder

/**
 * Shared constants used in multiple locations within the sim.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Range from '../../../dot/js/Range.js';
import RangeWithValue from '../../../dot/js/RangeWithValue.js';
import Vector3 from '../../../dot/js/Vector3.js';
import PhetColorScheme from '../../../scenery-phet/js/PhetColorScheme.js';
import capacitorLabBasics from '../capacitorLabBasics.js';

const CLBConstants = {

  //----------------------------------------------------------------------------
  // Model
  //----------------------------------------------------------------------------

  EPSILON_0: 8.854E-12, // vacuum permittivity, aka electric constant (Farads/meter)

  // world
  WORLD_DRAG_MARGIN: 0.001, // meters

  // battery
  BATTERY_VOLTAGE_RANGE: new RangeWithValue( -1.5, 1.5, 0 ), // Volts
  BATTERY_VOLTAGE_SNAP_TO_ZERO_THRESHOLD: 0.15, // Volts

  // capacitor
  CAPACITANCE_RANGE: new Range( 1E-13, 3E-13 ), // Farads

  LIGHT_BULB_X_SPACING: 0.023, // meters
  BATTERY_POSITION: new Vector3( 0.0065, 0.030, 0 ), // meters
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

  DRAG_HANDLE_ARROW_LENGTH: 45, // pixels

  // Model values at which the bar meters have their maximum length in the view.
  // They are currently set to follow a common scale.
  CAPACITANCE_METER_MAX_VALUE: 2.7e-12,
  PLATE_CHARGE_METER_MAX_VALUE: 2.7e-12,
  STORED_ENERGY_METER_MAX_VALUE: 2.7e-12,

  CONNECTION_POINT_RADIUS: 8, // px - dashed circles at switch contacts

  // plate charges
  ELECTRON_CHARGE: 1.60218E-19,
  MIN_PLATE_CHARGE: 0.01E-12, // absolute minimum plate charge in coulombs

  // E-field
  NUMBER_OF_EFIELD_LINES: new Range( 1, 900 ), // number of lines on smallest plate
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
  SCREEN_VIEW_BACKGROUND_COLOR: 'rgb( 153, 193, 255 )'
};

capacitorLabBasics.register( 'CLBConstants', CLBConstants );

export default CLBConstants;
