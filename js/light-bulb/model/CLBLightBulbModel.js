// Copyright 2015-2022, University of Colorado Boulder

/**
 * The main model for the "Light Bulb" screen of Capacitor Lab: Basics.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import CapacitorConstants from '../../../../scenery-phet/js/capacitor/CapacitorConstants.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';
import CLBQueryParameters from '../../common/CLBQueryParameters.js';
import CircuitConfig from '../../common/model/CircuitConfig.js';
import CircuitState from '../../common/model/CircuitState.js';
import CLBModel from '../../common/model/CLBModel.js';
import BarMeter from '../../common/model/meter/BarMeter.js';
import LightBulbCircuit from './LightBulbCircuit.js';

// constants
const CAPACITOR_X_SPACING = 0.0180; // meters
const CAPACITOR_Y_SPACING = 0.0010; // meters
const PLATE_WIDTH = CapacitorConstants.PLATE_WIDTH_RANGE.defaultValue;
const PLATE_SEPARATION = CapacitorConstants.PLATE_SEPARATION_RANGE.defaultValue;

class CLBLightBulbModel extends CLBModel {
  /**
   * @param {Property.<boolean>} switchUsedProperty - whether switch has been changed by user. Affects both screens.
   * @param {YawPitchModelViewTransform3} modelViewTransform
   * @param {Tandem} tandem
   */
  constructor( switchUsedProperty, modelViewTransform, tandem ) {

    // A requested PhET-iO customization is to simplify the switch into a
    // single-pole double-throw switch for the light-bulb circuit instead of
    // the default three-position version (phet-io/569).
    // Enable with the switch=twoState query parameter.
    const useTwoStateSwitch = CLBQueryParameters.switch === 'twoState';

    const twoState = [
      CircuitState.BATTERY_CONNECTED,
      CircuitState.LIGHT_BULB_CONNECTED
    ];
    const threeState = [
      CircuitState.BATTERY_CONNECTED,
      CircuitState.OPEN_CIRCUIT,
      CircuitState.LIGHT_BULB_CONNECTED
    ];

    // configuration info for the circuit
    const circuitConfig = CircuitConfig.create( {
      circuitConnections: useTwoStateSwitch ? twoState : threeState,
      modelViewTransform: modelViewTransform,
      capacitorXSpacing: CAPACITOR_X_SPACING,
      capacitorYSpacing: CAPACITOR_Y_SPACING,
      plateWidth: PLATE_WIDTH,
      plateSeparation: PLATE_SEPARATION,
      hasLightBulb: true
    } );

    const circuit = new LightBulbCircuit( circuitConfig, tandem.createTandem( 'circuit' ) );
    super( circuit, switchUsedProperty, modelViewTransform, tandem );

    // @public {LightBulbCircuit}
    this.circuit = circuit;

    // @public {BarMeter}
    this.capacitanceMeter = new BarMeter( this.capacitanceMeterVisibleProperty, this.circuit.capacitor.capacitanceProperty );

    // @public {BarMeter}
    this.plateChargeMeter = new BarMeter( this.topPlateChargeMeterVisibleProperty, this.circuit.capacitor.plateChargeProperty );

    // @public {BarMeter}
    this.storedEnergyMeter = new BarMeter( this.storedEnergyMeterVisibleProperty, this.circuit.capacitor.storedEnergyProperty );
  }

  /**
   * Reset function for this model.
   * @public
   * @override
   */
  reset() {
    this.plateChargesVisibleProperty.reset();
    this.topPlateChargeMeterVisibleProperty.reset();
    this.storedEnergyMeterVisibleProperty.reset();
    this.capacitanceMeter.reset();
    this.plateChargeMeter.reset();
    this.storedEnergyMeter.reset();
    this.voltmeter.reset();
    this.circuit.reset();
    super.reset();
  }

  /**
   * @param {number} dt
   * @param {boolean} isManual
   * @public
   */
  step( dt, isManual ) {
    super.step( dt, isManual );
    this.circuit.updateCurrentAmplitude( dt );
  }

  /**
   * @public
   */
  manualStep() {
    super.step( 0.2, true );
  }
}

capacitorLabBasics.register( 'CLBLightBulbModel', CLBLightBulbModel );

export default CLBLightBulbModel;