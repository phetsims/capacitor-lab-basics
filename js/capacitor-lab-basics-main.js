// Copyright 2014-2019, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Emily Randall (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const CapacitanceScreen = require( 'CAPACITOR_LAB_BASICS/capacitance/CapacitanceScreen' );
  const CLBLightBulbScreen = require( 'CAPACITOR_LAB_BASICS/light-bulb/CLBLightBulbScreen' );
  const Property = require( 'AXON/Property' );
  const Sim = require( 'JOIST/Sim' );
  const SimLauncher = require( 'JOIST/SimLauncher' );
  const Tandem = require( 'TANDEM/Tandem' );

  // strings
  const capacitorLabBasicsTitleString = require( 'string!CAPACITOR_LAB_BASICS/capacitor-lab-basics.title' );

  // constants
  const tandem = Tandem.ROOT;

  const simOptions = {
    credits: {
      leadDesign: 'Amy Rouinfar',
      softwareDevelopment: 'Andrew Adare, Jesse Greenberg, Chris Malley, Emily Randall, Jonathan Olson',
      team: 'Emily B. Moore, Ariel Paul, Kathy Perkins, Emily Randall',
      qualityAssurance: 'Steele Dalton, Amanda Davis, Kerrie Dochen, Bryce Griebenow, Ethan Johnson, Elise Morgan, Liam Mulhall, Oliver Orejola, Arnab Purkayastha, Ben Roberts, Clara Wilson, Bryan Yoelin'
    }
  };

  SimLauncher.launch( function() {

    // Tracks whether a circuit switch has been changed by user. Once the switch has been changed in either screen,
    // the cue arrows (used to hint that the switch is available) should disappear from both screens.
    const switchUsedProperty = new Property( false );

    const screens = [
      new CapacitanceScreen( switchUsedProperty, tandem.createTandem( 'capacitanceScreen' ) ),
      new CLBLightBulbScreen( switchUsedProperty, tandem.createTandem( 'lightBulbScreen' ) )
    ];
    const sim = new Sim( capacitorLabBasicsTitleString, screens, simOptions );
    sim.start();
  } );
} );

