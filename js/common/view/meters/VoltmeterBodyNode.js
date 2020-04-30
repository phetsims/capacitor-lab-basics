// Copyright 2015-2020, University of Colorado Boulder

/**
 * Body of the voltmeter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import DynamicProperty from '../../../../../axon/js/DynamicProperty.js';
import Property from '../../../../../axon/js/Property.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Utils from '../../../../../dot/js/Utils.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import inherit from '../../../../../phet-core/js/inherit.js';
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import MovableDragHandler from '../../../../../scenery-phet/js/input/MovableDragHandler.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import Image from '../../../../../scenery/js/nodes/Image.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import Rectangle from '../../../../../scenery/js/nodes/Rectangle.js';
import Text from '../../../../../scenery/js/nodes/Text.js';
import voltmeterBodyImage from '../../../../images/voltmeter_body_png.js';
import capacitorLabBasicsStrings from '../../../capacitorLabBasicsStrings.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';

// digital display
const DISPLAY_FONT = new PhetFont( 18 );

// title display
const TITLE_FONT = new PhetFont( {
  size: 20
} );

const voltageString = capacitorLabBasicsStrings.voltage;
const voltsPatternString = capacitorLabBasicsStrings.voltsPattern;
const voltsUnknownString = capacitorLabBasicsStrings.volts.unknown;


/**
 * @constructor
 *
 * @param {Voltmeter} voltmeter - the voltmeter model
 * @param {YawPitchModelViewTransform3} modelViewTransform
 * @param {Property.<boolean>} isDraggedProperty
 * @param {Tandem} tandem
 */
function VoltmeterBodyNode( voltmeter, modelViewTransform, isDraggedProperty, tandem ) {

  Node.call( this );
  const self = this;

  this.cursor = 'pointer';

  // @public {Property.<Vector3>]}
  this.bodyPositionProperty = voltmeter.bodyPositionProperty;

  const readoutAdjustmentY = 15;

  // body of the meter
  const imageNode = new Image( voltmeterBodyImage, {
    scale: 0.336
  } );
  this.addChild( imageNode );

  // text label
  const labelText = new Text( voltageString, {
    font: TITLE_FONT,
    maxWidth: imageNode.width / 2
  } );
  labelText.center = new Vector2( imageNode.width / 2, imageNode.height / 3 + readoutAdjustmentY );
  this.addChild( labelText );

  const valueString = StringUtils.fillIn( voltsPatternString, {
    value: voltmeter.measuredVoltageProperty.value
  } );

  const valueText = new Text( valueString, {
    font: DISPLAY_FONT,
    maxWidth: imageNode.width * 0.4
  } );

  // add the display to the
  // display area for the value
  const backgroundRectWidth = imageNode.width / 2;
  const backgroundRectHeight = valueText.height + 5;
  const backgroundRect = new Rectangle( new Bounds2( 0, 0, backgroundRectWidth, backgroundRectHeight ), 5, 5, {
    lineWidth: 1,
    fill: 'white',
    stroke: 'black'
  } );
  const textCenter = new Vector2( this.center.x, this.center.y + readoutAdjustmentY );
  backgroundRect.center = textCenter;
  valueText.center = textCenter;
  this.addChild( backgroundRect );
  this.addChild( valueText );

  // offsets for connection points of wires that attach probes to body, determined by visual inspection.  If the
  // voltmeter body images ever changes, these will have to be changed as well.
  const imageBounds = imageNode.bounds;
  const probeOffset = 0.056;
  this.positiveConnectionOffset = new Vector2( ( 0.5 - probeOffset ) * imageBounds.width, 0.875 * imageBounds.maxY ); // @public bottom left
  this.negativeConnectionOffset = new Vector2( ( 0.5 + probeOffset ) * imageBounds.width, 0.875 * imageBounds.maxY ); // @public bottom right

  // update value
  voltmeter.measuredVoltageProperty.link( function( value ) {
    self.setValueText( valueText, value );
    valueText.center = backgroundRect.center;
  } );

  // update position with model
  voltmeter.bodyPositionProperty.link( function( bodyPosition ) {
    if ( bodyPosition instanceof Vector2 ) {
      self.translation = modelViewTransform.modelToViewPosition( bodyPosition.toVector3() );
    }
    else {
      self.translation = modelViewTransform.modelToViewPosition( bodyPosition );
    }
  } );

  // voltmeter is restricted by bounds in model coordinates for `handler, adjusted by dimensions
  // of the voltmeter body
  const adjustedViewBounds = new Bounds2( 0, 0, voltmeter.dragBounds.maxX - imageNode.width, voltmeter.dragBounds.maxY - imageNode.height );
  const bodyDragBounds = modelViewTransform.viewToModelBounds( adjustedViewBounds );

  const body2DProperty = new DynamicProperty( new Property( voltmeter.bodyPositionProperty ), {
    bidirectional: true,
    useDeepEquality: true,
    map: function( vector3 ) { return vector3.toVector2(); },
    inverseMap: function( vector2 ) { return vector2.toVector3(); }
  } );
  this.movableDragHandler = new MovableDragHandler( body2DProperty, {
    tandem: tandem.createTandem( 'dragHandler' ),
    dragBounds: bodyDragBounds,
    modelViewTransform: modelViewTransform.modelToViewTransform2D,
    startDrag: function() {
      isDraggedProperty.set( true );
    },
    endDrag: function() {
      isDraggedProperty.set( false );
    }
  } );
  self.addInputListener( this.movableDragHandler );
}

capacitorLabBasics.register( 'VoltmeterBodyNode', VoltmeterBodyNode );

inherit( Node, VoltmeterBodyNode, {

  /**
   * Set the text for the display value, formatting the units and number of decimal places.
   *
   * @param {Text} valueText
   * @param {number} value
   * @public
   */
  setValueText: function( valueText, value ) {
    if ( value === null ) {
      valueText.setText( voltsUnknownString );
    }
    else {
      const fixedValue = Utils.toFixed( value, 3 );
      valueText.setText( StringUtils.fillIn( voltsPatternString, { value: fixedValue } ) );
    }
  }
} );

export default VoltmeterBodyNode;
