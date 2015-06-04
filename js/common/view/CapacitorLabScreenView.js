// Copyright 2002-2014, University of Colorado Boulder

/**
 * Base class for all screens in the "Capacitor Lab" sim.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );

  /**
   * Constructor for the CapacitorLabScreenView.
   *
   * @constructor
   */
  function CapacitorLabScreenView( model, modelViewTransform, globalProperties ) {

    ScreenView.call( this );

  }

  return inherit( ScreenView, CapacitorLabScreenView );
} );