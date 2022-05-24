// Copyright 2015-2022, University of Colorado Boulder

/**
 * Model for the "Light Bulb" circuit, which extends ParallelCircuit.  This circuit is composed of a battery, capacitor
 * and a light bulb.  The capacitor is connected to a switch so that it can be connected to either the light bulb OR
 * the battery, but not both at the same time.  The capacitor can also be entirely disconnected from the circuit. This
 * is illustrated in the following diagram:
 *
 * +---+ + +----+
 * |      /     |
 * |     |      |
 * B     C      Z
 * |     |      |
 * |      \     |
 * +---+ + +----+
 *
 * B = Battery
 * C = Capacitor, connected in parallel through switches
 * Z = Light Bulb
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import Vector3 from '../../../../dot/js/Vector3.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';
import CLBConstants from '../../common/CLBConstants.js';
import CircuitPosition from '../../common/model/CircuitPosition.js';
import CircuitState from '../../common/model/CircuitState.js';
import LightBulb from '../../common/model/LightBulb.js';
import ParallelCircuit from '../../common/model/ParallelCircuit.js';

// During exponential voltage drop, circuit voltage crosses this threshold,
// below which we no longer call discharge() so I and V don't tail off forever.
const MIN_VOLTAGE = 1e-3; // Volts. Minimum readable value on voltmeter.

class LightBulbCircuit extends ParallelCircuit {
  /**
   * @param {CircuitConfig} config
   * @param {Tandem} tandem
   */
  constructor( config, tandem ) {

    // Initialize a lightBulb
    const bulbPosition = new Vector3(
      CLBConstants.BATTERY_POSITION.x + config.capacitorXSpacing + CLBConstants.LIGHT_BULB_X_SPACING,
      CLBConstants.BATTERY_POSITION.y + config.capacitorYSpacing,
      CLBConstants.BATTERY_POSITION.z
    );
    const lightBulb = new LightBulb( bulbPosition, config.modelViewTransform );
    config.lightBulb = lightBulb;

    super( config, tandem );

    // @public {LightBulb}
    this.lightBulb = lightBulb;

    // Make sure that the charges are correct when the battery is reconnected to the circuit.
    this.circuitConnectionProperty.link( circuitConnection => {
      /*
       * When disconnecting the battery, set the disconnected plate charge to whatever the total plate charge was with
       * the battery connected.  Need to do this before changing the plate voltages property.
       */
      if ( circuitConnection !== CircuitState.BATTERY_CONNECTED ) {
        this.disconnectedPlateChargeProperty.set( this.getTotalCharge() );
      }
      this.updatePlateVoltages();
    } );

    // Allow the capacitor to discharge when adjusting the plate geometry.
    Multilink.multilink( [ this.capacitor.plateSizeProperty, this.capacitor.plateSeparationProperty ],
      () => {
        // Don't discharge the capacitor when we're connected to the battery (since the amount of charge changes to
        // compensate). See https://github.com/phetsims/capacitor-lab-basics/issues/282
        if ( this.circuitConnectionProperty.value === CircuitState.LIGHT_BULB_CONNECTED &&
             Math.abs( this.capacitor.plateVoltageProperty.value ) > MIN_VOLTAGE ) {
          this.capacitor.discharge( this.lightBulb.resistance, 0 );
        }
      } );
  }


  /**
   * LightBulbCircuit model update function
   * @public
   * @override
   *
   * @param {number} dt time step in seconds
   */
  step( dt ) {

    // Step through common circuit components
    super.step( dt );

    // Discharge the capacitor when it is in parallel with the light bulb,
    // but don't allow the voltage to taper to zero forever.
    // This is both for performance, and for better timing control.
    // The current arrows should start fading when the voltmeter reading drops
    // below MIN_VOLTAGE.
    if ( this.circuitConnectionProperty.value === CircuitState.LIGHT_BULB_CONNECTED ) {
      if ( Math.abs( this.capacitor.plateVoltageProperty.value ) > MIN_VOLTAGE ) {
        this.capacitor.discharge( this.lightBulb.resistance, dt );
      }

      else {
        this.capacitor.plateVoltageProperty.set( 0 );
        this.currentAmplitudeProperty.set( 0 );
        this.previousTotalCharge = 0; // This fixes #130
      }
    }

  }

  /**
   * Updates the plate voltage, depending on whether the battery is connected.
   * Null check required because superclass calls this method from its constructor.
   * Remember to call this method at the end of this class' constructor.
   * @public
   */
  updatePlateVoltages() {
    // If the battery is connected, the voltage is equal to the battery voltage
    if ( this.circuitConnectionProperty !== undefined ) {
      if ( this.circuitConnectionProperty.value === CircuitState.BATTERY_CONNECTED ) {
        this.capacitor.plateVoltageProperty.value = this.battery.voltageProperty.value;
      }
      // If circuit is open, use V = Q/C
      else if ( this.circuitConnectionProperty.value === CircuitState.OPEN_CIRCUIT ) {
        this.capacitor.plateVoltageProperty.value =
          this.disconnectedPlateChargeProperty.value / this.capacitor.capacitanceProperty.value;
      }
    }
  }

  /**
   * Assert that position is either CircuitPosition.LIGHT_BULB_TOP or BOTTOM.
   * @private
   *
   * @param {CircuitPosition} position
   */
  validatePosition( position ) {

    assert && assert( position === CircuitPosition.LIGHT_BULB_TOP || position === CircuitPosition.LIGHT_BULB_BOTTOM,
      `position should be LIGHT_BULB_TOP or LIGHT_BULB_BOTTOM, received ${position}` );
  }

  /**
   * Update the current amplitude depending on the circuit connection.  If the capacitor is connected to the light
   * bulb, find the current by I = V / R.  Otherwise, current is found by dQ/dT.
   * @public
   *
   * @param {number} dt
   */
  updateCurrentAmplitude( dt ) {

    // if the circuit is connected to the light bulb, I = V / R
    if ( this.circuitConnectionProperty.value === CircuitState.LIGHT_BULB_CONNECTED ) {
      let current = this.capacitor.plateVoltageProperty.value / this.lightBulb.resistance;

      // The cutoff is doubled here for #58
      if ( Math.abs( current ) < 2 * MIN_VOLTAGE / this.lightBulb.resistance ) {
        current = 0;
      }

      this.currentAmplitudeProperty.set( current );
    }

    // otherise, I = dQ/dT
    else {
      super.updateCurrentAmplitude( dt );
    }
  }
}

capacitorLabBasics.register( 'LightBulbCircuit', LightBulbCircuit );

export default LightBulbCircuit;
