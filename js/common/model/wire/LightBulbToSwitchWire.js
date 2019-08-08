// Copyright 2015-2018, University of Colorado Boulder

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

  /**
   * @constructor
   *
   * @param {CircuitLocation} connectionPoint
   * @param {CircuitConfig} config
   * @param {LightBulb} lightBulb
   * @param {CircuitSwitch} circuitSwitch
   */
  function LightBulbToSwitchWire( connectionPoint, config, lightBulb, circuitSwitch ) {
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
        rightCorner
      );
    }
    else {
      verticalSegment = WireSegment.createComponentBottomWireSegment(
        lightBulb,
        rightCorner
      );
    }
    segments.push( verticalSegment );

    // connect light bulb to switch connection point.
    var switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitState.LIGHT_BULB_CONNECTED );

    var separationOffset = new Vector3( 0.0006, 0, 0 );

    var wireSegment = new WireSegment(
      rightCorner,
      switchConnectionPoint.plus( separationOffset )
    );
    segments.push( wireSegment );

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
     * @returns {LightBulbToSwitchWire}
     */
    createLightBulbToSwitchWireBottom: function( config, lightBulb, circuitSwitch ) {
      return new LightBulbToSwitchWire( CircuitLocation.LIGHT_BULB_BOTTOM, config, lightBulb, circuitSwitch );
    },

    /**
     * Factory methods for bottom LightBulbToSwitchWire instance
     * @public
     *
     * @param {CircuitConfig} config
     * @param {LightBulb} lightBulb
     * @param {CircuitSwitch} circuitSwitch
     * @returns {LightBulbToSwitchWire}
     */
    createLightBulbToSwitchWireTop: function( config, lightBulb, circuitSwitch ) {
      return new LightBulbToSwitchWire( CircuitLocation.LIGHT_BULB_TOP, config, lightBulb, circuitSwitch );
    }

  } );

} );

