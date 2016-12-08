// Copyright 2016, University of Colorado Boulder

/**
 * The circuit switch has a hinge point and an end point that can switch to new
 * connection points.  It is assumed that the circuit switch is connected to
 * a capacitor in this simulation.
 *
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var CLBQueryParameters = require( 'CAPACITOR_LAB_BASICS/common/CLBQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Vector2 = require( 'DOT/Vector2' );
  var Vector3 = require( 'DOT/Vector3' );
  var Wire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/Wire' );
  var WireSegment = require( 'CAPACITOR_LAB_BASICS/common/model/wire/WireSegment' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );

  // constants
  var SWITCH_ANGLE = Math.PI / 4; // angle from the vertical of each connection point

  /**
   * Constructor for a CircuitSwitch.
   *
   * @param {string} positionLabel - 'top' or 'bottom'
   * @param {CircuitConfig} config
   * @param {Property.<CircuitConnectionEnum>} circuitConnectionProperty
   * @param {Tandem} tandem
   */
  function CircuitSwitch( positionLabel, config, circuitConnectionProperty, tandem ) {

    // Validate positionLabel string
    assert && assert( positionLabel === 'top' || positionLabel === 'bottom',
      'Unsupported positionLabel: ' + positionLabel );

    // Removes the 'open circuit' option when a capacitor and light bulb exist
    // @private
    this.twoStateSwitch = CLBQueryParameters.switch === 'twoState' ? true : false;

    // {Vector3}
    // @public
    this.hingePoint = this.getSwitchHingePoint( positionLabel, config );
    this.circuitConnectionProperty = circuitConnectionProperty;

    // @private
    //REVIEW: initialAngle doesn't need to be a property, since it's inlined in the Property declaration below
    this.initialAngle = 0; // with respect to the vertical ( open switch )
    this.connections = this.getSwitchConnections( positionLabel, this.hingePoint.toVector2(), config.circuitConnections );
    //REVIEW: activeConnection doesn't need to be a property, since no methods use it
    //REVIEW: The only 'read' to activeConnection is when creating the WireSegment. When updated later, it is never used.
    //REVIEW: Recommend just inlining this in WireSegment construction, and using local vars elsewhere.
    this.activeConnection = this.getConnection( circuitConnectionProperty.value );
    var self = this;

    //REVIEW: Use NumberProperty instead
    // @public
    this.angleProperty = new Property( this.initialAngle, {
      tandem: tandem.createTandem( 'angleProperty' ),
      phetioValueType: TNumber( {
        units: 'radians'
      } )
    } );

    // Assign string identifying connection point
    var connectionName = ( positionLabel === 'top' ) ?
      CLBConstants.WIRE_CONNECTIONS.CIRCUIT_SWITCH_TOP :
      CLBConstants.WIRE_CONNECTIONS.CIRCUIT_SWITCH_BOTTOM;

    // Add the switch wire that spans two connection points. Default connection is to the battery.
    this.switchSegment = WireSegment.createSwitchSegment( this.hingePoint,
      this.getConnection( circuitConnectionProperty.value ),
      tandem.createTandem( 'switchSegment' ) );

    // Wire between the hinge point and end point
    // @public
    this.switchWire = new Wire( config.modelViewTransform, [ this.switchSegment ], connectionName );

    // set active connection whenever circuit connection type changes.
    circuitConnectionProperty.link( function( circuitConnection ) {

      // If the switch is being dragged, it is in transit and there is no active connection.
      if ( circuitConnection === CircuitConnectionEnum.IN_TRANSIT ) {
        return;
      }

      self.switchSegment.endPointProperty.set( self.getConnection( circuitConnection ).location );

      // Shorten the switch wire (requested in #140)
      var endPoint = self.switchSegment.endPointProperty.get();
      var hingePoint = self.switchSegment.hingePoint;
      var delta = endPoint.minus( hingePoint );
      delta.setMagnitude( 0.9 * CLBConstants.SWITCH_WIRE_LENGTH );
      self.switchSegment.endPointProperty.set( hingePoint.plus( delta ) );
    } );

  }

  capacitorLabBasics.register( 'CircuitSwitch', CircuitSwitch );

  return inherit( Object, CircuitSwitch, {

    //REVIEW: doc
    //REVIEW: This function is never called, and should be removed (dead code), unless we really SHOULD be resetting.
    //REVIEW: Probably never get rid of a switch, so OK to remove?
    reset: function() {
      this.angleProperty.reset();
    },

    /**
     * Get (x,y,z) position of switch pivot point
     * @private
     *
     * @param {string} positionLabel - 'top' or 'bottom'
     * @param {CircuitConfig} config - Class containing circuit geometry and properties
     *
     * @returns {Vector3}
     */
    getSwitchHingePoint: function( positionLabel, config ) {

      // Validate positionLabel string
      assert && assert( positionLabel === 'top' || positionLabel === 'bottom',
        'Unsupported positionLabel: ' + positionLabel );

      // create the circuit switches that connect the capacitor to the circuit
      var x = CLBConstants.BATTERY_LOCATION.x + config.capacitorXSpacing;
      var z = CLBConstants.BATTERY_LOCATION.z;

      var yOffset = CLBConstants.PLATE_SEPARATION_RANGE.max + CLBConstants.SWITCH_Y_SPACING;
      var y = CLBConstants.BATTERY_LOCATION.y;

      if ( positionLabel === 'top' ) {
        y -= yOffset;
      }
      else if ( positionLabel === 'bottom' ) {
        y += yOffset;
      }

      return new Vector3( x, y, z );
    },

    /**
     * Get an array of objects containing locations (as Vector3) and connection types (as strings)
     * of the switch connection points
     * @private
     *
     * @param  {string} positionLabel - 'top' or 'bottom'
     * @param  {Vector2} hingeXY - Location of switch hinge
     * @param  {CircuitConfig} config - Class containing circuit geometry and properties
     *
     * @returns {Object[]} - Array of Objects containing connection points and types REVIEW: document the fields of this object, like in getConnection()
     */
    getSwitchConnections: function( positionLabel, hingeXY, circuitConnections ) {
      /* REVIEW: Simplification and avoid branches, should be able to replace this entire function:
      // at constants
      var SWITCH_ANGLE = Math.PI / 4; // angle from the vertical of each connection point
      var CONNECTION_ANGLE_MAP = {}; // maps {CircuitConnectionEnum} => additional angle offset for connection type {number}
      CONNECTION_ANGLE_MAP[ CircuitConnectionEnum.OPEN_CIRCUIT ] = 0;
      CONNECTION_ANGLE_MAP[ CircuitConnectionEnum.BATTERY_CONNECTED ] = SWITCH_ANGLE;
      CONNECTION_ANGLE_MAP[ CircuitConnectionEnum.LIGHT_BULB_CONNECTED ] = -SWITCH_ANGLE;
      // ...
      var topSign = ( position === CircuitSwitch.TOP ) ? -1 : 1;
      return circuitConnections.filter( function( circuitSwitchConnection ) {
        return circuitSwitchConnection !== CircuitConnectionEnum.IN_TRANSIT;
      } ).map( function( circuitSwitchConnection ) {
        var angle = topSign * ( Math.PI + CONNECTION_ANGLE_MAP[ circuitSwitchConnection ] );
        return {
          location: hingeXY.plus( Vector2.createPolar( CLBConstants.SWITCH_WIRE_LENGTH, angle ) ).toVector3(),
          connectionType: circuitSwitchConnection
        };
      } );
      */

      // Projection of switch wire vector to its components (angle is from a vertical wire)
      var length = CLBConstants.SWITCH_WIRE_LENGTH;
      var dx = length * Math.sin( SWITCH_ANGLE );
      var dy = length * Math.cos( SWITCH_ANGLE );

      // Top point of hinge from pivot point
      var topOffset = new Vector2( 0, length );

      // Compute 2D switch contact points

      var topPoint;
      var leftPoint;
      var rightPoint;

      if ( positionLabel === 'top' ) {
        topPoint = hingeXY.minus( topOffset );
        leftPoint = hingeXY.minusXY( dx, dy );
        rightPoint = hingeXY.minusXY( -dx, dy );
      }
      else {
        topPoint = hingeXY.plus( topOffset );
        leftPoint = hingeXY.plusXY( -dx, dy );
        rightPoint = hingeXY.plusXY( dx, dy );
      }

      var connections = [];
      circuitConnections.forEach( function( circuitSwitchConnection ) {
        if ( circuitSwitchConnection === CircuitConnectionEnum.OPEN_CIRCUIT ) {
          connections.push( {
            location: topPoint.toVector3(),
            connectionType: circuitSwitchConnection
          } );
        }
        else if ( circuitSwitchConnection === CircuitConnectionEnum.BATTERY_CONNECTED ) {
          connections.push( {
            location: leftPoint.toVector3(),
            connectionType: circuitSwitchConnection
          } );
        }
        else if ( circuitSwitchConnection === CircuitConnectionEnum.LIGHT_BULB_CONNECTED ) {
          connections.push( {
            location: rightPoint.toVector3(),
            connectionType: circuitSwitchConnection
          } );
        }
        else {
          assert && assert( false, 'attempting to create switch conection which is not supported' );
        }
      } );

      return connections;
    },

    /**
     * Get the desired connection from the connection type.
     * @public
     *
     * @param connectionType
     * @returns {Object} returnConnection - object of the format { location: Vector3, connectionType: string } REVIEW: CircuitConnectionEnum, not string
     */
    getConnection: function( connectionType ) {

      var returnConnection = _.find( this.connections, function( connection ) {
        return connection.connectionType === connectionType;
      } );

      assert && assert( returnConnection, 'No connection type for this circuit named ' + connectionType );

      return returnConnection;
    },

    /**
     * Convenience method for getting the connection locations. Similar to getConnection above, but directly returns
     * the location.
     * REVIEW: visibility doc
     *
     * REVIEW: Type should note CircuitConnectionEnum, and presumably assert that it can't be IN_TRANSIT
     * @param {string} connectionType - BATTERY_CONNECTED || OPEN_CIRCUIT || LIGHT_BULB_CONNECTED
     */
    getConnectionPoint: function( connectionType ) {
      return this.getConnection( connectionType ).location;
    },

    /**
     * Get the location of the endpoint for the circuit switch segment.
     * REVIEW: visibility doc
     *
     * @returns {Vector2} [description] REVIEW: wrong type doc, Vector3 as asserted below?
     */
    getSwitchEndPoint: function() {

      var endPoint = this.switchSegment.endPointProperty.value;

      assert && assert( endPoint instanceof Vector3 );

      return endPoint;
    },

    /**
     * Get the connection point that will be nearest the connecting capacitor.
     * REVIEW: visibility doc
     *
     * REVIEW: hingePoint is public, just have the client use that?
     *
     * @returns {Vector2} REVIEW: wrong type doc? See below
     */
    getCapacitorConnectionPoint: function() {
      if ( assert ) {
        if ( this.hingePoint.constructor.name !== 'Vector2' ) {
          console.log( 'REVIEW (CircuitSwitch.getCapacitorConnectionPoint): Probably not a Vector2: ' + this.hingePoint.constructor.name );
        }
      }
      return this.hingePoint;
    },

    /**
     * Get the limiting angle of the circuit switch to the right.
     * The limiting angle is dependent on wheter a light bulb is connected to the circuit.
     * REVIEW: visibility doc
     *
     * @returns {number}
     */
    getRightLimitAngle: function() {
      /* REVIEW: simpler implementation?
      return _.maxBy( this.connections, function( connection ) {
        return connection.location.x;
      } ).location.minus( this.hingePoint ).toVector2().angle();
      */

      var self = this;

      var c = self.twoStateSwitch ? CircuitConnectionEnum.LIGHT_BULB_CONNECTED : CircuitConnectionEnum.OPEN_CIRCUIT;
      var rightConnectionPoint = self.getConnectionPoint( c );

      this.connections.forEach( function( connection ) {
        if ( connection.connectionType === 'LIGHT_BULB_CONNECTED' ) {
          rightConnectionPoint = self.getConnectionPoint( CircuitConnectionEnum.LIGHT_BULB_CONNECTED );
        }
      } );

      return rightConnectionPoint.minus( self.hingePoint ).toVector2().angle();
    },

    /**
     * Get the limiting angle of the circuit switch to the left.
     * REVIEW: visibility doc
     *
     * @returns {[type]} [description] REVIEW: probably {number}
     */
    getLeftLimitAngle: function() {
      /* REVIEW: more general implementation?
      return _.minBy( this.connections, function( connection ) {
        return connection.location.x;
      } ).location.minus( this.hingePoint ).toVector2().angle();
      */
      var a = this.getConnectionPoint( CircuitConnectionEnum.BATTERY_CONNECTED );
      var b = this.hingePoint;

      assert && assert( a instanceof Vector3 && b instanceof Vector3,
        'One of these is not a Vector3:\n' + a + '\n' + b );

      return a.minus( b ).toVector2().angle();
    }
  }, {

    /**
     * Factory method for a top CircuitSwitch
     * @public
     *
     * @param {CircuitConfig} config
     * @param {Property.<CircuitConnectionEnum>} circuitConnectionProperty
     * @param {Tandem} tandem
     * @returns {CircuitSwitch}
     */
    TOP: function( config, circuitConnectionProperty, tandem ) {
      return new CircuitSwitch( 'top', config, circuitConnectionProperty, tandem );
    },

    /**
     * Factory method for a bottom CircuitSwitch
     * @public
     *
     * @param {CircuitConfig} config
     * @param {Property.<CircuitConnectionEnum>} circuitConnectionProperty
     * @param {Tandem} tandem
     * @returns {CircuitSwitch}
     */
    BOTTOM: function( config, circuitConnectionProperty, tandem ) {
      return new CircuitSwitch( 'bottom', config, circuitConnectionProperty, tandem );
    }
  } );
} );
