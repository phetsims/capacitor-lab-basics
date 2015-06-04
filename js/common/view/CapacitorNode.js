// Copyright 2002-2015, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var Dimension2 = require( 'DOT/Dimension2' );
  var EFieldNode = require( 'CAPACITOR_LAB/capacitor-lab/view/EFieldNode' );
  var Text = require( 'SCENERY/nodes/Text' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var PlateNode = require( 'CAPACITOR_LAB/capacitor-lab/view/PlateNode' );
  var PlateSlider = require( 'CAPACITOR_LAB/capacitor-lab/view/PlateSlider' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  
  // strings
  var mmString = require( 'string!CAPACITOR_LAB/mm' );
  var separationString = require( 'string!CAPACITOR_LAB/separation' );
  var plateAreaString = require( 'string!CAPACITOR_LAB/plateArea' );
  
  /**
   * Constructor for the capacitor
   * @param {CapacitorLabModel} model
   **/
  function CapacitorNode(model, options) {
    Node.call( this, options );
    
    // Translates the property value for plate separation into a pixel value
    var plateSeparationScale = 10;
    var plateSeparation = model.plateSeparationProperty.value * plateSeparationScale;
    
    // Top plate of capacitor
    this.topPlate = new PlateNode(model, 1, {
      x: 0,
      y: -plateSeparation
    } );
    this.topPlate.makeChargeGrid();
    // Bottom plate of capacitor
    this.bottomPlate = new PlateNode(model, -1, {
      x: 0,
      y: plateSeparation
    } );
    this.bottomPlate.makeChargeGrid();
    // Electric field between capacitors
    this.eField = new EFieldNode( model, 2 * plateSeparation - this.topPlate.plateDepth, plateSeparationScale, this.topPlate, {
      x: this.topPlate.plateWidth / 2 + this.topPlate.plateShift / 2,
      y: -plateSeparation + this.topPlate.plateDepth + this.topPlate.plateHeight / 2
    } );
    this.addChild( this.bottomPlate );
    this.addChild( this.eField );
    this.addChild( this.topPlate );
    
    // Controls the distance between the plates
    var distanceSlider = new PlateSlider(model.plateSeparationProperty, {min: 5.0, max: 10.0}, {
      x: 50,
      y: -150,
      rotation: -Math.PI / 2,
    } );
    this.addChild( distanceSlider );
    
    var font = new PhetFont( 19 );
    
    // Describes the distance between the plates as text
    var separation = 10.0 + mmString;
    var separationText = new Text(separationString, {
      top: distanceSlider.top,
      right: distanceSlider.left - 15,
      font: font,
      fontWeight: "bold"
    } );
    var separationValue = new Text(separation, {
      top: separationText.bottom + 5,
      left: separationText.left,
      font: font,
    } );
    this.addChild( separationText );
    this.addChild( separationValue );
    
    // Controls the area of the plates
    var xOffset = -45;
    var yOffset = -75;
    var atan = Math.atan( ( this.topPlate.minPlateShift + this.topPlate.minPlateWidth ) / this.topPlate.minPlateHeight );
    var sizeSlider = new PlateSlider(model.capacitorPlateAreaProperty, {min: 100.0, max: 400.0}, {
      x: xOffset,
      y: yOffset,
      trackSize: new Dimension2( 124, 5 ),
      rotation: Math.PI/2 -  atan
    } );
    this.addChild( sizeSlider );
    
    // Describes the area of the plates as text
    var areaString = "100.0" + mmString + "<sup>2";
    var areaText = new Text(plateAreaString, {
      top: this.topPlate.bottom - 60,
      right: this.topPlate.left - 15,
      font: font,
      fontWeight: "bold"
    } );
    var areaValue = new SubSupText(areaString, {
      top: areaText.bottom,
      left: areaText.left,
      font: font,
    } );
    this.addChild( areaText );
    this.addChild( areaValue );
    
    var thisNode = this;
    model.plateSeparationProperty.link( function () {
      plateSeparation = model.plateSeparationProperty.value * plateSeparationScale;
      
      thisNode.topPlate.y = -plateSeparation - (thisNode.topPlate.plateHeight - thisNode.topPlate.minPlateHeight)/2;
      thisNode.bottomPlate.y = plateSeparation - (thisNode.bottomPlate.plateHeight - thisNode.bottomPlate.minPlateHeight)/2;
      thisNode.eField.y = -plateSeparation + thisNode.topPlate.plateDepth + thisNode.topPlate.plateHeight / 2;
      
      sizeSlider.y = yOffset + (100-plateSeparation);
      
      separation = model.plateSeparationProperty.value.toFixed(1) + mmString;
      separationValue.text = separation;
      separationText.top = distanceSlider.top + (100-plateSeparation)/2;
      separationValue.top = separationText.bottom + 5;
      
      areaText.top = sizeSlider.top - 50;
      areaValue.top = areaText.bottom;
      
      model.updateCapacitanceAndCharge();
    });
    
    model.capacitorPlateAreaProperty.link( function () {
      var xShift = -(thisNode.topPlate.plateWidth - thisNode.topPlate.minPlateWidth)/2 - (thisNode.topPlate.plateShift - thisNode.topPlate.minPlateShift)/2;
      var yShift = -(thisNode.topPlate.plateHeight - thisNode.topPlate.minPlateHeight)/2;
      
      areaString = model.capacitorPlateAreaProperty.value.toFixed(1) + mmString + "<sup>2";
      areaValue.text = areaString;
      areaText.top = thisNode.topPlate.bottom - 60;
      areaText.right = thisNode.topPlate.left - 15;
      areaValue.top = areaText.bottom;
      areaValue.left = areaText.left;
      
      thisNode.topPlate.x = xShift;
      thisNode.bottomPlate.x = xShift;
      thisNode.topPlate.y = -plateSeparation + yShift;
      thisNode.bottomPlate.y = plateSeparation + yShift;
      
      model.updateCapacitanceAndCharge();
      
      if (!model.batteryConnectedProperty.value) {
        thisNode.topPlate.makeChargeGrid();
        thisNode.bottomPlate.makeChargeGrid();
      }
    });
    
    model.upperPlateChargeProperty.link( function () {
      thisNode.topPlate.makeChargeGrid();
      thisNode.bottomPlate.makeChargeGrid();
    });
  }
  
  return inherit( Node, CapacitorNode );
} );