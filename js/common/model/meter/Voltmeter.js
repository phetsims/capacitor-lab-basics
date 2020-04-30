// Copyright 2015-2020, University of Colorado Boulder

/**
 * Voltmeter model.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../../axon/js/BooleanProperty.js';
import Property from '../../../../../axon/js/Property.js';
import PropertyIO from '../../../../../axon/js/PropertyIO.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Dimension2 from '../../../../../dot/js/Dimension2.js';
import Vector3 from '../../../../../dot/js/Vector3.js';
import Vector3IO from '../../../../../dot/js/Vector3IO.js';
import inherit from '../../../../../phet-core/js/inherit.js';
import YawPitchModelViewTransform3 from '../../../../../scenery-phet/js/capacitor/YawPitchModelViewTransform3.js';
import NullableIO from '../../../../../tandem/js/types/NullableIO.js';
import NumberIO from '../../../../../tandem/js/types/NumberIO.js';
import StringIO from '../../../../../tandem/js/types/StringIO.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';
import CircuitPosition from '../CircuitPosition.js';
import CircuitState from '../CircuitState.js';
import ParallelCircuit from '../ParallelCircuit.js';
import ProbeTarget from '../ProbeTarget.js';
import VoltmeterShapeCreator from '../shapes/VoltmeterShapeCreator.js';

// constants
// size of the probe tips, determined by visual inspection of the associated image files
const PROBE_TIP_SIZE = new Dimension2( 0.0003, 0.0013 ); // meters

// Initial positions when dragged out of toolbox
const POSITIVE_PROBE_POSITION = new Vector3( 0.0669, 0.0298, 0 );
const NEGATIVE_PROBE_POSITION = new Vector3( 0.0707, 0.0329, 0 );

/**
 * @constructor
 *
 * @param {ParallelCircuit} circuit
 * @param {Bounds2} dragBounds
 * @param {YawPitchModelViewTransform3} modelViewTransform
 * @param {Property.<boolean>} voltmeterVisibleProperty
 * @param {Tandem} tandem
 */
