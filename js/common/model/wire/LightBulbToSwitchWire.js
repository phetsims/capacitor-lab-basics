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

    // y coordinate of the horizontal wire
    var horizontalY = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED ).y;
    var rightCorner = this.getRightCorner( connectionPoint, lightBulb, horizontalY );

    // add the vertical segment.
    segments.push( this.getLightBulbWireSegment( connectionPoint, lightBulb, rightCorner ) );

    // connect lightbulb to switch connection point.
    segments.push( this.getLightBulbToSwitchSegment( connectionPoint, circuitSwitch, rightCorner ) );

    Wire.call( this, modelViewTransform, thickness, segments, connectionPoint );

  }

  capacitorLabBasics.register( 'LightBulbToSwitchWire', LightBulbToSwitchWire );

  return inherit( Wire, LightBulbToSwitchWire, {

    getRightCorner: function( connectionPoint, lightBulb, horizontalY ) {
      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.LIGHT_BULB_TOP ) {
        return new Vector2( lightBulb.getTopConnectionPoint().x, horizontalY );
      } else {
        return new Vector2( lightBulb.getBottomConnectionPoint().x, horizontalY );
      }
    },

    getLightBulbWireSegment: function( connectionPoint, lightBulb, endPoint ) {
      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.LIGHT_BULB_TOP ) {
        return WireSegment.ComponentTopWireSegment( lightBulb, endPoint );
      } else {
        return WireSegment.ComponentBottomWireSegment( lightBulb, endPoint );
      }
    },

    getLightBulbToSwitchSegment: function( connectionPoint, circuitSwitch, endPoint ) {
      var switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.LIGHT_BULB_CONNECTED );
      return new WireSegment( endPoint, switchConnectionPoint );
    }

  }, {

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

