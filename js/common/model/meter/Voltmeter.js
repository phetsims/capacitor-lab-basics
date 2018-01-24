// Copyright 2015-2018, University of Colorado Boulder

/**
 * Voltmeter model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CircuitLocation = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitLocation' );
  var CircuitState = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitState' );
  var CLBModelViewTransform3D = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModelViewTransform3D' );
  var Vector3IO = require( 'DOT/Vector3IO' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NullableIO = require( 'ifphetio!PHET_IO/types/NullableIO' );
  var ParallelCircuit = require( 'CAPACITOR_LAB_BASICS/common/model/ParallelCircuit' );
  var ProbeTarget = require( 'CAPACITOR_LAB_BASICS/common/model/ProbeTarget' );
  var Property = require( 'AXON/Property' );
  var PropertyIO = require( 'AXON/PropertyIO' );
  var StringIO = require( 'ifphetio!PHET_IO/types/StringIO' );
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
    this.isDraggedProperty = new BooleanProperty( false, {
      tandem: tandem.createTandem( 'isDraggedProperty' ),
      phetioInstanceDocumentation: 'Indicates whether the user is currently dragging the voltmeter'
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

    // TODO: factor out shared code for positive/negative probe
    // @public {Property.<ProbeTarget>} - What the positive probe is currently touching. Updated from within computeValue below.
    this.positiveProbeTargetProperty = new Property( ProbeTarget.NONE, {
      tandem: tandem.createTandem( 'positiveProbeTargetProperty' ),
      phetioType: PropertyIO( StringIO )
    } );

    // @public {Property.<ProbeTarget>} - What the negative probe is currently touching. Updated from within computeValue below.
    this.negativeProbeTargetProperty = new Property( ProbeTarget.NONE, {
      tandem: tandem.createTandem( 'negativeProbeTargetProperty' ),
      phetioType: PropertyIO( StringIO )
    } );

    var self = this;

    // @public {VoltmeterShapeCreator} (read-only)
    this.shapeCreator = new VoltmeterShapeCreator( this, modelViewTransform );

    var getProbeTarget = function( probe ) {
      if ( self.probesAreTouching() ) {
        return ProbeTarget.OTHER_PROBE;
      }
      if ( self.circuit.lightBulb ) {
        if ( self.circuit.lightBulb.intersectsBulbTopBase( probe ) ) {
          return ProbeTarget.LIGHT_BULB_TOP;
        }
        if ( self.circuit.lightBulb.intersectsBulbBottomBase( probe ) ) {
          return ProbeTarget.LIGHT_BULB_BOTTOM;
        }
      }
      if ( self.circuit.battery.contacts( probe ) ) {
        return ProbeTarget.BATTERY_TOP_TERMINAL;
      }

      if ( self.circuit.capacitor.topCircuitSwitch.contacts( probe ) ) {
        return ProbeTarget.SWITCH_CONNECTION_TOP;
      }
      if ( self.circuit.capacitor.bottomCircuitSwitch.contacts( probe ) ) {
        return ProbeTarget.SWITCH_CONNECTION_BOTTOM;
      }

      // NOTE: Capacitor checks include the switch connections, so those need to be checked first
      if ( self.circuit.capacitor.contacts( probe, CircuitLocation.CAPACITOR_TOP ) ) {
        return ProbeTarget.CAPACITOR_TOP;
      }
      if ( self.circuit.capacitor.contacts( probe, CircuitLocation.CAPACITOR_BOTTOM ) ) {
        return ProbeTarget.CAPACITOR_BOTTOM;
      }

      // Check circuit switch wires first here, since they are included as part of CircuitLocation.CAPACITOR_X
      if ( self.circuit.capacitor.topCircuitSwitch.switchWire.contacts( probe ) ) {
        return ProbeTarget.WIRE_SWITCH_TOP;
      }
      if ( self.circuit.capacitor.bottomCircuitSwitch.switchWire.contacts( probe ) ) {
        return ProbeTarget.WIRE_SWITCH_BOTTOM;
      }

      // Check for wire intersections last
      if ( self.circuit.shapeTouchesWireGroup( probe, CircuitLocation.CAPACITOR_TOP ) ) {
        return ProbeTarget.WIRE_CAPACITOR_TOP;
      }
      if ( self.circuit.shapeTouchesWireGroup( probe, CircuitLocation.CAPACITOR_BOTTOM ) ) {
        return ProbeTarget.WIRE_CAPACITOR_BOTTOM;
      }
      if ( self.circuit.shapeTouchesWireGroup( probe, CircuitLocation.BATTERY_TOP ) ) {
        return ProbeTarget.WIRE_BATTERY_TOP;
      }
      if ( self.circuit.shapeTouchesWireGroup( probe, CircuitLocation.BATTERY_BOTTOM ) ) {
        return ProbeTarget.WIRE_BATTERY_BOTTOM;
      }
      if ( self.circuit.shapeTouchesWireGroup( probe, CircuitLocation.LIGHT_BULB_TOP ) ) {
        return ProbeTarget.WIRE_LIGHT_BULB_TOP;
      }
      if ( self.circuit.shapeTouchesWireGroup( probe, CircuitLocation.LIGHT_BULB_BOTTOM ) ) {
        return ProbeTarget.WIRE_LIGHT_BULB_BOTTOM;
      }

      return ProbeTarget.NONE;
    };

    // NOTE: does not use CIRCUIT_SWITCH locations, only CAPACITOR ones (since they are always connected)
    var getCircuitLocation = function( probeTarget ) {
      switch ( probeTarget ) {
        case ProbeTarget.BATTERY_TOP_TERMINAL: return CircuitLocation.BATTERY_TOP;
        case ProbeTarget.LIGHT_BULB_TOP: return CircuitLocation.LIGHT_BULB_TOP;
        case ProbeTarget.LIGHT_BULB_BOTTOM: return CircuitLocation.LIGHT_BULB_BOTTOM;
        case ProbeTarget.CAPACITOR_TOP: return CircuitLocation.CAPACITOR_TOP;
        case ProbeTarget.CAPACITOR_BOTTOM: return CircuitLocation.CAPACITOR_BOTTOM;
        case ProbeTarget.SWITCH_TOP: return CircuitLocation.CAPACITOR_TOP;
        case ProbeTarget.SWITCH_BOTTOM: return CircuitLocation.CAPACITOR_BOTTOM;
        case ProbeTarget.SWITCH_CONNECTION_TOP: return CircuitLocation.CAPACITOR_TOP;
        case ProbeTarget.SWITCH_CONNECTION_BOTTOM: return CircuitLocation.CAPACITOR_BOTTOM;
        case ProbeTarget.WIRE_CAPACITOR_TOP: return CircuitLocation.CAPACITOR_TOP;
        case ProbeTarget.WIRE_CAPACITOR_BOTTOM: return CircuitLocation.CAPACITOR_BOTTOM;
        case ProbeTarget.WIRE_BATTERY_TOP: return CircuitLocation.BATTERY_TOP;
        case ProbeTarget.WIRE_BATTERY_BOTTOM: return CircuitLocation.BATTERY_BOTTOM;
        case ProbeTarget.WIRE_LIGHT_BULB_TOP: return CircuitLocation.LIGHT_BULB_TOP;
        case ProbeTarget.WIRE_LIGHT_BULB_BOTTOM: return CircuitLocation.LIGHT_BULB_BOTTOM;
        case ProbeTarget.WIRE_SWITCH_TOP: return CircuitLocation.CAPACITOR_TOP;
        case ProbeTarget.WIRE_SWITCH_BOTTOM: return CircuitLocation.CAPACITOR_BOTTOM;
        default: throw new Error( 'Unsupported probe target (no circuit location for it): ' + probeTarget );
      }
    };

    /**
     * Compute voltage reading for meter, called when many different properties change
     * Null values correspond to a ? on the voltmeter.
     *
     * @returns {number|null} - voltage difference between probes
     */
    var computeValue = function() {
      var positiveProbeTarget = self.positiveProbeTargetProperty.value;
      var negativeProbeTarget = self.negativeProbeTargetProperty.value;

      // If one probe is disconnected, return null.
      if ( positiveProbeTarget === ProbeTarget.NONE || negativeProbeTarget === ProbeTarget.NONE ) {
        return null;
      }

      // Sanity check for both as "other probe"
      if ( positiveProbeTarget === ProbeTarget.OTHER_PROBE || negativeProbeTarget === ProbeTarget.OTHER_PROBE ) {
        return 0;
      }

      var positiveCircuitLocation = getCircuitLocation( positiveProbeTarget );
      var negativeCircuitLocation = getCircuitLocation( negativeProbeTarget );

      // If the probes are touching the same location, there should be no voltage change
      if ( positiveCircuitLocation === negativeCircuitLocation ) {
        return 0;
      }

      // Closed circuit between battery and capacitor
      if ( self.circuit.circuitConnectionProperty.value === CircuitState.BATTERY_CONNECTED ) {
        if ( CircuitLocation.isCapacitor( positiveCircuitLocation ) ) {
          positiveCircuitLocation = CircuitLocation.isTop( positiveCircuitLocation ) ? CircuitLocation.BATTERY_TOP : CircuitLocation.BATTERY_BOTTOM;
        }
        if ( CircuitLocation.isCapacitor( negativeCircuitLocation ) ) {
          negativeCircuitLocation = CircuitLocation.isTop( negativeCircuitLocation ) ? CircuitLocation.BATTERY_TOP : CircuitLocation.BATTERY_BOTTOM;
        }
      }
      // Closed circuit between light bulb and capacitor
      else if ( self.circuit.circuitConnectionProperty.value === CircuitState.LIGHT_BULB_CONNECTED ) {
        if ( CircuitLocation.isLightBulb( positiveCircuitLocation ) ) {
          positiveCircuitLocation = CircuitLocation.isTop( positiveCircuitLocation ) ? CircuitLocation.CAPACITOR_TOP : CircuitLocation.CAPACITOR_BOTTOM;
        }
        if ( CircuitLocation.isLightBulb( negativeCircuitLocation ) ) {
          negativeCircuitLocation = CircuitLocation.isTop( negativeCircuitLocation ) ? CircuitLocation.CAPACITOR_TOP : CircuitLocation.CAPACITOR_BOTTOM;
        }
      }

      // If the probes are touching the same location, there should be no voltage change
      if ( positiveCircuitLocation === negativeCircuitLocation ) {
        return 0;
      }
      else if ( CircuitLocation.isBattery( positiveCircuitLocation ) && CircuitLocation.isBattery( negativeCircuitLocation ) ) {
        return ( CircuitLocation.isTop( positiveCircuitLocation ) ? 1 : -1 ) * self.circuit.getTotalVoltage();
      }
      else if ( CircuitLocation.isCapacitor( positiveCircuitLocation ) && CircuitLocation.isCapacitor( negativeCircuitLocation ) ) {
        return ( CircuitLocation.isTop( positiveCircuitLocation ) ? 1 : -1 ) * self.circuit.getCapacitorPlateVoltage();
      }
      else if ( CircuitLocation.isLightBulb( positiveCircuitLocation ) && CircuitLocation.isLightBulb( negativeCircuitLocation ) ) {
        return 0;
      }
      else {
        return null;
      }

    };

    /**
     * Update the value of the meter. Called when many different properties change.
     */
    var updateValue = function() {
      if ( self.visibleProperty.value ) {
        self.positiveProbeTargetProperty.value = getProbeTarget( self.shapeCreator.getPositiveProbeTipShape() );
        self.negativeProbeTargetProperty.value = getProbeTarget( self.shapeCreator.getNegativeProbeTipShape() );
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
      this.isDraggedProperty.reset();
      this.bodyLocationProperty.reset();
      this.positiveProbeLocationProperty.reset();
      this.negativeProbeLocationProperty.reset();
      this.measuredVoltageProperty.reset();
    }
  } );
} );
