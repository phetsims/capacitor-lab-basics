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
  var Property = require( 'AXON/Property' );
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
    }
  };

  SimLauncher.launch( function() {

    // Tracks whether a circuit switch has been changed by user. Once the switch has been changed in either screen,
    // the cue arrows (used to hint that the switch is available) should disappear from both screens.
    var switchUsedProperty = new Property( false );

    var screens = [
      new CapacitanceScreen( switchUsedProperty, tandem.createTandem( 'capacitanceScreen' ) ),
      new CLBLightBulbScreen( switchUsedProperty, tandem.createTandem( 'lightBulbScreen' ) )
    ];
    var sim = new Sim( capacitorLabBasicsTitleString, screens, simOptions );
    sim.start();
  } );
} );

