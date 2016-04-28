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
  var CLBLightBulbScreen = require( 'CAPACITOR_LAB_BASICS/light-bulb/CLBLightBulbScreen' );
  var CapacitanceScreen = require( 'CAPACITOR_LAB_BASICS/capacitance/CapacitanceScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var Tandem = require( 'TANDEM/Tandem' );

  // strings
  var capacitorLabBasicsTitleString = require( 'string!CAPACITOR_LAB_BASICS/capacitor-lab-basics.title' );

  // constants
  var tandem = Tandem.createRootTandem();

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
    tandem: tandem
  };

  // Appending '?dev' to the URL will enable developer-only features.
  if ( phet.chipper.getQueryParameter( 'dev' ) ) {
    simOptions = _.extend( {
      // add dev-specific options here
    }, simOptions );
  }

  SimLauncher.launch( function() {
    var screens = [
      new CapacitanceScreen( tandem.createTandem( 'capacitanceScreen' ) ),
      new CLBLightBulbScreen( tandem.createTandem( 'lightBulbScreen' ) )
    ];
    var sim = new Sim( capacitorLabBasicsTitleString, screens, simOptions );
    sim.start();
  } );
} );