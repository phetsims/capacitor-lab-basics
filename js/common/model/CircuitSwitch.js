// Copyright 2002-2015, University of Colorado Boulder

/**
 * Circuit switch.  The circuit switch has a start point and an end point.  The start point acts as a hinge, and the end
 * point can switch to new connection points.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Wire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/Wire' );
  var WireSegment = require( 'CAPACITOR_LAB_BASICS/common/model/wire/WireSegment' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var PropertySet = require( 'AXON/PropertySet' );

  // constants
  var SWITCH_ANGLE = Math.PI / 4;

  /**
   * Constructor for a CircuitSwitch.
   *
   * @param {Vector3} hingePoint
   * @param {Object} connections
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {Property} circuitConnectionProperty
   */
  function CircuitSwitch( hingePoint, connections, modelViewTransform, circuitConnectionProperty ) {

    this.initialAngle = 0; // with respect to the horizontal ( open switch )

    this.hingePoint = hingePoint;
    this.connections = connections;
    this.modelViewTransform = modelViewTransform;
    this.circuitConnectionProperty = circuitConnectionProperty;

    this.activeConnection = this.getConnection( circuitConnectionProperty.value );
    var thisSwitch = this;

    PropertySet.call( this, {
      angle: this.initialAngle
    } );

    // add the switch wire that spans two connection points. Default connection is battery.
    this.switchSegment = WireSegment.SwitchSegment( hingePoint, this.activeConnection );
    this.switchWire = new Wire( modelViewTransform, CLConstants.WIRE_THICKNESS, [ this.switchSegment ] );

    // set active connection whenever circuit connection type changes.
    circuitConnectionProperty.link( function( circuitConnection ) {
      thisSwitch.activeConnection = thisSwitch.getConnection( circuitConnection );
      thisSwitch.switchSegment.update( thisSwitch.activeConnection );
    } );

  }

  return inherit( PropertySet, CircuitSwitch, {

    /**
     * Get the disired connection from the connection type.
     *
     * @param connectionType
     * @returns {object}
     */
    getConnection: function( connectionType ) {
      var returnConnection;
      this.connections.forEach( function( connection ) {
        if ( connection.connectionType === connectionType ) {
          returnConnection = connection;
        }
      } );
      if ( returnConnection === 'undefined' ) {
        console.error( 'Requested connection type that does not exist for this circuit' );
      }
      return returnConnection;
    },

    /**
     * Convenience method for getting the connection locations. Similar to getConnection above, but directly returns
     * the location.
     *
     * @param {string} connectionType - BATTERY_CONNECTED || OPEN_CIRCUIT || LIGHT_BULB_CONNECTED
     */
    getConnectionPoint: function( connectionType ) {
      var returnConnectionPoint;
      this.connections.forEach( function( connection ) {
        if ( connection.connectionType === connectionType ) {
          returnConnectionPoint = connection.location;
        }
      } );
      if ( returnConnectionPoint === 'undefined' ) {
        console.error( 'Requested connection type that does not exist for this circuit.' );
      }
      return returnConnectionPoint.toVector2();
    },

    getSwitchEndPoint: function() {
      return this.switchSegment.endPoint.toVector2();
    },

    getCapacitorConnectionPoint: function() {
      return this.hingePoint.toVector2();
    },

    getRightLimitAngle: function() {
      return this.getConnectionPoint( CircuitConnectionEnum.LIGHT_BULB_CONNECTED ).minus( this.hingePoint.toVector2() ).angle();
    },

    getLeftLimitAngle: function() {
      return this.getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED ).minus( this.hingePoint.toVector2() ).angle();
    },

    getOpenAngle: function() {
      return this.getConnectionPoint( CircuitConnectionEnum.OPEN_CIRCUIT ).minus( this.hingePoint.toVector2() ).angle();
    }
  }, {

    CircuitTopSwitch: function( hingePoint, modelViewTransform, circuitConnectionProperty ) {

      var topPoint = hingePoint.toVector2().minusXY( 0, CLConstants.SWITCH_WIRE_LENGTH );
      var leftPoint = hingePoint.toVector2().minusXY(
        CLConstants.SWITCH_WIRE_LENGTH * Math.sin( SWITCH_ANGLE ),
        CLConstants.SWITCH_WIRE_LENGTH * Math.cos( SWITCH_ANGLE )
      );
      var rightPoint = hingePoint.toVector2().minusXY(
        -CLConstants.SWITCH_WIRE_LENGTH * Math.sin( SWITCH_ANGLE ),
        CLConstants.SWITCH_WIRE_LENGTH * Math.cos( SWITCH_ANGLE )
      );
      var connections = [
        {
          location: topPoint.toVector3(),
          connectionType: CircuitConnectionEnum.OPEN_CIRCUIT
        },
        {
          location: leftPoint.toVector3(),
          connectionType: CircuitConnectionEnum.BATTERY_CONNECTED
        },
        {
          location: rightPoint.toVector3(),
          connectionType: CircuitConnectionEnum.LIGHT_BULB_CONNECTED
        }
      ];

      return new CircuitSwitch( hingePoint, connections, modelViewTransform, circuitConnectionProperty );
    },

    CircuitBottomSwitch: function( hingePoint, modelViewTransform, circuitConnectionProperty ) {

      var topPoint = hingePoint.toVector2().plusXY( 0, CLConstants.SWITCH_WIRE_LENGTH );
      var rightPoint = hingePoint.toVector2().plusXY(
        CLConstants.SWITCH_WIRE_LENGTH * Math.sin( SWITCH_ANGLE ),
        CLConstants.SWITCH_WIRE_LENGTH * Math.cos( SWITCH_ANGLE )
      );
      var leftPoint = hingePoint.toVector2().plusXY(
        -CLConstants.SWITCH_WIRE_LENGTH * Math.sin( SWITCH_ANGLE ),
        CLConstants.SWITCH_WIRE_LENGTH * Math.cos( SWITCH_ANGLE )
      );
      var connections = [
        {
          location: topPoint.toVector3(),
          connectionType: CircuitConnectionEnum.OPEN_CIRCUIT
        },
        {
          location: leftPoint.toVector3(),
          connectionType: CircuitConnectionEnum.BATTERY_CONNECTED
        },
        {
          location: rightPoint.toVector3(),
          connectionType: CircuitConnectionEnum.LIGHT_BULB_CONNECTED
        }
      ];

      return new CircuitSwitch( hingePoint, connections, modelViewTransform, circuitConnectionProperty );
    }
  } );
} );