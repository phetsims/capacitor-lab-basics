// Copyright 2015, University of Colorado Boulder

/**
 * Creates a wire that connects a light bulb to a circuit switch.
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var Vector2 = require( 'DOT/Vector2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Wire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/Wire' );
  var WireSegment = require( 'CAPACITOR_LAB_BASICS/common/model/wire/WireSegment' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  var COUNTER = 0;

  /**
   * @param {string} connectionPoint one of 'TOP' or 'BOTTOM'
   * @param {CircuitConfig} config
   * @param {LightBulb} lightBulb
   * @param {CircuitSwitch} circuitSwitch
   * @param {Tandem|null} tandem - null if this is a temporary circuit used for calculations
   * @constructor
   */
  function LightBulbToSwitchWire( connectionPoint, config, lightBulb, circuitSwitch, tandem ) {
    var segments = [];

    // Get y coordinate of the horizontal wire
    var horizontalY = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED ).y;

    // Get x coordinate of the connection point
    var isTop = connectionPoint === CLBConstants.WIRE_CONNECTIONS.LIGHT_BULB_TOP;
    var connectionPointX = isTop ? lightBulb.getTopConnectionPoint().x : lightBulb.getBottomConnectionPoint().x;

    // This is the (x,y) position of the upper right corner
    var rightCorner = new Vector2( connectionPointX, horizontalY );

    // add the vertical segment.
    var verticalSegment;
    if ( isTop ) {
      verticalSegment = WireSegment.createComponentTopWireSegment( lightBulb, rightCorner,
        tandem.createTandem( 'lightBulbComponentTopWireSegment' ) );
    } else {
      verticalSegment = WireSegment.createComponentBottomWireSegment( lightBulb, rightCorner,
        tandem.createTandem( 'lightBulbComponentBottomWireSegment' ) );
    }
    segments.push( verticalSegment );

    // connect lightbulb to switch connection point.
    var switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.LIGHT_BULB_CONNECTED );

    // Tandem IDs must be unique, so append a counter index
    segments.push( new WireSegment( rightCorner, switchConnectionPoint,
      tandem.createTandem( 'lightBulbSwitchWireSegment' + COUNTER ) ) );
    COUNTER++;

    Wire.call( this, config.modelViewTransform, config.wireThickness, segments, connectionPoint );

  }

  capacitorLabBasics.register( 'LightBulbToSwitchWire', LightBulbToSwitchWire );

  return inherit( Wire, LightBulbToSwitchWire, {}, {

    /**
     * Factory methods for top and bottom LightBulbToSwitchWire instances
     *
     * @param {CircuitConfig} config
     * @param {LightBulb} lightBulb
     * @param {CircuitSwitch} circuitSwitch
     * @param {Tandem} tandem
     */
    createLightBulbToSwitchWireBottom: function( config, lightBulb, circuitSwitch, tandem ) {
      return new LightBulbToSwitchWire( CLBConstants.WIRE_CONNECTIONS.LIGHT_BULB_BOTTOM, config, lightBulb, circuitSwitch, tandem );
    },

    createLightBulbToSwitchWireTop: function( config, lightBulb, circuitSwitch, tandem ) {
      return new LightBulbToSwitchWire( CLBConstants.WIRE_CONNECTIONS.LIGHT_BULB_TOP, config, lightBulb, circuitSwitch, tandem );
    }

  } );

} );

