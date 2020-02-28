// Copyright 2015-2020, University of Colorado Boulder

/**
 * Capacitance model for Capacitor Lab: Basics.  This model has a battery connected in parallel to a capacitor, and
 * allows the user to modify capacitor plate geometry to illustrate relationships with capacitance.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import inherit from '../../../../phet-core/js/inherit.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';
import CircuitConfig from '../../common/model/CircuitConfig.js';
import CircuitState from '../../common/model/CircuitState.js';
import CLBModel from '../../common/model/CLBModel.js';
import BarMeter from '../../common/model/meter/BarMeter.js';
import CapacitanceCircuit from './CapacitanceCircuit.js';

/**
 * @constructor
 *
 * @param {Property.<boolean>} switchUsedProperty - whether switch has been changed by user. Affects both screens.
 * @param {YawPitchModelViewTransform3} modelViewTransform
 * @param {Tandem} tandem
 */
function CapacitanceModel( switchUsedProperty, modelViewTransform, tandem ) {

  const circuitConfig = CircuitConfig.create( {
    circuitConnections: [ CircuitState.BATTERY_CONNECTED, CircuitState.OPEN_CIRCUIT ]
  } );

  // @public {CapacitanceCircuit}
  this.circuit = new CapacitanceCircuit( circuitConfig, tandem.createTandem( 'circuit' ) );

  CLBModel.call( this, switchUsedProperty, modelViewTransform, tandem );

  // @public {BarMeter}
  this.capacitanceMeter = new BarMeter( this.capacitanceMeterVisibleProperty, this.circuit.capacitor.capacitanceProperty );

  // @public {BarMeter}
  this.plateChargeMeter = new BarMeter( this.topPlateChargeMeterVisibleProperty, this.circuit.capacitor.plateChargeProperty );

  // @public {BarMeter}
  this.storedEnergyMeter = new BarMeter( this.storedEnergyMeterVisibleProperty, this.circuit.capacitor.storedEnergyProperty );
}

capacitorLabBasics.register( 'CapacitanceModel', CapacitanceModel );

export default inherit( CLBModel, CapacitanceModel, {

  /**
   * Reset function for this model.
   * @public
   * @override
   */
  reset: function() {
    this.capacitanceMeter.reset();
    this.plateChargeMeter.reset();
    this.storedEnergyMeter.reset();
    this.voltmeter.reset();
    this.circuit.reset();
    CLBModel.prototype.reset.call( this );
  }
} );