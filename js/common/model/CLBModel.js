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
  var inherit = require( 'PHET_CORE/inherit' );
  var PropertySet = require( 'AXON/PropertySet' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var Capacitor = require( 'CAPACITOR_LAB_BASICS/common/model/Capacitor' );
  var CLBModelViewTransform3D = require( 'CAPACITOR_LAB_BASICS/common/model/CLBModelViewTransform3D' );
  var Vector3 = require( 'DOT/Vector3' );
  var DielectricMaterial = require( 'CAPACITOR_LAB_BASICS/common/model/DielectricMaterial' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * Constructor for the CLBModel.
   * @param {Tandem} tandem
   *
   * @constructor
   */
  function CLBModel( tandem ) {

    // public
    PropertySet.call( this, {
      plateChargesVisible: CLBConstants.PLATE_CHARGES_VISIBLE,
      eFieldVisible: CLBConstants.EFIELD_VISIBLE,
      capacitanceMeterVisible: true,
      plateChargeMeterVisible: false,
      storedEnergyMeterVisible: false,
      barGraphsVisible: true,
      voltmeterVisible: false,
      currentVisible: true
    }, {
      tandemSet: {
        plateChargesVisible: tandem.createTandem( 'plateChargesVisibleProperty' ),
        eFieldVisible: tandem.createTandem( 'eFieldVisibleProperty' ),
        capacitanceMeterVisible: tandem.createTandem( 'capacitanceMeterVisibleProperty' ),
        plateChargeMeterVisible: tandem.createTandem( 'plateChargeMeterVisibleProperty' ),
        storedEnergyMeterVisible: tandem.createTandem( 'storedEnergyMeterVisibleProperty' ),
        barGraphsVisible: tandem.createTandem( 'barGraphsVisibleProperty' ),
        voltmeterVisible: tandem.createTandem( 'voltmeterVisibleProperty' ),
        currentVisible: tandem.createTandem( 'currentVisibleProperty' )
      }
    } );
  }

  capacitorLabBasics.register( 'CLBModel', CLBModel );

  return inherit( PropertySet, CLBModel, {

    // Gets a capacitor with maximum charge.
    /**
     * Return a capacitor with the maximum amount of charge allowed by the model/
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
        dielectricMaterial: DielectricMaterial.CustomDielectricMaterial( CLBConstants.DIELECTRIC_CONSTANT_RANGE.max ),
        dielectricOffset: CLBConstants.DIELECTRIC_OFFSET_RANGE.min
      } );

      capacitor.platesVoltage = CLBConstants.BATTERY_VOLTAGE_RANGE.max;
      return capacitor;
    }
  } );
} );