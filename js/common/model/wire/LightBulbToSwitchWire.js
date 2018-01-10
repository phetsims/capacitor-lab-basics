// Copyright 2015-2017, University of Colorado Boulder

/**
 * Creates a wire that connects a light bulb to a circuit switch.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CircuitLocation = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitLocation' );
  var CircuitState = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitState' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector3 = require( 'DOT/Vector3' );
  var Wire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/Wire' );
  var WireSegment = require( 'CAPACITOR_LAB_BASICS/common/model/wire/WireSegment' );

  var COUNTER = 0;

  /**
   * @constructor
   *
   * @param {CircuitLocation} connectionPoint
   * @param {CircuitConfig} config
   * @param {LightBulb} lightBulb
   * @param {CircuitSwitch} circuitSwitch
   * @param {Tandem} tandem
   */
  function LightBulbToSwitchWire( connectionPoint, config, lightBulb, circuitSwitch, tandem ) {
    var segments = [];

    // Get y coordinate of the horizontal wire
    var horizontalY = circuitSwitch.getConnectionPoint( CircuitState.BATTERY_CONNECTED ).y;

    // Get x coordinate of the connection point
    var isTop = connectionPoint === CircuitLocation.LIGHT_BULB_TOP;
    var connectionPointX = isTop ? lightBulb.getTopConnectionPoint().x : lightBulb.getBottomConnectionPoint().x;

    // This is the (x,y) position of the upper right corner
    var rightCorner = new Vector3( connectionPointX, horizontalY, 0 );

    // add the vertical segment.
    var verticalSegment;
    if ( isTop ) {
      verticalSegment = WireSegment.createComponentTopWireSegment(
        lightBulb,
        rightCorner,
        tandem.createTandem( 'lightBulbComponentTopWireSegment' )
      );
    }
    else {
      verticalSegment = WireSegment.createComponentBottomWireSegment(
        lightBulb,
        rightCorner,
        tandem.createTandem( 'lightBulbComponentBottomWireSegment' )
      );
    }
    segments.push( verticalSegment );

    // connect lightbulb to switch connection point.
    var switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitState.LIGHT_BULB_CONNECTED );

    var separationOffset = new Vector3( 0.0006, 0, 0 );

    // Tandem IDs must be unique, so append a counter index
    var wireSegment = new WireSegment(
      rightCorner,
      switchConnectionPoint.plus( separationOffset ),
      tandem.createTandem( 'lightBulbSwitchWireSegment' + COUNTER )
    );
    segments.push( wireSegment );
    COUNTER++;

    Wire.call( this, config.modelViewTransform, segments, connectionPoint );
  }

  capacitorLabBasics.register( 'LightBulbToSwitchWire', LightBulbToSwitchWire );

  return inherit( Wire, LightBulbToSwitchWire, {}, {

    /**
     * Factory methods for top LightBulbToSwitchWire instance
     * @public
     *
     * @param {CircuitConfig} config
     * @param {LightBulb} lightBulb
     * @param {CircuitSwitch} circuitSwitch
     * @param {Tandem} tandem
     * @returns {Wire}
     */
    createLightBulbToSwitchWireBottom: function( config, lightBulb, circuitSwitch, tandem ) {
      return new LightBulbToSwitchWire( CircuitLocation.LIGHT_BULB_BOTTOM, config, lightBulb, circuitSwitch, tandem );
    },

    /**
     * Factory methods for bottom LightBulbToSwitchWire instance
     * @public
     *
     * @param {CircuitConfig} config
     * @param {LightBulb} lightBulb
     * @param {CircuitSwitch} circuitSwitch
     * @param {Tandem} tandem
     * @returns {Wire}
     */
    createLightBulbToSwitchWireTop: function( config, lightBulb, circuitSwitch, tandem ) {
      return new LightBulbToSwitchWire( CircuitLocation.LIGHT_BULB_TOP, config, lightBulb, circuitSwitch, tandem );
    }

  } );

} );

