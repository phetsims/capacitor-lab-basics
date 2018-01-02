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
  var Bounds2 = require( 'DOT/Bounds2' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CircuitLocation = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitLocation' );
  var CLBModelViewTransform3D = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModelViewTransform3D' );
  var Vector3IO = require( 'DOT/Vector3IO' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NullableIO = require( 'ifphetio!PHET_IO/types/NullableIO' );
  var ParallelCircuit = require( 'CAPACITOR_LAB_BASICS/common/model/circuit/ParallelCircuit' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var Vector3 = require( 'DOT/Vector3' );
  var VoltmeterShapeCreator = require( 'CAPACITOR_LAB_BASICS/common/model/shapes/VoltmeterShapeCreator' );

  // phet-io modules
  var NumberIO = require( 'ifphetio!PHET_IO/types/NumberIO' );

  // constants
  // size of the probe tips, determined by visual inspection of the associated image files
  var PROBE_TIP_SIZE = new Dimension2( 0.0003, 0.0013 ); // meters

  // Initial locations when dragged out of toolbox
  var POSITIVE_PROBE_LOCATION = new Vector3( 0.0669, 0.0298, 0 );
  var NEGATIVE_PROBE_LOCATION = new Vector3( 0.0707, 0.0329, 0 );

  /**
   * @constructor
   *
   * @param {ParallelCircuit} circuit
   * @param {Bounds2} dragBounds
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Property.<boolean>} voltmeterVisibleProperty
   * @param {Tandem} tandem
   */
  function Voltmeter( circuit, dragBounds, modelViewTransform, voltmeterVisibleProperty, tandem ) {
    assert && assert( circuit instanceof ParallelCircuit );
    assert && assert( dragBounds instanceof Bounds2 );
    assert && assert( modelViewTransform instanceof CLBModelViewTransform3D );

    // @private {ParallelCircuit}
    this.circuit = circuit;

    // @public {Bounds2} (read-only)
    this.dragBounds = dragBounds;

    // @private {CLBModelViewTransform3D}
    this.modelViewTransform = modelViewTransform;

    // @public {Dimension2} (read-only)
    this.probeTipSizeReference = PROBE_TIP_SIZE;

    // @public {Property.<boolean>}
    this.visibleProperty = voltmeterVisibleProperty;

    // @public {Property.<boolean>}
    this.inUserControlProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'inUserControlProperty' )
    } );

    // @public {Property.<Vector3>}
    this.bodyLocationProperty = new Property( new Vector3(), {
      useDeepEquality: true,
      tandem: tandem.createTandem( 'bodyLocationProperty' ),
      phetioType: PropertyIO( Vector3IO )
    } );

    // @public {Property.<Vector3>}
    this.positiveProbeLocationProperty = new Property( POSITIVE_PROBE_LOCATION, {
      useDeepEquality: true,
      tandem: tandem.createTandem( 'positiveProbeLocationProperty' ),
      phetioType: PropertyIO( Vector3IO )
    } );

    // @public {Property.<Vector3>}
    this.negativeProbeLocationProperty = new Property( NEGATIVE_PROBE_LOCATION, {
      useDeepEquality: true,
      tandem: tandem.createTandem( 'negativeProbeLocationProperty' ),
      phetioType: PropertyIO( Vector3IO )
    } );

    // By design, the voltmeter reads "?" for disconnected contacts, which is represented internally by a null
    // assignment value.
    // @public {Property.<number|null>}
    this.measuredVoltageProperty = new Property( null, {
      tandem: tandem.createTandem( 'measuredVoltageProperty' ),
      units: 'volts',
      phetioType: PropertyIO( NullableIO( NumberIO ) )
    } );

    var self = this;

    // @public {VoltmeterShapeCreator} (read-only)
    this.shapeCreator = new VoltmeterShapeCreator( this, modelViewTransform );

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
     *
     * @returns {number} - voltage difference between probes
     */
    var computeValue = function() {

      if ( self.probesAreTouching() ) {
        return 0;
      }
      else {

        var positiveProbe = self.shapeCreator.getPositiveProbeTipShape();
        var negativeProbe = self.shapeCreator.getNegativeProbeTipShape();

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
          else {
            var positiveToBattery = touchingFreeBattery( positiveProbe );
            var negativeToBattery = touchingFreeBattery( negativeProbe );
            // Set voltage to null when one (and only one) probe is on a disconnected battery
            if ( ( positiveToBattery && !negativeToBattery ) || ( !positiveToBattery && negativeToBattery ) ) {
              return null;
            }
          }
        }

        // Booleans representing electrical contact between probes and circuit components.
        var positiveToPlate = touchingFreePlate( positiveProbe );
        var negativeToPlate = touchingFreePlate( negativeProbe );

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
      if ( self.visibleProperty.value ) {
        self.measuredVoltageProperty.value = computeValue();
      }
      else {
        self.measuredVoltageProperty.value = null;
      }
    };
    updateValue();

    // Since we don't update when not visible,
    this.visibleProperty.lazyLink( updateValue );

    // Update voltage reading if plate voltage changes
    circuit.capacitor.plateVoltageProperty.lazyLink( updateValue );

    // Update reading when the probes move
    Property.lazyMultilink( [ self.negativeProbeLocationProperty, self.positiveProbeLocationProperty ], updateValue );

    // Update all segments and the plate voltages when capacitor plate geometry changes. Capacitor may not exist yet.
    circuit.capacitor.plateSeparationProperty.lazyLink( updateValue );

    // Update the plate voltage when the capacitor plate size changes. Capacitor may not exist yet.
    circuit.capacitor.plateSizeProperty.lazyLink( updateValue );

    // update the value when the circuit connection property changes
    circuit.circuitConnectionProperty.lazyLink( updateValue );

    // Update when battery voltage changes
    circuit.battery.voltageProperty.lazyLink( updateValue );

    // Update when the switch is moving. NOTE: only listening to the top, since both get activated at the same time.
    circuit.capacitor.topCircuitSwitch.angleProperty.lazyLink( updateValue );
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
      this.inUserControlProperty.reset();
      this.bodyLocationProperty.reset();
      this.positiveProbeLocationProperty.reset();
      this.negativeProbeLocationProperty.reset();
      this.measuredVoltageProperty.reset();
    }
  } );
} );
