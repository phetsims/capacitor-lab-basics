// Copyright 2015-2017, University of Colorado Boulder

/**
 * A voltmeter has a body, 2 probes, and 2 wires connecting the probes to the body.
 * This node is designed to be located at (0,0), so that we don't need to deal with
 * coordinate frame issues when the voltmeter's components move.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var ProbeWireNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/ProbeWireNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );
  var VoltmeterBodyNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/VoltmeterBodyNode' );
  var VoltmeterProbeNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/VoltmeterProbeNode' );

  // strings
  var voltageString = require( 'string!CAPACITOR_LAB_BASICS/voltage' );

  // title display
  var TITLE_FONT = new PhetFont( {
    size: 7
  } );

  // images
  var blackVoltmeterProbeImage = require( 'image!CAPACITOR_LAB_BASICS/probe_black.png' );
  var redVoltmeterProbeImage = require( 'image!CAPACITOR_LAB_BASICS/probe_red.png' );
  var voltmeterBodyImage = require( 'image!CAPACITOR_LAB_BASICS/voltmeter_body.png' );

  /**
   * @constructor
   *
   * @param {Voltmeter} voltmeter - the voltmeter model
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Tandem} tandem
   */
  function VoltmeterNode( voltmeter, modelViewTransform, voltmeterVisibleProperty, tandem ) {

    Node.call( this, { tandem: tandem } );
    var self = this;

    // construct all parts of the probe
    // @public {VoltmeterBodyNode}
    this.bodyNode = new VoltmeterBodyNode( voltmeter, modelViewTransform, voltmeter.isDraggedProperty,
      tandem.createTandem( 'bodyNode' ) );

    // @public {VoltmeterProbeNode}
    this.positiveProbeNode = VoltmeterProbeNode.createPositiveVoltmeterProbeNode( voltmeter, modelViewTransform,
      tandem.createTandem( 'positiveProbeNode' ) );

    // @public {VoltmeterProbeNode}
    this.negativeProbeNode = VoltmeterProbeNode.createNegativeVoltmeterProbeNode( voltmeter, modelViewTransform,
      tandem.createTandem( 'negativeProbeNode' ) );

    var positiveWireNode = new ProbeWireNode( this.bodyNode, this.positiveProbeNode, true );
    var negativeWireNode = new ProbeWireNode( this.bodyNode, this.negativeProbeNode, false );

    // rendering order
    this.addChild( this.bodyNode );
    this.addChild( this.positiveProbeNode );
    this.addChild( positiveWireNode );
    this.addChild( this.negativeProbeNode );
    this.addChild( negativeWireNode );

    voltmeterVisibleProperty.link( function( voltmeterVisible ) {
      self.visible = voltmeterVisible;
    } );
  }

  capacitorLabBasics.register( 'VoltmeterNode', VoltmeterNode );

  inherit( Node, VoltmeterNode, {}, {

    /**
     * Create an icon of the voltmeter, to be used in the toolbox panel.
     *
     * @returns {VoltmeterIconNode}
     * @public
     */
    createVoltmeterIconNode: function() {
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

    Node.call( this,{scale: .60} );

    // body of the voltmeter icon
    var voltmeterImageNode = new Image( voltmeterBodyImage, {
      scale: 0.17
    } );
    var offset = 8;
    var labelText = new Text( voltageString, {
      font: TITLE_FONT,
      maxWidth: voltmeterImageNode.width / 2
    } );
    labelText.center = new Vector2( voltmeterImageNode.width / 2, voltmeterImageNode.height / 3 + offset );
    var readoutRectangle = new Rectangle( 0, 0, voltmeterImageNode.width / 2, labelText.height + 8, 2, 2, {
      lineWidth: 0.75,
      fill: 'white',
      stroke: 'black'
    } );
    readoutRectangle.addChild( new Text( '?', {
      font: new PhetFont( { size: 9 } ),
      center: readoutRectangle.center
    } ) );

    var imageBounds = voltmeterImageNode.bounds;
    var positiveConnectionOffset = new Vector2( 3 * imageBounds.width / 7, imageBounds.maxY * 7 / 8 );
    var negativeConnectionOffset = new Vector2( 4 * imageBounds.width / 7, imageBounds.maxY * 7 / 8 );

    // probes for the voltmeter icon, not rotated for perspective
    var redProbeImage = new Image( redVoltmeterProbeImage, {
      scale: 0.10
    } );
    var blackProbeImage = new Image( blackVoltmeterProbeImage, {
      scale: 0.10
    } );

    // layout - must be done before wire bezier calculations
    readoutRectangle.center = new Vector2( voltmeterImageNode.center.x, voltmeterImageNode.center.y + offset );
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
    this.children = [ voltmeterImageNode, labelText, readoutRectangle, blackProbeImage, redProbeImage, redWirePath,
      blackWirePath
    ];
  }

  capacitorLabBasics.register( 'VoltmeterIconNode', VoltmeterIconNode );

  inherit( Node, VoltmeterIconNode );

  return VoltmeterNode;
} );
