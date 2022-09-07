// Copyright 2014-2022, University of Colorado Boulder

/**
 * Main entry point for the sim.
 *
 * @author Emily Randall (PhET Interactive Simulations)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Property from '../../axon/js/Property.js';
import Sim from '../../joist/js/Sim.js';
import simLauncher from '../../joist/js/simLauncher.js';
import Tandem from '../../tandem/js/Tandem.js';
import CapacitanceScreen from './capacitance/CapacitanceScreen.js';
import CapacitorLabBasicsStrings from './CapacitorLabBasicsStrings.js';
import CLBLightBulbScreen from './light-bulb/CLBLightBulbScreen.js';

const capacitorLabBasicsTitleStringProperty = CapacitorLabBasicsStrings[ 'capacitor-lab-basics' ].titleStringProperty;

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

simLauncher.launch( () => {

  // Tracks whether a circuit switch has been changed by user. Once the switch has been changed in either screen,
  // the cue arrows (used to hint that the switch is available) should disappear from both screens.
  const switchUsedProperty = new Property( false );

  const screens = [
    new CapacitanceScreen( switchUsedProperty, tandem.createTandem( 'capacitanceScreen' ) ),
    new CLBLightBulbScreen( switchUsedProperty, tandem.createTandem( 'lightBulbScreen' ) )
  ];
  const sim = new Sim( capacitorLabBasicsTitleStringProperty, screens, simOptions );
  sim.start();
} );