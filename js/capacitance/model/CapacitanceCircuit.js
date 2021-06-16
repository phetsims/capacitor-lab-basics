// Copyright 2015-2021, University of Colorado Boulder

/**
 * Model of a circuit with a battery (B) connected to a single capacitor.  This is treated as a special case of a
 * parallel circuit, with some added features.  The capacitor also has a switch attached to it so that it can be
 * disconnected from the battery.
 *
 * +-----+
 * |      \
 * |       |
 * B      ===
 * |       |
 * |      /
 * +-----+
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import capacitorLabBasics from '../../capacitorLabBasics.js';
import CircuitState from '../../common/model/CircuitState.js';
import ParallelCircuit from '../../common/model/ParallelCircuit.js';

class CapacitanceCircuit extends ParallelCircuit {
  /**
   * @param {CircuitConfig} config
   * @param {Tandem} tandem
   */
  constructor( config, tandem ) {
    super( config, tandem );

    this.lightBulb = null; // There is no light bulb in the first screen
  }

  /**
   * Updates the plate voltage, depending on whether the battery is connected.
   * @public
   */
  updatePlateVoltages() {

    // Undefined check required because superclass calls this method from its constructor.
    if ( this.circuitConnectionProperty !== undefined ) {

      // if the battery is connected, the voltage is equal to the battery voltage
      if ( this.circuitConnectionProperty.value === CircuitState.BATTERY_CONNECTED ) {
        this.capacitor.plateVoltageProperty.value = this.battery.voltageProperty.value;
      }

      else {

        // otherwise, the voltage can be found by V=Q/C
        this.capacitor.plateVoltageProperty.value =
          this.disconnectedPlateChargeProperty.value / this.capacitor.capacitanceProperty.value;
      }
    }
  }
}

capacitorLabBasics.register( 'CapacitanceCircuit', CapacitanceCircuit );

export default CapacitanceCircuit;