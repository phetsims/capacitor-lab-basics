// Copyright 2016-2021, University of Colorado Boulder

/**
 * Query parameters specific to Capacitor Lab: Basics
 *
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import capacitorLabBasics from '../capacitorLabBasics.js';

const CLBQueryParameters = QueryStringMachine.getAll( {

  // Provided as a customization for PhET-iO.
  // Removes the open-circuit switch state in the Light Bulb screen
  switch: {
    type: 'string',
    validValues: [ 'twoState', 'threeState' ],
    defaultValue: 'threeState',
    public: true
  },

  showDebugAreas: {
    type: 'flag'
  }
} );

capacitorLabBasics.register( 'CLBQueryParameters', CLBQueryParameters );

export default CLBQueryParameters;