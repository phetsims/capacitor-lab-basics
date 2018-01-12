// Copyright 2016-2017, University of Colorado Boulder

/**
 * Query parameters specific to Capacitor Lab: Basics
 *
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  var CLBQueryParameters = QueryStringMachine.getAll( {

    // Provided as a customization for PhET-iO.
    // Removes the open-circuit switch state in the Light Bulb screen
    switch: {
      type: 'string',
      validValues: [ 'twoState', 'threeState' ],
      defaultValue: 'threeState'
    },

    showDebugAreas: {
      type: 'flag'
    }
  } );

  capacitorLabBasics.register( 'CLBQueryParameters', CLBQueryParameters );

  return CLBQueryParameters;
} );
