//  Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
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
  function BarMeterNode(model, maxValue, title, units, meterProperty, valueProperty, options) {
    Node.call( this, options);
    
    var height = 120;
    var width = 30;
    var tickNumber = 10;
    var tickSpacing = height / tickNumber;
    var lineOptions = {stroke: '#000000'};
    var tickLength = 5;
    
    var meter = new Rectangle( 0, 0, width, height, 0, 0, {
      stroke: 'black',
      fill: '#ffffff'
    } );
    this.addChild( meter );
    
    var color = 'green';
    if (meterProperty == model.plateChargeMeterProperty) {
      color = 'red';
    }
    else if (meterProperty == model.energyMeterProperty) {
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
    
    var subtitleText = new HTMLText(units, {centerX: meter.centerX, y: titleText.bottom + 15, font: new PhetFont(10)});
    this.addChild( subtitleText );
    
    var bottomNumber = new HTMLText("0", {right: meter.left - tickLength - 2, bottom: meter.bottom + 5, font: new PhetFont(10)});
    this.addChild( bottomNumber );
    
    var topNumber = new HTMLText("10<sup>-13</sup>", {right: meter.left - tickLength - 2, top: meter.top - 5, font: new PhetFont(10)});
    this.addChild( topNumber );
    
    var thisNode = this;
    // Add a drag handler
    this.addInputListener( new SimpleDragHandler( {
      // Allow moving a finger (touch) across a node to pick it up.
      allowTouchSnag: true,
      
      start: function( event ) {
        // Move up the scene graph until the parent screen is found.
        var testNode = thisNode;
        while ( testNode !== null ) {
          if ( testNode instanceof ScreenView ) {
            parentScreen = testNode;
            break;
          }
          testNode = testNode.parents[0]; // Move up the scene graph by one level
        }
        // Create a new node and add it to the model.
        thisNode.modelElement = thisNode.addElementToModel( eventToModelPosition( event.pointer.point ) );
      },
      
      //Translate on drag events
      drag: function( event ) {
        if ( thisNode.modelElement !== null ) {
          // Move the node.
          thisNode.modelElement.position = eventToModelPosition( event.pointer.point );
        }
      },
      end: function( event ) {
        // The user has released the node.
        thisNode.modelElement.release();
        thisNode.modelElement = null;
        parentScreen = null;
      }
    }));
    meterProperty.link( function () {
      if (meterProperty.value) {
        thisNode.visible = true;
      }
      else {
        thisNode.visible = false;
      }
    });
  }
  
  return inherit( Node, BarMeterNode);
} );