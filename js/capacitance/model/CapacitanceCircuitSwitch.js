// Copyright 2002-2015, University of Colorado Boulder

/**
 * Circuit switch for the Capacitance model.  This circuit switch has only two connection points which correspond to
 * the battery connection and the open switch connection.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var CircuitSwitch = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitSwitch' );

  // constants
  var SWITCH_ANGLE = Math.PI / 4;

  /**
   * Constructor for a CircuitSwitch.
   *
   * @param {Vector3} hingePoint
   * @param {Object} connections
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {Property} circuitConnectionProperty
   * @constructor
   */
  function CapacitanceCircuitSwitch( hingePoint, connections, modelViewTransform, circuitConnectionProperty ) {
    CircuitSwitch.call( this, hingePoint, connections, modelViewTransform, circuitConnectionProperty );
  }

  return inherit( CircuitSwitch, CapacitanceCircuitSwitch, {

    /**
     * Right limit angle for the CapacitanceCircuitSwitch.  Overrides limit function in CircuitSwitch.  Capacitance
     * circuit switch is limited to the OPEN_CIRCUIT connection point.
     *
     * @returns {number}
     */
    getRightLimitAngle: function() {
      return this.getConnectionPoint( CircuitConnectionEnum.OPEN_CIRCUIT ).minus( this.hingePoint.toVector2() ).angle();
    }
  }, {

    CapacitanceCircuitTopSwitch: function( hingePoint, modelViewTransform, circuitConnectionProperty ) {

      var topPoint = hingePoint.toVector2().minusXY( 0, CLConstants.SWITCH_WIRE_LENGTH );
      var leftPoint = hingePoint.toVector2().minusXY(
        CLConstants.SWITCH_WIRE_LENGTH * Math.sin( SWITCH_ANGLE ),
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
        }
      ];

      return new CapacitanceCircuitSwitch( hingePoint, connections, modelViewTransform, circuitConnectionProperty );
    },

    CapacitanceCircuitBottomSwitch: function( hingePoint, modelViewTransform, circuitConnectionProperty ) {

      var topPoint = hingePoint.toVector2().plusXY( 0, CLConstants.SWITCH_WIRE_LENGTH );
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
        }
      ];

      return new CapacitanceCircuitSwitch( hingePoint, connections, modelViewTransform, circuitConnectionProperty );
    }
  } );
} );