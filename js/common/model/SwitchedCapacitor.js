// Copyright 2016, University of Colorado Boulder

/**
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var Capacitor = require( 'CAPACITOR_LAB_BASICS/common/model/Capacitor' );
  var Vector3 = require( 'DOT/Vector3' );
  var CircuitSwitch = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitSwitch' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );

  // constants
  var SWITCH_ANGLE = Math.PI / 4; // angle from the vertical of each connection point

  /**
   * @param {CircuitConfig} config
   * @param {Property.<string>} circuitConnectionProperty
   * @param {Tandem} tandem
   */
  function SwitchedCapacitor( config, circuitConnectionProperty, tandem ) {

    var location = new Vector3(
      config.batteryLocation.x + config.capacitorXSpacing,
      config.batteryLocation.y + config.capacitorYSpacing,
      config.batteryLocation.z );

    // TODO: Remove options from Capacitor constructor and just use config
    var options = {
      plateWidth: config.plateWidth,
      plateSeparation: config.plateSeparation,
      dielectricMaterial: config.dielectricMaterial,
      dielectricOffset: config.dielectricOffset
    };
    Capacitor.call( this, location, config.modelViewTransform, tandem, options );

    this.config = config;

    // create the circuit switches that connect the capacitor to the circuit
    var x = config.batteryLocation.x + config.capacitorXSpacing;
    var topY = config.batteryLocation.y - CLBConstants.PLATE_SEPARATION_RANGE.max - CLBConstants.SWITCH_Y_SPACING;
    var bottomY = config.batteryLocation.y + CLBConstants.PLATE_SEPARATION_RANGE.max + CLBConstants.SWITCH_Y_SPACING;
    var z = config.batteryLocation.z;

    var topStartPoint = new Vector3( x, topY, z );
    var bottomStartPoint = new Vector3( x, bottomY, z );

    var topConnections = this.getTopConnections( topStartPoint );
    var bottomConnections = this.getBottomConnections( bottomStartPoint );

    this.topCircuitSwitch = new CircuitSwitch( topStartPoint, topConnections, config.modelViewTransform,
      circuitConnectionProperty, CLBConstants.WIRE_CONNECTIONS.CIRCUIT_SWITCH_TOP,
      tandem ? tandem.createTandem( 'topCircuitSwitch' ) : null );
    this.bottomCircuitSwitch = new CircuitSwitch( bottomStartPoint, bottomConnections, config.modelViewTransform,
      circuitConnectionProperty, CLBConstants.WIRE_CONNECTIONS.CIRCUIT_SWITCH_BOTTOM,
      tandem ? tandem.createTandem( 'bottomCircuitSwitch' ) : null );
  }

  capacitorLabBasics.register( 'SwitchedCapacitor', SwitchedCapacitor );

  return inherit( Capacitor, SwitchedCapacitor, {

    // calculate the locations of the connection points for this circuit
    getTopConnections: function( hingePoint ) {
      var topPoint = hingePoint.toVector2().minusXY( 0, CLBConstants.SWITCH_WIRE_LENGTH );
      var leftPoint = hingePoint.toVector2().minusXY(
        CLBConstants.SWITCH_WIRE_LENGTH * Math.sin( SWITCH_ANGLE ),
        CLBConstants.SWITCH_WIRE_LENGTH * Math.cos( SWITCH_ANGLE )
      );
      var rightPoint = hingePoint.toVector2().minusXY( -CLBConstants.SWITCH_WIRE_LENGTH * Math.sin( SWITCH_ANGLE ),
        CLBConstants.SWITCH_WIRE_LENGTH * Math.cos( SWITCH_ANGLE )
      );

      var connections = this.getConnectionLocationsAndTypes( this.config.circuitConnections,
        topPoint, leftPoint, rightPoint );
      return connections;
    },

    // determine the locations of each connection point
    getBottomConnections: function( hingePoint ) {
      var topPoint = hingePoint.toVector2().plusXY( 0, CLBConstants.SWITCH_WIRE_LENGTH );
      var rightPoint = hingePoint.toVector2().plusXY(
        CLBConstants.SWITCH_WIRE_LENGTH * Math.sin( SWITCH_ANGLE ),
        CLBConstants.SWITCH_WIRE_LENGTH * Math.cos( SWITCH_ANGLE )
      );
      var leftPoint = hingePoint.toVector2().plusXY( -CLBConstants.SWITCH_WIRE_LENGTH * Math.sin( SWITCH_ANGLE ),
        CLBConstants.SWITCH_WIRE_LENGTH * Math.cos( SWITCH_ANGLE )
      );

      var connections = this.getConnectionLocationsAndTypes( this.config.circuitConnections,
        topPoint, leftPoint, rightPoint );
      return connections;
    },

    /**
     * Return array of objects containing location (Vector3) and type (CircuitConnectionEnum value)
     * for each connection in circuitSwitchConnections.
     *
     * @param {Array<Object>} connections - array of { location: Vector3, connectionType: string }
     * @param  {Vector2} topPoint
     * @param  {Vector2} leftPoint
     * @param  {Vector2} rightPoint
     *
     * @return {Array<Object>} - array of { location: Vector3, connectionType: string }
     */
    getConnectionLocationsAndTypes: function( circuitSwitchConnections, topPoint, leftPoint, rightPoint ) {

      // collect location and connection type for each of the possible circuit switch connections
      var connections = [];
      circuitSwitchConnections.forEach( function( circuitSwitchConnection ) {
        if ( circuitSwitchConnection === CircuitConnectionEnum.OPEN_CIRCUIT ) {
          connections.push( {
            location: topPoint.toVector3(),
            connectionType: circuitSwitchConnection
          } );
        } else if ( circuitSwitchConnection === CircuitConnectionEnum.BATTERY_CONNECTED ) {
          connections.push( {
            location: leftPoint.toVector3(),
            connectionType: circuitSwitchConnection
          } );
        } else if ( circuitSwitchConnection === CircuitConnectionEnum.LIGHT_BULB_CONNECTED ) {
          connections.push( {
            location: rightPoint.toVector3(),
            connectionType: circuitSwitchConnection
          } );
        } else {
          assert && assert( 'attempting to create switch conection which is not supported' );
        }
      } );
      return connections;
    }

  } );
} );

