//  Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HSlider = require( 'SUN/HSlider' );
  var HTMLText = require( 'SCENERY/nodes/HTMLText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );

  function PlateChargeSlider(model, options) {
    Node.call( this, options);
    
    var slider = new HSlider(model.upperPlateChargeProperty, {min: -.53E-11, max: .53E-11}, {
      scale: 1.5,
      x: 0,
      y: 0,
      thumbSize: new Dimension2( 15, 20 ),
      rotation: Math.PI / -2,
      majorTickLength: 12
    });
    var labelOptions = {rotation: Math.PI / 2, scale: .9};
    var topLabel = new HTMLText("Lots (+)", labelOptions);
    var midLabel = new HTMLText("None", labelOptions);
    var bottomLabel = new HTMLText("Lots (-)", labelOptions);
    slider.addMajorTick(100, topLabel);
    slider.addMajorTick(0, midLabel);
    slider.addMajorTick(-100, bottomLabel);
    
    var rectangle = new Rectangle( 0, 0, slider.width + 20, slider.height + 20, 0, 0, {
      stroke: 'black',
      fill: '#ffffff',
      x: slider.left - 10,
      y: slider.top - 10
    } );
    this.addChild( rectangle );
    
    this.addChild(slider);
    
    var title = new HTMLText("<b>Plate Charge (top)</b>", {centerX: slider.centerX, y: slider.bottom + 35, font: new PhetFont(15)});
    this.addChild( title );
    
    var thisNode = this;
    model.batteryConnectedProperty.link( function () {
      model.updateCapacitanceAndCharge();
      if (model.batteryConnectedProperty.value) {
        thisNode.visible = false;
      }
      else {
        thisNode.visible = true;
      }
    });
  }
  
  return inherit( Node, PlateChargeSlider);
} );