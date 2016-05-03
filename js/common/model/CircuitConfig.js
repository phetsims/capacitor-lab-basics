// Copyright 2015, University of Colorado Boulder

/**
 * Configuration information for a circuit. This is purely a data structure, whose purpose is to reduce the number of
 * parameters required in constructors and creation methods.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var CLBModelViewTransform3D = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModelViewTransform3D' );
  var DielectricMaterial = require( 'CAPACITOR_LAB_BASICS/common/model/DielectricMaterial' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector3 = require( 'DOT/Vector3' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );

  // Constants with default assignments
  var BATTERY_LOCATION = new Vector3( 0.0065, 0.030, 0 ); // meters
  var CAPACITOR_X_SPACING = 0.024; // meters
  var CAPACITOR_Y_SPACING = 0; // meters
  var LIGHT_BULB_X_SPACING = 0.023; // meters
  var PLATE_WIDTH = CLBConstants.PLATE_WIDTH_RANGE.defaultValue;
  var PLATE_SEPARATION = CLBConstants.PLATE_SEPARATION_RANGE.defaultValue;
  var WIRE_EXTENT = 0.016; // how far the wire extends above or below the capacitor (meters)
  var WIRE_THICKNESS = CLBConstants.WIRE_THICKNESS;
  var DIELECTRIC_OFFSET = 0.02; // meters
  var LIGHT_BULB_RESISTANCE = 5e12; // Ohms. Artificially large to stretch discharge time
  var NUMBER_OF_CAPACITORS = 1;
  var NUMBER_OF_LIGHTBULBS = 0;

  // constructor
  function CircuitConfig( options ) {

    options = _.extend( {
      modelViewTransform: new CLBModelViewTransform3D(),
      batteryLocation: BATTERY_LOCATION,
      capacitorXSpacing: CAPACITOR_X_SPACING,
      capacitorYSpacing: CAPACITOR_Y_SPACING,
      plateWidth: PLATE_WIDTH,
      plateSeparation: PLATE_SEPARATION,
      wireExtent: WIRE_EXTENT,
      wireThickness: WIRE_THICKNESS,
      lightBulbXSpacing: LIGHT_BULB_X_SPACING,
      dielectricMaterial: DielectricMaterial.Air,
      dielectricOffset: DIELECTRIC_OFFSET,
      lightBulbResistance: LIGHT_BULB_RESISTANCE,
      circuitConnections: [
        CircuitConnectionEnum.BATTERY_CONNECTED,
        CircuitConnectionEnum.OPEN_CIRCUIT,
        CircuitConnectionEnum.LIGHT_BULB_CONNECTED
      ],
      numberOfCapacitors: NUMBER_OF_CAPACITORS,
      numberOfLightBulbs: NUMBER_OF_LIGHTBULBS
    }, options );

    // @public
    this.modelViewTransform = options.modelViewTransform;
    this.batteryLocation = options.batteryLocation;
    this.capacitorXSpacing = options.capacitorXSpacing;
    this.capacitorYSpacing = options.capacitorYSpacing;
    this.plateWidth = options.plateWidth;
    this.plateSeparation = options.plateSeparation;
    this.wireExtent = options.wireExtent;
    this.wireThickness = options.wireThickness;
    this.lightBulbXSpacing = options.lightBulbXSpacing;
    this.dielectricMaterial = options.dielectricMaterial;
    this.dielectricOffset = options.dielectricOffset;
    this.lightBulbResistance = options.lightBulbResistance;
    this.circuitConnections = options.circuitConnections;
    this.numberOfCapacitors = options.numberOfCapacitors;
    this.numberOfLightBulbs = options.numberOfLightBulbs;
  }

  capacitorLabBasics.register( 'CircuitConfig', CircuitConfig );

  return inherit( Object, CircuitConfig );

} );

