// Copyright 2015, University of Colorado Boulder

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
  var CapacitanceCircuitNode = require( 'CAPACITOR_LAB_BASICS/capacitance/view/CapacitanceCircuitNode' );
  var CLBViewControl = require( 'CAPACITOR_LAB_BASICS/common/view/control/CLBViewControl' );
  var VoltmeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/VoltmeterNode' );
  var ResetAllButton = require( 'SCENERY_PHET/buttons/ResetAllButton' );
  var Path = require( 'SCENERY/nodes/Path' );
  var VoltmeterToolBoxPanel = require( 'CAPACITOR_LAB_BASICS/common/view/control/VoltmeterToolBoxPanel' );
  var CapacitanceBarMeterPanel = require( 'CAPACITOR_LAB_BASICS/capacitance/view/CapacitanceBarMeterPanel' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // constants
  var DEBUG_SHAPES = false;

  /**
   * @param {CLBModel} model
   * @param {Tandem} tandem
   * @constructor
   */
  function CapacitanceScreenView( model, tandem ) {

    ScreenView.call( this );

    // @private
    this.modelViewTransform = model.modelViewTransform;
    this.model = model;

    // Maxima, for calibrating various view representations.
    var maxPlateCharge = model.getMaxPlateCharge();
    var maxEffectiveEField = model.getMaxEffectiveEField();

    // circuit
    var capacitanceCircuitNode = new CapacitanceCircuitNode( model.circuit, this.modelViewTransform, model.plateChargesVisibleProperty,
      model.eFieldVisibleProperty, model.currentIndicatorsVisibleProperty, maxPlateCharge, maxEffectiveEField );

    // meters
    var voltmeterNode = new VoltmeterNode( model.voltmeter, this.modelViewTransform, model.voltmeterVisibleProperty );
    var voltmeterToolBoxPanel = new VoltmeterToolBoxPanel( voltmeterNode, this.modelViewTransform,
      model.voltmeter.inUserControlProperty, model.voltmeterVisibleProperty );

    // control
    // TODO: Layout calculations are messy, come back soon to clean up.
    var capacitanceViewControl = new CLBViewControl( model, 0 );
    capacitanceViewControl.translation = this.layoutBounds.rightTop.minusXY( capacitanceViewControl.width + 10, -10 );
    voltmeterToolBoxPanel.rightTop = capacitanceViewControl.rightBottom.plusXY( 0, 20 );

    var capacitanceBarMeterPanel = new CapacitanceBarMeterPanel( model, capacitanceCircuitNode.width );
    capacitanceBarMeterPanel.leftBottom = capacitanceCircuitNode.topWireNode.leftTop.minusXY( 0, 60 );

    var resetAllButton = new ResetAllButton( {
      listener: function() {
        model.reset();
      },
      bottom: this.layoutBounds.bottom - 20,
      right: this.layoutBounds.right - 30,
      radius: 25,
      tandem: tandem.createTandem( 'resetAllButton' )
    } );

    // rendering order
    this.addChild( capacitanceCircuitNode );
    this.addChild( capacitanceBarMeterPanel );
    this.addChild( capacitanceViewControl );
    this.addChild( voltmeterToolBoxPanel );
    this.addChild( voltmeterNode );
    this.addChild( resetAllButton );

    // debug shapes for probe collision testing, to be removed soon
    if ( DEBUG_SHAPES ) {
      var topTerminalNode = new Path( model.circuit.battery.shapeCreator.createPositiveTerminalShapeBody( model.circuit.battery.location ), {
        fill: 'rgba( 1, 0, 0, 0.5 )'
      } );
      this.addChild( topTerminalNode );
      // add a shape at the tip of the probe for debugging probe tip collisions.
      this.addChild( new Path( model.voltmeter.shapeCreator.getPositiveProbeTipShape(), {
        fill: 'rgba( 1, 0, 0, 0.5 )'
      } ) );
      this.addChild( new Path( model.voltmeter.shapeCreator.getNegativeProbeTipShape(), {
        fill: 'rgba( 1, 0, 0, 0.5 )'
      } ) );
    }

  }

  capacitorLabBasics.register( 'CapacitanceScreenView', CapacitanceScreenView );

  return inherit( ScreenView, CapacitanceScreenView );
} );

