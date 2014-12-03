//  Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HSlider = require( 'SUN/HSlider' );
  var HTMLText = require( 'SCENERY/nodes/HTMLText' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  // @param maxValue (double): the maximum value of the property being studied
  // @param title (string): the title that goes under the meter
  // @param units (string): the subtitle that describes the units of the property
  // @param meterProperty: the type of meter being shown
  // @param valueProperty: the property that the meter measures
  function BarMeterNode(model, title, value, meterProperty, valueProperty, options) {
    Node.call( this, options);
    
    var height = 120;
    var width = 30;
    var tickNumber = 10;
    var tickSpacing = height / tickNumber;
    var lineOptions = {stroke: '#000000'};
    var tickLength = 5;
    var maxValue = 1E-13;
    var exp = "10<sup>"+Math.log10(maxValue)+"</sup>";
    
    var meter = new Rectangle( 0, 0, width, height, 0, 0, {
      stroke: 'black',
      fill: '#ffffff'
    } );
    this.addChild( meter );
    
    var color = 'green';
    var units = ' F';
    if (meterProperty == model.plateChargeMeterProperty) {
      units = ' C';
      if (model.upperPlateChargeProperty.value > 0) {
        color = 'red';
      }
      else {
        color = 'blue';
      }
    }
    else if (meterProperty == model.energyMeterProperty) {
      units = ' J';
      color = 'yellow';
    }
    var measure = new Rectangle( 1, height - 1, width - 2, -height * valueProperty.value/maxValue, 0, 0, {
      fill: color
    } );
    this.addChild( measure );
    
    var yLoc = 0;
    for (var i = 0; i <= tickNumber; i++) {
      yLoc = i*tickSpacing + meter.top;
      this.addChild( new Line(meter.left, yLoc, meter.left - tickLength, yLoc, lineOptions));
    }
    
    var titleText = new HTMLText(title, {centerX: meter.centerX, y: meter.bottom + 15, font: new PhetFont(10)});
    this.addChild( titleText );
    
    var subtitleText = new HTMLText(value, {centerX: meter.centerX, y: titleText.bottom + 15, font: new PhetFont(10)});
    this.addChild( subtitleText );
    
    var bottomNumber = new HTMLText("0", {right: meter.left - tickLength - 2, bottom: meter.bottom + 5, font: new PhetFont(10)});
    this.addChild( bottomNumber );
    
    var topNumber = new HTMLText(exp, {right: meter.left - tickLength - 2, top: meter.top - 5, font: new PhetFont(10)});
    this.addChild( topNumber );
    
    // arrow for when the value is greater than the scale
    var arrow = new ArrowNode( 0, 0, 0, -13, {
      doubleHead: false,
      tailWidth: 10,
      headWidth: 20,
      headHeight: 8,
      fill: color,
      stroke: 'black',
      lineWidth: 1,
      centerX: meter.centerX,
      bottom: meter.top - 2,
      visible: false,
    } );
    this.addChild( arrow );
    
    var thisNode = this;

    // drag handler
    var meterOffset = {};
    var meterDragHandler = new SimpleDragHandler( {
      //When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,
      start: function( event ) {
        meterOffset.x = thisNode.globalToParentPoint( event.pointer.point ).x - thisNode.centerX;
        meterOffset.y = thisNode.globalToParentPoint( event.pointer.point ).y - thisNode.centerY;
      },
      //Translate on drag events
      drag: function( event ) {
        var point = thisNode.globalToParentPoint( event.pointer.point );
        var desiredPosition = point.copy().subtract( meterOffset );
        //alert(thisNode.y);
        model.moveMeterToPosition( desiredPosition, thisNode );
      }
    } );
    this.addInputListener( meterDragHandler );

    meterProperty.link( function () {
      if (meterProperty.value) {
        thisNode.visible = true;
      }
      else {
        thisNode.visible = false;
      }
    });
    
    valueProperty.link( function () {
      thisNode.removeChild( measure );
      if (valueProperty == model.upperPlateChargeProperty && model.upperPlateChargeProperty.value > 0 ) {
        color = 'red';
      }
      else if (valueProperty == model.upperPlateChargeProperty && model.upperPlateChargeProperty.value < 0 ) {
        color = 'blue';
      }
      var rectHeight = -height * Math.abs(valueProperty.value)/maxValue;
      if (Math.abs(valueProperty.value) >= maxValue) {
        arrow.visible = true;
        arrow.fill = color;
        rectHeight = -height+1;
      }
      else {
        arrow.visible = false;
      }
      measure = new Rectangle( 1, height - 1, width - 2, rectHeight, 0, 0, {
        fill: color
      } );
      thisNode.addChild( measure );
      
      // update the string at the bottom of the meter
      exp = "10<sup>"+Math.log10(maxValue)+"</sup>";
      var val = (Math.abs(valueProperty.value) / maxValue).toFixed(2);
      subtitleText.text = val + "x" + exp + units;
    });
  }
  
  return inherit( Node, BarMeterNode);
} );