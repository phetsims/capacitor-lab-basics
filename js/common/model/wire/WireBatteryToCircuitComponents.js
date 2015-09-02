// Copyright 2002-2015, University of Colorado Boulder

/**
 * Base class for any wire that connects a battery (B) to one or more circuit components (Z1...Zn).  For Capacitor Lab:
 * Basics, circuit comoponents include a capacitor and a lightBulb.  Circuit components are also connected via
 * switches so that the circuit components can be added and disconnected from the circuit (marked with a (`) in the
 * diagram below).
 *
 * For the "top" subclass, the wire looks like this:
 *
 *
 * |--`--|--`---|--...--|
 * |     |      |       |
 * |     |      |       |
 * B     Z1    Z2       Zn
 *
 * For the "bottom" subclass, the wire looks like this:
 *
 * B     Z1    Z2       Zn
 * |     |      |       |
 * |     |      |       |
 * |--`--|--`---|--...--|
 *
 * TODO: This documentation is no longer accurate.
 * TODO: I think the best solution here is to break tis file into sub and super classes and distribute through intro and
 * light bulb directories.  This would significantly reduce the number of switch statements as well as accountability
 * for generalizatoin ( multiple switches and such ).
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
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

  // constants
  var ConnectionPoint = {
    TOP: 'TOP',
    BOTTOM: 'BOTTOM'
  };

  /**
   * Constructor.
   *
   * @param {string} connectionPoint one of 'TOP' or 'BOTTOM'
   * @param {ModelViewTransform2} modelViewTransform
   * @param {number} thickness
   * @param {number} wireExtent how far the wire extends beyond the capacitor, in meters
   * @param {Battery} battery
   * @param {array.<Capacitor>} circuitComponents
   * @param {array.<CircuitSwitch>} circuitSwitches
   * @param {Property.<string>} circuitConnectionProperty
   * @constructor
   */
  function WireBatteryToCircuitComponents( connectionPoint, modelViewTransform, thickness, wireExtent, componentSpacing,
                                           battery, circuitComponents, circuitSwitches, circuitConnectionProperty ) {

    var segments = [];

    // y coordinate of the horizontal wire
    var horizontalY = this.getHorizontalY( connectionPoint, circuitComponents, wireExtent );
    var leftCorner = new Vector2( battery.location.x, horizontalY );

    // x offset for horizontal wire segments to compensate for the switch

    // add the battery segment
    // TODO: 0 should be getEndOffset
    segments.push( this.getBatteryWireSegment( connectionPoint, battery, 0, leftCorner ) );

     //add the lightbulb segment
    // TODO: Temporary solution that assumes that there is only one lightbulb and one switch.  This code is
    // messy, but it is a placeholder for layout for now.
    if( circuitComponents.length > 1 ) {
      var lightBulb = circuitComponents[ circuitComponents.length - 1 ];
      var capacitor = circuitComponents[ 0 ];
      var rightCorner = this.getRightCorner( connectionPoint, lightBulb, horizontalY );
      //var rightCorner = new Vector2( lightBulb.location.x, horizontalY );

      segments.push( this.getLightBulbWireSegment( connectionPoint, lightBulb, rightCorner ) );

      var sortedSwitches = _.sortBy( circuitSwitches, function( circuitSwitch ) {
        // get the top switch first.
        return circuitSwitch.getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED ).y;
      } );

      // connect battery to switch connection point.
      segments.push( this.getBatteryToSwitchSegment( connectionPoint, sortedSwitches, leftCorner ) );

      // connect light bulb to switch connection point.
      segments.push( this.getBulbToSwitchSegment( connectionPoint, sortedSwitches, rightCorner ) );

      // connect the capacitor to the switch.
      segments.push( this.getCapacitorToSwitchSegment( connectionPoint, sortedSwitches, capacitor ) );

    }

    Wire.call( this, modelViewTransform, thickness, segments, circuitConnectionProperty );

  }


  return inherit( Wire, WireBatteryToCircuitComponents, {
    /**
     * Gets the Y coordinate of the horizontal wire. It extends wireExtent distance above/below the component that is
     * closest to the wire.
     *
     * @param {string} connectionPoint, one of 'TOP', 'BOTTOM'
     * @param {array} circuitComponents
     * @param {number} wireExtent
     * @return {number}
     */
    getHorizontalY: function( connectionPoint, circuitComponents, wireExtent ) {
      var y = circuitComponents[ 0 ].location.y;
      if ( connectionPoint === ConnectionPoint.TOP ) {
        circuitComponents.forEach( function( component ) {
          y = Math.min( y, component.location.y - wireExtent );
        } );
      }
      else {
        circuitComponents.forEach( function( component ) {
          y = Math.max( y, component.location.y + wireExtent );
        } );
      }
      return y;
    },

    getRightCorner: function( connectionPoint, lightBulb, horizontalY ) {
      if( connectionPoint === ConnectionPoint.TOP ) {
        return new Vector2( lightBulb.location.x, horizontalY );
      }
      else {
        return new Vector2( lightBulb.getBottomConnectionPoint().x, horizontalY );
      }
    },

    /**
     * Gets a wire segment that attaches to the specified terminal (top or bottom) of a battery.
     *
     * @param connectionPoint
     * @param battery
     * @param endOffset
     * @param endPoint
     * @returns {WireSegment}
     */
    getBatteryWireSegment: function( connectionPoint, battery, endOffset, endPoint ) {
      if ( connectionPoint === ConnectionPoint.TOP ) {
        return WireSegment.BatteryTopWireSegment( battery, endOffset, endPoint );
      }
      else {
        return WireSegment.BatteryBottomWireSegment( battery, endOffset, endPoint );
      }
    },

    getLightBulbWireSegment: function( connectionPoint, lightBulb, endPoint ) {
      if ( connectionPoint === ConnectionPoint.TOP ) {
        return WireSegment.LightBulbTopWireSegment( lightBulb.getTopConnectionPoint(), endPoint );
      }
      else {
        return WireSegment.LightBulbBottomWireSegment( lightBulb.getBottomConnectionPoint(), endPoint );
      }
    },

    getBatteryToSwitchSegment: function( connectionPoint, sortedSwitches, endPoint ) {
      var switchConnectionPoint;
      if ( connectionPoint === ConnectionPoint.TOP ) {
        switchConnectionPoint = sortedSwitches[ 0 ].getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED );
        return WireSegment.BatteryTopToSwitchSegment( switchConnectionPoint, endPoint );
      }
      else {
        switchConnectionPoint = sortedSwitches[ 1 ].getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED );
        return WireSegment.BatteryBottomToSwitchSegment( switchConnectionPoint, endPoint );
      }
    },

    getBulbToSwitchSegment: function( connectionPoint, sortedSwiches, endPoint ) {
      var topSwitch = sortedSwiches[ 0 ];
      var bottomSwitch = sortedSwiches[ 1 ];
      var switchConnectionPoint;
      if( connectionPoint === ConnectionPoint.TOP ) {
        switchConnectionPoint = topSwitch.getConnectionPoint( CircuitConnectionEnum.LIGHT_BULB_CONNECTED );
        return WireSegment.BulbTopToSwitchSegment( switchConnectionPoint, endPoint );
      }
      else {
        switchConnectionPoint = bottomSwitch.getConnectionPoint( CircuitConnectionEnum.LIGHT_BULB_CONNECTED );
        return WireSegment.BulbBottomToSwitchSegment( switchConnectionPoint, endPoint );
      }
    },

    getCapacitorToSwitchSegment: function( connectionPoint, sortedSwitches, capacitor ) {
      var topSwitch = sortedSwitches[ 0 ];
      var bottomSwitch= sortedSwitches[1];
      var switchConnectionPoint;
      if( connectionPoint === ConnectionPoint.TOP ) {
        switchConnectionPoint = topSwitch.getCapacitorConnectionPoint();
        return WireSegment.CapacitorTopToSwitchSegment( capacitor.getTopConnectionPoint(), switchConnectionPoint);
      }
      else{
        switchConnectionPoint = bottomSwitch.getCapacitorConnectionPoint();
        return WireSegment.CapacitorTopToSwitchSegment( capacitor.getBottomConnectionPoint(), switchConnectionPoint );
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
      if ( connectionPoint === ConnectionPoint.TOP ) {
        return WireSegment.VerticalTopWireSegment( battery, startPoint );
      }
      else if ( connectionPoint === ConnectionPoint.BOTTOM ) {
        return WireSegment.VerticalBottomWireSegment( battery, startPoint );
      }
      else {
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
      if ( connectionPoint === ConnectionPoint.TOP ) {
        return WireSegment.ComponentTopWireSegment( component, startPoint );
      }
      else {
        return WireSegment.ComponentBottomWireSegment( component, startPoint );
      }
    }

  }, {

    /**
     * Factory functions for public access to specific constructors.
     */
    WireBatteryToCircuitComponentsBottom: function( modelViewTransform, thickness, wireExtent, componentSpacing, battery, circuitComponents, circuitSwitches, circuitConnectionProperty ) {
      return new WireBatteryToCircuitComponents( ConnectionPoint.BOTTOM, modelViewTransform, thickness, wireExtent, componentSpacing, battery, circuitComponents, circuitSwitches, circuitConnectionProperty );
    },

    WireBatteryToCircuitComponentsTop: function( modelViewTransform, thickness, wireExtent, componentSpacing, battery, circuitComponents, circuitSwitches, circuitConnectionProperty ) {
      return new WireBatteryToCircuitComponents( ConnectionPoint.TOP, modelViewTransform, thickness, wireExtent, componentSpacing, battery, circuitComponents, circuitSwitches, circuitConnectionProperty );
    }

  } );

} );