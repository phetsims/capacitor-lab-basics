// Copyright 2014-2018, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Emily Randall (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var CapacitanceScreen = require( 'CAPACITOR_LAB_BASICS/capacitance/CapacitanceScreen' );
  var CLBLightBulbScreen = require( 'CAPACITOR_LAB_BASICS/light-bulb/CLBLightBulbScreen' );
  var Property = require( 'AXON/Property' );
  var Sim = require( 'JOIST/Sim' );
  var SimLauncher = require( 'JOIST/SimLauncher' );
  var Tandem = require( 'TANDEM/Tandem' );

  // strings
  var capacitorLabBasicsTitleString = require( 'string!CAPACITOR_LAB_BASICS/capacitor-lab-basics.title' );

  // constants
  var tandem = Tandem.rootTandem;

  var simOptions = {
    credits: {
      leadDesign: 'Amy Rouinfar',
      softwareDevelopment: 'Andrew Adare, Jesse Greenberg, Chris Malley, Emily Randall, Jonathan Olson',
      team: 'Emily Moore, Ariel Paul, Kathy Perkins, Emily Randall',
      qualityAssurance: 'Steele Dalton, Amanda Davis, Kerrie Dochen, Bryce Griebenow, Ethan Johnson, Elise Morgan, Liam Mulhall, Oliver Orejola, Arnab Purkayastha, Ben Roberts, Clara Wilson, Bryan Yoelin'
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

