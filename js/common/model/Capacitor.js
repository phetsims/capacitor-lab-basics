// Copyright 2015, University of Colorado Boulder

/**
 * Model of a capacitor whose geometry can be directly manipulated by the user.
 *
 * A capacitor consists of 2 parallel, square plates, with a dielectric material between the plates. When the
 * dielectric can be partially inserted, the capacitor must be modeled as 2 parallel capacitors, one of which has the
 * dielectric between its plates, and the other of which has air between its plates.
 *
 * NOTE: Dielectrics have not been ported and are not used in Capacitor Lab: Basics.
 *
 * A capacitor's capacitance (C) is solely dependent on its geometry and the dielectric material. Charge (Q) on the
 * plates is a function of capacitance and voltage (V) across the plates: Q = CV
 *
 * Variable names used in this implementation where chosen to match the specification in the design document, and
 * therefore violate Java naming conventions.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */

define( function( require ) {
  'use strict';

  // modules
  var Bounds3 = require( 'DOT/Bounds3' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CapacitorShapeCreator = require( 'CAPACITOR_LAB_BASICS/common/model/shapes/CapacitorShapeCreator' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var DielectricMaterial = require( 'CAPACITOR_LAB_BASICS/common/model/DielectricMaterial' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector3 = require( 'DOT/Vector3' );

  // phet-io modules
  var TBounds3 = require( 'ifphetio!PHET_IO/types/dot/TBounds3' );
  var TDielectricMaterial = require( 'ifphetio!PHET_IO/simulations/capacitor-lab-basics/types/TDielectricMaterial' );
  var TNumber = require( 'ifphetio!PHET_IO/types/TNumber' );

  /**
   * Constructor for the Capacitor.
   * @param {Vector3} location
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Tandem} tandem
   * @param {Object} [options]
   * @constructor
   */
  function Capacitor( location, modelViewTransform, tandem, options ) {

    // options that populate the capacitor with various geometric properties
    options = _.extend( {
      plateWidth: CLBConstants.PLATE_WIDTH_RANGE.min,
      plateSeparation: CLBConstants.PLATE_SEPARATION_RANGE.max,
      dielectricMaterial: DielectricMaterial.AIR,
      dielectricOffset: CLBConstants.DIELECTRIC_OFFSET_RANGE.max
    }, options );

    // @public
    this.transientTime = 0; // model time updated when the switch is closed and while the capacitor is discharging
    this.voltageAtSwitchClose = 0; // voltage of the plates when the bulb switch is initially closed
    this.modelViewTransform = modelViewTransform;
    this.location = location;

    // @private
    this.shapeCreator = new CapacitorShapeCreator( this, modelViewTransform );

    var propertySetOptions = tandem && TNumber ? {
      tandemSet: {
        plateSize: tandem.createTandem( 'plateSizeProperty' ),
        plateSeparation: tandem.createTandem( 'plateSeparationProperty' ),
        platesVoltage: tandem.createTandem( 'platesVoltageProperty' ),
        dielectricMaterial: tandem.createTandem( 'dielectricMaterialProperty' ),
        dielectricOffset: tandem.createTandem( 'dielectricOffsetProperty' )
      },
      typeSet: {
        plateSize: TBounds3,
        plateSeparation: TNumber( 'meters', { range: CLBConstants.PLATE_SEPARATION_RANGE } ),
        platesVoltage: TNumber( 'volts' ),
        dielectricMaterial: TDielectricMaterial,
        dielectricOffset: TNumber( 'meters' )
      }
    } : {};

    // @public
    PropertySet.call( this, {
      plateSize: new Bounds3( 0, 0, 0, options.plateWidth, CLBConstants.PLATE_HEIGHT, options.plateWidth ), // Square plates.
      plateSeparation: options.plateSeparation,
      platesVoltage: 0, // zero until it's connected into a circuit
      dielectricMaterial: options.dielectricMaterial,
      dielectricOffset: options.dielectricOffset // in meters, default is totally outside of capacitor plates.
    }, propertySetOptions );

    // @private - track the previous capacitance to adjust the inital voltage when discharging, see
    // updateDischargeParameters() below.
    this.previousCapacitance = this.getTotalCapacitance();
  }

  capacitorLabBasics.register( 'Capacitor', Capacitor );

  return inherit( PropertySet, Capacitor, {

    /**
     * Convenience method, gets the area of one plate's top (or bottom) surfaces.
     * (design doc symbol: A)
     *
     * @return {number} area in meters^2
     */
    getPlateArea: function() {
      return this.plateSize.width * this.plateSize.depth;
    },

    /**
     * Gets the area of the contact between one of the plates and air.  Note that without dielectrics this is the same
     * as the plate area.
     * (design doc symbol: A_air)
     *
     * @return {number} area in meters^2
     */
    getAirContactArea: function() {
      return this.getPlateArea() - this.getDielectricContactArea();
    },

    /**
     * Gets the area of the contact between one of the plates and the dielectric material.
     * (design doc symbol: A_dielectric)
     *
     * @return {number} area, in meters^2
     */
    getDielectricContactArea: function() {
      var absoluteOffset = Math.abs( this.dielectricOffset );
      var area = ( this.plateSize.width - absoluteOffset ) * this.plateSize.depth; // front * side
      if ( area < 0 ) {
        area = 0;
      }
      return area;
    },

    /**
     * Sets the distance between the 2 parallel plates.
     * NOTE: The model for this sim requires that the plate separation be > 0.
     * (design doc symbol: d)
     *
     * @param {number} plateSeparation distance, in meters.
     */
    setPlateSeparation: function( plateSeparation ) {
      if ( plateSeparation <= 0 ) {
        console.error( 'plateSeparation must be > 0: ' + plateSeparation );
      }
      this.plateSeparation = plateSeparation;
    },

    /**
     * Sets the plate width.
     * (design doc symbol: L)
     *
     * Only the plate width settable. Plates are square, the plate depth is identical to the width. And the height
     * (thickness) is constant.
     *
     * @param {number} plateWidth meters
     */
    setPlateWidth: function( plateWidth ) {
      if ( plateWidth <= 0 ) {
        console.error( 'plateWidth must be > 0: ' + plateWidth );
      }
      this.plateSize = new Bounds3( 0, 0, 0, plateWidth, this.plateSize.height, plateWidth );
    },

    /**
     * Convenience method for determining the outside center of the top plate.  This is a wire attachment point.
     *
     * @return {Vector3}
     */
    getTopConnectionPoint: function() {
      return new Vector3( this.location.x, this.location.y - ( this.plateSeparation / 2 ) - this.plateSize.height, this.location.z );
    },

    /**
     * Convenience method for determining the outside center of the bottom plate.  This is a wire attachment point.
     *
     * @return {Vector3}
     */
    getBottomConnectionPoint: function() {
      return new Vector3( this.location.x, this.location.y + ( this.plateSeparation / 2 ) + this.plateSize.height, this.location.z );
    },

    // d =  epsilon * epsilon_0 * A / C
    /**
     * Get the plate separation of this capacitor.  Value is determined by the equation d =  epsilon * epsilon_0 * A / C
     *
     * @param {number} dielectricConstant
     * @param {number} plateWidth
     * @param {number} capacitance
     * @returns {number}
     */
    getPlateSeparation: function( dielectricConstant, plateWidth, capacitance ) {
      return dielectricConstant * CLBConstants.EPSILON_0 * plateWidth * plateWidth / capacitance;
    },

    /**
     * General formula for computing capacitance.
     *
     * @param {number} epsilon dielectric constant, dimensionless
     * @param {number} area of the contact between the dielectric and one plate, meters^2
     * @param {number} plateSeparation distance between the plates, meters
     * @return {number} capacitance, in Farads
     */
    getCapacitance: function( epsilon, area, plateSeparation ) {
      return epsilon * CLBConstants.EPSILON_0 * area / plateSeparation;
    },

    /**
     * Gets the capacitance due to the part of the capacitor that is contacting air.
     * (design doc symbol: C_air)
     *
     * @return {number} capacitance, in Farads
     */
    getAirCapacitance: function() {
      return this.getCapacitance( CLBConstants.EPSILON_AIR, this.getAirContactArea(), this.plateSeparation );
    },

    /**
     * Gets the capacitance due to the part of the capacitor that is contacting the dielectric.
     * (design doc symbol: C_dielectric)
     *
     * @return {number} capacitance, in Farads
     */
    getDielectricCapacitance: function() {
      return this.getCapacitance( this.dielectricMaterial.dielectricConstant, this.getDielectricContactArea(), this.plateSeparation );
    },

    /**
     * Does a Shape intersect the top plate shape?  Assumes that a shape is much smaller than the
     * top plate.  This is sufficient in the case of probes.
     *
     * @param {Shape} shape
     * @return {boolean}
     */
    intersectsTopPlate: function( shape ) {
      var intersectsTopPlate = false;
      this.shapeCreator.createTopPlateShapeOccluded().forEach( function( topPlateShape ) {

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
     *
     * @param {Shape} shape
     * @return {boolean}
     */
    intersectsBottomPlate: function( shape ) {
      var intersectsBottomPlate = false;
      this.shapeCreator.createBottomPlateShapeOccluded().forEach( function( bottomPlateShape ) {
        if ( bottomPlateShape.containsPoint( shape.bounds.center ) ) {
          intersectsBottomPlate = true;
        }
      } );
      return intersectsBottomPlate;
    },

    /**
     * Is a point inside the Shape that is the 2D projection of the space between the capacitor plates?  In the Java
     * sim this checked for points between plates in air or in a dielectric.  Dielectrics are being ignored for the
     * moment so this is identical to isInsideAirBetweenPlates().
     *
     * @param {Vector3} point a point in the global 2D model coordinate frame
     * @return {boolean}
     */
    isBetweenPlates: function( point ) {
      return this.isInsideAirBetweenPlates( point );
    },

    /**
     * Gets the charge for the portion of the top plate contacting the air.  If charge is less than half of an electron
     * charge, return 0.
     * (design doc symbol: Q_air)
     *
     * @return {number} charge, in Coulombs
     *
     */
    getAirPlateCharge: function() {
      var airPlateCharge = this.getAirCapacitance() * this.platesVoltage;
      if ( Math.abs( airPlateCharge ) < CLBConstants.MIN_PLATE_CHARGE ) {
        return 0;
      } else {
        return airPlateCharge;
      }
    },

    /**
     * Gets the charge for the portion of the top plate contacting the dielectric.
     * (design doc symbol: Q_dielectric)
     *
     * @return {number} charge, in Coulombs
     */
    getDielectricPlateCharge: function() {
      var dielectricCharge = this.getDielectricCapacitance() * this.platesVoltage;
      if ( Math.abs( dielectricCharge ) < CLBConstants.MIN_PLATE_CHARGE ) {
        return 0;
      } else {
        return dielectricCharge;
      }
    },

    /**
     * Gets the total charge on the top plate. Note that without dielectrics this is equal to getAirPlateCharge().
     * (design doc symbol: Q_total)
     *
     * @return {number} charge, in Coulombs
     */
    getTotalPlateCharge: function() {
      return this.getAirPlateCharge() + this.getDielectricPlateCharge();
    },

    /**
     * Get the total capacitance of this capacitor.  Note that without dielectrics this is identical to the capacitance
     * of air.  When dielectrics are added, be sure to include dielectric capacitance components.
     *
     * @returns {number}
     */
    getTotalCapacitance: function() {
      return this.getAirCapacitance() + this.getDielectricCapacitance();
    },

    /**
     * Gets the excess plate charge due to plates contacting air.
     * (design doc symbol: Q_excess_air)
     *
     * @return {number} excess charge, in Coulombs
     */
    getExcessAirPlateCharge: function() {
      return this.getExcessPlateCharge( CLBConstants.EPSILON_AIR, this.getAirCapacitance(), this.platesVoltage );
    },

    /**
     * General solution for excess plate charge.
     *
     * @param {number} epsilon_r dielectric constant, dimensionless
     * @param {number} C capacitance due to the dielectric
     * @param {number} V_plates plate voltage, volts
     * @return {number} charge, in Coulombs (C)
     */
    getExcessPlateCharge: function( epsilon_r, C, V_plates ) {
      if ( epsilon_r <= 0 ) {
        console.error( 'Model requires epsilon_r > 0 : ' + epsilon_r );
      }
      return ( ( epsilon_r - CLBConstants.EPSILON_VACUUM ) / epsilon_r ) * C * V_plates; // Coulombs (1C = 1F * 1V)
    },

    /**
     * Gets the effective (net) field between the plates. This is uniform everywhere between the plates.
     * If the total charge on the plate is less than half that of a single electron, effective field is zero.
     *
     * (design doc symbol: E_effective)
     *
     * @return {number} Volts/meter
     */
    getEffectiveEField: function() {
      var totalPlateCharge = this.getTotalPlateCharge();
      if ( Math.abs( totalPlateCharge ) < CLBConstants.MIN_PLATE_CHARGE ) {
        return 0;
      } else {
        return this.platesVoltage / this.plateSeparation;
      }
    },

    /**
     * Gets the field due to the plates in the capacitor volume that contains air.
     * (design doc symbol: E_plates_air)
     *
     * @return E-field, in Volts/meter
     */
    getPlatesAirEField: function() {
      return this.getPlatesEField( CLBConstants.EPSILON_AIR, this.platesVoltage, this.plateSeparation );
    },

    /**
     * General solution for the E-field due to some dielectric.
     *
     * @param {number} epsilon_r dielectric constant, dimensionless
     * @param {number} V_plates plate voltage, volts
     * @param {number} d plate separation, meters
     * @return {number} E-field, in Volts/meter
     */
    getPlatesEField: function( epsilon_r, V_plates, d ) {
      if ( d <= 0 ) {
        console.error( 'Model requires d (plate separation) > 0 : ' + d );
      }
      return epsilon_r * V_plates / d;
    },

    /**
     * Gets the field due to air polarization.
     * (design doc symbol: E_air)
     *
     * @return {number} E-field, in Volts/meter
     */
    getAirEField: function() {
      return this.getPlatesAirEField() - this.getEffectiveEField();
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
     * @param {number} R
     * @param {number} dt
     */
    discharge: function( R, dt ) {
      var C = this.getTotalCapacitance();

      this.transientTime += dt; // step time since switch was closed
      var exp = Math.exp( -this.transientTime / ( R * C ) );
      this.platesVoltage = this.voltageAtSwitchClose * exp;

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
     * is instantaneously increased to C2.  The charge will remain Q1, but the voltage will decrease proportionally
     * from V1 to V2, like V2 = V1 / ( C2 / C1 ).  The RC time constant also needs to change
     * since C has been updated.  This assumes that the capacitance changes instantaneously.
     *
     * Therefore, the solution needs to change to
     * Vc = V2 * exp( -t / ( R * C2 ) )
     */
    updateDischargeParameters: function() {

      // in the discharge function, C is recalculated every time step, so we only need to adjust Vo.
      var capacitanceRatio = this.getTotalCapacitance() / this.previousCapacitance;

      // update the initial voltage Vo
      this.voltageAtSwitchClose = this.platesVoltage / capacitanceRatio;

      // reset transient time
      this.transientTime = 0;
    }

  } );
} );

