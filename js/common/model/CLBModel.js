// Copyright 2015, University of Colorado Boulder

/**
 * Base model for Capacitor Lab: Basics.  This gets extended by CLBLightBulbModel and CapacitanceModel.
 * This base model holds high level view properties that are shared by both screens.
 *
 * @author Chris Malley
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var Capacitor = require( 'CAPACITOR_LAB_BASICS/common/model/Capacitor' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var CLBModelViewTransform3D = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModelViewTransform3D' );
  var DielectricMaterial = require( 'CAPACITOR_LAB_BASICS/common/model/DielectricMaterial' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var Vector3 = require( 'DOT/Vector3' );

  // phet-io modules
  var TBoolean = require( 'ifphetio!PHET_IO/types/TBoolean' );

  /**
   * Constructor for the CLBModel.
   * @param {Tandem|null} tandem - null if this is part of a temporary circuit used for calculations
   *
   * @constructor
   */
  function CLBModel( tandem ) {

    var properties = {
      plateChargesVisible: {
        value: CLBConstants.PLATE_CHARGES_VISIBLE,
        tandem: tandem ? tandem.createTandem( 'plateChargesVisibleProperty' ) : null,
        phetioValueType: TBoolean
      },
      eFieldVisible: {
        value: CLBConstants.EFIELD_VISIBLE,
        tandem: tandem ? tandem.createTandem( 'eFieldVisibleProperty' ) : null,
        phetioValueType: TBoolean
      },
      capacitanceMeterVisible: {
        value: true,
        tandem: tandem ? tandem.createTandem( 'capacitanceMeterVisibleProperty' ) : null,
        phetioValueType: TBoolean
      },
      plateChargeMeterVisible: {
        value: false,
        tandem: tandem ? tandem.createTandem( 'plateChargeMeterVisibleProperty' ) : null,
        phetioValueType: TBoolean
      },
      storedEnergyMeterVisible: {
        value: false,
        tandem: tandem ? tandem.createTandem( 'storedEnergyMeterVisibleProperty' ) : null,
        phetioValueType: TBoolean
      },
      barGraphsVisible: {
        value: true,
        tandem: tandem ? tandem.createTandem( 'barGraphsVisibleProperty' ) : null,
        phetioValueType: TBoolean
      },
      voltmeterVisible: {
        value: false,
        tandem: tandem ? tandem.createTandem( 'voltmeterVisibleProperty' ) : null,
        phetioValueType: TBoolean
      },
      currentVisible: {
        value: true,
        tandem: tandem ? tandem.createTandem( 'currentVisibleProperty' ) : null,
        phetioValueType: TBoolean
      }
    };

    // public
    PropertySet.call( this, null, properties );
  }

  capacitorLabBasics.register( 'CLBModel', CLBModel );

  return inherit( PropertySet, CLBModel, {

    /**
     * Return a capacitor with the maximum amount of charge allowed by the model.
     *
     * @return {Capacitor}
     */
    getCapacitorWithMaxCharge: function() {
      // arbitrary model view transform
      var modelViewTransform = new CLBModelViewTransform3D();

      // Construct Capacitor without a Tandem instance (null), since this is an intermediate object
      // used only in calculations.
      var capacitor = new Capacitor( new Vector3( 0, 0, 0 ), modelViewTransform, null, {
        plateWidth: CLBConstants.PLATE_WIDTH_RANGE.max,
        plateSeparation: CLBConstants.PLATE_SEPARATION_RANGE.min,
        dielectricMaterial: DielectricMaterial.createCustomDielectricMaterial( CLBConstants.DIELECTRIC_CONSTANT_RANGE.max ),
        dielectricOffset: CLBConstants.DIELECTRIC_OFFSET_RANGE.min
      } );

      capacitor.platesVoltage = CLBConstants.BATTERY_VOLTAGE_RANGE.max;
      return capacitor;
    }
  } );
} );
