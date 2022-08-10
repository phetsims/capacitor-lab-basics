// Copyright 2015-2022, University of Colorado Boulder

/**
 * Model of a circuit with a battery, switches, and possibly a light bulb.
 * The layout of the circuit assumes that the battery is on the left
 * hand side of the circuit, while the circuit components are to the right.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import { Shape } from '../../../../kite/js/imports.js';
import StringIO from '../../../../tandem/js/types/StringIO.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';
import CLBConstants from '../CLBConstants.js';
import Battery from './Battery.js';
import Capacitor from './Capacitor.js';
import CircuitPosition from './CircuitPosition.js';
import CircuitState from './CircuitState.js';
import ProbeTarget from './ProbeTarget.js';
import BatteryToSwitchWire from './wire/BatteryToSwitchWire.js';
import CapacitorToSwitchWire from './wire/CapacitorToSwitchWire.js';
import LightBulbToSwitchWire from './wire/LightBulbToSwitchWire.js';

class ParallelCircuit {
  /**
   * @param {CircuitConfig} config
   * @param {Tandem} tandem
   */
  constructor( config, tandem ) {

    // @public {NumberProperty} - Signed current through circuit. Used to update arrows
    this.currentAmplitudeProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'currentAmplitudeProperty' ),
      units: 'A',
      phetioDocumentation: 'Beware that the current is calculated in the model time step, so if dQ is zero for a step the current could transiently appear as zero.',
      phetioReadOnly: true
    } );

    // @public {Property.<CircuitState>} - Property tracking the state of the switch
    this.circuitConnectionProperty = new Property( CircuitState.BATTERY_CONNECTED, {
      tandem: tandem.createTandem( 'circuitConnectionProperty' ),
      phetioValueType: StringIO,
      validValues: CircuitState.VALUES
    } );


    // @public {NumberProperty} - Property tracking the signed charge value on the upper plate
    this.disconnectedPlateChargeProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'disconnectedPlateChargeProperty' ),
      units: 'C',
      phetioReadOnly: true
    } );

    // @protected {number}
    this.previousTotalCharge = 0;

    // @protected {number} - Overwritten in subtypes
    this.maxPlateCharge = Infinity;
    this.maxEffectiveEField = Infinity;

    // @public {Battery}
    this.battery = new Battery(
      CLBConstants.BATTERY_POSITION,
      CLBConstants.BATTERY_VOLTAGE_RANGE.defaultValue,
      config.modelViewTransform,
      tandem.createTandem( 'battery' )
    );

    // @public {Capacitor}
    this.capacitor = new Capacitor( config, this.circuitConnectionProperty, tandem.createTandem( 'capacitor' ) );

    // @public {Array.<CircuitSwitch>}
    this.circuitSwitches = [ this.capacitor.topCircuitSwitch, this.capacitor.bottomCircuitSwitch ];

    // @public {Array.<Wire>} - Assumes the capacitor is to the left of the lightbulb.
    this.wires = [
      BatteryToSwitchWire.createBatteryToSwitchWireTop(
        config,
        this.battery,
        this.capacitor.topCircuitSwitch
      ),
      BatteryToSwitchWire.createBatteryToSwitchWireBottom(
        config,
        this.battery,
        this.capacitor.bottomCircuitSwitch
      ),
      CapacitorToSwitchWire.createCapacitorToSwitchWireTop(
        config,
        this.capacitor,
        this.capacitor.topCircuitSwitch
      ),
      CapacitorToSwitchWire.createCapacitorToSwitchWireBottom(
        config,
        this.capacitor,
        this.capacitor.bottomCircuitSwitch
      )
    ];

    // If there is a light bulb in the circuit, wire it up
    if ( config.lightBulb ) {
      this.wires.push( LightBulbToSwitchWire.createLightBulbToSwitchWireTop(
        config,
        this.capacitor.topCircuitSwitch
      ) );
      this.wires.push( LightBulbToSwitchWire.createLightBulbToSwitchWireBottom(
        config,
        this.capacitor.bottomCircuitSwitch
      ) );
    }

    /**
     * Return the subset of wires connected to the provided position
     *
     * @param {CircuitPosition} position
     * @returns {Wire[]}
     */
    const selectWires = position => {
      return this.wires.filter( wire => wire.connectionPoint === position );
    };

    // Create wire groups that are electrically connected to various parts of the circuit.
    // These arrays are hashed to a position key for efficient connectivity checking.
    // @protected {Object} - Maps {CircuitPosition} => {Array.<Wire>}
    this.wireGroup = {};
    const positions = [ CircuitPosition.BATTERY_TOP, CircuitPosition.BATTERY_BOTTOM, CircuitPosition.LIGHT_BULB_TOP, CircuitPosition.LIGHT_BULB_BOTTOM, CircuitPosition.CAPACITOR_TOP, CircuitPosition.CAPACITOR_BOTTOM ];
    positions.forEach( position => {
      this.wireGroup[ position ] = selectWires( position );
    } );

    // @public {Array.<Wire>}
    this.topWires = this.wireGroup[ CircuitPosition.BATTERY_TOP ]
      .concat( this.wireGroup[ CircuitPosition.LIGHT_BULB_TOP ] )
      .concat( this.wireGroup[ CircuitPosition.CAPACITOR_TOP ] );

    // @public {Array.<Wire>}
    this.bottomWires = this.wireGroup[ CircuitPosition.BATTERY_BOTTOM ]
      .concat( this.wireGroup[ CircuitPosition.LIGHT_BULB_BOTTOM ] )
      .concat( this.wireGroup[ CircuitPosition.CAPACITOR_BOTTOM ] );

    // Add the switch wires to the capacitor wires arrays
    this.circuitSwitches.forEach( circuitSwitch => {
      const wire = circuitSwitch.switchWire;
      if ( wire.connectionPoint === CircuitPosition.CIRCUIT_SWITCH_TOP ) {
        this.wireGroup[ CircuitPosition.CAPACITOR_TOP ].push( wire );
      }
      if ( wire.connectionPoint === CircuitPosition.CIRCUIT_SWITCH_BOTTOM ) {
        this.wireGroup[ CircuitPosition.CAPACITOR_BOTTOM ].push( wire );
      }
    } );

    // Make sure all is well with circuit components.
    // Circuit must include at least one circuit component and two wires.
    assert && assert( this.wires.length >= 2, 'Valid circuits must include at least two wires' );

    // Update start and end points of each wire segment
    const updateSegments = () => {
      for ( let i = 0; i < this.wires.length; i++ ) {
        this.wires[ i ].update();
      }
    };

    // Update all segments, disconnected plate charge, and plate voltages when the connection property changes
    this.circuitConnectionProperty.lazyLink( circuitConnection => {

      // When disconnecting the battery, set the disconnected plate charge to whatever the total plate charge was with
      // the battery connected.  Need to do this before changing the plate voltages property.
      if ( circuitConnection !== CircuitState.BATTERY_CONNECTED ) {
        this.disconnectedPlateChargeProperty.set( this.getTotalCharge() );
      }
      this.updatePlateVoltages();
      updateSegments();
    } );

    // Update all segments and the plate voltages when capacitor plate geometry changes.
    this.capacitor.plateSeparationProperty.lazyLink( () => {
      updateSegments();
      this.updatePlateVoltages();
    } );

    // update the plate voltages when the capacitor plate size changes.
    this.capacitor.plateSizeProperty.lazyLink( () => {
      this.updatePlateVoltages();
    } );

    // update all segments when battery polarity changes.
    this.battery.polarityProperty.link( polarity => {
      updateSegments();
    } );

    // when the disconnected plate charge property changes, set the disconnected plate voltage.
    this.disconnectedPlateChargeProperty.lazyLink( () => {
      if ( this.circuitConnectionProperty.value === CircuitState.OPEN_CIRCUIT ) {
        this.updatePlateVoltages();
      }
    } );

    /*
     * When the battery voltage changes and the battery is connected, update the plate voltages.
     * Do NOT automatically do this when adding the observer because
     * updatePlateVoltages is implemented by the subclass, and all
     * necessary fields in the subclass may not be initialized.
     */
    this.battery.voltageProperty.lazyLink( () => {
      if ( this.circuitConnectionProperty.value === CircuitState.BATTERY_CONNECTED ) {
        this.updatePlateVoltages();
      }
    } );
  }


  // @public
  reset() {
    this.battery.reset();
    this.capacitor.reset();
    this.currentAmplitudeProperty.reset();
    this.circuitConnectionProperty.reset();
    this.disconnectedPlateChargeProperty.reset();
    this.previousTotalCharge = 0;
  }

  /**
   * Updates current amplitude and current indicators.
   * @public
   *
   * @param {number} dt
   */
  step( dt ) {
    assert && assert( typeof dt === 'number' );

    this.updateCurrentAmplitude( dt );
  }

  /**
   * Update the Current amplitude. Current amplitude is proportional to dQ/dt,
   * the change in charge (Q_total) over time.
   * @public
   *
   * @param {number} dt
   */
  updateCurrentAmplitude( dt ) {
    assert && assert( typeof dt === 'number' );

    const Q = this.getTotalCharge();
    if ( this.previousTotalCharge !== -1 ) {
      const dQ = Q - this.previousTotalCharge;
      this.currentAmplitudeProperty.set( dQ / dt );
    }
    this.previousTotalCharge = Q;
  }

  /**
   * Since the default is a connected battery, the total voltage is the battery voltage.
   * @public
   *
   * @returns {number}
   */
  getTotalVoltage() {
    return this.battery.voltageProperty.value;
  }

  /**
   * Gets the total charge in the circuit.
   * Design doc symbol: Q_total
   * @public
   *
   * @returns {number}
   */
  getTotalCharge() {
    return this.capacitor.plateChargeProperty.value;
  }

  /**
   * Get the voltage across the capacitor plates.
   * @public
   *
   * @returns {number}
   */
  getCapacitorPlateVoltage() {
    return this.capacitor.plateVoltageProperty.value;
  }

  /**
   * Check if shape intersects any wire in the array, stopping to return if true.
   * @public
   *
   * @param {Shape} shape
   * @param {CircuitPosition} position
   * @returns {boolean}
   */
  shapeTouchesWireGroup( shape, position ) {
    assert && assert( shape instanceof Shape );
    assert && assert( _.includes( CircuitPosition.VALUES, position ) );

    assert && assert( this.wireGroup.hasOwnProperty( position ), `Invalid position: ${position}` );

    const wires = this.wireGroup[ position ];

    return _.some( wires, wire => wire.contacts( shape ) );
  }

  /**
   * Returns true if the switch is open or in transit
   * @public
   *
   * @returns {boolean}
   */
  isOpen() {
    const connection = this.circuitConnectionProperty.value;
    return connection === CircuitState.OPEN_CIRCUIT || connection === CircuitState.SWITCH_IN_TRANSIT;
  }

  /**
   * Returns the probe target (what part of the circuit the probe is over/touching) given a probe shape.
   * @public
   *
   * @param {Shape} probe
   * @returns {ProbeTarget}
   */
  getProbeTarget( probe ) {
    if ( this.lightBulb ) {
      if ( this.lightBulb.intersectsBulbTopBase( probe ) ) {
        return ProbeTarget.LIGHT_BULB_TOP;
      }
      if ( this.lightBulb.intersectsBulbBottomBase( probe ) ) {
        return ProbeTarget.LIGHT_BULB_BOTTOM;
      }
    }
    if ( this.battery.contacts( probe ) ) {
      return ProbeTarget.BATTERY_TOP_TERMINAL;
    }

    if ( this.capacitor.topCircuitSwitch.contacts( probe ) ) {
      return ProbeTarget.SWITCH_CONNECTION_TOP;
    }
    if ( this.capacitor.bottomCircuitSwitch.contacts( probe ) ) {
      return ProbeTarget.SWITCH_CONNECTION_BOTTOM;
    }

    // NOTE: Capacitor checks include the switch connections, so those need to be checked first
    if ( this.capacitor.contacts( probe, CircuitPosition.CAPACITOR_TOP ) ) {
      return ProbeTarget.CAPACITOR_TOP;
    }
    if ( this.capacitor.contacts( probe, CircuitPosition.CAPACITOR_BOTTOM ) ) {
      return ProbeTarget.CAPACITOR_BOTTOM;
    }

    // Check circuit switch wires first here, since they are included as part of CircuitPosition.CAPACITOR_X
    if ( this.capacitor.topCircuitSwitch.switchWire.contacts( probe ) ) {
      return ProbeTarget.WIRE_SWITCH_TOP;
    }
    if ( this.capacitor.bottomCircuitSwitch.switchWire.contacts( probe ) ) {
      return ProbeTarget.WIRE_SWITCH_BOTTOM;
    }

    // Check for wire intersections last
    if ( this.shapeTouchesWireGroup( probe, CircuitPosition.CAPACITOR_TOP ) ) {
      return ProbeTarget.WIRE_CAPACITOR_TOP;
    }
    if ( this.shapeTouchesWireGroup( probe, CircuitPosition.CAPACITOR_BOTTOM ) ) {
      return ProbeTarget.WIRE_CAPACITOR_BOTTOM;
    }
    if ( this.shapeTouchesWireGroup( probe, CircuitPosition.BATTERY_TOP ) ) {
      return ProbeTarget.WIRE_BATTERY_TOP;
    }
    if ( this.shapeTouchesWireGroup( probe, CircuitPosition.BATTERY_BOTTOM ) ) {
      return ProbeTarget.WIRE_BATTERY_BOTTOM;
    }
    if ( this.shapeTouchesWireGroup( probe, CircuitPosition.LIGHT_BULB_TOP ) ) {
      return ProbeTarget.WIRE_LIGHT_BULB_TOP;
    }
    if ( this.shapeTouchesWireGroup( probe, CircuitPosition.LIGHT_BULB_BOTTOM ) ) {
      return ProbeTarget.WIRE_LIGHT_BULB_BOTTOM;
    }

    return ProbeTarget.NONE;
  }
}

capacitorLabBasics.register( 'ParallelCircuit', ParallelCircuit );
export default ParallelCircuit;
