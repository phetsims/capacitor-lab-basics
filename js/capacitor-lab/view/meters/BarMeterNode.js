//  Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Line = require( 'SCENERY/nodes/Line' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ScientificNotationNode = require( 'SCENERY_PHET/ScientificNotationNode' );
  var SubSupText = require( 'SCENERY_PHET/SubSupText' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );

  /**
   * Constructor for the bar meters that measure capacitance, plate charge, and energy
   * @param title (string): the title that goes under the meter
   * @param meterProperty: the type of meter being shown
   * @param valueProperty: the property that the meter measures
   * @param meterPositionProperty: the property that describes the position of the meter
   **/
  function BarMeterNode(model, title, meterProperty, valueProperty, meterPositionProperty, options) {
    options = _.extend({cursor: 'pointer'}, options);
    Node.call( this, options);
    
    var height = 120;
    var width = 30;
    var tickNumber = 10;
    var tickSpacing = height / tickNumber;
    var lineOptions = {stroke: '#000000'};
    var tickLength = 5;
    var maxValue = 1E-13;
    var exp = "10<sup>-13";
    
    // Body of the meter
    var meter = new Rectangle( 0, 0, width, height, 0, 0, {
      stroke: 'black',
      fill: '#ffffff'
    } );
    this.addChild( meter );
    
    var color = 'green';
    var units = ' F';
    if (meterProperty === model.plateChargeMeterProperty) {
      units = ' C';
      if (model.upperPlateChargeProperty.value > 0) {
        color = 'red';
      }
      else {
        color = 'blue';
      }
    }
    else if (meterProperty === model.energyMeterProperty) {
      units = ' J';
      color = 'yellow';
    }
    
    // Filled rectangle to represent the value of the property being measured
    var measure = new Rectangle( 0, height, width, -height * valueProperty.value/maxValue, 0, 0, {
      fill: color
    } );
    meter.addChild( measure );
    
    // Small tick marks along the side of the meter
    var yLoc = 0;
    for (var i = 0; i <= tickNumber; i++) {
      yLoc = i*tickSpacing + meter.top;
      this.addChild( new Line(meter.left, yLoc, meter.left - tickLength, yLoc, lineOptions));
    }
    
    // Meter title
    var titleText = new Text(title, {centerX: meter.centerX, y: meter.bottom + 15, font: new PhetFont(10)});
    this.addChild( titleText );
    // Value of property being measured
    var subtitleText = new ScientificNotationNode(valueProperty, {centerX: meter.centerX, y: titleText.bottom + 15, font: new PhetFont(10)});
    this.addChild( subtitleText );
    
    // Lower bound of values being measured by the meter
    var bottomNumber = new Text("0", {right: meter.left - tickLength - 2, bottom: meter.bottom + 5, font: new PhetFont(10)});
    this.addChild( bottomNumber );
    
    // Upper bound on values measured by meter
    var topNumber = new SubSupText(exp, {right: meter.left - tickLength - 2, top: meter.top - 5, font: new PhetFont(10)});
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
    
    // Button to decrease the upper bound
    var zoomInButton = new ZoomButton({
      top: topNumber.bottom + 10,
      right: topNumber.right - 5,
      scale: 0.4,
      baseColor: 'white',
      enabled: false,
      listener: function () {
        maxValue = maxValue / 10;
        exp = "10<sup>"+Math.log10(maxValue);
        topNumber.text = exp;
        updateMeter();
      },
      });
    this.addChild(zoomInButton);
    // Button to increase the upper bound
    var zoomOutButton = new ZoomButton({
      top: zoomInButton.bottom + 7,
      right: zoomInButton.right,
      scale: 0.4,
      in: false,
      baseColor: 'white',
      enabled: false,
      listener: function () {
        maxValue = maxValue * 10;
        exp = "10<sup>"+Math.log10(maxValue);
        topNumber.text = exp;
        updateMeter();
      },
      });
    this.addChild(zoomOutButton);
    
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
        model.moveMeterToPosition( desiredPosition, meterPositionProperty );
      }
    } );
    this.addInputListener( meterDragHandler );

    meterProperty.link( function () {
      thisNode.visible = meterProperty.value;
    });
    
    valueProperty.link( function () {
      updateMeter();
    });
    
    meterPositionProperty.link( function () {
      thisNode.centerX = meterPositionProperty.value.x;
      thisNode.centerY = meterPositionProperty.value.y;
    });
    
    // Updates the display when the property being measured changes
    function updateMeter() {
      if (valueProperty === model.upperPlateChargeProperty && model.upperPlateChargeProperty.value > 0 ) {
        color = 'red';
      }
      else if (valueProperty === model.upperPlateChargeProperty && model.upperPlateChargeProperty.value < 0 ) {
        color = 'blue';
      }
      var rectHeight = -height * Math.abs(valueProperty.value)/maxValue;
      if (Math.abs(valueProperty.value) >= maxValue) {
        arrow.visible = true;
        arrow.fill = color;
        rectHeight = -height;
        zoomOutButton.enabled = true;
      }
      else {
        arrow.visible = false;
        zoomOutButton.enabled = false;
      }
      if ((Math.abs(valueProperty.value) < maxValue / 10) && (Math.abs(valueProperty.value) !== 0)) {
        zoomInButton.enabled = true;
      }
      else {
        zoomInButton.enabled = false;
      }
      measure.setRect(0, height + rectHeight, width, -rectHeight, 0, 0);
      measure.fill = color;
      
      subtitleText.centerX = meter.centerX;
    }
  }
  
  return inherit( Node, BarMeterNode);
} );