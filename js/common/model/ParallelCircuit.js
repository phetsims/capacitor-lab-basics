// Copyright 2015-2018, University of Colorado Boulder

/**
 * Model of a circuit with a battery, switches, and possibly a light bulb.
 * The layout of the circuit assumes that the battery is on the left
 * hand side of the circuit, while the circuit components are to the right.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var Battery = require( 'CAPACITOR_LAB_BASICS/common/model/Battery' );
  var BatteryToSwitchWire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/BatteryToSwitchWire' );
  var Capacitor = require( 'CAPACITOR_LAB_BASICS/common/model/Capacitor' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CapacitorToSwitchWire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/CapacitorToSwitchWire' );
  var CircuitLocation = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitLocation' );
  var CircuitState = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitState' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LightBulbToSwitchWire = require( 'CAPACITOR_LAB_BASICS/common/model/wire/LightBulbToSwitchWire' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var ProbeTarget = require( 'CAPACITOR_LAB_BASICS/common/model/ProbeTarget' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Shape = require( 'KITE/Shape' );
  var StringIO = require( 'TANDEM/types/StringIO' );

  /**
   * @constructor
   *
   * @param {CircuitConfig} config
   * @param {Tandem} tandem
   */
  function ParallelCircuit( config, tandem ) {

    var self = this;

    // @public {NumberProperty} - Signed current through circuit. Used to update arrows
    this.currentAmplitudeProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'currentAmplitudeProperty' ),
      units: 'amperes',
      phetioDocumentation: 'Beware that the current is calculated in the model time step, so if dQ is zero for a step the current could transiently appear as zero.',
      phetioReadOnly: true
    } );

    // @public {Property.<CircuitState>} - Property tracking the state of the switch
    this.circuitConnectionProperty = new Property( CircuitState.BATTERY_CONNECTED, {
      tandem: tandem.createTandem( 'circuitConnectionProperty' ),
      phetioType: PropertyIO( StringIO ),
      validValues: CircuitState.VALUES
    } );

    // @public {NumberProperty} - Property tracking the signed charge value on the upper plate
    this.disconnectedPlateChargeProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'disconnectedPlateChargeProperty' ),
      units: 'coulombs',
      phetioReadOnly: true
    } );

    // @protected {number}
    this.previousTotalCharge = 0;

    // @protected {number} - Overwritten in subtypes
    this.maxPlateCharge = Infinity;
    this.maxEffectiveEField = Infinity;

    // @public {Battery}
    this.battery = new Battery(
      CLBConstants.BATTERY_LOCATION,
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
    if ( this.lightBulb ) {
      this.wires.push( LightBulbToSwitchWire.createLightBulbToSwitchWireTop(
        config,
        this.lightBulb,
        this.capacitor.topCircuitSwitch
      ) );
      this.wires.push( LightBulbToSwitchWire.createLightBulbToSwitchWireBottom(
        config,
        this.lightBulb,
        this.capacitor.bottomCircuitSwitch
      ) );
    }

    /**
     * Return the subset of wires connected to the provided location
     *
     * @param {CircuitLocation} location
     * @returns {Wire[]}
     */
    function selectWires( location ) {
      return self.wires.filter( function( wire ) {
        return wire.connectionPoint === location;
      } );
    }

    // Create wire groups that are electrically connected to various parts of the circuit.
    // These arrays are hashed to a location key for efficient connectivity checking.
    // @protected {Object} - Maps {CircuitLocation} => {Array.<Wire>}
    this.wireGroup = {};
    var locations = [ CircuitLocation.BATTERY_TOP, CircuitLocation.BATTERY_BOTTOM, CircuitLocation.LIGHT_BULB_TOP, CircuitLocation.LIGHT_BULB_BOTTOM, CircuitLocation.CAPACITOR_TOP, CircuitLocation.CAPACITOR_BOTTOM ];
    locations.forEach( function( location ) {
      self.wireGroup[ location ] = selectWires( location );
    } );

    // @public {Array.<Wire>}
    this.topWires = this.wireGroup[ CircuitLocation.BATTERY_TOP ]
      .concat( this.wireGroup[ CircuitLocation.LIGHT_BULB_TOP ] )
      .concat( this.wireGroup[ CircuitLocation.CAPACITOR_TOP ] );

    // @public {Array.<Wire>}
    this.bottomWires = this.wireGroup[ CircuitLocation.BATTERY_BOTTOM ]
      .concat( this.wireGroup[ CircuitLocation.LIGHT_BULB_BOTTOM ] )
      .concat( this.wireGroup[ CircuitLocation.CAPACITOR_BOTTOM ] );

    // Add the switch wires to the capacitor wires arrays
    this.circuitSwitches.forEach( function( circuitSwitch ) {
      var wire = circuitSwitch.switchWire;
      if ( wire.connectionPoint === CircuitLocation.CIRCUIT_SWITCH_TOP ) {
        self.wireGroup[ CircuitLocation.CAPACITOR_TOP ].push( wire );
      }
      if ( wire.connectionPoint === CircuitLocation.CIRCUIT_SWITCH_BOTTOM ) {
        self.wireGroup[ CircuitLocation.CAPACITOR_BOTTOM ].push( wire );
      }
    } );

    // Make sure all is well with circuit components.
    // Circuit must include at least one circuit component and two wires.
    assert && assert( this.wires.length >= 2, 'Valid circuits must include at least two wires' );

    // Update start and end points of each wire segment
    function updateSegments() {
      for ( var i = 0; i < self.wires.length; i++ ) {
        self.wires[ i ].update();
      }
    }

    // Update all segments, disconnected plate charge, and plate voltages when the connection property changes
    this.circuitConnectionProperty.lazyLink( function( circuitConnection ) {

      // When disconnecting the battery, set the disconnected plate charge to whatever the total plate charge was with
      // the battery connected.  Need to do this before changing the plate voltages property.
      if ( circuitConnection !== CircuitState.BATTERY_CONNECTED ) {
        self.disconnectedPlateChargeProperty.set( self.getTotalCharge() );
      }
      self.updatePlateVoltages();
      updateSegments();
    } );

    // Update all segments and the plate voltages when capacitor plate geometry changes.
    this.capacitor.plateSeparationProperty.lazyLink( function() {
      updateSegments();
      self.updatePlateVoltages();
    } );

    // update the plate voltages when the capacitor plate size changes.
    this.capacitor.plateSizeProperty.lazyLink( function() {
      self.updatePlateVoltages();
    } );

    // update all segments when battery polarity changes.
    this.battery.polarityProperty.link( function( polarity ) {
      updateSegments();
    } );

    // when the disconnected plate charge property changes, set the disconnected plate voltage.
    this.disconnectedPlateChargeProperty.lazyLink( function() {
      if ( self.circuitConnectionProperty.value === CircuitState.OPEN_CIRCUIT ) {
        self.updatePlateVoltages();
      }
    } );

    /*
     * When the battery voltage changes and the battery is connected, update the plate voltages.
     * Do NOT automatically do this when adding the observer because
     * updatePlateVoltages is implemented by the subclass, and all
     * necessary fields in the subclass may not be initialized.
     */
    this.battery.voltageProperty.lazyLink( function() {
      if ( self.circuitConnectionProperty.value === CircuitState.BATTERY_CONNECTED ) {
        self.updatePlateVoltages();
      }
    } );
  }

  capacitorLabBasics.register( 'ParallelCircuit', ParallelCircuit );

  inherit( Object, ParallelCircuit, {

    // @public
    reset: function() {
      this.battery.reset();
      this.capacitor.reset();
      this.currentAmplitudeProperty.reset();
      this.circuitConnectionProperty.reset();
      this.disconnectedPlateChargeProperty.reset();
      this.previousTotalCharge = 0;
    },

    /**
     * Updates current amplitude and current indicators.
     * @public
     *
     * @param {number} dt
     */
    step: function( dt ) {
      assert && assert( typeof dt === 'number' );

      this.updateCurrentAmplitude( dt );
    },

    /**
     * Update the Current amplitude. Current amplitude is proportional to dQ/dt,
     * the change in charge (Q_total) over time.
     * @public
     *
     * @param {number} dt
     */
    updateCurrentAmplitude: function( dt ) {
      assert && assert( typeof dt === 'number' );

      var Q = this.getTotalCharge();
      if ( this.previousTotalCharge !== -1 ) {
        var dQ = Q - this.previousTotalCharge;
        this.currentAmplitudeProperty.set( dQ / dt );
      }
      this.previousTotalCharge = Q;
    },

    /**
     * Since the default is a connected battery, the total voltage is the battery voltage.
     * @public
     *
     * @returns {number}
     */
    getTotalVoltage: function() {
      return this.battery.voltageProperty.value;
    },

    /**
     * Gets the total charge in the circuit.
     * Design doc symbol: Q_total
     * @public
     *
     * @returns {number}
     */
    getTotalCharge: function() {
      return this.capacitor.plateChargeProperty.value;
    },

    /**
     * Get the voltage across the capacitor plates.
     * @public
     *
     * @returns {number}
     */
    getCapacitorPlateVoltage: function() {
      return this.capacitor.plateVoltageProperty.value;
    },

    /**
     * Check if shape intersects any wire in the array, stopping to return if true.
     * @public
     *
     * @param {Shape} shape
     * @param {CircuitLocation} location
     * @returns {boolean}
     */
    shapeTouchesWireGroup: function( shape, location ) {
      assert && assert( shape instanceof Shape );
      assert && assert( _.includes( CircuitLocation.VALUES, location ) );

      assert && assert( this.wireGroup.hasOwnProperty( location ), 'Invalid location: ' + location );

      var wires = this.wireGroup[ location ];

      return _.some( wires, function( wire ) {
        return wire.contacts( shape );
      } );
    },

    /**
     * Returns true if the switch is open or in transit
     * @public
     *
     * @returns {boolean}
     */
    isOpen: function() {
      var connection = this.circuitConnectionProperty.value;
      return connection === CircuitState.OPEN_CIRCUIT || connection === CircuitState.SWITCH_IN_TRANSIT;
    },

    /**
     * Returns the probe target (what part of the circuit the probe is over/touching) given a probe shape.
     * @public
     *
     * @param {Shape} probe
     * @returns {ProbeTarget}
     */
    getProbeTarget: function( probe ) {
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
      if ( this.capacitor.contacts( probe, CircuitLocation.CAPACITOR_TOP ) ) {
        return ProbeTarget.CAPACITOR_TOP;
      }
      if ( this.capacitor.contacts( probe, CircuitLocation.CAPACITOR_BOTTOM ) ) {
        return ProbeTarget.CAPACITOR_BOTTOM;
      }

      // Check circuit switch wires first here, since they are included as part of CircuitLocation.CAPACITOR_X
      if ( this.capacitor.topCircuitSwitch.switchWire.contacts( probe ) ) {
        return ProbeTarget.WIRE_SWITCH_TOP;
      }
      if ( this.capacitor.bottomCircuitSwitch.switchWire.contacts( probe ) ) {
        return ProbeTarget.WIRE_SWITCH_BOTTOM;
      }

      // Check for wire intersections last
      if ( this.shapeTouchesWireGroup( probe, CircuitLocation.CAPACITOR_TOP ) ) {
        return ProbeTarget.WIRE_CAPACITOR_TOP;
      }
      if ( this.shapeTouchesWireGroup( probe, CircuitLocation.CAPACITOR_BOTTOM ) ) {
        return ProbeTarget.WIRE_CAPACITOR_BOTTOM;
      }
      if ( this.shapeTouchesWireGroup( probe, CircuitLocation.BATTERY_TOP ) ) {
        return ProbeTarget.WIRE_BATTERY_TOP;
      }
      if ( this.shapeTouchesWireGroup( probe, CircuitLocation.BATTERY_BOTTOM ) ) {
        return ProbeTarget.WIRE_BATTERY_BOTTOM;
      }
      if ( this.shapeTouchesWireGroup( probe, CircuitLocation.LIGHT_BULB_TOP ) ) {
        return ProbeTarget.WIRE_LIGHT_BULB_TOP;
      }
      if ( this.shapeTouchesWireGroup( probe, CircuitLocation.LIGHT_BULB_BOTTOM ) ) {
        return ProbeTarget.WIRE_LIGHT_BULB_BOTTOM;
      }

      return ProbeTarget.NONE;
    }
  } );

  return ParallelCircuit;
} );
