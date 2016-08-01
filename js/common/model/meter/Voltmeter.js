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

  // phet-io modules
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );
  var TVector3 = require( 'ifphetio!PHET_IO/types/dot/TVector3' );

  // constants
  // size of the probe tips, determined by visual inspection of the associated image files
  var PROBE_TIP_SIZE = new Dimension2( 0.001, 0.0018 ); // meters
  var BODY_LOCATION = new Vector3( 0.071, 0.026, 0 );
  var POSITIVE_PROBE_LOCATION = new Vector3( 0.0669, 0.0298, 0 );
  var NEGATIVE_PROBE_LOCATION = new Vector3( 0.0707, 0.0329, 0 );

  /**
   * Constructor for a Voltmeter.
   *
   * @param {AbstractCircuit} circuit
   * @param {Bounds2} dragBounds
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function Voltmeter( circuit, dragBounds, modelViewTransform, tandem ) {

    // @public
    PropertySet.call( this, {
      visible: false,
      inUserControl: false,
      bodyLocation: BODY_LOCATION,
      positiveProbeLocation: POSITIVE_PROBE_LOCATION,
      negativeProbeLocation: NEGATIVE_PROBE_LOCATION,
      value: null // This is a number. Will be properly initialized by updateValue
    }, tandem ? {
      tandemSet: {
        visible: tandem.createTandem( 'visibleProperty' ),
        inUserControl: tandem.createTandem( 'inUserControlProperty' ),
        bodyLocation: tandem.createTandem( 'bodyLocationProperty' ),
        positiveProbeLocation: tandem.createTandem( 'positiveProbeLocationProperty' ),
        negativeProbeLocation: tandem.createTandem( 'negativeProbeLocationProperty' ),
        value: tandem.createTandem( 'valueProperty' )
      },
      phetioValueTypeSet: {
        visible: TBoolean,
        inUserControl: TBoolean,
        bodyLocation: TVector3,
        positiveProbeLocation: TVector3,
        negativeProbeLocation: TVector3,
        value: TNumber( 'volts' )
      }
    } : {} );
    var thisMeter = this;

    this.shapeCreator = new VoltmeterShapeCreator( this, modelViewTransform ); // @public (read-only)
    this.circuit = circuit; // @private
    this.dragBounds = dragBounds; // @public (read-only)

    // @private
    var touchingFreePlate = function( probeShape ) {
      var t = thisMeter.circuit.connectedToDisconnectedCapacitorTop( probeShape );
      var b = thisMeter.circuit.connectedToDisconnectedCapacitorBottom( probeShape );
      return ( t || b );
    };

    var touchingFreeLightBulb = function( probeShape ) {
      var t = thisMeter.circuit.connectedToDisconnectedLightBulbTop( probeShape );
      var b = thisMeter.circuit.connectedToDisconnectedLightBulbBottom( probeShape );
      return ( t || b );
    };

    var touchingFreeBattery = function( probeShape ) {
      var t = thisMeter.circuit.connectedToDisconnectedBatteryTop( probeShape );
      var b = thisMeter.circuit.connectedToDisconnectedBatteryBottom( probeShape );
      return ( t || b );
    };

    /**
     * Update the value of the meter, called when many different properties change
     */
    var updateValue = function() {
      if ( thisMeter.probesAreTouching() ) {
        thisMeter.value = 0;
      } else {
        var positiveProbeShape = thisMeter.shapeCreator.getPositiveProbeTipShape();
        var negativeProbeShape = thisMeter.shapeCreator.getNegativeProbeTipShape();

        // Ensure that the voltage is null when one (and only one) probe is on a disconnected lightbulb
        // or battery
        if ( thisMeter.circuit.lightBulb ) {
          if ( ( touchingFreeLightBulb( positiveProbeShape ) && !touchingFreeLightBulb( negativeProbeShape ) ) ||
            ( !touchingFreeLightBulb( positiveProbeShape ) && touchingFreeLightBulb( negativeProbeShape ) ) ) {
            thisMeter.value = null;
            return;
          }
          else if ( ( touchingFreeBattery( positiveProbeShape ) && !touchingFreeBattery( negativeProbeShape ) ) ||
            ( !touchingFreeBattery( positiveProbeShape ) && touchingFreeBattery( negativeProbeShape ) ) ) {
            thisMeter.value = null;
            return;
          }
        }

        // Ensure that voltage is null when one (and only one) probe is on a disconnected plate.
        if ( ( touchingFreePlate( positiveProbeShape ) && !touchingFreePlate( negativeProbeShape ) ) ||
          ( !touchingFreePlate( positiveProbeShape ) && touchingFreePlate( negativeProbeShape ) ) ) {
          thisMeter.value = null;
          return;
        }

        // Handle all other cases
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

    // Update when battery voltage changes
    circuit.battery.voltageProperty.link( updateValue );

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

