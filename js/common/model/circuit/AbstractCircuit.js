// Copyright 2015, University of Colorado Boulder

/**
 * Base model for all circuits.
 *
 * REVIEW: There is only one direct subtype: ParallelCircuit. Is future work planned to use this, or should they be
 *         collapsed together?
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var Battery = require( 'CAPACITOR_LAB_BASICS/common/model/Battery' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var Range = require( 'DOT/Range' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );
  var TString = require( 'ifphetio!PHET_IO/types/TString' );

  /**
   * Constructor for the AbstractCircuit.
   *
   * @param {CircuitConfig} config circuit configuration values
   * @param {function} createCircuitComponents   function for creating cirucit components
   * @param {function} createWires function for creating wires
   * @param {function} createCircuitSwitches function for creating wires
   * @param {Tandem} tandem
   */
  function AbstractCircuit( config, createCircuitComponents, createWires, tandem ) {
    //REVIEW: documentation
    this.currentAmplitudeProperty = new Property( 0, {
      tandem: tandem.createTandem( 'currentAmplitudeProperty' ),
      phetioValueType: TNumber( {
        units: 'amperes'
      } ),
      documentation: 'currentAmplitudeProperty is updated by the model and should not be set by users'
    } );

    //REVIEW: documentation
    //REVIEW: When doing this, doc it as Property.<CircuitConnectionEnum>, not Property.<String> (treated as its own type)
    this.circuitConnectionProperty = new Property( CircuitConnectionEnum.BATTERY_CONNECTED, {
      tandem: tandem.createTandem( 'circuitConnectionProperty' ),
      phetioValueType: TString
    } );

    //REVIEW: documentation
    this.disconnectedPlateChargeProperty = new Property( 0, {
      tandem: tandem.createTandem( 'disconnectedPlateChargeProperty' ),
      phetioValueType: TNumber( {
        units: 'coulombs',
        range: new Range( -CLBConstants.PLATE_CHARGE_METER_MAX_VALUE, CLBConstants.PLATE_CHARGE_METER_MAX_VALUE )
      } )
    } );

    var self = this;

    //REVIEW: Why is -1 special? Docs related to #130 would help
    //REVIEW: Not private, should be protected (usage in LightBulbCircuit)
    this.previousTotalCharge = -1; // no value, @private

    //REVIEW: documentation
    this.config = config;

    // Overwrite in concrete instances
    //REVIEW: mark as protected, or are they public?
    this.maxPlateCharge = Infinity;
    this.maxEffectiveEField = Infinity;

    // create basic circuit components
    // @public
    this.battery = new Battery( config.batteryLocation, CLBConstants.BATTERY_VOLTAGE_RANGE.defaultValue,
      config.modelViewTransform, tandem.createTandem( 'battery' ) );

    //REVIEW: documentation - Type important here!
    this.circuitComponents = createCircuitComponents( config, this.circuitConnectionProperty, tandem );

    // capture the circuit components into individual arrays.  Note that using slice assumes order of capacitors and
    // then lightbulbs. If new order is important, new method is necessary.
    // @public
    //REVIEW: type documentation is important here.
    //REVIEW: Information about order of components is needed, OR a better method that doesn't rely on that should be
    //        used.
    this.capacitors = this.circuitComponents.slice( 0, config.numberOfCapacitors );
    this.lightBulbs = this.circuitComponents.slice( config.numberOfCapacitors, config.numberOfLightBulbs + 1 );

    //REVIEW: type documentation would be helpful
    this.circuitSwitches = [];
    //REVIEW: to avoid 'self' reference, could do:
    // this.circuitSwitches = _.flatten( this.capacitors.map( function( capacitor ) {
    //   return [ capacitor.topCircuitSwitch, capacitor.bottomCircuitSwitch ];
    // } ) );
    this.capacitors.forEach( function( capacitor ) {
      self.circuitSwitches.push( capacitor.topCircuitSwitch );
      self.circuitSwitches.push( capacitor.bottomCircuitSwitch );
    } );

    //REVIEW: type documentation important here
    this.wires = createWires(
      config,
      this.battery,
      this.lightBulbs,
      this.capacitors,
      this.circuitSwitches,
      this.circuitConnectionProperty,
      tandem );

    //REVIEW: Recommend passing reason for assertion as the second parameter, e.g.:
    // assert && assert( this.wires.length >= 2, 'Valid circuits must include at least two wires' );
    // Make sure all is well with circuit components.  Circuit must include at least one circuit component and two wires.
    assert && assert( this.circuitComponents.length >= 1 );
    assert && assert( this.wires.length >= 2 );

    function updateSegments( circuitConnection ) {
      //REVIEW: circuitConnection is always self.circuitConnectionProperty.value
      // update start and end points of each wire segment
      self.wires.forEach( function( wire ) {
        //REVIEW: We are digging into Wire a lot here. wire.update() could do this?
        wire.segments.forEach( function( segment ) {
          // not all segments need to be updated
          //REVIEW: Any advantage of this over having a no-op update() on WireSegment itself?
          segment.update && segment.update();
        } );
      } );
    }

    // Whenever a circuit property changes, all segments are updated. This works, but is excessive.  If there are
    // performance issues, these links would be a great place to start.
    // udpate all segments, disconnected plate charge, and plate voltages when the connection property changes
    this.circuitConnectionProperty.lazyLink( function( circuitConnection ) {
      /*
       * When disconnecting the battery, set the disconnected plate charge to whatever the total plate charge was with
       * the battery connected.  Need to do this before changing the plate voltages property.
       */
      if ( circuitConnection !== CircuitConnectionEnum.BATTERY_CONNECTED ) {
        self.setDisconnectedPlateCharge( self.getTotalCharge() );
      }
      self.updatePlateVoltages();

      updateSegments( circuitConnection );
    } );

    // update all segments and the plate voltages when capacitor plate geometry changes.  Lazy link because there is
    // no guarantee that capacitors have been constructed.
    this.capacitors.forEach( function( capacitor ) {
      capacitor.plateSeparationProperty.lazyLink( function() {
        updateSegments( self.circuitConnectionProperty.value );
        self.updatePlateVoltages();
      } );
    } );

    // update the plate voltages when the capacitor plate size changes.  Lazy link because there is no guarantee that
    // capacitors have been constructed.
    this.capacitors.forEach( function( capacitor ) {
      capacitor.plateSizeProperty.lazyLink( function() {
        self.updatePlateVoltages();
      } );
    } );

    // update all segments when battery polarity changes.
    this.battery.polarityProperty.link( function( polarity ) {
      updateSegments( self.circuitConnectionProperty.value );
    } );

    // when the disconnected plate charge property changes, set the disconnected plate voltage.
    this.disconnectedPlateChargeProperty.lazyLink( function() {
      self.setDisconnectedPlateVoltage();
    } );

    /*
     * When the battery voltage changes and the battery is connected, update the plate voltages.
     * Do NOT automatically do this when adding the observer because
     * updatePlateVoltages is implemented by the subclass, and all
     * necessary fields in the subclass may not be initialized.
     */
    this.battery.voltageProperty.lazyLink( function() {
      if ( self.circuitConnectionProperty.value === CircuitConnectionEnum.BATTERY_CONNECTED ) {
        self.updatePlateVoltages();
      }
    } );

  }

  capacitorLabBasics.register( 'AbstractCircuit', AbstractCircuit );

  return inherit( Object, AbstractCircuit, {

    /**
     * Updates the plate voltages.
     * Subclasses must call this at the end of their constructor, see note in constructor.
     * REVIEW: visibility doc
     */
    updatePlateVoltages: function() {
      //REVIEW: Replace with throwing an error for an abstract method
      console.log( 'updatePlateVoltages should be implemented in descendant classes.' );
    },

    /**
     * Sets the plate voltages, but checks to make sure that th ebattery is disconnected from the circuit.
     * REVIEW: visibility doc
     */
    setDisconnectedPlateVoltage: function() {
      if ( this.circuitConnectionProperty.value === CircuitConnectionEnum.OPEN_CIRCUIT ) {
        this.updatePlateVoltages();
      }
    },

    /**
     * Sets the value used for plate charge when the battery is disconnected.
     * (design doc symbol: Q_total)
     * REVIEW: visibility doc
     *
     * @param {number} charge - in Coulombs
     */
    setDisconnectedPlateCharge: function( charge ) {
      if ( charge !== this.disconnectedPlateChargeProperty.value ) {
        this.disconnectedPlateChargeProperty.set( charge );
      }
    },

    //REVIEW: documentation, with @override
    reset: function() {
      this.battery.reset();
      this.capacitors.forEach( function( capacitor ) {
        capacitor.reset();
      } );
      this.currentAmplitudeProperty.reset();
      this.circuitConnectionProperty.reset();
      this.disconnectedPlateChargeProperty.reset();
    },

    /**
     * Step function for the AbstractCircuit.  Updates current amplitude and current indicators.
     * REVIEW: visibility doc
     *
     * @param {number} dt
     */
    step: function( dt ) {
      this.updateCurrentAmplitude( dt );
    },

    /**
     * Default implementation has a connected battery.
     * REVIEW: visibility doc
     *
     * In some other circuits, we'll override this and add a setter, so that the battery can be dynamically
     * connected and disconnected.
     */
    isBatteryConnected: function() {
      //REVIEW: I don't ever see this being used. Maybe documentation is out of date, and this is dead code?
      return true;
    },

    /**
     * Gets the wires connected to the top of circuit components.
     * REVIEW: visibility doc
     *
     * @returns {Wire[]} topWires
     */
    getTopWires: function() {
      /*
       * REVIEW:
       * simplification, which could be indented to multiple lines:
       * return this.getTopBatteryWires().concat( this.getTopLightBulbWires() ).concat( this.getTopCapacitorWires() );
       */
      var topBatteryWires = this.getTopBatteryWires();
      var topLightBulbWires = this.getTopLightBulbWires();
      var topCapacitorWires = this.getTopCapacitorWires();

      var topWires = [];
      topWires = topWires.concat( topBatteryWires );
      topWires = topWires.concat( topLightBulbWires );
      topWires = topWires.concat( topCapacitorWires );
      return topWires;
    },

    /**
     * Get all top wires that are connected to the battery.
     * REVIEW: visibility doc
     * REVIEW: Once the circuit is being constructed, the wires won't change. Compute this on startup, so usages can
     *         get circuit.topBatteryWires
     */
    getTopBatteryWires: function() {
      /*
       * REVIEW:
       * Would usually prefer the filter() function be used when possible.
       * return this.wires.filter( function( wire ) {
       *   return wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.BATTERY_TOP;
       * } );
       */
      var topBatteryWires = [];
      this.wires.forEach( function( wire ) {
        if ( wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.BATTERY_TOP ) {
          topBatteryWires.push( wire );
        }
      } );
      return topBatteryWires;
    },

    /**
     * Get all top wires that are connected to the battery.
     * REVIEW: visibility doc
     * REVIEW: Once the circuit is being constructed, the wires won't change. Compute this on startup, so usages can
     *         get circuit.bottomBatteryWires
     */
    getBottomBatteryWires: function() {
      //REVIEW: See recommended filter() usage above
      var bottomBatteryWires = [];
      this.wires.forEach( function( wire ) {
        if ( wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.BATTERY_BOTTOM ) {
          bottomBatteryWires.push( wire );
        }
      } );
      return bottomBatteryWires;
    },

    /**
     * Get all top wires that are connected to the light bulb.
     * REVIEW: visibility doc
     * REVIEW: Once the circuit is being constructed, the wires won't change. Compute this on startup, so usages can
     *         get circuit.topLightBulbWires
     */
    getTopLightBulbWires: function() {
      //REVIEW: See recommended filter() usage above
      var topLightBulbWires = [];
      this.wires.forEach( function( wire ) {
        if ( wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.LIGHT_BULB_TOP ) {
          topLightBulbWires.push( wire );
        }
      } );
      return topLightBulbWires;
    },

    /**
     * Get all bottom wires that are connected to the light bulb.
     * REVIEW: visibility doc
     * REVIEW: Once the circuit is being constructed, the wires won't change. Compute this on startup, so usages can
     *         get circuit.bottomLightBulbWires
     */
    getBottomLightBulbWires: function() {
      //REVIEW: See recommended filter() usage above
      var bottomLightBulbWires = [];
      this.wires.forEach( function( wire ) {
        if ( wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.LIGHT_BULB_BOTTOM ) {
          bottomLightBulbWires.push( wire );
        }
      } );
      return bottomLightBulbWires;
    },

    /**
     * Get all the top wires that connect the circuit switch.
     * REVIEW: visibility doc
     * REVIEW: Once the circuit is being constructed, the switches won't change. Compute on startup, so usages can get
     *         circuit.topSwitchWires
     * REVIEW: Doc return type
     */
    getTopSwitchWires: function() {
      //REVIEW: See recommended filter() usage above
      var topCircuitSwitchWires = [];
      this.circuitSwitches.forEach( function( circuitSwitch ) {
        var switchWire = circuitSwitch.switchWire;
        if ( switchWire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.CIRCUIT_SWITCH_TOP ) {
          topCircuitSwitchWires.push( switchWire );
        }
      } );
      return topCircuitSwitchWires;
    },

    /**
     * Get all the bottom wires that connect the circuit switch.
     * REVIEW: visibility doc
     * REVIEW: Once the circuit is being constructed, the wires won't change. Compute on startup, so usages can get
     *         circuit.bottomSwitchWires
     *
     * @returns {Wire[]}
     */
    getBottomSwitchWires: function() {
      //REVIEW: See recommended filter() usage above
      var bottomCircuitSwitchWires = [];
      this.circuitSwitches.forEach( function( circuitSwitch ) {
        var switchWire = circuitSwitch.switchWire;
        if ( switchWire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.CIRCUIT_SWITCH_BOTTOM ) {
          bottomCircuitSwitchWires.push( switchWire );
        }
      } );
      return bottomCircuitSwitchWires;
    },

    /**
     * Get all the top wires that are connected to the capacitor.
     * REVIEW: visibility doc
     * REVIEW: Once the circuit is being constructed, the wires won't change. Compute on startup, so usages can get
     *         circuit.topSwitchWires
     *
     * @returns {Wire[]}
     */
    getTopCapacitorWires: function() {
      //REVIEW: See recommended filter() usage above
      var topCapacitorWires = [];
      this.wires.forEach( function( wire ) {
        if ( wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.CAPACITOR_TOP ) {
          topCapacitorWires.push( wire );
        }
      } );
      return topCapacitorWires;
    },

    /**
     * Get all the bottom wires that are connected to the capacitor.
     * REVIEW: visibility doc
     * REVIEW: Once the circuit is being constructed, the wires won't change. Compute on startup, so usages can get
     *         circuit.topSwitchWires
     *
     * @returns {Wire[]}
     */
    getBottomCapacitorWires: function() {
      //REVIEW: See recommended filter() usage above
      var bottomCapacitorWires = [];
      this.wires.forEach( function( wire ) {
        if ( wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.CAPACITOR_BOTTOM ) {
          bottomCapacitorWires.push( wire );
        }
      } );
      return bottomCapacitorWires;
    },

    /**
     * Gets the wire connected to the battery's bottom terminal.
     * REVIEW: visibility doc
     *
     * @returns {Wire[]} bottomWires
     */
    getBottomWires: function() {
      //REVIEW: This can be simplified to like 1-3 lines.
      var bottomBatteryWires = this.getBottomBatteryWires();
      var bottomLightBulbWires = this.getBottomLightBulbWires();
      var bottomCapacitorWires = this.getBottomCapacitorWires();

      var bottomWires = [];
      bottomWires = bottomWires.concat( bottomBatteryWires );
      bottomWires = bottomWires.concat( bottomLightBulbWires );
      bottomWires = bottomWires.concat( bottomCapacitorWires );

      return bottomWires;
    },

    /**
     * Get the total charge with Q_total = V_total * C_total
     * REVIEW: visibility doc
     *
     * @returns {number}
     */
    getTotalCharge: function() {
      return this.getTotalVoltage() * this.getTotalCapacitance();
    },

    /**
     * Since the default is a connected battery, the total voltage is the battery voltage.
     * REVIEW: visibility doc
     *
     * @returns {number}
     */
    getTotalVoltage: function() {
      return this.battery.voltageProperty.value;
    },

    /**
     * Gets the voltage between 2 Shapes. The shapes are in world coordinates.
     * Returns null if the 2 Shapes are not both connected to the circuit.
     * REVIEW: visibility doc
     *
     * @param {Shape} positiveShape
     * @param {Shape} negativeShape
     * return {number}
     */
    getVoltageBetween: function( positiveShape, negativeShape ) {
      var vPlus = this.getVoltageAt( positiveShape );
      var vMinus = this.getVoltageAt( negativeShape );

      return ( vPlus === null || vMinus === null ) ? null : vPlus - vMinus;
    },

    /**
     * Gets the voltage at a shape, with respect to ground. Returns null if the
     * Shape is not connected to the circuit.
     * REVIEW: visibility doc
     *
     * @param {Shape} shape
     * @returns {number}
     */
    getVoltageAt: function( shape ) {
      //REVIEW: throw an error instead, we shouldn't hit this (typical for abstract functions)
      console.log( 'getVoltageAt() should be implemented in descendant classes of AbstractCircuit' );
    },

    /**
     * Gets the energy stored in the circuit. (design doc symbol: U)
     * REVIEW: visibility doc
     *
     * @returns {number}
     */
    getStoredEnergy: function() {
      var C_total = this.getTotalCapacitance(); // F
      var V_total = this.getCapacitorPlateVoltage(); // V
      return 0.5 * C_total * V_total * V_total; // Joules (J)
    },

    /**
     * Gets the effective E-field at a specified location. Inside the plates, this is E_effective. Outside the plates,
     * it is zero.
     * REVIEW: visibility doc
     *
     * @param {Vector3} location
     * @returns {number} eField
     */
    getEffectiveEFieldAt: function( location ) {
      var eField = 0;
      this.capacitors.forEach( function( capacitor ) {
        if ( capacitor.isBetweenPlates( location ) ) {
          eField = capacitor.getEffectiveEField();
          //return; //break
          //REVIEW: If you use _.each, returning false will break out of the loop.
        }
      } );
      return eField;
    },

    /**
     * Field due to the plate, at a specific location. Between the plates, the field is either E_plate_dielectric or
     * E_plate_air, depending on whether the probe intersects the dielectric.  Outside the plates, the field is zero.
     * REVIEW: visibility doc
     *
     * Note that as of 5/29/2015 without Dielectrics, the only possible value is E_plate_air.
     *
     * @param {Vector3} location
     * @returns {number} eField
     */
    getPlatesDielectricEFieldAt: function( location ) {
      var eField = 0;
      //REVIEW: Consider summing without an intermediate variable:
      // return _.sumBy( this.capacitors, function( capacitor ) {
      //   return capacitor.isInsideAirBetweenPlates( location ) ? capacitor.getPlatesAirEField : 0;
      // } );
      this.capacitors.forEach( function( capacitor ) {
        if ( capacitor.isInsideAirBetweenPlates( location ) ) {
          eField = capacitor.getPlatesAirEField();
        }
      } );
      return eField;
    },

    /**
     * Update the Current amplitude. Current amplitude is proportional to dQ/dt, the change in charge (Q_total) over
     * time.
     * REVIEW: visibility doc
     *
     * @param {number} dt
     */
    updateCurrentAmplitude: function( dt ) {
      var Q = this.getTotalCharge();
      if ( this.previousTotalCharge !== -1 ) {
        var dQ = Q - this.previousTotalCharge;
        this.currentAmplitudeProperty.set( dQ / dt );
      }
      this.previousTotalCharge = Q;
    }
  } );
} );
