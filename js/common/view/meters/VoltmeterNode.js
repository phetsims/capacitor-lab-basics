// Copyright 2015, University of Colorado Boulder

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
  var Image = require( 'SCENERY/nodes/Image' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // strings
  var voltageString = require( 'string!CAPACITOR_LAB_BASICS/voltage' );

  // constants
  // wire is a cubic curve, these are the control point offsets
  var BODY_CONTROL_POINT_OFFSET = new Vector2( 0, 100 );
  var PROBE_CONTROL_POINT_OFFSET = new Vector2( -80, 100 );

  // title display
  var TITLE_FONT = new PhetFont( { size: 7 } );

  var POSITIVE_WIRE_COLOR = PhetColorScheme.RED_COLORBLIND;
  var NEGATIVE_WIRE_COLOR = 'black';

  // images
  var voltmeterBodyImage = require( 'image!CAPACITOR_LAB_BASICS/voltmeter_body.png' );
  var redVoltmeterProbeImage = require( 'image!CAPACITOR_LAB_BASICS/probe_red.png' );
  var blackVoltmeterProbeImage = require( 'image!CAPACITOR_LAB_BASICS/probe_black.png' );

  /**
   * Constructor.
   *
   * @param {Voltmeter} voltmeter - the voltmeter model
   * @param {CLModelViewTransform3D} modelViewTransform
   */
  function VoltmeterNode( voltmeter, modelViewTransform, voltmeterVisibleProperty ) {

    Node.call( this );
    var thisNode = this;

    // construct all parts of the probe
    this.bodyNode = new VoltmeterBodyNode( voltmeter, modelViewTransform, voltmeter.inUserControlProperty ); // @public
    this.positiveProbeNode = VoltmeterProbeNode.PositiveVoltmeterProbeNode( voltmeter, modelViewTransform );
    this.negativeProbeNode = VoltmeterProbeNode.NegativeVoltmeterProbeNode( voltmeter, modelViewTransform );
    var positiveWireNode = new ProbeWireNode( this.bodyNode, this.positiveProbeNode, BODY_CONTROL_POINT_OFFSET, PROBE_CONTROL_POINT_OFFSET,
      this.bodyNode.positiveConnectionOffset, this.positiveProbeNode.connectionOffset, POSITIVE_WIRE_COLOR );
    var negativeWireNode = new ProbeWireNode( this.bodyNode, this.negativeProbeNode, BODY_CONTROL_POINT_OFFSET, PROBE_CONTROL_POINT_OFFSET,
      this.bodyNode.negativeConnectionOffset, this.negativeProbeNode.connectionOffset, NEGATIVE_WIRE_COLOR );

    // rendering order
    this.addChild( this.bodyNode );
    this.addChild( this.positiveProbeNode );
    this.addChild( positiveWireNode );
    this.addChild( this.negativeProbeNode );
    this.addChild( negativeWireNode );

    voltmeterVisibleProperty.link( function( voltmeterVisible ) {
      thisNode.visible = voltmeterVisible;
    } );

  }

  capacitorLabBasics.register( 'VoltmeterNode', VoltmeterNode );

  inherit( Node, VoltmeterNode, {}, {

    // Create an icon of the voltmeter, to be used in the toolbox panel.
    VoltmeterIconNode: function() {
      return new VoltmeterIconNode();
    },

    // statics for dimensions of the voltmeter body image
    VOLTMETER_BODY_HEIGHT: voltmeterBodyImage.height,
    VOLTMETER_BODY_WIDTH: voltmeterBodyImage.width

  } );

  /**
   * Generates an icon of the voltmeter with probes, wires, and a title.
   * @constructor
   */
  function VoltmeterIconNode() {

    Node.call( this );

    // body of the voltmeter icon
    var voltmeterImageNode = new Image( voltmeterBodyImage, { scale: 0.17 } );
    var labelText = new Text( voltageString, { font: TITLE_FONT } );
    labelText.center = new Vector2( voltmeterImageNode.width / 2, voltmeterImageNode.height / 3 );
    var readoutRectangle = new Rectangle( 0, 0, voltmeterImageNode.width / 2, labelText.height + 8, 2, 2, {
      lineWidth: 0.75,
      fill: 'white',
      stroke: 'black'
    } );

    var imageBounds = voltmeterImageNode.bounds;
    var positiveConnectionOffset = new Vector2( 3 * imageBounds.width / 7, imageBounds.maxY * 7 / 8 );
    var negativeConnectionOffset = new Vector2( 4 * imageBounds.width / 7, imageBounds.maxY * 7 / 8 );

    // probes for the voltmeter icon, not rotated for perspective
    var redProbeImage = new Image( redVoltmeterProbeImage, { scale: 0.10 } );
    var blackProbeImage = new Image( blackVoltmeterProbeImage, { scale: 0.10 } );

    // layout - must be done before wire bezier calculations
    readoutRectangle.center = voltmeterImageNode.center;
    redProbeImage.centerBottom = voltmeterImageNode.centerBottom.minusXY( 40, 15 );
    blackProbeImage.centerBottom = voltmeterImageNode.centerBottom.minusXY( -40, 15 );

    // wires for the icon, bezier cubics
    //black wire control points
    var blackProbeConnectionPoint = blackProbeImage.centerBottom;
    var blackVoltmeterConnectionPoint = voltmeterImageNode.translation.plus( negativeConnectionOffset );
    var blackWireControlPoint1 = new Vector2(
      blackVoltmeterConnectionPoint.x + ( blackProbeConnectionPoint.x - blackVoltmeterConnectionPoint.x ) / 2,
      ( blackVoltmeterConnectionPoint.y + 10 )
    );
    var blackWireControlPoint2 = new Vector2( blackProbeConnectionPoint.x, blackVoltmeterConnectionPoint.y + 5 );

    // black wire shape
    var blackWireShape = new Shape()
      .moveToPoint( blackVoltmeterConnectionPoint )
      .cubicCurveToPoint( blackWireControlPoint1, blackWireControlPoint2, blackProbeConnectionPoint );
    var blackWirePath = new Path( blackWireShape, {
      stroke: 'black',
      lineWidth: 2
    } );

    // red wire connection points
    var redProbeConnectionPoint = redProbeImage.centerBottom;
    var redVoltmeterConnectionPoint = voltmeterImageNode.translation.plus( positiveConnectionOffset );
    var redWireControlPoint1 = new Vector2(
      redVoltmeterConnectionPoint.x - ( redVoltmeterConnectionPoint.x - redProbeConnectionPoint.x ) / 2,
      ( blackVoltmeterConnectionPoint.y + 10 )
    );
    var redWireControlPoint2 = new Vector2( redProbeConnectionPoint.x, redVoltmeterConnectionPoint.y + 5 );

    var redWireShape = new Shape()
      .moveToPoint( redVoltmeterConnectionPoint )
      .cubicCurveToPoint( redWireControlPoint1, redWireControlPoint2, redProbeConnectionPoint );
    var redWirePath = new Path( redWireShape, {
      stroke: PhetColorScheme.RED_COLORBLIND,
      lineWidth: 2
    } );


    // rendering order for the icon
    this.children = [ voltmeterImageNode, labelText, readoutRectangle, blackProbeImage, redProbeImage, redWirePath, blackWirePath ];

  }

  capacitorLabBasics.register( 'VoltmeterIconNode', VoltmeterIconNode );
  
  inherit( Node, VoltmeterIconNode );

  return VoltmeterNode;
} );