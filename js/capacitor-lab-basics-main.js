// Copyright 2014-2015, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Emily Randall
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var CapacitorLabBasicsLightBulbScreen = require( 'CAPACITOR_LAB_BASICS/light-bulb/CapacitorLabBasicsLightBulbScreen' );
  var CapacitanceScreen = require( 'CAPACITOR_LAB_BASICS/capacitance/CapacitanceScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var capacitorLabBasicsTitleString = require( 'string!CAPACITOR_LAB_BASICS/capacitor-lab-basics.title' );

  var screens = [
    new CapacitanceScreen(),
    new CapacitorLabBasicsLightBulbScreen()
  ];

  var simOptions = {
    credits: {
      //TODO fill in proper credits, all of these fields are optional, see joist.AboutDialog
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      qualityAssurance: '',
      graphicArts: '',
      thanks: ''
    },
    // TODO: This should be removed for production deployment.
    // disable home screen for accessibility testing.
    showHomeScreen: false,
  };

  // Appending '?dev' to the URL will enable developer-only features.
  if ( phet.chipper.getQueryParameter( 'dev' ) ) {
    simOptions = _.extend( {
      // add dev-specific options here
    }, simOptions );
  }

  SimLauncher.launch( function() {
    var sim = new Sim( capacitorLabBasicsTitleString, screens, simOptions );
    sim.start();
  } );
} );