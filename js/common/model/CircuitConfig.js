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
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector3 = require( 'DOT/Vector3' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );

  // Constants with default assignments
  var BATTERY_LOCATION = new Vector3( 0.0065, 0.030, 0 ); // meters
  var CAPACITOR_X_SPACING = 0.024; // meters
  var CAPACITOR_Y_SPACING = 0; // meters
  //REVIEW: LIGHT_BULB_X_SPACING is always 0.023, consider factoring out into a common location and not passing around
  var LIGHT_BULB_X_SPACING = 0.023; // meters
  var PLATE_WIDTH = CLBConstants.PLATE_WIDTH_RANGE.defaultValue;
  var PLATE_SEPARATION = CLBConstants.PLATE_SEPARATION_RANGE.defaultValue;
  var WIRE_EXTENT = 0.016; // how far the wire extends above or below the capacitor (meters)
  var WIRE_THICKNESS = CLBConstants.WIRE_THICKNESS;
  var LIGHT_BULB_RESISTANCE = 5e12; // Ohms. Artificially large to stretch discharge time

  // constructor
  function CircuitConfig( options ) {

    //REVIEW: Including type information (e.g. circuitConnections {Array.<CircuitConnectionEnum>}) would be helpful
    options = _.extend( {
      modelViewTransform: new CLBModelViewTransform3D(),
      batteryLocation: BATTERY_LOCATION, //REVIEW: I don't see this being overridden anywhere, presumably factor it out.
      capacitorXSpacing: CAPACITOR_X_SPACING,
      capacitorYSpacing: CAPACITOR_Y_SPACING,
      plateWidth: PLATE_WIDTH,
      plateSeparation: PLATE_SEPARATION,
      wireExtent: WIRE_EXTENT,
      //REVIEW: Wire thickness never varies from CLBConstants.WIRE_THICKNESS. Don't need to pass this around
      wireThickness: WIRE_THICKNESS,
      //REVIEW: LIGHT_BULB_X_SPACING is always 0.023, consider factoring out into a common location and not passing around
      lightBulbXSpacing: LIGHT_BULB_X_SPACING,
      lightBulbResistance: LIGHT_BULB_RESISTANCE, //REVIEW: I don't see this being overridden anywhere, presumably factor it out.
      circuitConnections: [
        CircuitConnectionEnum.BATTERY_CONNECTED,
        CircuitConnectionEnum.OPEN_CIRCUIT,
        CircuitConnectionEnum.LIGHT_BULB_CONNECTED
      ]
    }, options );

    //REVIEW: Call me crazy, but `_.extend( this, { ...defaults... }, options )` would do all of this.
    // @public
    this.modelViewTransform = options.modelViewTransform;
    this.batteryLocation = options.batteryLocation;//REVIEW: I don't see this being overridden anywhere, presumably factor it out.
    this.capacitorXSpacing = options.capacitorXSpacing;
    this.capacitorYSpacing = options.capacitorYSpacing;
    this.plateWidth = options.plateWidth;
    this.plateSeparation = options.plateSeparation;
    //REVIEW: Wire thickness never varies from CLBConstants.WIRE_THICKNESS. Don't need to pass this around
    this.wireExtent = options.wireExtent;
    this.wireThickness = options.wireThickness;
    //REVIEW: LIGHT_BULB_X_SPACING is always 0.023, consider factoring out into a common location and not passing around
    this.lightBulbXSpacing = options.lightBulbXSpacing;
    this.lightBulbResistance = options.lightBulbResistance;
    this.circuitConnections = options.circuitConnections;
  }

  capacitorLabBasics.register( 'CircuitConfig', CircuitConfig );

  //REVIEW: Since it has no prototype, consider CircuitConfig having just a method (CircuitConfig.create( ... )) that returns a plain object.
  return inherit( Object, CircuitConfig );

} );

