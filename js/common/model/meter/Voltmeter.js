// Copyright 2015-2017, University of Colorado Boulder

/**
 * Voltmeter model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CircuitLocation = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitLocation' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Property = require( 'AXON/Property' );
  var TVector3 = require( 'DOT/TVector3' );
  var Vector3 = require( 'DOT/Vector3' );
  var VoltmeterShapeCreator = require( 'CAPACITOR_LAB_BASICS/common/model/shapes/VoltmeterShapeCreator' );

  // phet-io modules
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );

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
      tandem: tandem.createTandem( 'visibleProperty' )
    } );

    // @public
    this.inUserControlProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'inUserControlProperty' )
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

    // By design, the voltmeter reads "?" for disconnected contacts, which is represented internally by a null
    // assignment value.
    // @public
    this.measuredVoltageProperty = new Property( null, {
      tandem: tandem.createTandem( 'measuredVoltageProperty' ),
      units: 'volts',
      phetioValueType: TNumber
    } );

    var self = this;

    this.shapeCreator = new VoltmeterShapeCreator( this, modelViewTransform ); // @public (read-only)

    //REVIEW: https://github.com/phetsims/capacitor-lab-basics/issues/174 should help with duplication here

    var touchingFreePlate = function( probe ) {
      return ( self.circuit.probeContactsComponent( probe, CircuitLocation.CAPACITOR_TOP, true ) ||
               self.circuit.probeContactsComponent( probe, CircuitLocation.CAPACITOR_BOTTOM, true ) );
    };

    var touchingFreeLightBulb = function( probe ) {
      return ( self.circuit.disconnectedLightBulbContacts( probe, CircuitLocation.LIGHT_BULB_TOP ) ||
               self.circuit.disconnectedLightBulbContacts( probe, CircuitLocation.LIGHT_BULB_BOTTOM ) );
    };

    var touchingFreeBattery = function( probe ) {
      return ( self.circuit.probeContactsComponent( probe, CircuitLocation.BATTERY_TOP, true ) ||
               self.circuit.probeContactsComponent( probe, CircuitLocation.BATTERY_BOTTOM, true ) );
    };

    /**
     * Compute voltage reading for meter, called when many different properties change
     * Null values correspond to a ? on the voltmeter.
     * @private
     * @returns {number} - voltage difference between probes
     */
    var computeValue = function() {

      if ( self.probesAreTouching() ) {
        return 0;
      }
      else {

        var positiveProbe = self.shapeCreator.getPositiveProbeTipShape();
        var negativeProbe = self.shapeCreator.getNegativeProbeTipShape();

        // Booleans representing electrical contact between probes and circuit components.
        // Compute once for performance
        var positiveToBattery = touchingFreeBattery( positiveProbe );
        var negativeToBattery = touchingFreeBattery( negativeProbe );
        var positiveToPlate = touchingFreePlate( positiveProbe );
        var negativeToPlate = touchingFreePlate( negativeProbe );

        if ( self.circuit.lightBulb ) {
          var positiveToLight = touchingFreeLightBulb( positiveProbe );
          var negativeToLight = touchingFreeLightBulb( negativeProbe );

          // Set voltage to zero when both probes are touching the disconnected lightbulb
          if ( positiveToLight && negativeToLight ) {
            return 0;
          }

          // Set voltage to null when one (and only one) probe is on a disconnected lightbulb
          if ( ( positiveToLight && !negativeToLight ) || ( !positiveToLight && negativeToLight ) ) {
            return null;
          }

          // Set voltage to null when one (and only one) probe is on a disconnected battery
          else if ( ( positiveToBattery && !negativeToBattery ) || ( !positiveToBattery && negativeToBattery ) ) {
            return null;
          }
        }

        // Set voltage to null when one (and only one) probe is on a disconnected plate.
        if ( ( positiveToPlate && !negativeToPlate ) || ( !positiveToPlate && negativeToPlate ) ) {
          return null;
        }

        // Handle all other cases
        return self.circuit.getVoltageBetween( positiveProbe, negativeProbe );
      }
    };

    /**
     * Update the value of the meter. Called when many different properties change.
     */
    var updateValue = function() {
      self.measuredVoltageProperty.set( computeValue() );
    };

    // Update voltage reading if plate voltage changes
    circuit.capacitor.plateVoltageProperty.link( updateValue );

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
     * @public
     *
     * @returns {boolean}
     */
    probesAreTouching: function() {
      var posShape = this.shapeCreator.getPositiveProbeTipShape();
      var negShape = this.shapeCreator.getNegativeProbeTipShape();

      return posShape.bounds.intersectsBounds( negShape.bounds ) &&
             posShape.shapeIntersection( negShape ).getNonoverlappingArea() > 0;
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
