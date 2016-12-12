// Copyright 2016, University of Colorado Boulder

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
  var DerivedProperty = require( 'AXON/DerivedProperty' );
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
   * @param {Property.<CircuitState>} circuitConnectionProperty
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
    this.plateVoltageProperty = new NumberProperty( 0, {
      tandem: tandem.createTandem( 'plateVoltageProperty' ),
      phetioValueType: TNumber( {
        units: 'volts'
      } )
    } );

    // @public
    this.capacitanceProperty = new DerivedProperty( [ this.plateSeparationProperty, this.plateSizeProperty ],
      function( plateSeparation, plateSize ) {
        assert && assert( plateSeparation > 0, 'Plate separation is ' + plateSeparation );
        return CLBConstants.EPSILON_0 * plateSize.width * plateSize.depth / plateSeparation;
      }, {
        tandem: tandem.createTandem( 'capacitanceProperty' ),
        phetioValueType: TNumber( {units: 'Farads' } )
      } );

    // Charge on top plate of capacitor
    // @public
    this.plateChargeProperty = new DerivedProperty( [ this.capacitanceProperty, this.plateVoltageProperty ],
      function( capacitance, voltage ) {
        var charge = capacitance * voltage;

        // Force an underflow to zero below the threshold for stability
        if ( Math.abs( charge ) < CLBConstants.MIN_PLATE_CHARGE ) {
          charge = 0;
        }
        return charge;
      }, {
        tandem: tandem.createTandem( 'plateChargeProperty' ),
        phetioValueType: TNumber( {units: 'Coulombs' } )
      } );

    // @public
    this.storedEnergyProperty = new DerivedProperty( [ this.capacitanceProperty, this.plateVoltageProperty ],
      function( capacitance, voltage ) {
        return 0.5 * capacitance * voltage * voltage;
      }, {
        tandem: tandem.createTandem( 'storedEnergyProperty' ),
        phetioValueType: TNumber( {units: 'Joules' } )
      } );

    // Track the previous capacitance to adjust the inital voltage when discharging, see
    // updateDischargeParameters() below.
    // @private
    this.previousCapacitance = this.capacitanceProperty.value;

    // @public
    this.topCircuitSwitch = CircuitSwitch.TOP( config, circuitConnectionProperty,
      tandem.createTandem( 'topCircuitSwitch' ) );
    this.bottomCircuitSwitch = CircuitSwitch.BOTTOM( config, circuitConnectionProperty,
      tandem.createTandem( 'bottomCircuitSwitch' ) );

    this.topPlateFaces = this.shapeCreator.createTopPlateShape();
    this.bottomPlateFaces = this.shapeCreator.createBottomPlateShape();

    // link the top and bottom circuit switches together so that they rotate together
    // as the user drags
    var self = this;

    // JS handles negative numbers precisely so there will not be an infinite
    // loop here due to mutual recursion.
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
     * Does a Shape intersect the top plate shape?  Assumes that a shape is much smaller than the
     * top plate.  This is sufficient in the case of probes.
     * @public
     *
     * @param {Shape} shape
     * @returns {boolean}
     */
    intersectsTopPlate: function( shape ) {

      // kite does not support finding the intersection between two shapes and checking for
      // intersection of shape bounds is too inacurate in this case because of the 3d perspective.
      // Determining if center of shape bounds is most accurate assuming the shape is small relative
      // to the plate
      return _.some( this.topPlateFaces, function( plateShape ) {
        plateShape.containsPoint( shape.bounds.center );
      } );
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
      return _.some( this.bottomPlateFaces, function( plateShape ) {
        plateShape.containsPoint( shape.bounds.center );
      } );
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
      var plateCharge = this.plateChargeProperty.value;
      if ( Math.abs( plateCharge ) < CLBConstants.MIN_PLATE_CHARGE ) {
        return 0;
      }
      else {
        return this.plateVoltageProperty.value / this.plateSeparationProperty.value;
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
      var C = this.capacitanceProperty.value;

      this.transientTime += dt; // step time since switch was closed
      var exp = Math.exp( -this.transientTime / ( R * C ) );
      this.plateVoltageProperty.value = this.voltageAtSwitchClose * exp;

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
      var capacitanceRatio = this.capacitanceProperty.value / this.previousCapacitance;

      // update the initial voltage Vo
      this.voltageAtSwitchClose = this.plateVoltageProperty.value / capacitanceRatio;

      // reset transient time
      this.transientTime = 0;
    },

    // @public
    reset: function() {
      this.plateSizeProperty.reset();
      this.plateSeparationProperty.reset();
      this.plateVoltageProperty.reset();
    }

  } );
} );
