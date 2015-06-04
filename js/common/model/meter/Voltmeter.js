// Copyright 2002-2015, University of Colorado Boulder

/**
 * Voltmeter model.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var VoltmeterShapeCreator = require( 'CAPACITOR_LAB/common/model/shapes/VoltmeterShapeCreator' );

  // constants
  // size of the probe tips, determined by visual inspection of the associated image files
  var PROBE_TIP_SIZE = new Dimension2( 0.0005, 0.0015 ); // meters

  /**
   * Constructor for a Voltmeter.
   *
   * @param {AbstractCircuit} circuit
   * @param {Bounds2} worldBounds
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Vector3} bodyLocation
   * @param {Vector3} positiveProbeLocation
   * @param {Vector3} negativeProbeLocation
   * @param {boolean} visible
   * @constructor
   */
  function Voltmeter( circuit, worldBounds, modelViewTransform, bodyLocation, positiveProbeLocation, negativeProbeLocation, visible ) {

    PropertySet.call( this, {
      visible: visible,
      bodyLocation: bodyLocation,
      positiveProbeLocation: positiveProbeLocation,
      negativeProbeLocation: negativeProbeLocation,
      value: 0 // Wil be properly initialized by updateValue
    } );

    this.shapeCreator = new VoltmeterShapeCreator( this, modelViewTransform );
    this.circuit = circuit;
    //circuitChangeListener = new CircuitChangeListener() { TODO
    //  public void circuitChanged() {
    //    updateValue();
    //  }
    //};
    //circuit.addCircuitChangeListener( circuitChangeListener );

    // update value when probes move TODO
    //RichSimpleObserver probeObserver = new RichSimpleObserver() {
    //  public void update() {
    //    updateValue();
    //  }
    //};
    //probeObserver.observe( positiveProbeLocationProperty, negativeProbeLocationProperty );

  }

  return inherit( PropertySet, Voltmeter, {

    updateValue: function() {
      if ( this.probesAreTouching() ) {
        this.valueProperty = 0;
      }
      else {
        this.valueProperty = this.circuit.getVoltageBetween( this.shapeCreator.getPositivePropeTipShape(), this.shapeCreator.getNegativePropeTipShape() );
      }
    },

    // Probes are touching if their tips intersect.
    probesAreTouching: function() {
      return this.shapeCreator.getPositiveProbeTipShape().intersectsBounds( this.shapeCreator.getNegativeProbeTimShape().bounds );
    },

    setCircuit: function( circuit ) {
      if ( circuit !== this.circuit ) {
        //this.circuit.removeCircuitChangeListener( circuitChangeListener ); TODO
        this.circuit = circuit;
        //this.circuit.addCircuitChangeListener( circuitChangeListener );
        this.updateValue();
      }
    },

    getProbeTipSizeReference: function() {
      return PROBE_TIP_SIZE;
    }
  }, {

    // Get the probe tip size if needed. TODO: Remove if not used publicly.
    PROBE_TIP_SIZE: PROBE_TIP_SIZE

  } );
} );