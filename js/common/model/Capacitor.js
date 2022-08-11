// Copyright 2015-2022, University of Colorado Boulder

/**
 * Model of a capacitor whose geometry can be directly manipulated by the user.
 *
 * A capacitor consists of 2 parallel, square plates, separated by vacuum.
 * There is no modeling of non-vacuum dielectric materials whatsoever in
 * Capacitor Lab: Basics.
 *
 * The capacitance (C) is solely dependent on its geometry. Charge (Q) on the
 * plates is a function of capacitance and voltage (V) across the plates: Q = CV
 *
 * Variable names used in this implementation where chosen to match the
 * specification in the design document, and therefore violate Java naming
 * conventions.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import DerivedProperty from '../../../../axon/js/DerivedProperty.js';
import NumberProperty from '../../../../axon/js/NumberProperty.js';
import Property from '../../../../axon/js/Property.js';
import Bounds3 from '../../../../dot/js/Bounds3.js';
import Vector3 from '../../../../dot/js/Vector3.js';
import merge from '../../../../phet-core/js/merge.js';
import BoxShapeCreator from '../../../../scenery-phet/js/capacitor/BoxShapeCreator.js';
import CapacitorConstants from '../../../../scenery-phet/js/capacitor/CapacitorConstants.js';
import NumberIO from '../../../../tandem/js/types/NumberIO.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';
import CLBConstants from '../CLBConstants.js';
import CircuitPosition from './CircuitPosition.js';
import CircuitState from './CircuitState.js';
import CircuitSwitch from './CircuitSwitch.js';

class Capacitor {
  /**
   * @param {CircuitConfig} config
   * @param {Property.<CircuitState>} circuitConnectionProperty
   * @param {Tandem} tandem
   * @param {Object} [options]
   */
  constructor( config, circuitConnectionProperty, tandem, options ) {

    // options that populate the capacitor with various geometric properties
    options = merge( {
      plateWidth: CapacitorConstants.PLATE_WIDTH_RANGE.defaultValue,
      plateSeparation: CapacitorConstants.PLATE_SEPARATION_RANGE.defaultValue
    }, options );

    // @public {number}
    this.voltageAtSwitchClose = 0; // voltage of the plates when the bulb switch is initially closed

    // @public {YawPitchModelViewTransform3}
    this.modelViewTransform = config.modelViewTransform;

    // @public {Vector3}
    this.position = new Vector3(
      CLBConstants.BATTERY_POSITION.x + config.capacitorXSpacing,
      CLBConstants.BATTERY_POSITION.y + config.capacitorYSpacing,
      CLBConstants.BATTERY_POSITION.z );

    // @private {BoxShapeCreator}
    this.shapeCreator = new BoxShapeCreator( config.modelViewTransform );

    // Square plates.
    const plateBounds = new Bounds3( 0, 0, 0, options.plateWidth, CapacitorConstants.PLATE_HEIGHT, options.plateWidth );

    // @public {Property.<Bounds3>}
    this.plateSizeProperty = new Property( plateBounds, {
      tandem: tandem.createTandem( 'plateSizeProperty' ),
      phetioValueType: Bounds3.Bounds3IO,
      phetioReadOnly: true
    } );

    // @public {Property.<number>}
    this.plateSeparationProperty = new NumberProperty( options.plateSeparation, {
      tandem: tandem.createTandem( 'plateSeparationProperty' ),
      units: 'm',
      range: CapacitorConstants.PLATE_SEPARATION_RANGE
    } );

    // @public {Property.<number>} - zero until it's connected into a circuit
    this.plateVoltageProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'plateVoltageProperty' ),
      units: 'V',
      phetioReadOnly: true
    } );

    // @public {Property.<number>}
    this.capacitanceProperty = new DerivedProperty( [ this.plateSeparationProperty, this.plateSizeProperty ],
      ( plateSeparation, plateSize ) => {
        assert && assert( plateSeparation > 0, `Plate separation is ${plateSeparation}` );
        return CLBConstants.EPSILON_0 * plateSize.width * plateSize.depth / plateSeparation;
      }, {
        tandem: tandem.createTandem( 'capacitanceProperty' ),
        units: 'F',
        phetioValueType: NumberIO
      } );

    this.capacitanceProperty.lazyLink( ( capacitance, oldCapacitance ) => {
      // plateSizeProperty => capacitanceProperty => changes plateVoltageProperty after plateVoltageProperty was set, so
      // since this doesn't apply when we're setting state, we opt out.
      if ( circuitConnectionProperty.value === CircuitState.LIGHT_BULB_CONNECTED && !phet.joist.sim.isSettingPhetioStateProperty.value ) {
        this.updateDischargeParameters( capacitance, oldCapacitance );
      }
    } );

    // @public {Property.<number>} Charge on top plate of capacitor
    this.plateChargeProperty = new DerivedProperty( [ this.capacitanceProperty, this.plateVoltageProperty, circuitConnectionProperty ],
      ( capacitance, voltage, circuitConnection ) => {
        const charge = capacitance * voltage;

        // Force an underflow to zero below the threshold for stability
        return circuitConnection ? ( Math.abs( charge ) < CLBConstants.MIN_PLATE_CHARGE ? 0 : charge ) : 0;
      }, {
        tandem: tandem.createTandem( 'plateChargeProperty' ),
        units: 'C',
        phetioValueType: NumberIO
      } );

    // @public {Property.<number>}
    this.storedEnergyProperty = new DerivedProperty( [ this.capacitanceProperty, this.plateVoltageProperty ],
      ( capacitance, voltage ) => 0.5 * capacitance * voltage * voltage, {
        tandem: tandem.createTandem( 'storedEnergyProperty' ),
        units: 'J',
        phetioValueType: NumberIO
      } );

    // @public {CircuitSwitch}
    this.topCircuitSwitch = CircuitSwitch.TOP( config, circuitConnectionProperty,
      tandem.createTandem( 'topCircuitSwitch' ) );

    // @public {CircuitSwitch}
    this.bottomCircuitSwitch = CircuitSwitch.BOTTOM( config, circuitConnectionProperty,
      tandem.createTandem( 'bottomCircuitSwitch' ) );

    // link the top and bottom circuit switches together so that they rotate together
    // as the user drags

    // JS handles negative numbers precisely so there will not be an infinite
    // loop here due to mutual recursion.
    this.topCircuitSwitch.angleProperty.link( angle => {
      this.bottomCircuitSwitch.angleProperty.set( -angle );
    } );
    this.bottomCircuitSwitch.angleProperty.link( angle => {
      this.topCircuitSwitch.angleProperty.set( -angle );
    } );
  }


  /**
   * Convenience method, gets the area of one plate's top (or bottom) surfaces.
   * (design doc symbol: A)
   * @public
   *
   * @returns {number} area in meters^2
   */
  getPlateArea() {
    return this.plateSizeProperty.value.width * this.plateSizeProperty.value.depth;
  }

  /**
   * Sets width and depth of square plates. Thickness is constant.
   * (design doc symbol: L)
   * @public
   *
   * @param {number} plateWidth - meters
   */
  setPlateWidth( plateWidth ) {
    assert && assert( plateWidth > 0, `plateWidth must be > 0: ${plateWidth}` );
    this.plateSizeProperty.set( new Bounds3( 0, 0, 0, plateWidth, this.plateSizeProperty.value.height, plateWidth ) );
  }

  /**
   * Convenience method for determining the outside center of the top plate.  This is a wire attachment point.
   * @public
   *
   * @returns {Vector3}
   */
  getTopConnectionPoint() {
    return new Vector3(
      this.position.x,
      this.position.y - ( this.plateSeparationProperty.value / 2 ) - this.plateSizeProperty.value.height,
      this.position.z );
  }

  /**
   * Convenience method for determining the outside center of the bottom plate.  This is a wire attachment point.
   * @public
   *
   * @returns {Vector3}
   */
  getBottomConnectionPoint() {
    return new Vector3(
      this.position.x,
      this.position.y + ( this.plateSeparationProperty.value / 2 ) + this.plateSizeProperty.value.height,
      this.position.z );
  }

  /**
   * Check for intersection between a voltmeter probe and the plate faces at either the top or
   * bottom plate positions, as specified by the position parameter. Assumes that the probe shape
   * is much smaller than the top plate.
   * @public
   *
   * @param {Shape} probe
   * @param {CircuitPosition} position - CircuitPosition.CAPACITOR_TOP or CircuitPosition.CAPACITOR_BOTTOM
   * @returns {boolean}
   */
  contacts( probe, position ) {

    assert && assert( position === CircuitPosition.CAPACITOR_TOP || position === CircuitPosition.CAPACITOR_BOTTOM,
      `Invalid capacitor position: ${position}` );

    let shape;
    const size = this.plateSizeProperty.value;
    if ( position === CircuitPosition.CAPACITOR_TOP ) {
      shape = this.shapeCreator.createBoxShape( this.position.x, this.getTopConnectionPoint().y, this.position.z, size.width, size.height, size.depth );
    }
    else if ( position === CircuitPosition.CAPACITOR_BOTTOM ) {
      shape = this.shapeCreator.createBoxShape( this.position.x, this.position.y + this.plateSeparationProperty.value / 2, this.position.z, size.width, size.height, size.depth );
    }

    let contacts = probe.bounds.intersectsBounds( shape.bounds ) &&
                   probe.shapeIntersection( shape ).getNonoverlappingArea() > 0;

    if ( !contacts && position === CircuitPosition.CAPACITOR_TOP ) {
      contacts = this.topCircuitSwitch.contacts( probe );
    }
    else if ( !contacts && position === CircuitPosition.CAPACITOR_BOTTOM ) {
      contacts = this.bottomCircuitSwitch.contacts( probe );
    }

    return contacts;
  }

  /**
   * Gets the effective (net) field between the plates. This is uniform everywhere between the plates.
   * If the total charge on the plate is less than half that of a single electron, effective field is zero.
   * @public
   *
   * (design doc symbol: E_effective)
   *
   * @returns {number} Volts/meter
   */
  getEffectiveEField() {
    const plateCharge = this.plateChargeProperty.value;
    if ( Math.abs( plateCharge ) < CLBConstants.MIN_PLATE_CHARGE ) {
      return 0;
    }
    else {
      return this.plateVoltageProperty.value / this.plateSeparationProperty.value;
    }
  }

  /**
   * Discharge the capacitor when it is in parallel with some resistance.  This updates the voltage of the plates
   * assuming the solution
   *
   * Vc = Vo*exp( -t / ( R * C ) )
   *
   * to the differential equation
   *
   * Ic = - R*C * dVc/dt
   *
   * @public
   *
   * @param {number} R
   * @param {number} dt
   */
  discharge( R, dt ) {
    this.plateVoltageProperty.value *= Math.exp( -dt / ( R * this.capacitanceProperty.value ) );
  }

  /**
   * It is possible to change the capacitance while the capacitor is discharging.  The parameters
   * for the solution
   *
   * Vc = Vo*exp( -t / ( R * C ) )
   *
   * need to change.
   *
   * Suppose that the capacitor has capacitance C1 with charge Q1 and voltage V1.  The capacitance
   * is instantaneously increased to C2.  The charge will remain Q1, but the voltage will decrease
   * proportionally from V1 to V2, like V2 = V1 / ( C2 / C1 ).  The RC time constant also needs to
   * change since C has been updated.  This assumes that the capacitance changes instantaneously.
   *
   * Therefore, the solution needs to change to
   * Vc = V2 * exp( -t / ( R * C2 ) )
   *
   * @public
   *
   * @param {number} newCapacitance
   * @param {number} oldCapacitance
   */
  updateDischargeParameters( newCapacitance, oldCapacitance ) {

    // in the discharge function, C is recalculated every time step, so we only need to adjust Vo.
    const capacitanceRatio = newCapacitance / oldCapacitance;

    this.plateVoltageProperty.value = this.plateVoltageProperty.value / capacitanceRatio;
  }

  // @public
  reset() {
    this.plateSizeProperty.reset();
    this.plateSeparationProperty.reset();
    this.plateVoltageProperty.reset();
  }
}

capacitorLabBasics.register( 'Capacitor', Capacitor );

export default Capacitor;