// Copyright 2015-2023, University of Colorado Boulder

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
import StringUtils from '../../../../../phetcommon/js/util/StringUtils.js';
import PhetFont from '../../../../../scenery-phet/js/PhetFont.js';
import { DragListener, Image, Node, Rectangle, Text } from '../../../../../scenery/js/imports.js';
import voltmeterBody_png from '../../../../images/voltmeterBody_png.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';
import CapacitorLabBasicsStrings from '../../../CapacitorLabBasicsStrings.js';

// digital display
const DISPLAY_FONT = new PhetFont( 18 );

// title display
const TITLE_FONT = new PhetFont( {
  size: 20
} );

const voltageString = CapacitorLabBasicsStrings.voltage;
const voltsPatternString = CapacitorLabBasicsStrings.voltsPattern;
const voltsUnknownString = CapacitorLabBasicsStrings.volts.unknown;

class VoltmeterBodyNode extends Node {
  /**
   * @param {Voltmeter} voltmeter - the voltmeter model
   * @param {YawPitchModelViewTransform3} modelViewTransform
   * @param {Property.<boolean>} isDraggedProperty
   * @param {Tandem} tandem
   */
  constructor( voltmeter, modelViewTransform, isDraggedProperty, tandem ) {

    super();

    this.cursor = 'pointer';

    // @public {Property.<Vector3>]}
    this.bodyPositionProperty = voltmeter.bodyPositionProperty;

    const readoutAdjustmentY = 15;

    // body of the meter
    const imageNode = new Image( voltmeterBody_png, {
      scale: 0.336,
      hitTestPixels: true
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
    voltmeter.measuredVoltageProperty.link( value => {
      this.setValueText( valueText, value );
      valueText.center = backgroundRect.center;
    } );

    // update position with model
    voltmeter.bodyPositionProperty.link( bodyPosition => {
      if ( bodyPosition instanceof Vector2 ) {
        this.translation = modelViewTransform.modelToViewPosition( bodyPosition.toVector3() );
      }
      else {
        this.translation = modelViewTransform.modelToViewPosition( bodyPosition );
      }
    } );

    // voltmeter is restricted by bounds in model coordinates for `handler, adjusted by dimensions
    // of the voltmeter body
    const adjustedViewBounds = new Bounds2( 0, 0, voltmeter.dragBounds.maxX - imageNode.width, voltmeter.dragBounds.maxY - imageNode.height );
    const bodyDragBounds = modelViewTransform.viewToModelBounds( adjustedViewBounds );

    const body2DProperty = new DynamicProperty( new Property( voltmeter.bodyPositionProperty ), {
      bidirectional: true,
      valueComparisonStrategy: 'equalsFunction',
      map: vector3 => vector3.toVector2(),
      inverseMap: vector2 => vector2.toVector3()
    } );
    this.dragListener = new DragListener( {
      positionProperty: body2DProperty,
      attach: true,
      useParentOffset: true,
      tandem: tandem.createTandem( 'dragListener' ),
      dragBoundsProperty: new Property( bodyDragBounds ),
      transform: modelViewTransform.modelToViewTransform2D,
      start: () => {
        isDraggedProperty.set( true );
      },
      end: () => {
        isDraggedProperty.set( false );
      }
    } );
    this.addInputListener( this.dragListener );
  }


  /**
   * Set the text for the display value, formatting the units and number of decimal places.
   *
   * @param {Text} valueText
   * @param {number} value
   * @public
   */
  setValueText( valueText, value ) {
    if ( value === null ) {
      valueText.setString( voltsUnknownString );
    }
    else {
      const fixedValue = Utils.toFixed( value, 3 );
      valueText.setString( StringUtils.fillIn( voltsPatternString, { value: fixedValue } ) );
    }
  }
}

capacitorLabBasics.register( 'VoltmeterBodyNode', VoltmeterBodyNode );

export default VoltmeterBodyNode;
