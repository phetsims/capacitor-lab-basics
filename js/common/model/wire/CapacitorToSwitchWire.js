// Copyright 2015, University of Colorado Boulder

/**
 * Creates a wire that connects a capacitor to a circuit switch.
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
   * @param {Capacitor} capacitor
   * @param {CircuitSwitch} circuitSwitch
   * @constructor
   */
  function CapacitorToSwitchWire( connectionPoint, modelViewTransform, thickness, capacitor, circuitSwitch ) {
    var segments = [];

    // add the vertical segment.
    segments.push( this.getCapacitorToSwitchSegment( connectionPoint, circuitSwitch, capacitor ) );

    Wire.call( this, modelViewTransform, thickness, segments, connectionPoint );
  }

  capacitorLabBasics.register( 'CapacitorToSwitchWire', CapacitorToSwitchWire );

  return inherit( Wire, CapacitorToSwitchWire, {

    getRightCorner: function( connectionPoint, lightBulb, horizontalY ) {
      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.CAPACITOR_TOP ) {
        return new Vector2( lightBulb.location.x, horizontalY );
      } else {
        return new Vector2( lightBulb.getBottomConnectionPoint().x, horizontalY );
      }
    },

    getLightBulbWireSegment: function( connectionPoint, lightBulb, endPoint ) {
      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.CAPACITOR_TOP ) {
        return WireSegment.ComponentTopWireSegment( lightBulb, endPoint );
      } else {
        return WireSegment.ComponentBottomWireSegment( lightBulb, endPoint );
      }
    },

    getBatteryToSwitchSegment: function( connectionPoint, circuitSwitch, endPoint ) {
      var switchConnectionPoint;
      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.CAPACITOR_TOP ) {
        switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED );
        return WireSegment.BatteryTopToSwitchSegment( endPoint, switchConnectionPoint );
      } else {
        switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED );
        return WireSegment.BatteryBottomToSwitchSegment( endPoint, switchConnectionPoint );
      }
    },

    getLightBulbToSwitchSegment: function( connectionPoint, circuitSwitch, endPoint ) {
      var switchConnectionPoint;
      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.CAPACITOR_TOP ) {
        switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.LIGHT_BULB_CONNECTED );
        return new WireSegment( endPoint, switchConnectionPoint );
      } else {
        switchConnectionPoint = circuitSwitch.getConnectionPoint( CircuitConnectionEnum.LIGHT_BULB_CONNECTED );
        return new WireSegment( endPoint, switchConnectionPoint );
      }
    },

    getCapacitorToSwitchSegment: function( connectionPoint, circuitSwitch, capacitor ) {
      var switchConnectionPoint = circuitSwitch.getCapacitorConnectionPoint();
      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.CAPACITOR_TOP ) {
        return WireSegment.ComponentTopWireSegment( capacitor, switchConnectionPoint );
      } else {
        return WireSegment.ComponentBottomWireSegment( capacitor, switchConnectionPoint );
      }
    },

    /**
     * Return a vertical wire segment from the battery connection point to the horizontal wires in the parallel circuit.
     *
     * @param {string} connectionPoint The connection type for the component, one of TOP or BOTTOM
     * @param {Battery} battery
     * @param {Vector2} startPoint
     */
    getVerticalWireSegment: function( connectionPoint, battery, startPoint ) {
      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.CAPACITOR_TOP ) {
        return WireSegment.VerticalTopWireSegment( battery, startPoint );
      } else if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.CAPACITOR_BOTTOM ) {
        return WireSegment.VerticalBottomWireSegment( battery, startPoint );
      } else {
        assert && assert( 'Connection point must be one of "TOP" or "BOTTOM" ' );
      }
    },

    /**
     * Gets a wire segment that attaches to the specified circuit component.
     *
     * @param connectionPoint
     * @param component
     * @param endPoint
     * @returns {WireSegment}
     */
    getComponentWireSegment: function( connectionPoint, component, startPoint ) {
      if ( connectionPoint === CLConstants.WIRE_CONNECTIONS.CAPACITOR_TOP ) {
        return WireSegment.ComponentTopWireSegment( component, startPoint );
      } else {
        return WireSegment.ComponentBottomWireSegment( component, startPoint );
      }
    }

  }, {

    /**
     * Factory functions for public access to specific constructors.
     */
    CapacitorToSwitchWireTop: function( modelViewTransform, thickness, capacitor, circuitSwitch ) {
      return new CapacitorToSwitchWire( CLConstants.WIRE_CONNECTIONS.CAPACITOR_TOP, modelViewTransform, thickness, capacitor, circuitSwitch );
    },

    CapacitorToSwitchWireBottom: function( modelViewTransform, thickness, capacitor, circuitSwitch ) {
      return new CapacitorToSwitchWire( CLConstants.WIRE_CONNECTIONS.CAPACITOR_BOTTOM, modelViewTransform, thickness, capacitor, circuitSwitch );
    }

  } );

} );

