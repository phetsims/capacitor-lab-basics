// Copyright 2002-2015, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Emily Randall
 */
define( function( require ) {
  'use strict';

  // modules
  var CapacitorLabScreen = require( 'CAPACITOR_LAB/capacitor-lab/CapacitorLabScreen' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );

  // strings
  var simTitle = require( 'string!CAPACITOR_LAB/capacitor-lab.name' );

  var simOptions = {
    credits: {
      //TODO fill in proper credits, all of these fields are optional, see joist.AboutDialog
      leadDesign: '',
      softwareDevelopment: '',
      team: '',
      qualityAssurance: '',
      graphicArts: '',
      thanks: ''
    }
  };

  // Appending '?dev' to the URL will enable developer-only features.
  if ( phet.chipper.getQueryParameter( 'dev' ) ) {
    simOptions = _.extend( {
      // add dev-specific options here
    }, simOptions );
  }

  SimLauncher.launch( function() {
    var sim = new Sim( simTitle, [ new CapacitorLabScreen() ], simOptions );
    sim.start();
  } );
} );