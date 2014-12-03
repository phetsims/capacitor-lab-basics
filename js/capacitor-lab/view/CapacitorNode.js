//  Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var HTMLText = require( 'SCENERY/nodes/HTMLText' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MinusChargeNode = require( 'CAPACITOR_LAB/capacitor-lab/view/MinusChargeNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlateNode = require( 'CAPACITOR_LAB/capacitor-lab/view/PlateNode' );
  var PlateSlider = require( 'CAPACITOR_LAB/capacitor-lab/view/PlateSlider' );
  var PlusChargeNode = require( 'CAPACITOR_LAB/capacitor-lab/view/PlusChargeNode' );

  function CapacitorNode(model, options) {
    Node.call( this, options );
    var plateSeparationScale = 10;
    var plateSeparation = model.plateSeparationProperty.value * plateSeparationScale;
    var plateSizeScale = 1/100;
    var plateSize = model.capacitorPlateAreaProperty.value * plateSizeScale;
    
    var topPlate = new PlateNode(model, {x: 0, y: -plateSeparation});
    topPlate.makeChargeGrid(1);
    var bottomPlate = new PlateNode(model, {x: 0, y: plateSeparation});
    bottomPlate.makeChargeGrid(-1);
    this.addChild( topPlate );
    this.addChild( bottomPlate );
    
    var distanceSlider = new PlateSlider(model.plateSeparationProperty, {min: 5.0, max: 10.0}, {
      x: 50,
      y: -150,
      rotation: Math.PI / -2,
    });
    this.addChild(distanceSlider);
    
    var separationString = "10.0 mm";
    var separationText = new HTMLText("<b>Separation</b>", {top: distanceSlider.top, right: distanceSlider.left - 15, scale: 1.8});
    var separationValue = new HTMLText(separationString, {top: separationText.bottom + 5, left: separationText.left, scale: 1.8});
    this.addChild(separationText);
    this.addChild(separationValue);
    
    var xOffset = -35;
    var yOffset = -65;
    var sizeSlider = new PlateSlider(model.capacitorPlateAreaProperty, {min: 100.0, max: 400.0}, {
      x: xOffset,
      y: yOffset,
      rotation: Math.PI-.64//3*Math.PI / 4,
    });
    this.addChild(sizeSlider);
    
    var areaString = "100.0 mm<sup>2<\sup>";
    var areaText = new HTMLText("<b>Plate Area</b>", {top: sizeSlider.top - 50, right: sizeSlider.right - 25, scale: 1.8});
    var areaValue = new HTMLText(areaString, {top: areaText.bottom, left: areaText.left, scale: 1.8});
    this.addChild(areaText);
    this.addChild(areaValue);
    
    var thisNode = this;
    model.plateSeparationProperty.link( function () {
      plateSeparation = model.plateSeparationProperty.value * plateSeparationScale;
      topPlate.y = -plateSeparation;
      bottomPlate.y = plateSeparation;
      sizeSlider.y = yOffset + (100-plateSeparation);
      separationString = model.plateSeparationProperty.value.toFixed(1)+" mm";
      separationValue.text = separationString;
      separationText.top = distanceSlider.top + (100-plateSeparation)/2;
      separationValue.top = separationText.bottom + 5;
      areaText.top = sizeSlider.top - 50;
      areaValue.top = areaText.bottom;
      model.updateCapacitanceAndCharge();
    });
    
    model.capacitorPlateAreaProperty.link( function () {
      topPlate.scale = Math.sqrt(model.capacitorPlateAreaProperty.value / 100);
      console.log(topPlate.scale);
      bottomPlate.scale = Math.sqrt(model.capacitorPlateAreaProperty.value / 100);
      areaString = model.capacitorPlateAreaProperty.value.toFixed(1)+" mm<sup>2</sup>";
      areaValue.text = areaString;
      model.updateCapacitanceAndCharge();
    });
    
    model.upperPlateChargeProperty.link( function () {
      if (model.upperPlateChargeProperty.value > 0) {
        topPlate.makeChargeGrid(1);
        bottomPlate.makeChargeGrid(-1);
      }
      else {
        topPlate.makeChargeGrid(-1);
        bottomPlate.makeChargeGrid(1);
      }
    });
  }
  
  return inherit( Node, CapacitorNode);
} );