function Voltmeter( circuit, dragBounds, modelViewTransform, voltmeterVisibleProperty, tandem ) {
  assert && assert( circuit instanceof ParallelCircuit );
  assert && assert( dragBounds instanceof Bounds2 );
  assert && assert( modelViewTransform instanceof YawPitchModelViewTransform3 );

  // @private {ParallelCircuit}
  this.circuit = circuit;

  // @public {Bounds2} (read-only)
  this.dragBounds = dragBounds;

  // @private {YawPitchModelViewTransform3}
  this.modelViewTransform = modelViewTransform;

  // @public {Dimension2} (read-only)
  this.probeTipSizeReference = PROBE_TIP_SIZE;

  // @public {Property.<boolean>}
  this.visibleProperty = voltmeterVisibleProperty;

  // @public {Property.<boolean>}
  this.isDraggedProperty = new BooleanProperty( false, {
    tandem: tandem.createTandem( 'isDraggedProperty' ),
    phetioDocumentation: 'Indicates whether the user is currently dragging the voltmeter'
  } );

  // @public {Property.<Vector3>}
  this.bodyPositionProperty = new Property( new Vector3( 0, 0, 0 ), {
    useDeepEquality: true,
    tandem: tandem.createTandem( 'bodyPositionProperty' ),
    phetioType: PropertyIO( Vector3IO )
  } );

  // @public {Property.<Vector3>}
  this.positiveProbePositionProperty = new Property( POSITIVE_PROBE_POSITION, {
    useDeepEquality: true,
    tandem: tandem.createTandem( 'positiveProbePositionProperty' ),
    phetioType: PropertyIO( Vector3IO )
  } );

  // @public {Property.<Vector3>}
  this.negativeProbePositionProperty = new Property( NEGATIVE_PROBE_POSITION, {
    useDeepEquality: true,
    tandem: tandem.createTandem( 'negativeProbePositionProperty' ),
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
  // @private {Property.<ProbeTarget>} - What the positive probe is currently touching. Updated from within computeValue below.
  this.positiveProbeTargetProperty = new Property( ProbeTarget.NONE, {
    tandem: tandem.createTandem( 'positiveProbeTargetProperty' ),
    phetioType: PropertyIO( StringIO )
  } );

  // @private {Property.<ProbeTarget>} - What the negative probe is currently touching. Updated from within computeValue below.
  this.negativeProbeTargetProperty = new Property( ProbeTarget.NONE, {
    tandem: tandem.createTandem( 'negativeProbeTargetProperty' ),
    phetioType: PropertyIO( StringIO )
  } );

  const self = this;

  // @public {VoltmeterShapeCreator} (read-only)
  this.shapeCreator = new VoltmeterShapeCreator( this, modelViewTransform );

  /**
   * Update the value of the meter. Called when many different properties change.
   */
  const updateValue = function() {
    if ( self.visibleProperty.value ) {
      const probesTouching = self.probesAreTouching();
      self.positiveProbeTargetProperty.value = probesTouching ? ProbeTarget.OTHER_PROBE : self.circuit.getProbeTarget( self.shapeCreator.getPositiveProbeTipShape() );
      self.negativeProbeTargetProperty.value = probesTouching ? ProbeTarget.OTHER_PROBE : self.circuit.getProbeTarget( self.shapeCreator.getNegativeProbeTipShape() );
      self.measuredVoltageProperty.value = self.computeValue();
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
  Property.lazyMultilink( [ self.negativeProbePositionProperty, self.positiveProbePositionProperty ], updateValue );

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

inherit( Object, Voltmeter, {
  /**
   * Computes the voltage reading for this voltmeter (null corresponds to a ? on the voltmeter)
   * @private
   *
   * @returns {number|null} - voltage difference between probes
   */
  computeValue: function() {
    const positiveProbeTarget = this.positiveProbeTargetProperty.value;
    const negativeProbeTarget = this.negativeProbeTargetProperty.value;

    // If one probe is disconnected, return null.
    if ( positiveProbeTarget === ProbeTarget.NONE || negativeProbeTarget === ProbeTarget.NONE ) {
      return null;
    }

    // Sanity check for both as "other probe"
    if ( positiveProbeTarget === ProbeTarget.OTHER_PROBE || negativeProbeTarget === ProbeTarget.OTHER_PROBE ) {
      return 0;
    }

    let positiveCircuitPosition = ProbeTarget.getCircuitPosition( positiveProbeTarget );
    let negativeCircuitPosition = ProbeTarget.getCircuitPosition( negativeProbeTarget );

    // If the probes are touching the same position, there should be no voltage change. We check here first so we can
    // bail out and avoid any more work (even though we do a very similar check below).
    if ( positiveCircuitPosition === negativeCircuitPosition ) {
      return 0;
    }

    // Closed circuit between battery and capacitor
    if ( this.circuit.circuitConnectionProperty.value === CircuitState.BATTERY_CONNECTED ) {
      // Shift capacitor positions to battery positions (since we use the total voltage for anything connected to the capacitor)
      if ( CircuitPosition.isCapacitor( positiveCircuitPosition ) ) {
        positiveCircuitPosition = CircuitPosition.isTop( positiveCircuitPosition ) ? CircuitPosition.BATTERY_TOP : CircuitPosition.BATTERY_BOTTOM;
      }
      if ( CircuitPosition.isCapacitor( negativeCircuitPosition ) ) {
        negativeCircuitPosition = CircuitPosition.isTop( negativeCircuitPosition ) ? CircuitPosition.BATTERY_TOP : CircuitPosition.BATTERY_BOTTOM;
      }
    }
    // Closed circuit between light bulb and capacitor
    else if ( this.circuit.circuitConnectionProperty.value === CircuitState.LIGHT_BULB_CONNECTED ) {
      // Shift light bulb positions to capacitor positions (since we use the capacitor plate voltage for anything connected to the light bulb)
      if ( CircuitPosition.isLightBulb( positiveCircuitPosition ) ) {
        positiveCircuitPosition = CircuitPosition.isTop( positiveCircuitPosition ) ? CircuitPosition.CAPACITOR_TOP : CircuitPosition.CAPACITOR_BOTTOM;
      }
      if ( CircuitPosition.isLightBulb( negativeCircuitPosition ) ) {
        negativeCircuitPosition = CircuitPosition.isTop( negativeCircuitPosition ) ? CircuitPosition.CAPACITOR_TOP : CircuitPosition.CAPACITOR_BOTTOM;
      }
    }

    // If the probes are touching the same position, there should be no voltage change. This is different from the
    // above check (with the same code) since we have potentially remapped some of the circuit positions.
    if ( positiveCircuitPosition === negativeCircuitPosition ) {
      return 0;
    }
    // If probes are on opposite sides of the battery
    else if ( CircuitPosition.isBattery( positiveCircuitPosition ) && CircuitPosition.isBattery( negativeCircuitPosition ) ) {
      return ( CircuitPosition.isTop( positiveCircuitPosition ) ? 1 : -1 ) * this.circuit.getTotalVoltage();
    }
    // If probes are on opposite sides of the capacitor (and can't be connected to the battery, see above)
    else if ( CircuitPosition.isCapacitor( positiveCircuitPosition ) && CircuitPosition.isCapacitor( negativeCircuitPosition ) ) {
      return ( CircuitPosition.isTop( positiveCircuitPosition ) ? 1 : -1 ) * this.circuit.getCapacitorPlateVoltage();
    }
    // If probes are on opposite sides of the light bulb (and can't be connected to the capacitor, see above)
    else if ( CircuitPosition.isLightBulb( positiveCircuitPosition ) && CircuitPosition.isLightBulb( negativeCircuitPosition ) ) {
      return 0;
    }
    // Probes are not touching a connected component
    else {
      return null;
    }
  },

  /**
   * Probes are touching if their tips intersect.
   * @public
   *
   * @returns {boolean}
   */
  probesAreTouching: function() {
    const posShape = this.shapeCreator.getPositiveProbeTipShape();
    const negShape = this.shapeCreator.getNegativeProbeTipShape();

    return posShape.bounds.intersectsBounds( negShape.bounds ) &&
           posShape.shapeIntersection( negShape ).getNonoverlappingArea() > 0;
  },

  // @public
  reset: function() {
    this.isDraggedProperty.reset();
    this.bodyPositionProperty.reset();
    this.positiveProbePositionProperty.reset();
    this.negativeProbePositionProperty.reset();
    this.measuredVoltageProperty.reset();
    this.positiveProbeTargetProperty.reset();
    this.negativeProbeTargetProperty.reset();
  }
} );

export default Voltmeter;
