// Copyright 2015, University of Colorado Boulder

/**
 * Voltmeter model.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector3 = require( 'DOT/Vector3' );
  var VoltmeterShapeCreator = require( 'CAPACITOR_LAB_BASICS/common/model/shapes/VoltmeterShapeCreator' );

  // constants
  // size of the probe tips, determined by visual inspection of the associated image files
  var PROBE_TIP_SIZE = new Dimension2( 0.001, 0.0018 ); // meters

  /**
   * Constructor for a Voltmeter.
   *
   * @param {AbstractCircuit} circuit
   * @param {Bounds2} dragBounds
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Vector3} bodyLocation
   * @param {Vector3} positiveProbeLocation
   * @param {Vector3} negativeProbeLocation
   * @param {boolean} visible
   * @constructor
   */
  function Voltmeter( circuit, dragBounds, modelViewTransform, options ) {

    var defaultOptions = {
      bodyLocation: new Vector3( 0.071, 0.026, 0 ),
      positiveProbeLocation: new Vector3( 0.0669, 0.0298, 0 ),
      negativeProbeLocation: new Vector3( 0.0707, 0.0329, 0 ),
      visible: false
    };

    options = _.extend( {}, defaultOptions, options ); // don't modify defaultOptions!

    // @public
    PropertySet.call( this, {
      visible: options.visible,
      inUserControl: false,
      bodyLocation: options.bodyLocation,
      positiveProbeLocation: options.positiveProbeLocation,
      negativeProbeLocation: options.negativeProbeLocation,
      value: 0 // Wil be properly initialized by updateValue
    } );
    var thisMeter = this;

    this.shapeCreator = new VoltmeterShapeCreator( this, modelViewTransform ); // @public (read-only)
    this.circuit = circuit; // @private
    this.dragBounds = dragBounds; // @public (read-only)

    /**
     * Update the value of the meter, called when many different properties change
     */
    var updateValue = function() {
      if ( thisMeter.probesAreTouching() ) {
        thisMeter.value = 0;
      } else {
        var positiveProbeShape = thisMeter.shapeCreator.getPositiveProbeTipShape();
        var negativeProbeShape = thisMeter.shapeCreator.getNegativeProbeTipShape();
        thisMeter.value = thisMeter.circuit.getVoltageBetween( positiveProbeShape, negativeProbeShape );
      }
    };

    // search through capacitors, update value if plate voltage changes
    circuit.capacitors.forEach( function( capacitor ) {
      capacitor.platesVoltageProperty.link( updateValue );
    } );

    // update the value when the probes move
    this.multilink( [ 'negativeProbeLocation', 'positiveProbeLocation' ], updateValue );

    // update all segments and the plate voltages when capacitor plate geometry changes.  Lazy link because there is
    // no guarantee that capacitors have been constructed.
    circuit.capacitors.forEach( function( capacitor ) {
      capacitor.plateSeparationProperty.lazyLink( updateValue );
    } );

    // update the plate voltages when the capacitor plate size changes.  Lazy link because there is no guarantee that
    // capacators have been constructed.
    circuit.capacitors.forEach( function( capacitor ) {
      capacitor.plateSizeProperty.lazyLink( updateValue );
    } );

    // update the value when the circuit connection property changes
    circuit.circuitConnectionProperty.link( updateValue );

  }

  capacitorLabBasics.register( 'Voltmeter', Voltmeter );

  return inherit( PropertySet, Voltmeter, {

    /**
     * Probes are touching if their tips intersect.
     *
     * @returns {boolean}
        thisMeter.updateValue();
     */
    probesAreTouching: function() {
      return this.shapeCreator.getPositiveProbeTipShape().intersectsBounds( this.shapeCreator.getNegativeProbeTipShape() );
    },

    /**
     * Get the probe tip size in model coordinates
     *
     * @returns {Dimension2}
     */
    getProbeTipSizeReference: function() {
      return PROBE_TIP_SIZE;
    }
  } );
} );

