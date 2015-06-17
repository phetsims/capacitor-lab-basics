// Copyright 2002-2015, University of Colorado Boulder

/**
 * Base class for all bar meter model elements.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );

  /**
   * Constructor for a BarMeter.
   *
   * @param {AbstractCircuit} circuit
   * @param {Bounds2} worldBounds
   * @param {Vector3} location
   * @param {boolean} visible
   * @param {Function} valueFunction
   * @constructor
   */
  function BarMeter( circuit, worldBounds, location, visible, valueFunction ) {

    PropertySet.call( this, {
      location: location,
      visible: visible,
      value: valueFunction( circuit )
    } );

    var thisMeter = this;

    this.circuit = circuit;
    this.valueFunction = valueFunction;

    circuit.capacitor.multilink( ['plateSize', 'plateSeparation', 'platesVoltage' ], function() {
      thisMeter.updateValue();
    } );
    // change the value when the circuit changes TODO
    //circuitChangeListener = new CircuitChangeListener() {
    //  public void circuitChanged() {
    //    updateValue();
    //  }
    //};
    //circuit.addCircuitChangeListener( circuitChangeListener );
  }

    // Convenience class for capacitance meter
  function CapacitanceMeter( circuit, worldBounds, location, visible ) {
    BarMeter.call( this, circuit, worldBounds, location, visible,
      function() {
        return circuit.getTotalCapacitance();
      } );
  }

  inherit( BarMeter, CapacitanceMeter );

  // Convenience class for plate charge meter
  function PlateChargeMeter( circuit, worldBounds, location, visible ) {
    BarMeter.call( this, circuit, worldBounds, location, visible,
      function() {
        return circuit.getTotalCharge();
      } );
  }

  inherit( BarMeter, PlateChargeMeter );

  // Convenience class for stored energy meter
  function StoredEnergyMeter( circuit, worldBounds, location, visible ) {
    BarMeter.call( this, circuit, worldBounds, location, visible,
      function() {
        return circuit.getStoredEnergy();
      } );
  }

  inherit( BarMeter, StoredEnergyMeter );

  return inherit( PropertySet, BarMeter, {

    setCircuit: function( circuit ) {
      if( this.circuit !== circuit ) {
        //this.circuit.removeCircuitChangeListener( circuitChangeListener ); TODO
        this.circuit = circuit;
        //this.circuit.addCircuitChangeListener( circuitChangeListener ); TODO
        this.updateValue();
      }
    },

    updateValue: function() {
      this.value = this.valueFunction( this.circuit );
    }

  }, {

    /**
     * Factory functions for public access to specific constructors.
     */
    CapacitanceMeter: function( circuit, worldBounds, location, visible ) {
      return new BarMeter( circuit, worldBounds, location, visible,
        function() {
          return circuit.getTotalCapacitance();
        } );
    },

    PlateChargeMeter: function( circuit, worldBounds, location, visible ) {
      return new BarMeter( circuit, worldBounds, location, visible,
        function() {
          return circuit.getTotalCharge();
        } );
    },

    StoredEnergyMeter: function( circuit, worldBounds, location, visible ) {
      return new BarMeter( circuit, worldBounds, location, visible,
        function() {
          return circuit.getStoredEnergy();
        } );
    }

  } );
} );