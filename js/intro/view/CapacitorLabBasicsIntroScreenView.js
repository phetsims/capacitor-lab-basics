// Copyright 2002-2015, University of Colorado Boulder5

/**
 * "Intro" ScreenView for Capacitor Lab Basics.
 *
 * This this extension of ScreenView is a direct port of DielectricCanvas of Capacitor Lab without dielectrics.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ScreenView = require( 'JOIST/ScreenView' );
  var IntroCircuitNode = require( 'CAPACITOR_LAB_BASICS/intro/view/IntroCircuitNode' );
  var BarMeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/BarMeterNode' );
  var CapacitorLabBasicsIntroControl = require( 'CAPACITOR_LAB_BASICS/intro/view/control/CapacitorLabBasicsIntroControl' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );

  // Strings
  var capacitanceString = require( 'string!CAPACITOR_LAB_BASICS/capacitance' );

  /**
   * @param {CapacitorLabBasicsModel} model
   * @constructor
   */
  function CapacitorLabBasicsIntroScreenView( model ) {

    ScreenView.call( this );

    this.modelViewTransform = model.modelViewTransform;

    this.model = model;

    // Maxima, for calibrating various view representations.
    var maxPlateCharge = model.getMaxPlateCharge();
    //var maxExcessDielectricPlateCharge = model.getMaxExcessDielectricPlateCharge();
    var maxEffectiveEField = model.getMaxEffectiveEField();
    //var eFieldReferenceMagnitude = model.getEFieldReferenceMagnitude();

    // circuit
    var introCircuitNode = new IntroCircuitNode( model.circuit, this.modelViewTransform, model.plateChargesVisibleProperty,
      model.eFieldVisibleProperty, model.valuesVisibleProperty, maxPlateCharge, maxEffectiveEField );

    // meters
    var capacitanceMeterNode = new BarMeterNode.CapacitanceMeterNode( model.capacitanceMeter, this.modelViewTransform, capacitanceString );
    //VoltmeterNode voltmeterNode = new VoltmeterNode( model.voltmeter, mvt );

    // control
    // TODO: Layout calculations are messy, come back soon to clean up.
    var minWidth = this.right - capacitanceMeterNode.left;
    var capacitorLabBasicsIntroControl = new CapacitorLabBasicsIntroControl( model, minWidth );
    capacitorLabBasicsIntroControl.translation = this.layoutBounds.rightTop.minusXY( capacitorLabBasicsIntroControl.width + 10, -10 );

    capacitanceMeterNode.rightTop = capacitorLabBasicsIntroControl.leftTop.minusXY( 15, 0 );
    // reset button
    this.resetAllButton = new ResetAllButton( {
      listener: function() { model.reset(); },
      bottom: this.layoutBounds.bottom - 20,
      right: this.layoutBounds.right - 30,
      radius: 25
    } );

    // rendering order
    this.addChild( introCircuitNode );
    this.addChild( capacitanceMeterNode );
    //addChild( voltmeterNode );
    //addChild( shapesDebugParentNode );
    this.addChild( capacitorLabBasicsIntroControl );
    this.addChild( this.resetAllButton );
  }

  return inherit( ScreenView, CapacitorLabBasicsIntroScreenView );
} );