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
  var NumberProperty = require( 'AXON/NumberProperty' );
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

    /**
     * Signed current through circuit. Used to update arrows
     *
     * @type {NumberProperty}
     * @public
     */
    this.currentAmplitudeProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'currentAmplitudeProperty' ),
      phetioValueType: TNumber( {
        units: 'amperes'
      } ),
      documentation: 'currentAmplitudeProperty is updated by the model and should not be set by users'
    } );

    /**
     * Property tracking the state of the switch
     *
     * @type {Property.<CircuitConnectionEnum>}
     * @public
     */
    this.circuitConnectionProperty = new Property( CircuitConnectionEnum.BATTERY_CONNECTED, {
      tandem: tandem.createTandem( 'circuitConnectionProperty' ),
      phetioValueType: TString
    } );

    /**
     * Property tracking the signed charge value on the upper plate
     *
     * @type {NumberProperty}
     * @public
     */
    this.disconnectedPlateChargeProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'disconnectedPlateChargeProperty' ),
      phetioValueType: TNumber( {
        units: 'coulombs',
        range: new Range( -CLBConstants.PLATE_CHARGE_METER_MAX_VALUE, CLBConstants.PLATE_CHARGE_METER_MAX_VALUE )
      } )
    } );

    var self = this;

    // Utility variable for current calculation
    // @protected
    this.previousTotalCharge = 0;

    // Overwrite in concrete instances
    // @protected
    this.maxPlateCharge = Infinity;
    this.maxEffectiveEField = Infinity;

    // create basic circuit components
    // @public
    this.battery = new Battery( config.batteryLocation, CLBConstants.BATTERY_VOLTAGE_RANGE.defaultValue,
      config.modelViewTransform, tandem.createTandem( 'battery' ) );

    //REVIEW: documentation - Type important here!
    //REVIEW: Why does a callback need to be passed? It would be ideal to create these in the subtype.
    this.circuitComponents = createCircuitComponents( config, this.circuitConnectionProperty, tandem );

    // capture the circuit components into individual arrays.  Note that using slice assumes order of capacitors and
    // then lightbulbs. If new order is important, new method is necessary.
    // @public
    //REVIEW: type documentation is important here.
    //REVIEW: Information about order of components is needed, OR a better method that doesn't rely on that should be
    //        used.
    //REVIEW: number of capacitors is always 1, presumably factor this out so that circuits just have one.
    this.capacitors = this.circuitComponents.slice( 0, 1 );
    this.lightBulbs = this.circuitComponents.slice( 1, config.numberOfLightBulbs + 1 );

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
    //REVIEW: Why does a callback need to be passed? It would be ideal to create these in the subtype.
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
        self.disconnectedPlateChargeProperty.set( self.getTotalCharge() );
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
      if ( self.circuitConnectionProperty.value === CircuitConnectionEnum.OPEN_CIRCUIT ) {
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
      if ( self.circuitConnectionProperty.value === CircuitConnectionEnum.BATTERY_CONNECTED ) {
        self.updatePlateVoltages();
      }
    } );

  }

  capacitorLabBasics.register( 'AbstractCircuit', AbstractCircuit );

  return inherit( Object, AbstractCircuit, {

    // @override
    // @public
    reset: function() {
      this.battery.reset();
      this.capacitors.forEach( function( capacitor ) {
        capacitor.reset();
      } );
      this.currentAmplitudeProperty.reset();
      this.circuitConnectionProperty.reset();
      this.disconnectedPlateChargeProperty.reset();
      this.previousTotalCharge = 0;
    },

    /**
     * Gets the wires connected to the top of circuit components.
     * @public
     *
     * @returns {Wire[]} topWires
     */
    getTopWires: function() {
      return this.getTopBatteryWires()
        .concat( this.getTopLightBulbWires() )
        .concat( this.getTopCapacitorWires() );
    },

    /**
     * Get all top wires that are connected to the battery.
     * REVIEW: visibility doc
     * REVIEW: Once the circuit is being constructed, the wires won't change. Compute this on startup, so usages can
     *         get circuit.topBatteryWires
     */
    getTopBatteryWires: function() {
      return this.wires.filter( function( wire ) {
        return wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.BATTERY_TOP;
      } );
    },

    /**
     * Get all top wires that are connected to the battery.
     * REVIEW: visibility doc
     * REVIEW: Once the circuit is being constructed, the wires won't change. Compute this on startup, so usages can
     *         get circuit.bottomBatteryWires
     */
    getBottomBatteryWires: function() {
      return this.wires.filter( function( wire ) {
        return wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.BATTERY_BOTTOM;
      } );
    },

    /**
     * Get all top wires that are connected to the light bulb.
     * REVIEW: visibility doc
     * REVIEW: Once the circuit is being constructed, the wires won't change. Compute this on startup, so usages can
     *         get circuit.topLightBulbWires
     */
    getTopLightBulbWires: function() {
      return this.wires.filter( function( wire ) {
        return wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.LIGHT_BULB_TOP;
      } );
    },

    /**
     * Get all bottom wires that are connected to the light bulb.
     * REVIEW: visibility doc
     * REVIEW: Once the circuit is being constructed, the wires won't change. Compute this on startup, so usages can
     *         get circuit.bottomLightBulbWires
     */
    getBottomLightBulbWires: function() {
      return this.wires.filter( function( wire ) {
        return wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.LIGHT_BULB_BOTTOM;
      } );
    },

    /**
     * Get all the top wires that connect the circuit switch.
     * REVIEW: visibility doc
     * REVIEW: Once the circuit is being constructed, the switches won't change. Compute on startup, so usages can get
     *         circuit.topSwitchWires
     * REVIEW: Doc return type
     */
    getTopSwitchWires: function() {
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
      return this.wires.filter( function( wire ) {
        return wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.CAPACITOR_TOP;
      } );
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
      return this.wires.filter( function( wire ) {
        return wire.connectionPoint === CLBConstants.WIRE_CONNECTIONS.CAPACITOR_BOTTOM;
      } );
    },

    /**
     * Gets the wire connected to the battery's bottom terminal.
     * REVIEW: visibility doc
     *
     * @returns {Wire[]} bottomWires
     */
    getBottomWires: function() {
      return this.getBottomBatteryWires()
        .concat( this.getBottomLightBulbWires() )
        .concat( this.getBottomCapacitorWires() );
    }
  } );
} );
