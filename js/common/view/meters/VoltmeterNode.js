// Copyright 2002-2015, University of Colorado Boulder

/**
 * A voltmeter has a body, 2 probes, and 2 wires connecting the probes to the body.
 * This node is designed to be located at (0,0), so that we don't need to deal with
 * coordinate frame issues when the voltmeter's components move.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );
  var VoltmeterBodyNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/VoltmeterBodyNode' );
  var VoltmeterProbeNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/VoltmeterProbeNode' );
  var ProbeWireNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/ProbeWireNode' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );

  // constants
  // wire is a cubic curve, these are the control point offsets
  var BODY_CONTROL_POINT_OFFSET = new Vector2( 0, 100 );
  var PROBE_CONTROL_POINT_OFFSET = new Vector2( -80, 100 );

  var POSITIVE_WIRE_COLOR = PhetColorScheme.RED_COLORBLIND;
  var NEGATIVE_WIRE_COLOR = 'black';

  /**
   * Constructor.
   *
   * @param {Voltmeter} voltmeter - the voltmeter model
   * @param {CLModelViewTransform3D} modelViewTransform
   */
  function VoltmeterNode( voltmeter, modelViewTransform ) {

    Node.call( this );
    // TODO: All of these require a port.
    var bodyNode = new VoltmeterBodyNode( voltmeter, modelViewTransform );
    var positiveProbeNode = VoltmeterProbeNode.PositiveVoltmeterProbeNode( voltmeter, modelViewTransform );
    var negativeProbeNode = VoltmeterProbeNode.NegativeVoltmeterProbeNode( voltmeter, modelViewTransform );
    var positiveWireNode = new ProbeWireNode( bodyNode, positiveProbeNode, BODY_CONTROL_POINT_OFFSET, PROBE_CONTROL_POINT_OFFSET,
      bodyNode.positiveConnectionOffset, positiveProbeNode.connectionOffset, POSITIVE_WIRE_COLOR );
    var negativeWireNode = new ProbeWireNode( bodyNode, negativeProbeNode, BODY_CONTROL_POINT_OFFSET, PROBE_CONTROL_POINT_OFFSET,
      bodyNode.negativeConnectionOffset, negativeProbeNode.connectionOffset, NEGATIVE_WIRE_COLOR );

    // rendering order
    this.addChild( bodyNode );
    this.addChild( positiveProbeNode );
    this.addChild( negativeProbeNode );
    this.addChild( positiveWireNode );
    this.addChild( negativeWireNode );

  }

  return inherit( Node, VoltmeterNode );

} );
//  // modules
//  var inherit = require( 'PHET_CORE/inherit' );
//  var Image = require( 'SCENERY/nodes/Image' );
//  //var Input = require( 'SCENERY/input/Input' );
//  var Node = require( 'SCENERY/nodes/Node' );
//  var Path = require( 'SCENERY/nodes/Path' );
//  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
//  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
//  var Shape = require( 'KITE/Shape' );
//  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
//  var Text = require( 'SCENERY/nodes/Text' );
//  var Util = require( 'DOT/Util' );
//  var Vector2 = require( 'DOT/Vector2' );
//  var VoltmeterProbeNode = require( 'CAPACITOR_LAB_BASICS/capacitor-lab/view/meters/VoltmeterProbeNode' );
//
//  // strings
//  var voltString = require( 'string!CAPACITOR_LAB_BASICS/volt' );
//  var unknownVoltString = require( 'string!CAPACITOR_LAB_BASICS/volt.unknown' );
//
//  // images
//  var voltmeterBackgroundImage = require( 'image!CAPACITOR_LAB_BASICS/voltmeter.png' );
//  var redProbeImage = require( 'image!CAPACITOR_LAB_BASICS/probe_3D_red_large_cutout.png' );
//  var blackProbeImage = require( 'image!CAPACITOR_LAB_BASICS/probe_3D_black_large_cutout.png' );
//
//  /**
//   * Constructor for the voltmeter
//   * @param {CapacitorLabBasicsModel} model
//   * @param {CircuitNode} circuit
//   * @param {object} options
//   **/
//  function VoltmeterNode(model, circuit, options) {
//    options = _.extend({cursor: 'pointer'}, options);
//    Node.call( this, options);
//
//    var wire = circuit.wireNode;
//    var capacitor = circuit.capacitor;
//
//    var voltageString = unknownVoltString;
//    var probeScale = 0.15;
//
//    // body of the voltmeter
//    var bodyImage = new Image( voltmeterBackgroundImage, {scale: 0.7} );
//    var bodyNode = new Rectangle( bodyImage.x, bodyImage.y, bodyImage.width, bodyImage.height, 0, 0, {
//      focusable: true
//    } );
//    bodyNode.addChild( bodyImage );
//
//    // Redraws the wires when either probe moves or the meter body moves
//    function updateWire( probeNode ) {
//      var color = "red";
//      // connection points
//      var probeConnectionPoint = new Vector2( probeNode.left + 15, probeNode.bottom - 15 );
//      var meterConnectionPoint = new Vector2( bodyNode.centerX - 10, bodyNode.bottom );
//      if (probeNode === blackProbeNode) {
//        probeConnectionPoint = new Vector2( probeNode.left + 8, probeNode.bottom - 5 );
//        meterConnectionPoint = new Vector2( bodyNode.centerX + 10, bodyNode.bottom );
//        color = "black";
//      }
//
//      // control points
//      // The y coordinate of the body's control point varies with the x distance between the body and probe.
//      var c1Offset = new Vector2( 0, Util.linear( 0, 800, 0, 200, bodyNode.centerX - probeNode.left ) ); // x distance -> y coordinate
//      var c2Offset = new Vector2( 50, 150 );
//      var c1 = new Vector2( meterConnectionPoint.x + c1Offset.x, meterConnectionPoint.y + c1Offset.y );
//      var c2 = new Vector2( probeConnectionPoint.x + c2Offset.x, probeConnectionPoint.y + c2Offset.y );
//
//      var wireShape = new Shape()
//        .moveTo( meterConnectionPoint.x, meterConnectionPoint.y )
//        .cubicCurveTo( c1.x, c1.y, c2.x, c2.y, probeConnectionPoint.x, probeConnectionPoint.y );
//      return wireShape;
//    }
//
//    // Updates the voltage display when the voltage changes or the probes move into position
//    function updateVoltageString() {
//      var topPlate = capacitor.topPlate;
//      var bottomPlate = capacitor.bottomPlate;
//      var topPlateShape = topPlate.topPlate.shape;
//      var bottomPlateShape = bottomPlate.topPlate.shape;
//
//      // translate red probe tip locations into local coordinate system of wires
//      var redParentPoint = thisNode.localToParentPoint( new Vector2( redProbeNode.right-16, redProbeNode.top+16 ) );
//      var redCircuitPoint = circuit.parentToLocalPoint( redParentPoint );
//      var redWirePoint = wire.parentToLocalPoint( redCircuitPoint );
//      // translate red probe tip locations into local coordinate system of capacitor plates
//      var redCapPoint = capacitor.parentToLocalPoint( redCircuitPoint );
//      var redTopPlatePoint = topPlate.parentToLocalPoint( redCapPoint );
//      var redBottomPlatePoint = bottomPlate.parentToLocalPoint( redCapPoint );
//
//      // translate black probe tip locations into local coordinate system of wires
//      var blackParentPoint = thisNode.localToParentPoint( new Vector2( blackProbeNode.right-7, blackProbeNode.top+7 ) );
//      var blackCircuitPoint = circuit.parentToLocalPoint( blackParentPoint );
//      var blackWirePoint = wire.parentToLocalPoint( blackCircuitPoint );
//      // translate red probe tip locations into local coordinate system of capacitor plates
//      var blackCapPoint = capacitor.parentToLocalPoint( blackCircuitPoint );
//      var blackTopPlatePoint = topPlate.parentToLocalPoint( blackCapPoint );
//      var blackBottomPlatePoint = bottomPlate.parentToLocalPoint( blackCapPoint );
//
//      // if the red probe is on top and the black probe is on bottom
//      if ((wire.topWire.shape.containsPoint(redWirePoint) || topPlateShape.containsPoint(redTopPlatePoint)) &&
//          (wire.bottomWire.shape.containsPoint(blackWirePoint) || bottomPlateShape.containsPoint(blackBottomPlatePoint))) {
//        voltageString = Util.toFixed( model.voltageProperty.value, 2 ) + voltString;
//      }
//      // if the probes are reversed
//      else if ((wire.topWire.shape.containsPoint(blackWirePoint) || topPlateShape.containsPoint(blackTopPlatePoint)) &&
//               (wire.bottomWire.shape.containsPoint(redWirePoint) || bottomPlateShape.containsPoint(redBottomPlatePoint))) {
//        voltageString = ( Util.toFixed( model.voltageProperty.value * -1, 2 ) + voltString );
//      }
//      // if one or both probes are not on a wire or capacitor plate
//      else {
//        voltageString = unknownVoltString;
//      }
//      voltageTextNode.text = voltageString;
//      voltageTextNode.right = bodyImage.right - 10;
//    }
//
//    // red probe
//    var redProbeNode = new VoltmeterProbeNode( model, true, {
//      scale: probeScale,
//      x: -300,
//      y: 30,
//      rotation: Math.PI/4
//    } );
//    // wire connecting red probe to voltmeter body
//    var redWire = new Path( updateWire( redProbeNode ), {
//        stroke: "red",
//        lineWidth: 3,
//        lineCap: 'square',
//        lineJoin: 'round',
//        pickable: false
//    } );
//    // black probe
//    var blackProbeNode = new VoltmeterProbeNode( model, false, {
//      scale: probeScale,
//      x: -250,
//      y: 40,
//      rotation: Math.PI/4
//    } );
//    // wire connecting black probe to voltmeter body
//    var blackWire = new Path( updateWire( blackProbeNode ), {
//        stroke: "black",
//        lineWidth: 3,
//        lineCap: 'square',
//        lineJoin: 'round',
//        pickable: false
//    } );
//    // Ghost images of probes, to be displayed when the probe is in focus
//    this.redGhostNode = new Node( {visible: false} );
//    this.blackGhostNode = new Node( {visible: false} );
//    for (var i = 0; i < redProbeNode.locations.length; i++) {
//      this.redGhostNode.addChild( new Image( redProbeImage, {
//        scale: probeScale,
//        centerX: redProbeNode.locations[i].x,
//        centerY: redProbeNode.locations[i].y,
//        rotation: Math.PI/4
//      } ) );
//      this.blackGhostNode.addChild( new Image( blackProbeImage, {
//        scale: probeScale,
//        centerX: blackProbeNode.locations[i].x,
//        centerY: blackProbeNode.locations[i].y,
//        rotation: Math.PI/4
//      } ) );
//    }
//    this.redGhostNode.children[ 0 ].visible = false;
//    this.blackGhostNode.children[ 0 ].visible = false;
//
//    this.addChild( this.redGhostNode );
//    this.addChild( this.blackGhostNode );
//
//    this.addChild( redProbeNode );
//    this.addChild( redWire );
//    this.addChild( blackProbeNode );
//    this.addChild( blackWire );
//    this.addChild( bodyNode );
//
//    // Displays the value of the voltage when the probes are on the wires
//    // Displays "? V" else
//    var voltageTextNode = new Text( voltageString, {
//      top: bodyImage.top + 15,
//      right: bodyImage.right - 10,
//      font: new PhetFont( 14 )
//    } );
//    bodyNode.addChild( voltageTextNode );
//
//    var thisNode = this;
//
//    // drag handler for body of meter
//    var meterOffset = {};
//    var meterDragHandler = new SimpleDragHandler( {
//      //When dragging across it in a mobile device, pick it up
//      allowTouchSnag: true,
//      start: function( event ) {
//        meterOffset.x = bodyNode.globalToParentPoint( event.pointer.point ).x - bodyNode.centerX;
//        meterOffset.y = bodyNode.globalToParentPoint( event.pointer.point ).y - bodyNode.centerY;
//      },
//      //Translate on drag events
//      drag: function( event ) {
//        var point = bodyNode.globalToParentPoint( event.pointer.point );
//        var desiredPosition = point.copy().subtract( meterOffset );
//        model.moveMeterToPosition( desiredPosition, model.voltMeterPositionProperty );
//      }
//    } );
//    bodyNode.addInputListener( meterDragHandler );
//
//    model.voltageProperty.link( function () {
//      updateVoltageString();
//    });
//
//    model.redProbePositionProperty.link( function () {
//      redProbeNode.centerX = model.redProbePositionProperty.value.x;
//      redProbeNode.centerY = model.redProbePositionProperty.value.y;
//      redWire.shape = updateWire( redProbeNode );
//
//      updateVoltageString();
//    });
//
//    model.blackProbePositionProperty.link( function () {
//      blackProbeNode.centerX = model.blackProbePositionProperty.value.x;
//      blackProbeNode.centerY = model.blackProbePositionProperty.value.y;
//      blackWire.shape = updateWire( blackProbeNode );
//
//      updateVoltageString();
//    });
//
//    model.voltMeterPositionProperty.link( function () {
//      bodyNode.centerX = model.voltMeterPositionProperty.value.x;
//      bodyNode.centerY = model.voltMeterPositionProperty.value.y;
//      redWire.shape = updateWire( redProbeNode );
//      blackWire.shape = updateWire( blackProbeNode );
//    });
//
//    model.voltMeterProperty.link( function () {
//      thisNode.visible = model.voltMeterProperty.value;
//    });
//  }
//
//  return inherit( Node, VoltmeterNode, {
//    toggleGhosts: function( redGhosts ) {
//      if ( redGhosts ) {
//        this.redGhostNode.visible = !this.redGhostNode.visible;
//      }
//      else {
//        this.blackGhostNode.visible = !this.blackGhostNode.visible;
//      }
//    },
//
//    moveToGhost: function( probeNode, redGhosts, loc ) {
//      var i;
//      if ( redGhosts ) {
//        for ( i = 0; i < probeNode.locations.length; i++ ) {
//          this.redGhostNode.children[ i ].visible = true;
//        }
//        this.redGhostNode.children[ loc ].visible = false;
//      }
//      else {
//        for ( i = 0; i < probeNode.locations.length; i++ ) {
//          this.blackGhostNode.children[ i ].visible = true;
//        }
//        this.blackGhostNode.children[ loc ].visible = false;
//      }
//    }
//  });
//} );