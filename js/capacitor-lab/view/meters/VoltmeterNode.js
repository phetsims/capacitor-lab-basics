//  Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var VoltmeterProbeNode = require( 'CAPACITOR_LAB/capacitor-lab/view/meters/VoltmeterProbeNode' );

  /**
   * Constructor for the voltmeter
   * @param wire: the node containing the top and bottom wires in the circuit
   * @param capacitor: the node containing the capacitor representation
   **/
  function VoltmeterNode(model, wire, capacitor, options) {
    options = _.extend({cursor: 'pointer'}, options);
    Node.call( this, options);
    
    // true if both probes are on opposing wires
    var showVoltage = false;
    // 1 if the probes are on the correct sides of the battery
    // -1 if the meter would display the negative of the battery voltage
    var voltageMultiplier = 1;
    
    // strings
    var voltString = require( 'string!CAPACITOR_LAB/volt' );
    var unknownVoltString = require( 'string!CAPACITOR_LAB/volt.unknown' );
    
    var voltageString = unknownVoltString;
    
    // images
    var redProbeImage = require( 'image!CAPACITOR_LAB/probe_3D_red_large.png' );
    var blackProbeImage = require( 'image!CAPACITOR_LAB/probe_3D_black_large.png' );
    var voltmeterBackgroundImage = require( 'image!CAPACITOR_LAB/voltmeter.png' );
    
    // body of the voltmeter
    var backgroundNode = new Image( voltmeterBackgroundImage, {scale: .7} );
    // red probe
    var redProbeNode = new VoltmeterProbeNode( model, redProbeImage, true, {
      scale: .15,
      x: -300,
      y: 30,
      rotation: Math.PI/4});
    // wire connecting red probe to voltmeter body
    var redWire = new Path( updateWire( redProbeNode ), {
        stroke: "red",
        lineWidth: 3,
        lineCap: 'square',
        lineJoin: 'round',
        pickable: false
      });
    // black probe
    var blackProbeNode = new VoltmeterProbeNode( model, blackProbeImage, false, {
      scale: .15,
      x: -250,
      y: 40,
      rotation: Math.PI/4});
    // wire connecting black probe to voltmeter body
    var blackWire = new Path( updateWire( blackProbeNode ), {
        stroke: "black",
        lineWidth: 3,
        lineCap: 'square',
        lineJoin: 'round',
        pickable: false
      });
    
    this.addChild( backgroundNode );
    this.addChild( redProbeNode );
    this.addChild( redWire );
    this.addChild( blackProbeNode );
    this.addChild( blackWire );
    
    // Displays the value of the voltage when the probes are on the wires
    // Displays "? V" else
    var voltageTextNode = new Text( voltageString, {
      top: backgroundNode.top + 25,
      right: backgroundNode.right + 10,
      font: new PhetFont(14)});
    backgroundNode.addChild( voltageTextNode );
    
    var thisNode = this;

    // drag handler for body of meter
    var meterOffset = {};
    var meterDragHandler = new SimpleDragHandler( {
      //When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,
      start: function( event ) {
        meterOffset.x = backgroundNode.globalToParentPoint( event.pointer.point ).x - backgroundNode.centerX;
        meterOffset.y = backgroundNode.globalToParentPoint( event.pointer.point ).y - backgroundNode.centerY;
      },
      //Translate on drag events
      drag: function( event ) {
        var point = backgroundNode.globalToParentPoint( event.pointer.point );
        var desiredPosition = point.copy().subtract( meterOffset );
        model.moveMeterToPosition( desiredPosition, model.voltMeterPositionProperty );
      }
    } );
    backgroundNode.addInputListener( meterDragHandler );
    
    model.voltageProperty.link( function () {
      updateVoltageString();
    });
    
    model.redProbePositionProperty.link( function () {
      redProbeNode.centerX = model.redProbePositionProperty.value.x;
      redProbeNode.centerY = model.redProbePositionProperty.value.y;
      redWire.shape = updateWire( redProbeNode );
      
      updateVoltageString();
    });
    
    model.blackProbePositionProperty.link( function () {
      blackProbeNode.centerX = model.blackProbePositionProperty.value.x;
      blackProbeNode.centerY = model.blackProbePositionProperty.value.y;
      blackWire.shape = updateWire( blackProbeNode );
      
      updateVoltageString();
    });
    
    model.voltMeterPositionProperty.link( function () {
      backgroundNode.centerX = model.voltMeterPositionProperty.value.x;
      backgroundNode.centerY = model.voltMeterPositionProperty.value.y;
      redWire.shape = updateWire( redProbeNode );
      blackWire.shape = updateWire( blackProbeNode );
    });
    
    model.voltMeterProperty.link( function () {
      thisNode.visible = model.voltMeterProperty.value
    });
    
    // Redraws the wires when either probe moves or the meter body moves
    function updateWire( probeNode ) {
      var color = "red";
      // connection points
      var probeConnectionPoint = new Vector2( probeNode.left + 15, probeNode.bottom - 15 );
      var meterConnectionPoint = new Vector2( backgroundNode.centerX - 10, backgroundNode.bottom );
      if (probeNode == blackProbeNode) {
        probeConnectionPoint = new Vector2( probeNode.left + 8, probeNode.bottom - 5 );
        meterConnectionPoint = new Vector2( backgroundNode.centerX + 10, backgroundNode.bottom );
        color = "black";
      }
      
      // control points
      // The y coordinate of the body's control point varies with the x distance between the body and probe.
      var c1Offset = new Vector2( 0, Util.linear( 0, 800, 0, 200, backgroundNode.centerX - probeNode.left ) ); // x distance -> y coordinate
      var c2Offset = new Vector2( 50, 150 );
      var c1 = new Vector2( meterConnectionPoint.x + c1Offset.x, meterConnectionPoint.y + c1Offset.y );
      var c2 = new Vector2( probeConnectionPoint.x + c2Offset.x, probeConnectionPoint.y + c2Offset.y );
      
      var wireShape = new Shape()
        .moveTo( meterConnectionPoint.x, meterConnectionPoint.y )
        .cubicCurveTo( c1.x, c1.y, c2.x, c2.y, probeConnectionPoint.x, probeConnectionPoint.y );
      return wireShape;
    }
    
    // Updates the voltage display when the voltage changes or the probes move into position
    function updateVoltageString() {
      // translate probe tip locations into local coordinate system of wires
      var redProbeTip1 = new Vector2( redProbeNode.right / .7 + 614, redProbeNode.top / .7 + 43 );
      var blackProbeTip1 = new Vector2( blackProbeNode.right / .7 + 625, blackProbeNode.top / .7 - 176 );
      var redProbeTip2 = new Vector2( redProbeNode.right / .7 + 614, redProbeNode.top / .7 - 163 );
      var blackProbeTip2 = new Vector2( blackProbeNode.right / .7 + 625, blackProbeNode.top / .7 + 30 );
      
      // translate probe tip locations into local coordinate system of capacitor plates
      var redProbeTip3 = new Vector2( redProbeNode.right / .56 + 453.5, redProbeNode.top / .56 - 103 );
      var blackProbeTip3 = new Vector2( blackProbeNode.right / .56 + 469.5, blackProbeNode.top / .56 - 119.5 );
      var redProbeTip4 = new Vector2( redProbeNode.right / .56 + 453.5, redProbeNode.top / .56 - 103 );
      var blackProbeTip4 = new Vector2( blackProbeNode.right / .56 + 469.5, blackProbeNode.top / .56 - 119.5 );
      
      // recreate shapes wherein the probe tip can be and still display a voltage value
      var topPlate = capacitor.topPlate;
      var bottomPlate = capacitor.bottomPlate;
      var left = topPlate.left;
      var topPlateShape = new Shape().moveTo( left, topPlate.bottom ).
        verticalLineTo( topPlate.bottom - topPlate.plateDepth ).
        lineTo( left + topPlate.plateShift, topPlate.top ).
        horizontalLineTo( topPlate.right ).
        verticalLineTo( topPlate.top + topPlate.plateDepth ).
        lineTo( left + topPlate.plateWidth, topPlate.bottom ).
        horizontalLineTo( left );
      var bottomPlateShape = new Shape().moveTo( left, bottomPlate.bottom ).
        verticalLineTo( bottomPlate.bottom - bottomPlate.plateDepth ).
        lineTo( left + bottomPlate.plateShift, bottomPlate.top ).
        horizontalLineTo( bottomPlate.right ).
        verticalLineTo( bottomPlate.top + bottomPlate.plateDepth ).
        lineTo( left + bottomPlate.plateWidth, bottomPlate.bottom ).
        horizontalLineTo( left );
      
      // if the red probe is on top and the black probe is on bottom
      if ((wire.topWire.shape.containsPoint(redProbeTip1) || topPlateShape.containsPoint(redProbeTip3))
          && (wire.bottomWire.shape.containsPoint(blackProbeTip1) || bottomPlateShape.containsPoint(blackProbeTip3))) {
        voltageString = model.voltageProperty.value.toFixed(2) + voltString;
      }
      // if the probes are reversed
      else if ((wire.topWire.shape.containsPoint(blackProbeTip2) || topPlateShape.containsPoint(blackProbeTip4))
               && (wire.bottomWire.shape.containsPoint(redProbeTip2) || bottomPlateShape.containsPoint(redProbeTip4))) {
        voltageString = (model.voltageProperty.value * -1).toFixed(2) + voltString;
      }
      // if one or both probes are not on a wire or capacitor plate
      else {
        voltageString = unknownVoltString;
      }
      voltageTextNode.text = voltageString;
      voltageTextNode.right = backgroundNode.right - 10;
    }

  }
  
  return inherit( Node, VoltmeterNode);
} );