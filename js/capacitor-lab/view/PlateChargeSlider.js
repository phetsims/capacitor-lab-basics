//  Copyright 2002-2015, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HSlider = require( 'SUN/HSlider' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  
  // strings
  var lotsPlusString = require( 'string!CAPACITOR_LAB/lots.plus' );
  var lotsMinusString = require( 'string!CAPACITOR_LAB/lots.minus' );
  var noneString = require( 'string!CAPACITOR_LAB/none' );
  var plateChargeString = require( 'string!CAPACITOR_LAB/plateCharge.top' );
  
  // constants
  var MIN_CHARGE = -0.53E-12;
  var MAX_CHARGE = 0.53E-12;

  /**
   * Constructor for the slider that controls the charge on the capacitor when the battery is disconnected
   * @param {CapacitorLabModel} model
   **/
  function PlateChargeSlider( model, options ) {
    Node.call( this, options );
    
    var slider = new HSlider( model.upperPlateChargeProperty, { min: MIN_CHARGE, max: MAX_CHARGE }, {
      scale: 1.5,
      x: 0,
      y: 0,
      thumbSize: new Dimension2( 15, 20 ),
      rotation: Math.PI / -2,
      majorTickLength: 12
    } );
    var labelOptions = {
      rotation: Math.PI / 2,
      scale: 0.9
    };
    var topLabel = new Text( lotsPlusString, labelOptions );
    var midLabel = new Text( noneString, labelOptions );
    var bottomLabel = new Text( lotsMinusString, labelOptions );
    slider.addMajorTick( 100, topLabel );
    slider.addMajorTick( 0, midLabel );
    slider.addMajorTick( -100, bottomLabel );
    
    // container for the slider
    var rectangle = new Rectangle( 0, 0, slider.width + 20, slider.height + 20, 0, 0, {
      stroke: 'black',
      fill: '#ffffff',
      x: slider.left - 10,
      y: slider.top - 10
    } );
    this.addChild( rectangle );
    
    this.addChild( slider );
    
    var title = new Text(plateChargeString, {
      centerX: slider.centerX,
      y: slider.bottom + 35,
      font: new PhetFont( 15 ),
      fontWeight: 'bold'
    });
    this.addChild( title );
    
    var thisNode = this;
    model.batteryConnectedProperty.link( function () {
      model.updateCapacitanceAndCharge();
      thisNode.visible = !model.batteryConnectedProperty.value;
    } );
    
    model.upperPlateChargeProperty.link( function () {
      model.updateCapacitanceAndCharge();
    } );
  }
  
  return inherit( Node, PlateChargeSlider );
} );