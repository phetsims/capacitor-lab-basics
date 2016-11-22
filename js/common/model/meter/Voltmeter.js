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
  var Property = require( 'AXON/Property' );
  var Vector3 = require( 'DOT/Vector3' );
  var VoltmeterShapeCreator = require( 'CAPACITOR_LAB_BASICS/common/model/shapes/VoltmeterShapeCreator' );

  // phet-io modules
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );
  var TVector3 = require( 'ifphetio!PHET_IO/types/dot/TVector3' );

  // constants
  // size of the probe tips, determined by visual inspection of the associated image files
  var PROBE_TIP_SIZE = new Dimension2( 0.0005, 0.0015 ); // meters

  // Initial locations when dragged out of toolbox
  var BODY_LOCATION = new Vector3( 0.071, 0.026, 0 );
  var POSITIVE_PROBE_LOCATION = new Vector3( 0.0669, 0.0298, 0 );
  var NEGATIVE_PROBE_LOCATION = new Vector3( 0.0707, 0.0329, 0 );

  /**
   * Constructor for a Voltmeter.
   *
   * @param {AbstractCircuit} circuit
   * @param {Bounds2} dragBounds
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Tandem|null} tandem - null if this is a temporary component used for calculations
   * @constructor
   */
  function Voltmeter( circuit, dragBounds, modelViewTransform, tandem ) {

    this.visibleProperty = new Property( false, {
      tandem: tandem.createTandem( 'visibleProperty' ),
      phetioValueType: TBoolean
    } );
    this.inUserControlProperty = new Property( false, {
      tandem: tandem.createTandem( 'inUserControlProperty' ),
      phetioValueType: TBoolean
    } );
    this.bodyLocationProperty = new Property( BODY_LOCATION, {
      tandem: tandem.createTandem( 'bodyLocationProperty' ),
      phetioValueType: TVector3
    } );
    this.positiveProbeLocationProperty = new Property( POSITIVE_PROBE_LOCATION, {
      tandem: tandem.createTandem( 'positiveProbeLocationProperty' ),
      phetioValueType: TVector3
    } );
    this.negativeProbeLocationProperty = new Property( NEGATIVE_PROBE_LOCATION, {
      tandem: tandem.createTandem( 'negativeProbeLocationProperty' ),
      phetioValueType: TVector3
    } );
    this.measuredVoltageProperty = new Property( null, {
      tandem: tandem.createTandem( 'measuredVoltageProperty' ),
      phetioValueType: TNumber( {
        units: 'volts'
      } )
    } );

    var self = this;

    this.shapeCreator = new VoltmeterShapeCreator( this, modelViewTransform ); // @public (read-only)
    this.circuit = circuit; // @private
    this.dragBounds = dragBounds; // @public (read-only)
    this.modelViewTransform = modelViewTransform;

    // @private
    var touchingFreePlate = function( probeShape ) {
      var t = self.circuit.connectedToDisconnectedCapacitorTop( probeShape );
      var b = self.circuit.connectedToDisconnectedCapacitorBottom( probeShape );
      return ( t || b );
    };

    var touchingFreeLightBulb = function( probeShape ) {
      var t = self.circuit.connectedToDisconnectedLightBulbTop( probeShape );
      var b = self.circuit.connectedToDisconnectedLightBulbBottom( probeShape );
      return ( t || b );
    };

    var touchingFreeBattery = function( probeShape ) {
      var t = self.circuit.connectedToDisconnectedBatteryTop( probeShape );
      var b = self.circuit.connectedToDisconnectedBatteryBottom( probeShape );
      return ( t || b );
    };

    /**
     * Update the value of the meter, called when many different properties change
     */
    var updateValue = function() {
      if ( self.probesAreTouching() ) {
        self.measuredVoltageProperty.set( 0 );
        return;
      }
      else {
        var positiveProbeShape = self.shapeCreator.getPositiveProbeTipShape();
        var negativeProbeShape = self.shapeCreator.getNegativeProbeTipShape();

        if ( self.circuit.lightBulb ) {

          // Set voltage to zero when both probes are touching the disconnected lightbulb
          if ( touchingFreeLightBulb( positiveProbeShape ) && touchingFreeLightBulb( negativeProbeShape ) ) {
            self.measuredVoltageProperty.set( 0 );
            return;
          }

          // Set voltage to null when one (and only one) probe is on a disconnected lightbulb
          if ( ( touchingFreeLightBulb( positiveProbeShape ) && !touchingFreeLightBulb( negativeProbeShape ) ) ||
            ( !touchingFreeLightBulb( positiveProbeShape ) && touchingFreeLightBulb( negativeProbeShape ) ) ) {
            self.measuredVoltageProperty.set( null );
            return;
          }

          // Set voltage to null when one (and only one) probe is on a disconnected battery
          else if ( ( touchingFreeBattery( positiveProbeShape ) && !touchingFreeBattery( negativeProbeShape ) ) ||
            ( !touchingFreeBattery( positiveProbeShape ) && touchingFreeBattery( negativeProbeShape ) ) ) {
            self.measuredVoltageProperty.set( null );
            return;
          }
        }

        // Set voltage to null when one (and only one) probe is on a disconnected plate.
        if ( ( touchingFreePlate( positiveProbeShape ) && !touchingFreePlate( negativeProbeShape ) ) ||
          ( !touchingFreePlate( positiveProbeShape ) && touchingFreePlate( negativeProbeShape ) ) ) {
          self.measuredVoltageProperty.set( null );
          return;
        }

        // Handle all other cases
        self.measuredVoltageProperty.set( self.circuit.getVoltageBetween( positiveProbeShape, negativeProbeShape ) );
      }
    };

    // search through capacitors, update value if plate voltage changes
    circuit.capacitors.forEach( function( capacitor ) {
      capacitor.platesVoltageProperty.link( updateValue );
    } );

    // update the value when the probes move
    Property.multilink( [self.negativeProbeLocationProperty, self.positiveProbeLocationProperty ], updateValue );

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

  return inherit( Object, Voltmeter, {

    /**
     * Probes are touching if their tips intersect.
     *
     * @returns {boolean}
     */
    probesAreTouching: function() {
      var touching = false;
      var posShape = this.shapeCreator.getPositiveProbeTipShape();
      var negShape = this.shapeCreator.getNegativeProbeTipShape();
      posShape.subpaths.forEach( function( subpath ) {
        subpath.points.forEach( function( point ) {
          if ( negShape.containsPoint( point ) ) {
            touching = true;
            return;
          }
        } );
        if ( touching ) {
          return;
        } // For efficiency
      } );
      return touching;
    },

    /**
     * Get the probe tip size in model coordinates
     *
     * @returns {Dimension2}
     */
    getProbeTipSizeReference: function() {
      return PROBE_TIP_SIZE;
    },

    reset: function() {
      this.visibleProperty.reset();
      this.inUserControlProperty.reset();
      this.bodyLocationProperty.reset();
      this.positiveProbeLocationProperty.reset();
      this.negativeProbeLocationProperty.reset();
      this.measuredVoltageProperty.reset();
    }
  } );
} );
