// Copyright 2016, University of Colorado Boulder

/**
 * Voltmeter model.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
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
  var POSITIVE_PROBE_LOCATION = new Vector3( 0.0669, 0.0298, 0 );
  var NEGATIVE_PROBE_LOCATION = new Vector3( 0.0707, 0.0329, 0 );

  /**
   * Constructor for a Voltmeter.
   *
   * @param {ParallelCircuit} circuit
   * @param {Bounds2} dragBounds
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function Voltmeter( circuit, dragBounds, modelViewTransform, tandem ) {

    this.circuit = circuit; // @private
    this.dragBounds = dragBounds; // @public (read-only)
    this.modelViewTransform = modelViewTransform; // @private
    this.probeTipSizeReference = PROBE_TIP_SIZE; // @public (read-only)

    // @public
    this.visibleProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'visibleProperty' ),
      phetioValueType: TBoolean
    } );

    // @public
    this.inUserControlProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'inUserControlProperty' ),
      phetioValueType: TBoolean
    } );

    // @public
    this.bodyLocationProperty = new Property( new Vector3(), {
      tandem: tandem.createTandem( 'bodyLocationProperty' ),
      phetioValueType: TVector3
    } );

    // @public
    this.positiveProbeLocationProperty = new Property( POSITIVE_PROBE_LOCATION, {
      tandem: tandem.createTandem( 'positiveProbeLocationProperty' ),
      phetioValueType: TVector3
    } );

    // @public
    this.negativeProbeLocationProperty = new Property( NEGATIVE_PROBE_LOCATION, {
      tandem: tandem.createTandem( 'negativeProbeLocationProperty' ),
      phetioValueType: TVector3
    } );

    // By design, the voltmeter reads "?" for disconnected contacts, which is
    // represented internally by a null assignment value.
    // @public
    this.measuredVoltageProperty = new Property( null, {
      tandem: tandem.createTandem( 'measuredVoltageProperty' ),
      phetioValueType: TNumber( {
        units: 'volts'
      } )
    } );

    var self = this;

    this.shapeCreator = new VoltmeterShapeCreator( this, modelViewTransform ); // @public (read-only)

    //REVIEW: https://github.com/phetsims/capacitor-lab-basics/issues/174 should help with duplication here

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
      //REVIEW: lots of `self.measuredVoltageProperty.set( .. ); return;`
      //        Would prefer `return ..` for all in a computeValue() function, then updateValue sets it.
      if ( self.probesAreTouching() ) {
        self.measuredVoltageProperty.set( 0 );
        return;
      }
      else {
        var positiveProbeShape = self.shapeCreator.getPositiveProbeTipShape();
        var negativeProbeShape = self.shapeCreator.getNegativeProbeTipShape();

        if ( self.circuit.lightBulb ) {
          //REVIEW: factor out duplicated expressions like `touchingFreeLightBulb( positiveProbeShape )`. Should help
          //        performance and readability

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

    // Update voltage reading if plate voltage changes
    circuit.capacitor.platesVoltageProperty.link( updateValue );

    // Update reading when the probes move
    Property.multilink( [ self.negativeProbeLocationProperty, self.positiveProbeLocationProperty ], updateValue );

    // Update all segments and the plate voltages when capacitor plate geometry changes. Capacitor may not exist yet.
    circuit.capacitor.plateSeparationProperty.lazyLink( updateValue );

    // Update the plate voltage when the capacitor plate size changes. Capacitor may not exist yet.
    circuit.capacitor.plateSizeProperty.lazyLink( updateValue );

    // update the value when the circuit connection property changes
    circuit.circuitConnectionProperty.link( updateValue );

    // Update when battery voltage changes
    circuit.battery.voltageProperty.link( updateValue );
  }

  capacitorLabBasics.register( 'Voltmeter', Voltmeter );

  return inherit( Object, Voltmeter, {

    /**
     * Probes are touching if their tips intersect.
     * REVIEW: visibility doc
     *
     * @returns {boolean}
     */
    probesAreTouching: function() {
      //REVIEW: Use https://github.com/phetsims/capacitor-lab-basics/issues/175 instead
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

    // @public
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
