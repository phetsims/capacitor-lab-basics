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
  var FADEOUT_DURATION = 1000; // ms
  var FADEOUT_STEP_RATE = 20; // ms
  var FADEOUT_DELAY = 1; // seconds

  /**
   * Constructor.
   *
   * @param {Property.<number>} currentAmplitudeProperty
   * @param {number} positiveOrientation rotation angle for +dV/dt (radians)
   * @constructor
   */
  function CurrentIndicator( currentAmplitudeProperty, positiveOrientation ) {

    PropertySet.call( this, {
      opacity: 0,
      rotation: 0
    } );
    this.currentAmplitudeProperty = currentAmplitudeProperty;

    this.positiveOrientation = positiveOrientation;
    this.deltaOpacity = MAX_OPACITY / ( FADEOUT_DURATION / FADEOUT_STEP_RATE );
    this.delayTime = 0;

  }

  return inherit( PropertySet, CurrentIndicator, {

    /**
     * Step function.
     * @param {number} dt
     */
    step: function( dt ) {
      this.updateOpacity( this.currentAmplitudeProperty.value, dt );
      this.updateOrientation( this.currentAmplitudeProperty.value );
    },

    /**
     * Updates the opacitiy value for this model element based on the current amplitude. Any non-zero current amplitude
     * results in a constant opacity. When current amplitude goes to zero, a the node will gradually fade out to be
     * fully transparent, making it effectively invisible.
     *
     * @param {number} current
     * @param {number} dt, in ms
     */
    updateOpacity: function( current, dt ) {

      // if current is flowing, set opacity to max value and reset delay timer.
      if ( Math.abs( current ) > 0 ) {
        this.opacity = MAX_OPACITY;
        this.delayTime = FADEOUT_DELAY;
      }
      // no current flowing, but wait for delay dimer to hit zero.
      else if ( this.delayTime > 0 ) {
        //debugger;
        this.delayTime -= dt;
      }
      // gradually fade out when current and delay timer are both zero.
      else {
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