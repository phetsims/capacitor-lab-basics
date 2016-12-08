// Copyright 2016, University of Colorado Boulder

/**
 * A straight segment of wire. One or more segments are joined to create a Wire.  Contains factory functions to
 * construct wire segments for each of the circuit components, since segments will need unique functions to update
 * their geometry depending on the components they connect.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Vector3 = require( 'DOT/Vector3' );

  // phet-io modules
  var TVector3 = require( 'ifphetio!PHET_IO/types/dot/TVector3' );

  /**
   * @param {Vector3} startPoint
   * @param {Vector3} endPoint
   * @param {Tandem} tandem
   * @constructor
   */

  function WireSegment( startPoint, endPoint, tandem ) {

    assert && assert( startPoint instanceof Vector3 );
    assert && assert( endPoint instanceof Vector3 );

    // @public
    this.startPointProperty = new Property( startPoint, {
      tandem: tandem.createTandem( 'startPointProperty' ),
      phetioValueType: TVector3
    } );

    // @public
    this.endPointProperty = new Property( endPoint, {
      tandem: tandem.createTandem( 'endPointProperty' ),
      phetioValueType: TVector3
    } );
  }

  capacitorLabBasics.register( 'WireSegment', WireSegment );

  inherit( Object, WireSegment, {}, {

    // Factory methods for specific wire segments

    /**
     * Factory for a ComponentWireSegment that attaches to the top of a circuit component
     * REVIEW: visibility doc
     *
     * @param {Capacitor|LightBulb} component
     * @param {Vector2} endPoint REVIEW: Pretty sure it's Vector3
     * @param {Tandem} tandem - end point for the wire segment
     * REVIEW: returns?
     */
    createComponentTopWireSegment: function( component, endPoint, tandem ) {
      return new ComponentTopWireSegment( component, endPoint, tandem );
    },

    /**
     * Factory for a ComponentWireSegment that attaches to the bottom of a circuit component
     * REVIEW: visibility doc
     *
     * @param {Capacitor|LightBulb} component
     * @param {Vector2} endPoint - end point for the wire segment REVIEW: Pretty sure it's Vector3
     * @param {Tandem} tandem
     * REVIEW: returns?
     */
    createComponentBottomWireSegment: function( component, endPoint, tandem ) {
      return new ComponentBottomWireSegment( component, endPoint, tandem );
    },

    /**
     * Factory for a SwitchSegment that acts as a switch between two connection points
     * REVIEW: visibility doc
     *
     * REVIEW: Seems cleaner to have CircuitSwitch have a createWireSegment() function, recommend to move to there
     *
     * @param {Vector2} startPoint - start point for the switch segment REVIEW: Pretty sure it's Vector3
     * @param {Object} activeConnection
     * @param {Tandem} tandem
     * REVIEW: returns?
     */
    createSwitchSegment: function( startPoint, activeConnection, tandem ) {
      return new SwitchSegment( startPoint, activeConnection, tandem );
    },

    //REVIEW: doc
    //REVIEW: Find where this is called? I can't find any usages.
    reset: function() {
      this.startPointProperty.reset();
      this.endPointProperty.reset();
    }

  } );

  /**
   * Constructor for ComponentTopWireSegment.  This is a wire segment whose start point is connected to the top
   * connection point of a component.  Adjusts the wire geometry when the component changes geometry or orientation.
   * REVIEW: visibility doc
   *
   * @param {Capacitor|LightBulb} component
   * @param {Vector2} endPoint REVIEW: Pretty sure it's Vector3
   * @param {Tandem} tandem
   */
  function ComponentTopWireSegment( component, endPoint, tandem ) {
    WireSegment.call( this, component.getTopConnectionPoint(), endPoint, tandem );
    //REVIEW: visibility doc
    this.component = component;
  }

  capacitorLabBasics.register( 'ComponentTopWireSegment', ComponentTopWireSegment );

  inherit( WireSegment, ComponentTopWireSegment, {
    // update the start point of the segment, called when the component geometry changes
    //REVIEW: JSDoc
    update: function() {
      this.startPointProperty.set( this.component.getTopConnectionPoint() );
    }
  } );

  /**
   * Constructor for ComponentBottomWireSegment.  Wire segment whose start point is connected to the bottom connection
   * point of a component.  Adjusts the start point when the component geometry changes.
   *
   * @param {Capacitor|LightBulb} component
   * @param {Vector2} endPoint REVIEW: Nope, probably Vector3
   * @param {Tandem} tandem
   */
  function ComponentBottomWireSegment( component, endPoint, tandem ) {
    WireSegment.call( this, component.getBottomConnectionPoint(), endPoint, tandem );
    //REVIEW: visibility doc
    this.component = component;
  }

  capacitorLabBasics.register( 'ComponentBottomWireSegment', ComponentBottomWireSegment );

  inherit( WireSegment, ComponentBottomWireSegment, {
    // update the start point of the segment, called when the component geometry changes
    //REVIEW: JSDoc
    update: function() {
      this.startPointProperty.set( this.component.getBottomConnectionPoint() );
    }
  } );

  /**
   * Constructor for a switch segment.  End point of the switch segment will change depending on the connection
   * state of the circuit.
   *
   * REVIEW: Seems cleaner to have CircuitSwitch have a createWireSegment() function, recommend to move to there
   *
   * @param {Vector3} hingePoint
   * @param {Object} activeConnection REVIEW: doc this, or at least refer to CircuitSwitch where it's used
   * @param {Tandem} tandem
   * @constructor
   */
  function SwitchSegment( hingePoint, activeConnection, tandem ) {
    //REVIEW: visibility docs
    this.activeConnection = activeConnection;
    this.hingePoint = hingePoint;
    WireSegment.call( this, hingePoint, activeConnection.location, tandem );
  }

  capacitorLabBasics.register( 'SwitchSegment', SwitchSegment );

  inherit( WireSegment, SwitchSegment, {

    /**
     * Update the endpoint for the switch segment, called when the connection point of the circuit changes
     * @param  {CircuitConnection} activeConnection
     * @param  {number} angle
     * @public
     */
    update: function( activeConnection, angle ) {
      //REVIEW: Check usages, at least one didn't have the angle parameter. Can it be removed?
      // set the new active connection point
      this.endPoint = activeConnection.location;
    }
  } );

  return WireSegment;
} );
