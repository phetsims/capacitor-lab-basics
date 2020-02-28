// Copyright 2015-2020, University of Colorado Boulder

/**
 * A voltmeter has a body, 2 probes, and 2 wires connecting the probes to the body.
 * This node is designed to be located at (0,0), so that we don't need to deal with
 * coordinate frame issues when the voltmeter's components move.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import Shape from '../../../../../kite/js/Shape.js';
import inherit from '../../../../../phet-core/js/inherit.js';
import PhetColorScheme from '../../../../../scenery-phet/js/PhetColorScheme.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import Image from '../../../../../scenery/js/nodes/Image.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Path from '../../../../../scenery/js/nodes/Path.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import blackVoltmeterProbeImage from '../../../../images/probe_black_png.js';
import redVoltmeterProbeImage from '../../../../images/probe_red_png.js';
import voltmeterBodyImage from '../../../../images/voltmeter_body_png.js';
import capacitorLabBasicsStrings from '../../../capacitor-lab-basics-strings.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';
import ProbeWireNode from './ProbeWireNode.js';
import VoltmeterBodyNode from './VoltmeterBodyNode.js';
import VoltmeterProbeNode from './VoltmeterProbeNode.js';

const voltageString = capacitorLabBasicsStrings.voltage;

// title display
const TITLE_FONT = new PhetFont( {
  size: 7
} );


/**
 * @constructor
 *
 * @param {Voltmeter} voltmeter - the voltmeter model
 * @param {YawPitchModelViewTransform3} modelViewTransform
 * @param {Tandem} tandem
 */
function VoltmeterNode( voltmeter, modelViewTransform, voltmeterVisibleProperty, tandem ) {

  Node.call( this, { tandem: tandem } );
  const self = this;

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

  const positiveWireNode = new ProbeWireNode( this.bodyNode, this.positiveProbeNode, true );
  const negativeWireNode = new ProbeWireNode( this.bodyNode, this.negativeProbeNode, false );

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
   * @param {Number} scale - scales the size of the Node
   * @param {Tandem} tandem
   *
   * @returns {VoltmeterIconNode}
   * @public
   */
  createVoltmeterIconNode: function( scale, tandem ) {
    return new VoltmeterIconNode( scale, tandem );
  },

  // statics for dimensions of the voltmeter body image
  VOLTMETER_BODY_HEIGHT: voltmeterBodyImage.height,
  VOLTMETER_BODY_WIDTH: voltmeterBodyImage.width
} );

/**
 * Generates an icon of the voltmeter with probes, wires, and a title.
 * @param {Number} scale - scales the size of the Node
 * @param {Tandem} tandem
 * @constructor
 */
function VoltmeterIconNode( scale, tandem ) {

  Node.call( this, { scale: scale, tandem: tandem } );

  // body of the voltmeter icon
  const voltmeterImageNode = new Image( voltmeterBodyImage, {
    scale: 0.17
  } );
  const offset = 8;
  const labelText = new Text( voltageString, {
    font: TITLE_FONT,
    maxWidth: voltmeterImageNode.width / 2
  } );
  labelText.center = new Vector2( voltmeterImageNode.width / 2, voltmeterImageNode.height / 3 + offset );
  const readoutRectangle = new Rectangle( 0, 0, voltmeterImageNode.width / 2, labelText.height + 8, 2, 2, {
    lineWidth: 0.75,
    fill: 'white',
    stroke: 'black'
  } );
  readoutRectangle.addChild( new Text( '?', {
    font: new PhetFont( { size: 9 } ),
    center: readoutRectangle.center
  } ) );

  const imageBounds = voltmeterImageNode.bounds;
  const positiveConnectionOffset = new Vector2( 3 * imageBounds.width / 7, imageBounds.maxY * 7 / 8 );
  const negativeConnectionOffset = new Vector2( 4 * imageBounds.width / 7, imageBounds.maxY * 7 / 8 );

  // probes for the voltmeter icon, not rotated for perspective
  const redProbeImage = new Image( redVoltmeterProbeImage, {
    scale: 0.10
  } );
  const blackProbeImage = new Image( blackVoltmeterProbeImage, {
    scale: 0.10
  } );

  // layout - must be done before wire bezier calculations
  readoutRectangle.center = new Vector2( voltmeterImageNode.center.x, voltmeterImageNode.center.y + offset );
  redProbeImage.centerBottom = voltmeterImageNode.centerBottom.minusXY( 40, 15 );
  blackProbeImage.centerBottom = voltmeterImageNode.centerBottom.minusXY( -40, 15 );

  // wires for the icon, bezier cubics
  //black wire control points
  const blackProbeConnectionPoint = blackProbeImage.centerBottom;
  const blackVoltmeterConnectionPoint = voltmeterImageNode.translation.plus( negativeConnectionOffset );
  const blackWireControlPoint1 = new Vector2(
    blackVoltmeterConnectionPoint.x + ( blackProbeConnectionPoint.x - blackVoltmeterConnectionPoint.x ) / 2,
    ( blackVoltmeterConnectionPoint.y + 10 )
  );
  const blackWireControlPoint2 = new Vector2( blackProbeConnectionPoint.x, blackVoltmeterConnectionPoint.y + 5 );

  // black wire shape
  const blackWireShape = new Shape()
    .moveToPoint( blackVoltmeterConnectionPoint )
    .cubicCurveToPoint( blackWireControlPoint1, blackWireControlPoint2, blackProbeConnectionPoint );
  const blackWirePath = new Path( blackWireShape, {
    stroke: 'black',
    lineWidth: 2
  } );

  // red wire connection points
  const redProbeConnectionPoint = redProbeImage.centerBottom;
  const redVoltmeterConnectionPoint = voltmeterImageNode.translation.plus( positiveConnectionOffset );
  const redWireControlPoint1 = new Vector2(
    redVoltmeterConnectionPoint.x - ( redVoltmeterConnectionPoint.x - redProbeConnectionPoint.x ) / 2,
    ( blackVoltmeterConnectionPoint.y + 10 )
  );
  const redWireControlPoint2 = new Vector2( redProbeConnectionPoint.x, redVoltmeterConnectionPoint.y + 5 );

  const redWireShape = new Shape()
    .moveToPoint( redVoltmeterConnectionPoint )
    .cubicCurveToPoint( redWireControlPoint1, redWireControlPoint2, redProbeConnectionPoint );
  const redWirePath = new Path( redWireShape, {
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

export default VoltmeterNode;