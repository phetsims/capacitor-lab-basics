// Copyright 2015-2022, University of Colorado Boulder

/**
 * The circuit switch has a hinge point and an end point that can switch to new
 * connection points.  It is assumed that the circuit switch is connected to
 * a capacitor in this simulation.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Range from '../../../../dot/js/Range.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import Vector3 from '../../../../dot/js/Vector3.js';
import { Shape } from '../../../../kite/js/imports.js';
import CapacitorConstants from '../../../../scenery-phet/js/capacitor/CapacitorConstants.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';
import CLBConstants from '../CLBConstants.js';
import CircuitPosition from './CircuitPosition.js';
import CircuitState from './CircuitState.js';
import Connection from './Connection.js';
import Wire from './wire/Wire.js';
import WireSegment from './wire/WireSegment.js';

// constants
const SWITCH_ANGLE = Math.PI / 4; // angle from the vertical of each connection point

class CircuitSwitch {
  /**
   * @param {string} positionLabel - 'top' or 'bottom'
   * @param {CircuitConfig} config
   * @param {Property.<CircuitState>} circuitConnectionProperty
   * @param {Tandem} tandem
   */
  constructor( positionLabel, config, circuitConnectionProperty, tandem ) {

    // Validate positionLabel string
    assert && assert( positionLabel === 'top' || positionLabel === 'bottom',
      `Unsupported positionLabel: ${positionLabel}` );

    // @public {Vector3}
    this.hingePoint = this.getSwitchHingePoint( positionLabel, config );

    // @private {YawPitchModelViewTransform3}
    this.modelViewTransform = config.modelViewTransform;

    // @public {Property.<CircuitState>}
    this.circuitConnectionProperty = circuitConnectionProperty;

    // @private {Array.<Connection>}
    this.connections = this.getSwitchConnections( positionLabel, this.hingePoint.toVector2(), config.circuitConnections );

    // @public {Property.<number>} - Angle of the switch
    this.angleProperty = new NumberProperty( positionLabel === 'top' ? -Math.PI * 3 / 4 : Math.PI * 3 / 4, {
      tandem: tandem.createTandem( 'angleProperty' ),
      units: 'radians',
      range: config.lightBulb ? new Range(
        positionLabel === 'top' ? -Math.PI * 3 / 4 : Math.PI / 4,
        positionLabel === 'top' ? -Math.PI / 4 : Math.PI * 3 / 4
      ) : new Range(
        positionLabel === 'top' ? -Math.PI * 3 / 4 : Math.PI / 2,
        positionLabel === 'top' ? -Math.PI / 2 : Math.PI * 3 / 4
      )
    } );

    // Assign string identifying connection point
    const connectionName = ( positionLabel === 'top' ) ?
                           CircuitPosition.CIRCUIT_SWITCH_TOP :
                           CircuitPosition.CIRCUIT_SWITCH_BOTTOM;

    // @public {WireSegment} Add the switch wire that spans two connection points. Default connection is to the battery.
    this.switchSegment = new WireSegment(
      this.hingePoint,
      this.getConnection( circuitConnectionProperty.value ).position
    );
    this.switchSegment.hingePoint = this.hingePoint;

    // @public {Wire} - Wire between the hinge point and end point
    this.switchWire = new Wire( config.modelViewTransform, [ this.switchSegment ], connectionName );

    this.angleProperty.link( angle => {
      const hingePoint = this.switchSegment.hingePoint;

      // Shorten the switch wire (requested in #140)
      this.switchSegment.endPointProperty.value = hingePoint.plus( Vector2.createPolar( 0.9 * CLBConstants.SWITCH_WIRE_LENGTH, angle ).toVector3() );
    } );

    // set active connection whenever circuit connection type changes.
    circuitConnectionProperty.link( circuitConnection => {

      // If the switch is being dragged, it is in transit and there is no active connection.
      if ( circuitConnection === CircuitState.SWITCH_IN_TRANSIT ) {
        return;
      }

      const wireDelta = this.getConnection( circuitConnection ).position.minus( this.switchSegment.hingePoint );
      this.angleProperty.value = wireDelta.toVector2().angle;
    } );
  }


  /**
   * Get (x,y,z) position of switch pivot point
   * @private
   *
   * @param {string} positionLabel - 'top' or 'bottom'
   * @param {CircuitConfig} config - Class containing circuit geometry and properties
   *
   * @returns {Vector3}
   */
  getSwitchHingePoint( positionLabel, config ) {

    // Validate positionLabel string
    assert && assert( positionLabel === 'top' || positionLabel === 'bottom',
      `Unsupported positionLabel: ${positionLabel}` );

    // create the circuit switches that connect the capacitor to the circuit
    const x = CLBConstants.BATTERY_POSITION.x + config.capacitorXSpacing;
    const z = CLBConstants.BATTERY_POSITION.z;

    const yOffset = CapacitorConstants.PLATE_SEPARATION_RANGE.max + CLBConstants.SWITCH_Y_SPACING;
    let y = CLBConstants.BATTERY_POSITION.y;

    if ( positionLabel === 'top' ) {
      y -= yOffset;
    }
    else if ( positionLabel === 'bottom' ) {
      y += yOffset;
    }

    return new Vector3( x, y, z );
  }

  /**
   * Get an array of objects containing positions (as Vector3) and connection types (as strings)
   * of the switch connection points
   * @private
   *
   * @param  {string} positionLabel - 'top' or 'bottom'
   * @param  {Vector2} hingeXY - Position of switch hinge
   * @param  {Array.<CircuitState>} circuitStates
   * @returns {Array.<Connection>}
   */
  getSwitchConnections( positionLabel, hingeXY, circuitStates ) {
    // Projection of switch wire vector to its components (angle is from a vertical wire)
    const length = CLBConstants.SWITCH_WIRE_LENGTH;
    const dx = length * Math.sin( SWITCH_ANGLE );
    const dy = length * Math.cos( SWITCH_ANGLE );

    // Top point of hinge from pivot point
    const topOffset = new Vector2( 0, length );

    // Compute 2D switch contact points

    let topPoint;
    let leftPoint;
    let rightPoint;

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

    const connections = [];
    circuitStates.forEach( circuitState => {
      if ( circuitState === CircuitState.OPEN_CIRCUIT ) {
        connections.push( new Connection( topPoint.toVector3(), circuitState ) );
      }
      else if ( circuitState === CircuitState.BATTERY_CONNECTED ) {
        connections.push( new Connection( leftPoint.toVector3(), circuitState ) );
      }
      else if ( circuitState === CircuitState.LIGHT_BULB_CONNECTED ) {
        connections.push( new Connection( rightPoint.toVector3(), circuitState ) );
      }
      else {
        assert && assert( false, 'attempting to create switch conection which is not supported' );
      }
    } );

    return connections;
  }

  /**
   * Get the desired connection from the connection type.
   * @public
   *
   * @param {CircuitState} connectionType
   * @returns {Connection}
   */
  getConnection( connectionType ) {

    const returnConnection = _.find( this.connections, connection => connection.type === connectionType );

    assert && assert( returnConnection, `No connection type for this circuit named ${connectionType}` );

    return returnConnection;
  }

  /**
   * Convenience method for getting the connection positions. Similar to getConnection above, but directly returns
   * the position.
   * @public
   *
   * @param {CircuitState} connectionType - BATTERY_CONNECTED || OPEN_CIRCUIT || LIGHT_BULB_CONNECTED
   * @returns {Vector3}
   */
  getConnectionPoint( connectionType ) {
    assert && assert( connectionType !== CircuitState.SWITCH_IN_TRANSIT,
      'Cannot call getConnectionPoint while SWITCH_IN_TRANSIT' );

    return this.getConnection( connectionType ).position;
  }

  /**
   * Get the position of the endpoint for the circuit switch segment.
   * @public
   *
   * @returns {Vector3}
   */
  getSwitchEndPoint() {

    const endPoint = this.switchSegment.endPointProperty.value;

    assert && assert( endPoint instanceof Vector3 );

    return endPoint;
  }

  /**
   * Get the limiting angle of the circuit switch to the right.
   * The limiting angle is dependent on wheter a light bulb is connected to the circuit.
   * @public
   *
   * @returns {number}
   */
  getRightLimitAngle() {

    // Get the right-most connection.
    // Would prefer to use _.maxBy, but not available in lodash 2.4.1
    const rightMost = _.last( _.sortBy( this.connections, [ connection => connection.position.x ] ) );

    return rightMost.position.minus( this.hingePoint ).toVector2().angle;
  }

  /**
   * Get the limiting angle of the circuit switch to the left.
   * @public
   *
   * @returns {number}
   */
  getLeftLimitAngle() {

    // Get the left-most connection.
    // Would prefer to use _.minBy, but not available in lodash 2.4.1
    const leftMost = _.first( _.sortBy( this.connections, [ connection => connection.position.x ] ) );

    return leftMost.position.minus( this.hingePoint ).toVector2().angle;
  }

  /**
   * Returns whether or not the probe is connected
   * @param {Shape}probe
   * @public
   *
   * @returns {boolean}
   */
  contacts( probe ) {
    const connection = this.circuitConnectionProperty.value;

    // No connection point if it isn't connected
    if ( connection === CircuitState.SWITCH_IN_TRANSIT || connection === CircuitState.OPEN_CIRCUIT ) {
      return false;
    }

    const endPoint = this.switchSegment.endPointProperty.value;
    const hingePoint = this.switchSegment.hingePoint;
    const delta = endPoint.minus( hingePoint ).setMagnitude( CLBConstants.SWITCH_WIRE_LENGTH );
    const point = this.modelViewTransform.modelToViewPosition( hingePoint.plus( delta ) );
    const circle = Shape.circle( point.x, point.y, CLBConstants.CONNECTION_POINT_RADIUS );

    return probe.bounds.intersectsBounds( circle.bounds ) &&
           probe.shapeIntersection( circle ).getNonoverlappingArea() > 0;
  }


  /**
   * Factory method for a top CircuitSwitch
   * @public
   *
   * @param {CircuitConfig} config
   * @param {Property.<CircuitState>} circuitConnectionProperty
   * @param {Tandem} tandem
   * @returns {CircuitSwitch}
   */
  static TOP( config, circuitConnectionProperty, tandem ) {
    return new CircuitSwitch( 'top', config, circuitConnectionProperty, tandem );
  }

  /**
   * Factory method for a bottom CircuitSwitch
   * @public
   *
   * @param {CircuitConfig} config
   * @param {Property.<CircuitState>} circuitConnectionProperty
   * @param {Tandem} tandem
   * @returns {CircuitSwitch}
   */
  static BOTTOM( config, circuitConnectionProperty, tandem ) {
    return new CircuitSwitch( 'bottom', config, circuitConnectionProperty, tandem );
  }
}

capacitorLabBasics.register( 'CircuitSwitch', CircuitSwitch );

export default CircuitSwitch;
