// Copyright 2015, University of Colorado Boulder

/**
 * Creates a wire that connects a light bulb to a circuit switch.
 */

define( function( require ) {
  'use strict';

  // modules
  var Vector2 = require( 'DOT/Vector2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Wire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/Wire' );
  var WireSegment = require( 'CAPACITOR_LAB_BASICS/common/model/wire/WireSegment' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * Constructor.
   *
   * @param {string} connectionPoint one of 'TOP' or 'BOTTOM'
   * @param {ModelViewTransform2} modelViewTransform
   * @param {number} thickness
   * @param {LightBulb} lightBulb
   * @param {CircuitSwitch} circuitSwitch
   * @constructor
   */
  function LightBulbToSwitchWire( connectionPoint, modelViewTransform, thickness, lightBulb, circuitSwitch ) {
    var segments = [];

    // Get y coordinate of the horizontal wire
    var horizontalY = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED ).y;

    // Get x coordinate of the connection point
    var isTop = connectionPoint === CLConstants.WIRE_CONNECTIONS.LIGHT_BULB_TOP;
    var connectionPointX = isTop ? lightBulb.getTopConnectionPoint().x : lightBulb.getBottomConnectionPoint().x;

    var rightCorner = new Vector2( connectionPointX, horizontalY );

    // add the vertical segment.
    var verticalSegment;
    if ( isTop ) {
      verticalSegment = WireSegment.ComponentTopWireSegment( lightBulb, rightCorner );
    } else {
      verticalSegment = WireSegment.ComponentBottomWireSegment( lightBulb, rightCorner );
    }
    segments.push( verticalSegment );

    // connect lightbulb to switch connection point.
    var switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.LIGHT_BULB_CONNECTED );
    segments.push( new WireSegment( rightCorner, switchConnectionPoint ) );

    Wire.call( this, modelViewTransform, thickness, segments, connectionPoint );

  }

  capacitorLabBasics.register( 'LightBulbToSwitchWire', LightBulbToSwitchWire );

  return inherit( Wire, LightBulbToSwitchWire, {}, {

    /**
     * Factory functions for public access to specific constructors.
     */
    LightBulbToSwitchWireBottom: function( modelViewTransform, thickness, lightBulb, circuitSwitch ) {
      return new LightBulbToSwitchWire( CLConstants.WIRE_CONNECTIONS.LIGHT_BULB_BOTTOM, modelViewTransform, thickness, lightBulb, circuitSwitch );
    },

    LightBulbToSwitchWireTop: function( modelViewTransform, thickness, lightBulb, circuitSwitch ) {
      return new LightBulbToSwitchWire( CLConstants.WIRE_CONNECTIONS.LIGHT_BULB_TOP, modelViewTransform, thickness, lightBulb, circuitSwitch );
    }

  } );

} );

