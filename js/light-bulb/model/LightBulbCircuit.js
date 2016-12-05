// Copyright 2015, University of Colorado Boulder

/**
 * Model for the "Light Bulb" circuit, which extends ParallelCircuit.  This circuit is composed of a battery, capacitor
 * and a light bulb.  The capacitor is connected to a switch so that it can be connected to either the light bulb OR
 * the battery, but not both at the same time.  The capacitor can also be entirely disconnected from the circuit. This
 * is illustrated in the following diagram:
 *
 * |-----|------|
 * |      /     |
 * |     |      |
 * B     C      Z
 * |     |      |
 * |      \     |
 * |-----|------|
 *
 * B = Battery
 * C = Capacitor, connected in parallel through switches
 * Z = Light Bulb
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ParallelCircuit = require( 'CAPACITOR_LAB_BASICS/common/model/circuit/ParallelCircuit' );
  var CircuitConnectionEnum = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitConnectionEnum' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // During exponential voltage drop, circuit voltage crosses this threshold,
  // below which we no longer call discharge() for efficiency.
  var MIN_VOLTAGE = 1e-3; // Volts. Minimum readable value on voltmeter.

  /**
   * Constructor for the Single Capacitor Circuit.
   *
   * @param {CircuitConfig} config
   * @param {Tandem} tandem
   * @constructor
   */
  function LightBulbCircuit( config, tandem ) {

    assert && assert( config.numberOfLightBulbs === 1,
      'LightBulbCircuit should have 1 LightBulb in CL:B. config.numberOfLightBulbs: ' + config.numberOfLightBulbs );

    ParallelCircuit.call( this, config, tandem );
    var self = this;

    // @public
    //REVIEW: Probably move this up to the common circuit, since every circuit has exactly one.
    this.capacitor = this.capacitors[ 0 ];
    //REVIEW: Probably can remove code that handles multiple light-bulbs?
    this.lightBulb = this.lightBulbs[ 0 ];

    // Make sure that the charges are correct when the battery is reconnected to the circuit.
    this.circuitConnectionProperty.link( function( circuitConnection ) {
      /*
       * When disconnecting the battery, set the disconnected plate charge to whatever the total plate charge was with
       * the battery connected.  Need to do this before changing the plate voltages property.
       */
      if ( circuitConnection !== CircuitConnectionEnum.BATTERY_CONNECTED ) {
        self.disconnectedPlateChargeProperty.set( self.getTotalCharge() );
      }
      self.updatePlateVoltages();

      // if light bulb connected, reset values for transient calculations
      if ( circuitConnection === CircuitConnectionEnum.LIGHT_BULB_CONNECTED ) {
        self.capacitor.transientTime = 0;
        self.capacitor.voltageAtSwitchClose = self.capacitor.platesVoltageProperty.value;
      }

    } );
  }

  capacitorLabBasics.register( 'LightBulbCircuit', LightBulbCircuit );

  return inherit( ParallelCircuit, LightBulbCircuit, {
    //REVIEW: doc
    step: function( dt ) {

      // Step through common circuit components
      ParallelCircuit.prototype.step.call( this, dt );

      // Discharge the capacitor when it is in parallel with the light bulb,
      // but don't allow the voltage to taper to zero forever.
      // This is both for performance, and for better timing control.
      // The current arrows should start fading when the voltmeter reading drops
      // below MIN_VOLTAGE.
      if ( this.circuitConnectionProperty.value === CircuitConnectionEnum.LIGHT_BULB_CONNECTED ) {
        if ( Math.abs( this.capacitor.platesVoltageProperty.value ) > MIN_VOLTAGE ) {
          this.capacitor.discharge( this.lightBulb.resistance, dt );
        }

        else {
          this.capacitor.platesVoltageProperty.set( 0 );
          this.currentAmplitudeProperty.set( 0 );
          this.previousTotalCharge = 0; // This fixes #130
        }
      }

    },

    /**
     * Updates the plate voltage, depending on whether the battery is connected. Null check required because superclass
     * calls this method from its constructor. Remember to call this method at the end of this class' constructor.
     * REVIEW: visibility doc
     */
    updatePlateVoltages: function() {
      if ( this.circuitConnectionProperty !== undefined ) {
        //REVIEW: First two logic cases are shared with CapacitanceCircuit. Can we factor this out?
        if ( this.circuitConnectionProperty.value === CircuitConnectionEnum.BATTERY_CONNECTED ) {
          // if the battery is connected, the voltage is equal to the battery voltage
          this.capacitor.platesVoltageProperty.value = this.battery.voltageProperty.value;
        }
        else if ( this.circuitConnectionProperty.value === CircuitConnectionEnum.OPEN_CIRCUIT ) {
          // otherwise, the voltage can be found by V=Q/C
          this.capacitor.platesVoltageProperty.value =
            this.disconnectedPlateChargeProperty.value / this.capacitor.getCapacitance();
        }
        else if ( this.circuitConnectionProperty.value === CircuitConnectionEnum.LIGHT_BULB_CONNECTED ) {
          // the capacitor is discharging, but plate geometry is changing at the same time so we need
          // to update the parameters of the transient discharge equation parameters
          this.capacitor.updateDischargeParameters();
        }
      }
    },

    //REVIEW: doc
    //REVIEW: same as CapacitanceCircuit's implementation, can we share code?
    getCapacitorPlateVoltage: function() {
      return this.capacitor.platesVoltageProperty.value;
    },

    /**
     * Gets the voltage at a shape, with respect to ground. Returns null if the
     * Shape is not connected to the circuit.
     * REVIEW: visibility doc
     *
     * @param {Shape} shape
     * @returns {number}
     * @override
     */
    getVoltageAt: function( shape ) {
      var voltage = null;

      if ( this.connectedToLightBulbTop( shape ) ) {
        voltage = this.getCapacitorPlateVoltage();
      }
      else if ( this.connectedToLightBulbBottom( shape ) ) {
        voltage = 0;
      }
      else if ( this.connectedToBatteryTop( shape ) ) {
        voltage = this.getTotalVoltage();
      }
      else if ( this.connectedToBatteryBottom( shape ) ) {
        voltage = 0;
      }

      return voltage;
    },

    //REVIEW: doc
    connectedToLightBulbTop: function( shape ) {
      /* REVIEW: simplifications
      var topWires = this.getTopLightBulbWires().concat( this.getTopCapacitorWires() ).concat( this.getTopSwitchWires() );
      var intersectsTopWires = this.shapeTouchesWireGroup( shape, topWires );
      */
      var intersectsTopWires = false;
      var topLightBulbWires = this.topLightBulbWires;
      var topCapacitorWires = this.topCapacitorWires;
      var topSwitchWires = this.topSwitchWires;

      var topWires = [];
      topWires = topWires.concat( topLightBulbWires );
      topWires = topWires.concat( topCapacitorWires );
      topWires = topWires.concat( topSwitchWires );

      topWires.forEach( function( topWire ) {
        if ( topWire.shapeProperty.value.intersectsBounds( shape.bounds ) ) {
          intersectsTopWires = true;
        }
      } );

      // does the shape intersect a top plate?
      var intersectsSomeTopPlate = this.intersectsSomeTopPlate( shape );

      // does the shape intersect the light bulb base?
      var intersectsBulbBase = this.lightBulb.intersectsBulbBase( shape );

      return intersectsBulbBase || intersectsSomeTopPlate || intersectsTopWires;
    },

    /**
     * Determine if the shape is connected to the top of the lightbulb when it
     * is disconnected from the circuit.
     * REVIEW: visibility doc
     *
     * @param  {Shape} shape - shape of the element connected to the light bulb
     * @returns {boolean}
     */
    connectedToDisconnectedLightBulbTop: function( shape ) {
      //REVIEW: see notes in supertypes about potential improvements by using zones
      var intersectsTopWires = false;
      var topLightBulbWires = this.topLightBulbWires;
      var intersectsBulbBase = this.lightBulb.intersectsBulbBase( shape );

      //REVIEW: var intersectsTopWires = this.shapeTouchesWireGroup( shape, this.getTopLightBulbWires() );
      //REVIEW: Also, easier to check for whether disconnected is false before we need to compute this. Recommend top:
      // if ( !disconnected ) { return false; } // skips a lot
      topLightBulbWires.forEach( function( bottomWire ) {
        if ( bottomWire.shapeProperty.value.intersectsBounds( shape.bounds ) ) {
          intersectsTopWires = true;
        }
      } );

      var disconnected = !( this.circuitConnectionProperty.value === CircuitConnectionEnum.LIGHT_BULB_CONNECTED );
      return ( intersectsBulbBase || intersectsTopWires ) && disconnected;
    },

    /**
     * Determine if the shape is connected to the bottom of the lightbulb when it
     * is disconnected from the circuit.
     * @param  {Shape} shape - shape of the element connected to the light bulb
     * @returns {boolean}
     */
    connectedToDisconnectedLightBulbBottom: function( shape ) {
      //REVIEW: see notes in supertypes about potential improvements by using zones
      var intersectsBottomWires = false;
      var bottomLightBulbWires = this.bottomLightBulbWires;

      //REVIEW: var intersectsBottomWires = this.shapeTouchesWireGroup( shape, this.getBottomLightBulbWires() );
      //REVIEW: Also, easier to check for whether disconnected is false before we need to compute this. Recommend top:
      // if ( !disconnected ) { return false; } // skips a lot
      bottomLightBulbWires.forEach( function( bottomWire ) {
        if ( bottomWire.shapeProperty.value.intersectsBounds( shape.bounds ) ) {
          intersectsBottomWires = true;
        }
      } );

      var disconnected = !( this.circuitConnectionProperty.value === CircuitConnectionEnum.LIGHT_BULB_CONNECTED );
      return intersectsBottomWires && disconnected;
    },

    //REVIEW: doc
    connectedToLightBulbBottom: function( shape ) {
      /* REVIEW: simplification
      var bottomWires = this.getBottomLightBulbWires().concat( this.getBottomCapacitorWires() ).concat( this.getBottomSwitchWires() );
      var intersectsBottomWires = this.shapeTouchesWireGroup( shape, bottomWires );
      */
      var intersectsBottomWires = false;
      var bottomLightBulbWires = this.bottomLightBulbWires;
      var bottomCapacitorWires = this.bottomCapacitorWires;
      var bottomSwitchWires = this.bottomSwitchWires;

      var bottomWires = [];
      bottomWires = bottomWires.concat( bottomLightBulbWires );
      bottomWires = bottomWires.concat( bottomCapacitorWires );
      bottomWires = bottomWires.concat( bottomSwitchWires );

      // does the shape intersect the light bulb base?
      var intersectsBulbBase = this.lightBulb.intersectsBulbBase( shape );

      bottomWires.forEach( function( bottomWire ) {
        if ( bottomWire.shapeProperty.value.intersectsBounds( shape.bounds ) ) {
          intersectsBottomWires = true;
        }
      } );

      var intersectsSomeBottomPlate = this.intersectsSomeBottomPlate( shape );

      return intersectsBottomWires || intersectsSomeBottomPlate || intersectsBulbBase;

    },

    /**
     * Sets the value used for plate charge when the battery is disconnected.
     * (design doc symbol: Q_total)
     * REVIEW: visibility doc
     *
     * @param {number} disconnectedPlateCharge Coulombs
     */
    setDisconnectedPlateCharge: function( disconnectedPlateCharge ) {
      if ( disconnectedPlateCharge !== this.disconnectedPlateChargeProperty.value ) {
        this.disconnectedPlateChargeProperty.value = disconnectedPlateCharge;
        if ( this.circuitConnectionProperty.value !== CircuitConnectionEnum.BATTERY_CONNECTED ) {
          this.updatePlateVoltages();
        }
      }
    },

    /**
     * Sets the plate voltages, but checks to make sure that th ebattery is disconnected from the circuit.
     * REVIEW: visibility doc
     * REVIEW: Usually setters take a value, would updateDisconnectedPlateVoltage be a more appropriate name?
     */
    setDisconnectedPlateVoltage: function() {
      if ( this.circuitConnectionProperty.value === CircuitConnectionEnum.OPEN_CIRCUIT ) {
        this.updatePlateVoltages();
      }
    },

    /**
     * Gets the total charge in the circuit.(design doc symbol: Q_total)
     * REVIEW: visibility doc
     *
     * REVIEW: Same as CapacitanceCircuit's getTotalCharge(), should be factored out to a parent type (since all
     * circuits in this sim have one capacitor)
     *
     * @returns {number}
     */
    getTotalCharge: function() {
      return this.capacitor.getPlateCharge();
    },

    /**
     * Update the current amplitude depending on the circuit connection.  If the capacitor is connected to the light
     * bulb, find the current by I = V / R.  Otherwise, current is found by dQ/dT.
     * REVIEW: visibility doc
     *
     * @param {number} dt
     */
    updateCurrentAmplitude: function( dt ) {

      // if the circuit is connected to the light bulb, I = V / R
      if ( this.circuitConnectionProperty.value === CircuitConnectionEnum.LIGHT_BULB_CONNECTED ) {
        var current = this.capacitor.platesVoltageProperty.value / this.lightBulb.resistance;

        // The cutoff is doubled here for #58
        if ( Math.abs( current ) < 2 * MIN_VOLTAGE / this.lightBulb.resistance ) {
          current = 0;
        }

        this.currentAmplitudeProperty.set( current );
      }

      // otherise, I = dQ/dT
      else {
        ParallelCircuit.prototype.updateCurrentAmplitude.call( this, dt );
      }
    }

  } );

} );
