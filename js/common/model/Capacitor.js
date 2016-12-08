// Copyright 2015, University of Colorado Boulder

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
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 * @author Andrew Adare
 */

define( function( require ) {
  'use strict';

  // modules
  var Bounds3 = require( 'DOT/Bounds3' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CapacitorShapeCreator = require( 'CAPACITOR_LAB_BASICS/common/model/shapes/CapacitorShapeCreator' );
  var CircuitSwitch = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitSwitch' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var NumberProperty = require( 'AXON/NumberProperty' );
  var Property = require( 'AXON/Property' );
  var Vector3 = require( 'DOT/Vector3' );

  // phet-io modules
  var TBounds3 = require( 'ifphetio!PHET_IO/types/dot/TBounds3' );
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );

  /**
   * Constructor for the Capacitor.
   * @param {CircuitConfig} config
   * @param {Property.<CircuitConnectionEnum>} circuitConnectionProperty
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function Capacitor( config, circuitConnectionProperty, tandem, options ) {

    var location = new Vector3(
      CLBConstants.BATTERY_LOCATION.x + config.capacitorXSpacing,
      CLBConstants.BATTERY_LOCATION.y + config.capacitorYSpacing,
      CLBConstants.BATTERY_LOCATION.z );

    // options that populate the capacitor with various geometric properties
    options = _.extend( {
      plateWidth: CLBConstants.PLATE_WIDTH_RANGE.min,
      plateSeparation: CLBConstants.PLATE_SEPARATION_RANGE.max,
    }, options );

    // @public
    this.transientTime = 0; // model time updated when the switch is closed and while the capacitor is discharging
    this.voltageAtSwitchClose = 0; // voltage of the plates when the bulb switch is initially closed
    this.modelViewTransform = config.modelViewTransform;
    this.location = location;

    // @private
    this.shapeCreator = new CapacitorShapeCreator( this, config.modelViewTransform );

    // Square plates.
    var plateBounds = new Bounds3( 0, 0, 0, options.plateWidth, CLBConstants.PLATE_HEIGHT, options.plateWidth );

    // @public
    this.plateSizeProperty = new Property( plateBounds, {
      tandem: tandem.createTandem( 'plateSizeProperty' ),
      phetioValueType: TBounds3
    } );

    // @public
    this.plateSeparationProperty = new NumberProperty( options.plateSeparation, {
      tandem: tandem.createTandem( 'plateSeparationProperty' ),
      phetioValueType: TNumber( {
        units: 'meters',
        range: CLBConstants.PLATE_SEPARATION_RANGE
      } )
    } );

    // zero until it's connected into a circuit
    // @public
    this.platesVoltageProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'platesVoltageProperty' ),
      phetioValueType: TNumber( {
        units: 'volts'
      } )
    } );

    // Track the previous capacitance to adjust the inital voltage when discharging, see
    // updateDischargeParameters() below.
    // @private
    this.previousCapacitance = this.getCapacitance();

    // @public
    this.topCircuitSwitch = CircuitSwitch.TOP( config, circuitConnectionProperty,
      tandem.createTandem( 'topCircuitSwitch' ) );
    this.bottomCircuitSwitch = CircuitSwitch.BOTTOM( config, circuitConnectionProperty,
      tandem.createTandem( 'bottomCircuitSwitch' ) );

    // link the top and bottom circuit switches together so that they rotate together
    // as the user drags
    var self = this;
    //REVIEW: note about JS's handling of negating numbers not causing infinite loops here might be good. This would
    //        otherwise be a semi-dangerous pattern.
    this.topCircuitSwitch.angleProperty.link( function( angle ) {
      self.bottomCircuitSwitch.angleProperty.set( -angle );
    } );
    this.bottomCircuitSwitch.angleProperty.link( function( angle ) {
      self.topCircuitSwitch.angleProperty.set( -angle );
    } );

  }

  capacitorLabBasics.register( 'Capacitor', Capacitor );

  return inherit( Object, Capacitor, {

    /**
     * Convenience method, gets the area of one plate's top (or bottom) surfaces.
     * (design doc symbol: A)
     * @public
     *
     * @returns {number} area in meters^2
     */
    getPlateArea: function() {
      return this.plateSizeProperty.value.width * this.plateSizeProperty.value.depth;
    },

    /**
     * Sets width and depth of square plates. Thickness is constant.
     * (design doc symbol: L)
     * @public
     *
     * @param {number} plateWidth - meters
     */
    setPlateWidth: function( plateWidth ) {
      assert && assert( plateWidth > 0, 'plateWidth must be > 0: ' + plateWidth );
      this.plateSizeProperty.set( new Bounds3( 0, 0, 0, plateWidth, this.plateSizeProperty.value.height, plateWidth ) );
    },

    /**
     * Convenience method for determining the outside center of the top plate.  This is a wire attachment point.
     * @public
     *
     * @returns {Vector3}
     */
    getTopConnectionPoint: function() {
      return new Vector3(
        this.location.x,
        this.location.y - ( this.plateSeparationProperty.value / 2 ) - this.plateSizeProperty.value.height,
        this.location.z );
    },

    /**
     * Convenience method for determining the outside center of the bottom plate.  This is a wire attachment point.
     * @public
     *
     * @returns {Vector3}
     */
    getBottomConnectionPoint: function() {
      return new Vector3(
        this.location.x,
        this.location.y + ( this.plateSeparationProperty.value / 2 ) + this.plateSizeProperty.value.height,
        this.location.z );
    },

    /**
     * General formula for computing capacitance in vacuum.
     * @public
     *
     * @returns {number} capacitance in Farads
     */
    getCapacitance: function() {
      var d = this.plateSeparationProperty.value;
      assert && assert( d > 0, 'Plate separation is ' + d );
      return CLBConstants.EPSILON_0 * this.getPlateArea() / d;
    },

    /**
     * Does a Shape intersect the top plate shape?  Assumes that a shape is much smaller than the
     * top plate.  This is sufficient in the case of probes.
     * @public
     *
     * @param {Shape} shape
     * @returns {boolean}
     */
    intersectsTopPlate: function( shape ) {
      var intersectsTopPlate = false;
      //REVIEW: Why are we creating these shapes repeatedly? Presumably just create them on startup since they don't change.
      //REVIEW: Use _.some()
      this.shapeCreator.createTopPlateShape().forEach( function( topPlateShape ) {

        // kite does not support finding the intersection between two shapes and checking for
        // intersection of shape bounds is too inacurate in this case because of the 3d perspective.
        // Determining if center of shape bounds is most accurate assuming the shape is small relative
        // to the plate
        if ( topPlateShape.containsPoint( shape.bounds.center ) ) {
          intersectsTopPlate = true;
        }
      } );
      return intersectsTopPlate;
    },

    /**
     * Does a shape intersect the bottom plate shape?  Assumes that the shape is small relative
     * to the plate shape.
     * @public
     *
     * @param {Shape} shape
     * @returns {boolean}
     */
    intersectsBottomPlate: function( shape ) {
      var intersectsBottomPlate = false;
      //REVIEW: Why are we creating these shapes repeatedly? Presumably just create them on startup since they don't change.
      //REVIEW: Use _.some()
      this.shapeCreator.createBottomPlateShape().forEach( function( bottomPlateShape ) {
        if ( bottomPlateShape.containsPoint( shape.bounds.center ) ) {
          intersectsBottomPlate = true;
        }
      } );
      return intersectsBottomPlate;
    },

    /**
     * Gets the charge for the portion of the top plate.
     * If charge is less than half of an electron charge, return 0.
     * @public
     *
     * @returns {number} charge, in Coulombs
     */
    getPlateCharge: function() {
      var plateCharge = this.getCapacitance() * this.platesVoltageProperty.value;
      if ( Math.abs( plateCharge ) < CLBConstants.MIN_PLATE_CHARGE ) {
        return 0;
      }
      else {
        return plateCharge;
      }
    },

    /**
     * Gets the effective (net) field between the plates. This is uniform everywhere between the plates.
     * If the total charge on the plate is less than half that of a single electron, effective field is zero.
     * @public
     *
     * (design doc symbol: E_effective)
     *
     * @returns {number} Volts/meter
     */
    getEffectiveEField: function() {
      var plateCharge = this.getPlateCharge();
      if ( Math.abs( plateCharge ) < CLBConstants.MIN_PLATE_CHARGE ) {
        return 0;
      }
      else {
        return this.platesVoltageProperty.value / this.plateSeparationProperty.value;
      }
    },

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
    discharge: function( R, dt ) {
      var C = this.getCapacitance();

      this.transientTime += dt; // step time since switch was closed
      var exp = Math.exp( -this.transientTime / ( R * C ) );
      this.platesVoltageProperty.value = this.voltageAtSwitchClose * exp;

      this.previousCapacitance = C;
    },

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
     */
    updateDischargeParameters: function() {

      // in the discharge function, C is recalculated every time step, so we only need to adjust Vo.
      var capacitanceRatio = this.getCapacitance() / this.previousCapacitance;

      // update the initial voltage Vo
      this.voltageAtSwitchClose = this.platesVoltageProperty.value / capacitanceRatio;

      // reset transient time
      this.transientTime = 0;
    },

    // @public
    reset: function() {
      this.plateSizeProperty.reset();
      this.plateSeparationProperty.reset();
      this.platesVoltageProperty.reset();
    }

  } );
} );
