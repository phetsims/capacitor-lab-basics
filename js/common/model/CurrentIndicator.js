// Copyright 2002-2015, University of Colorado Boulder

/**
 * Model for the current indicator.  This model will track the current amplitude of the circuit and maintain an
 * opacity for the CurrentIndicatorNode through a step function.
 *
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  // constants
  var MAX_OPACITY = 0.75; // range is 0-1
  var FADEOUT_DURATION = 600; // ms
  var FADEOUT_STEP_RATE = 20; // ms

  /**
   * Constructor.
   *
   * @param {AbstractCircuit} circuit
   * @param {number} positiveOrientation rotation angle for +dV/dt (radians)
   * @constructor
   */
  function CurrentIndicator( circuit, positiveOrientation ) {

    PropertySet.call( this, {
      opacity: 0,
      rotation: 0
    } );
    this.circuit = circuit;
    
    this.positiveOrientation = positiveOrientation;
    this.deltaOpacity = MAX_OPACITY / ( FADEOUT_DURATION / FADEOUT_STEP_RATE );

  }

  return inherit( PropertySet, CurrentIndicator, {

    step: function( dt ) {
      this.updateOpacity( this.circuit.currentAmplitude );
      this.updateOrientation( this.circuit.currentAmplitude );
    },

    updateOpacity: function( current ) {
      // if current is flowing, set opacity to max value.
      if ( Math.abs( current ) > 0 ) {
        this.opacity = MAX_OPACITY;
      }

      else {
        // gradually fade out
        this.opacity = Math.max( 0, this.opacity - this.deltaOpacity );
      }
    },

    /**
     * Updates the orientation of the current indicator, based on the sign of the current amplitude.
     *
     * @param {number} current
     */
    updateOrientation: function( current ) {
      if ( current !== 0 ) {
        this.rotation = ( current > 0 ) ? this.positiveOrientation : this.positiveOrientation + Math.PI;
      }
    }
  } );
} );