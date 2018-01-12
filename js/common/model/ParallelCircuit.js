// Copyright 2015-2017, University of Colorado Boulder

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
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Shape = require( 'KITE/Shape' );

  // phet-io modules
  var StringIO = require( 'ifphetio!PHET_IO/types/StringIO' );

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
      phetioInstanceDocumentation: 'Beware that the current is calculated in the model time step, so if dQ is zero for a step the current could transiently appear as zero.',
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
        this.capacitor.topCircuitSwitch,
        tandem.createTandem( 'batteryToSwitchWireTop' )
      ),
      BatteryToSwitchWire.createBatteryToSwitchWireBottom(
        config,
        this.battery,
        this.capacitor.bottomCircuitSwitch,
        tandem.createTandem( 'batteryToSwitchWireBottom' )
      ),
      CapacitorToSwitchWire.createCapacitorToSwitchWireTop(
        config,
        this.capacitor,
        this.capacitor.topCircuitSwitch,
        tandem
      ),
      CapacitorToSwitchWire.createCapacitorToSwitchWireBottom(
        config,
        this.capacitor,
        this.capacitor.bottomCircuitSwitch,
        tandem
      )
    ];

    // If there is a light bulb in the circuit, wire it up
    if ( this.lightBulb ) {
      this.wires.push( LightBulbToSwitchWire.createLightBulbToSwitchWireTop(
        config,
        this.lightBulb,
        this.capacitor.topCircuitSwitch,
        tandem
      ) );
      this.wires.push( LightBulbToSwitchWire.createLightBulbToSwitchWireBottom(
        config,
        this.lightBulb,
        this.capacitor.bottomCircuitSwitch,
        tandem
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
     * Gets the voltage between 2 Shapes. The shapes are in world coordinates.
     * Returns null if the 2 Shapes are not both connected to the circuit.
     * @public
     *
     * @param {Shape} positiveShape
     * @param {Shape} negativeShape
     * return {number}
     */
    getVoltageBetween: function( positiveShape, negativeShape ) {
      assert && assert( positiveShape instanceof Shape );
      assert && assert( negativeShape instanceof Shape );

      var vPlus = this.getVoltageAt( positiveShape );
      var vMinus = this.getVoltageAt( negativeShape );

      return ( vPlus === null || vMinus === null ) ? null : ( vPlus - vMinus );
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
        return shape.bounds.intersectsBounds( wire.shapeProperty.value.bounds ) &&
               shape.shapeIntersection( wire.shapeProperty.value ).getNonoverlappingArea() > 0;
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
     * Determine if the probe tip is electrically connected to a circuit component at location.
     * @public
     *
     * @param {Shape} probe
     * @param {CircuitLocation} location - battery top or bottom
     * @param {boolean} isolated - if true, check for contact with a component that is disconnected from the circuit
     * @returns {boolean}
     */
    probeContactsComponent: function( probe, location, isolated ) {
      assert && assert( probe instanceof Shape );
      assert && assert( _.includes( CircuitLocation.VALUES, location ) );
      assert && assert( typeof isolated === 'boolean' );

      // Battery
      if ( location === CircuitLocation.BATTERY_TOP || location === CircuitLocation.BATTERY_BOTTOM ) {
        if ( isolated ) {
          if ( this.circuitConnectionProperty.value === CircuitState.BATTERY_CONNECTED ) {
            return false;
          }
          return ( this.battery.contacts( probe ) || this.shapeTouchesWireGroup( probe, location ) );
        }
        else {
          var capacitorSide = location === CircuitLocation.BATTERY_TOP ?
                              CircuitLocation.CAPACITOR_TOP : CircuitLocation.CAPACITOR_BOTTOM;
          return (
            this.shapeTouchesWireGroup( probe, location ) ||
            this.battery.contacts( probe ) || (
              this.circuitConnectionProperty.value === CircuitState.BATTERY_CONNECTED && (
              this.capacitor.contacts( probe, capacitorSide ) ||
              this.shapeTouchesWireGroup( probe, capacitorSide ) ) ) );
        }
      }

      // Capacitor
      else if ( location === CircuitLocation.CAPACITOR_TOP || location === CircuitLocation.CAPACITOR_BOTTOM ) {
        if ( isolated ) {
          if ( !this.isOpen() ) {
            return false;
          }
          return ( this.shapeTouchesWireGroup( probe, location ) || this.capacitor.contacts( probe, location ) );
        }
      }

      // Light bulb
      else if ( location === CircuitLocation.LIGHT_BULB_TOP || location === CircuitLocation.LIGHT_BULB_BOTTOM ) {
        if ( isolated ) {
          return this.disconnectedLightBulbContacts( probe, location );
        }
        return this.connectedLightBulbContacts( probe, location );
      }

      // Fall-through error case
      else {
        assert && assert( false, 'Location is not on Battery, Capacitor or LightBulb: ' + location );
      }
    },

    /**
     * Gets the voltage at a probe location, with respect to ground. Returns null if the Shape is not connected to the
     * circuit.
     * @override
     * @public
     *
     * @param {Shape} probe - voltmeter probe shape
     * @returns {number|null} voltage
     */
    getVoltageAt: function( probe ) {
      assert && assert( probe instanceof Shape );

      var voltage = null;

      var probeBatteryTop = this.probeContactsComponent( probe, CircuitLocation.BATTERY_TOP, false );
      var probeBatteryBottom = this.probeContactsComponent( probe, CircuitLocation.BATTERY_BOTTOM, false );
      var probeCapacitorTop = this.probeContactsComponent( probe, CircuitLocation.CAPACITOR_TOP, true );
      var probeCapacitorBottom = this.probeContactsComponent( probe, CircuitLocation.CAPACITOR_BOTTOM, true );
      var probeLightBulb = this.shapeTouchesWireGroup( probe, CircuitLocation.LIGHT_BULB_TOP ) ||
                           this.shapeTouchesWireGroup( probe, CircuitLocation.LIGHT_BULB_BOTTOM );

      // Closed circuit between battery and capacitor
      if ( this.circuitConnectionProperty.value === CircuitState.BATTERY_CONNECTED ) {
        if ( probeBatteryTop ) {
          voltage = this.getTotalVoltage();
        }
        else if ( probeBatteryBottom ) {
          voltage = 0;
        }
        else if ( probeLightBulb ) {
          voltage = 0;
        }
      }

      // Closed circuit between light bulb and capacitor
      else if ( this.circuitConnectionProperty.value === CircuitState.LIGHT_BULB_CONNECTED ) {
        if ( this.connectedLightBulbContacts( probe, CircuitLocation.LIGHT_BULB_TOP ) ) {
          voltage = this.getCapacitorPlateVoltage();
        }
        else if ( this.connectedLightBulbContacts( probe, CircuitLocation.LIGHT_BULB_BOTTOM ) ) {
          voltage = 0;
        }
        else if ( probeBatteryTop ) {
          voltage = this.getTotalVoltage();
        }
        else if ( probeBatteryBottom ) {
          voltage = 0;
        }
      }

      // Open Circuit
      else if ( this.circuitConnectionProperty.value === CircuitState.OPEN_CIRCUIT ) {
        if ( probeCapacitorTop ) {
          voltage = this.getCapacitorPlateVoltage();
        }
        else if ( probeCapacitorBottom ) {
          voltage = 0;
        }
        else if ( probeBatteryTop ) {
          voltage = this.getTotalVoltage();
        }
        else if ( probeBatteryBottom ) {
          voltage = 0;
        }
        else if ( probeLightBulb ) {
          voltage = 0;
        }
      }

      // On switch drag, provide a voltage readout if probes are connected to the battery
      else if ( this.circuitConnectionProperty.value === CircuitState.SWITCH_IN_TRANSIT ) {
        if ( probeBatteryTop ) {
          voltage = this.getTotalVoltage();
        }
        else if ( probeBatteryBottom ) {
          voltage = 0;
        }
        else if ( probeCapacitorTop ) {
          voltage = this.getCapacitorPlateVoltage();
        }
        else if ( probeCapacitorBottom ) {
          voltage = 0;
        }
      }

      // Error case
      else {
        assert && assert( false,
          'Unsupported circuit connection property value: ' + this.circuitConnectionProperty.get() );
      }

      return voltage;
    }
  } );

  return ParallelCircuit;
} );