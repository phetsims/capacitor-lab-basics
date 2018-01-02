// Copyright 2015-2017, University of Colorado Boulder

/**
 * A straight segment of wire. One or more segments are joined to create a Wire.  Contains factory functions to
 * construct wire segments for each of the circuit components, since segments will need unique functions to update
 * their geometry depending on the components they connect.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Vector3 = require( 'DOT/Vector3' );
  var Vector3IO = require( 'DOT/Vector3IO' );

  /**
   * @constructor
   *
   * @param {Vector3} startPoint
   * @param {Vector3} endPoint
   * @param {Tandem} tandem
   */
  function WireSegment( startPoint, endPoint, tandem ) {

    assert && assert( startPoint instanceof Vector3 );
    assert && assert( endPoint instanceof Vector3 );

    // @public {Property.<Vector3>}
    this.startPointProperty = new Property( startPoint, {
      tandem: tandem.createTandem( 'startPointProperty' ),
      phetioType: PropertyIO( Vector3IO )
    } );

    // @public {Property.<Vector3>}
    this.endPointProperty = new Property( endPoint, {
      tandem: tandem.createTandem( 'endPointProperty' ),
      phetioType: PropertyIO( Vector3IO )
    } );
  }

  capacitorLabBasics.register( 'WireSegment', WireSegment );

  inherit( Object, WireSegment, {

    /**
     * No-op function to provide a uniform interface for all descendants
     * @public
     */
    update: function() {}

  }, {

    // Factory methods for specific wire segments

    /**
     * Factory for a ComponentWireSegment that attaches to the top of a circuit component
     * @public
     *
     * @param {Capacitor|LightBulb} component
     * @param {Vector3} endPoint
     * @param {Tandem} tandem - end point for the wire segment
     * @returns {WireSegment}
     */
    createComponentTopWireSegment: function( component, endPoint, tandem ) {
      return new ComponentTopWireSegment( component, endPoint, tandem );
    },

    /**
     * Factory for a ComponentWireSegment that attaches to the bottom of a circuit component
     * @public
     *
     * @param {Capacitor|LightBulb} component
     * @param {Vector3} endPoint
     * @param {Tandem} tandem
     * @returns {WireSegment}
     */
    createComponentBottomWireSegment: function( component, endPoint, tandem ) {
      return new ComponentBottomWireSegment( component, endPoint, tandem );
    }
  } );

  /**
   * This is a wire segment whose start point is connected to the top
   * connection point of a component.  Adjusts the wire geometry when the component changes geometry or orientation.
   * @public
   * @constructor
   *
   * @param {Capacitor|LightBulb} component
   * @param {Vector3} endPoint
   * @param {Tandem} tandem
   */
  function ComponentTopWireSegment( component, endPoint, tandem ) {
    WireSegment.call( this, component.getTopConnectionPoint(), endPoint, tandem );

    // @private
    this.component = component;
  }

  capacitorLabBasics.register( 'ComponentTopWireSegment', ComponentTopWireSegment );

  inherit( WireSegment, ComponentTopWireSegment, {

    /**
     * Update the start point of the segment. Called when the component geometry changes.
     * @public
     */
    update: function() {
      var connectionPoint = this.component.getTopConnectionPoint();
      if ( !this.startPointProperty.value.equals( connectionPoint ) ) {
        this.startPointProperty.value = connectionPoint;
      }
    }
  } );

  /**
   * Wire segment whose start point is connected to the bottom connection
   * point of a component.  Adjusts the start point when the component geometry changes.
   * @public
   * @constructor
   *
   * @param {Capacitor|LightBulb} component
   * @param {Vector3} endPoint
   * @param {Tandem} tandem
   */
  function ComponentBottomWireSegment( component, endPoint, tandem ) {
    WireSegment.call( this, component.getBottomConnectionPoint(), endPoint, tandem );

    // @private
    this.component = component;
  }

  capacitorLabBasics.register( 'ComponentBottomWireSegment', ComponentBottomWireSegment );

  inherit( WireSegment, ComponentBottomWireSegment, {

    /**
     * Update the start point of the segment. Called when the component geometry changes
     * @public
     */
    update: function() {
      var connectionPoint = this.component.getBottomConnectionPoint();
      if ( !this.startPointProperty.value.equals( connectionPoint ) ) {
        this.startPointProperty.value = connectionPoint;
      }
    }
  } );

  return WireSegment;
} );
