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
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );
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
   * @param {ModelViewTransform2} modelViewTransform
   * @param {Vector3} bodyLocation
   * @param {Vector3} positiveProbeLocation
   * @param {Vector3} negativeProbeLocation
   * @param {boolean} visible
   * @constructor
   */
  function Voltmeter( circuit, dragBounds, modelViewTransform, bodyLocation, positiveProbeLocation, negativeProbeLocation, visible ) {

    // @public
    PropertySet.call( this, {
      visible: visible,
      inUserControl: false,
      bodyLocation: bodyLocation,
      positiveProbeLocation: positiveProbeLocation,
      negativeProbeLocation: negativeProbeLocation,
      value: 0 // Wil be properly initialized by updateValue
    } );
    var thisMeter = this;

    this.shapeCreator = new VoltmeterShapeCreator( this, modelViewTransform ); // @public (read-only)
    this.circuit = circuit; // @private
    this.dragBounds = dragBounds; // @public (read-only)

    // whenever a capacitor changes, update the value.
    circuit.capacitors.forEach( function( capacitor ) {
      capacitor.platesVoltageProperty.link( function( voltage ) {
        thisMeter.updateValue();
      } );
    } );

    // update the value when the probes move.
    this.multilink( [ 'negativeProbeLocation', 'positiveProbeLocation' ], function() {
      thisMeter.updateValue();
    } );

    // update the value when the circuit connection property changes
    circuit.circuitConnectionProperty.link( function( circuitConnection ) {
      thisMeter.updateValue();
    } );

  }

  return inherit( PropertySet, Voltmeter, {

    /**
     * Update the meter value.
     */
    updateValue: function() {
      if ( this.probesAreTouching() ) {
        this.value = 0;
      }
      else {
        this.value = this.circuit.getVoltageBetween( this.shapeCreator.getPositiveProbeTipShape(), this.shapeCreator.getNegativeProbeTipShape() );
      }
    },

    /**
     * Probes are touching if their tips intersect.
     *
     * @returns {boolean}
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
    },
    
    getUsefulProbeLocations: function() {
      var points = [];
      var topWires = this.circuit.getTopWires();
      var bottomWires = this.circuit.getBottomWires();
      topWires.forEach( function( wire ) {
        if ( wire.connectionPoint === CLConstants.WIRE_CONNECTIONS.BATTERY_TOP ||
            wire.connectionPoint === CLConstants.WIRE_CONNECTIONS.LIGHT_BULB_TOP ) {
          wire.segments.forEach( function( segment ) {
            if ( segment.startPoint.y === segment.endPoint.y ) {
              points.push( new Vector3( ( segment.startPoint.x + segment.endPoint.x ) / 2, segment.endPoint.y - wire.thickness / 2, 0) );
            }
          } );
        }
      } );
      this.circuit.capacitors.forEach( function( capacitor ) {
        var top = capacitor.getTopConnectionPoint();
        points.push( new Vector3( top.x - capacitor.plateSize.width / 4, top.y, top.z ) );
        var bottom = capacitor.getBottomConnectionPoint();
        points.push( new Vector3( bottom.x - capacitor.plateSize.width / 4, bottom.y, bottom.z ) );
      } );
      bottomWires.forEach( function( wire ) {
        if ( wire.connectionPoint === CLConstants.WIRE_CONNECTIONS.BATTERY_BOTTOM ||
            wire.connectionPoint === CLConstants.WIRE_CONNECTIONS.LIGHT_BULB_BOTTOM ) {
          wire.segments.forEach( function( segment ) {
            if ( segment.startPoint.y === segment.endPoint.y ) {
              points.push( new Vector3( ( segment.startPoint.x + segment.endPoint.x ) / 2, segment.endPoint.y - wire.thickness / 2, 0) );
            }
          } );
        }
      } );
      return points;
    }
  } );
} );