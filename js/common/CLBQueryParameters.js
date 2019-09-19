// Copyright 2016-2018, University of Colorado Boulder

/**
 * Query parameters specific to Capacitor Lab: Basics
 *
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  const CLBQueryParameters = QueryStringMachine.getAll( {

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
