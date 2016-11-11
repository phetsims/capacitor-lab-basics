// Copyright 2015, University of Colorado Boulder

/**
 * A straight segment of wire. One or more segments are joined to create a Wire.  Contains factory functions to
 * construct wire segments for each of the circuit components, since segments will need unique functions to update
 * their geometry depending on the components they connect.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  // var Vector2 = require( 'DOT/Vector2' );
  // var Vector3 = require( 'DOT/Vector3' );

  // phet-io modules
  var TVector2 = require( 'ifphetio!PHET_IO/types/dot/TVector2' );

  /**
   * @param {Vector2} startPoint
   * @param {Vector2|Vector3} endPoint TODO: This is sometimes Vector2 and sometimes Vector3.  Why?  It should probably
   *                                   TODO: just be one or the other.
   * @param {Tandem} tandem
   * @constructor
   */

  function WireSegment( startPoint, endPoint, tandem ) {

    // assert && assert( startPoint instanceof Vector3 );
    // assert && assert( endPoint instanceof Vector3 );

    this.startPointProperty = new Property( startPoint, {
      tandem: tandem.createTandem( 'startPointProperty' ),
      phetioValueType: TVector2,
    } );

    this.endPointProperty = new Property( endPoint, {
      tandem: tandem.createTandem( 'endPointProperty' ),
      phetioValueType: TVector2
    } );
  }

  capacitorLabBasics.register( 'WireSegment', WireSegment );

  inherit( Object, WireSegment, {}, {

    // Factory methods for specific wire segments

    /**
     * Factory for a ComponentWireSegment that attaches to the top of a circuit component
     * @param {Capacitor || LightBulb} component
     * @param {Vector2} endPoint
     * @param {Tandem} tandem - end point for the wire segment
     */
    createComponentTopWireSegment: function( component, endPoint, tandem ) {
      return new ComponentTopWireSegment( component, endPoint, tandem );
    },

    /**
     * Factory for a ComponentWireSegment that attaches to the bottom of a circuit component
     * @param {Capacitor | LightBulb} component
     * @param {Vector2} endPoint - end point for the wire segment
     * @param {Tandem} tandem
     */
    createComponentBottomWireSegment: function( component, endPoint, tandem ) {
      return new ComponentBottomWireSegment( component, endPoint, tandem );
    },

    /**
     * Factory for a SwitchSegment that acts as a switch between two connection points
     * @param {Vector2} startPoint - start point for the switch segment
     * @param {Object} activeConnection
     * @param {Tandem} tandem
     */
    createSwitchSegment: function( startPoint, activeConnection, tandem ) {
      return new SwitchSegment( startPoint, activeConnection, tandem );
    },

    reset: function() {
      this.startPointProperty.reset();
      this.endPointProperty.reset();
    }

  } );

  /**
   * Constructor for ComponentTopWireSegment.  This is a wire segment whose start point is connected to the top
   * connection point of a component.  Adjusts the wire geometry when the component changes geometry or orientation.
   *
   * @param {Capacitor || LightBulb} component
   * @param {Vector2} endPoint
   * @param {Tandem} tandem
   */
  function ComponentTopWireSegment( component, endPoint, tandem ) {
    WireSegment.call( this, component.getTopConnectionPoint().toVector2(), endPoint, tandem );
    this.component = component;
  }

  capacitorLabBasics.register( 'ComponentTopWireSegment', ComponentTopWireSegment );

  inherit( WireSegment, ComponentTopWireSegment, {
    // update the start point of the segment, called when the component geometry changes
    update: function() {
      this.startPointProperty.set( this.component.getTopConnectionPoint().toVector2() );
    }
  } );

  /**
   * Constructor for ComponentBottomWireSegment.  Wire segment whose start point is connected to the bottom connection
   * point of a component.  Adjusts the start point when the component geometry changes.
   *
   * @param {Capacitor || LightBulb} component
   * @param {Vector2} endPoint
   * @param {Tandem} tandem
   */
  function ComponentBottomWireSegment( component, endPoint, tandem ) {
    WireSegment.call( this, component.getBottomConnectionPoint().toVector2(), endPoint, tandem );
    this.component = component;
  }

  capacitorLabBasics.register( 'ComponentBottomWireSegment', ComponentBottomWireSegment );

  inherit( WireSegment, ComponentBottomWireSegment, {
    // update the start point of the segment, called when the component geometry changes
    update: function() {
      this.startPointProperty.set( this.component.getBottomConnectionPoint().toVector2() );
    }
  } );

  /**
   * Constructor for a switch segment.  End point of the switch segment will change depending on the connection
   * state of the circutit.
   *
   * @param {Vector2} hingePoint
   * @param {Object} activeConnection
   * @param {Tandem} tandem
   * @constructor
   */
  function SwitchSegment( hingePoint, activeConnection, tandem ) {
    this.activeConnection = activeConnection;
    this.hingePoint = hingePoint;
    WireSegment.call( this, hingePoint, activeConnection.location, tandem );
  }

  capacitorLabBasics.register( 'SwitchSegment', SwitchSegment );

  inherit( WireSegment, SwitchSegment, {

    // update the endpoint for the switch segment, called when the connection point of the circuit changes
    update: function( activeConnection, angle ) {
      // set the new active connection point
      this.endPoint = activeConnection.location;
    }
  } );

  return WireSegment;

} );
