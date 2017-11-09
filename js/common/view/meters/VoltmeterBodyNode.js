// Copyright 2015-2017, University of Colorado Boulder

/**
 * Body of the voltmeter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @autor Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // digital display
  var DISPLAY_FONT = new PhetFont( 18 );

  // title display
  var TITLE_FONT = new PhetFont( {
    size: 20
  } );

  // strings
  var voltsPatternString = require( 'string!CAPACITOR_LAB_BASICS/voltsPattern' );
  var voltageString = require( 'string!CAPACITOR_LAB_BASICS/voltage' );
  var voltsUnknownString = require( 'string!CAPACITOR_LAB_BASICS/volts.unknown' );

  // images
  var voltmeterBodyImage = require( 'image!CAPACITOR_LAB_BASICS/voltmeter_body.png' );

  /**
   * @constructor
   *
   * @param {Voltmeter} voltmeter - the voltmeter model
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Property.<boolean>} inUserControlProperty
   * @param {Tandem} tandem
   */
  function VoltmeterBodyNode( voltmeter, modelViewTransform, inUserControlProperty, tandem ) {

    Node.call( this );
    var self = this;

    this.cursor = 'pointer';

     // @public {Property.<Vector3>]}
    this.bodyLocationProperty = voltmeter.bodyLocationProperty;

    var readoutAdjustmentY = 15;

    // body of the meter
    var imageNode = new Image( voltmeterBodyImage, {
      scale: 0.336
    } );
    this.addChild( imageNode );

    // text label
    var labelText = new Text( voltageString, {
      font: TITLE_FONT,
      maxWidth: imageNode.width / 2
    } );
    labelText.center = new Vector2( imageNode.width / 2, imageNode.height / 3 + readoutAdjustmentY );
    this.addChild( labelText );

    var valueString = StringUtils.fillIn( voltsPatternString, {
      value: voltmeter.measuredVoltageProperty.value
    } );

    var valueText = new Text( valueString, {
      font: DISPLAY_FONT,
      maxWidth: imageNode.width * 0.4
    } );

    // add the display to the
    // display area for the value
    var backgroundRectWidth = imageNode.width / 2;
    var backgroundRectHeight = valueText.height + 5;
    var backgroundRect = new Rectangle( new Bounds2( 0, 0, backgroundRectWidth, backgroundRectHeight ), 5, 5, {
      lineWidth: 1,
      fill: 'white',
      stroke: 'black'
    } );
    var textCenter = new Vector2( this.center.x, this.center.y + readoutAdjustmentY );
    backgroundRect.center = textCenter;
    valueText.center = textCenter;
    this.addChild( backgroundRect );
    this.addChild( valueText );

    // offsets for connection points of wires that attach probes to body, determined by visual inspection.  If the
    // voltmeter body images ever changes, these will have to be changed as well.
    var imageBounds = imageNode.bounds;
    var probeOffset = 0.056;
    this.positiveConnectionOffset = new Vector2( ( 0.5 - probeOffset ) * imageBounds.width, 0.875 * imageBounds.maxY ); // @public bottom left
    this.negativeConnectionOffset = new Vector2( ( 0.5 + probeOffset ) * imageBounds.width, 0.875 * imageBounds.maxY ); // @public bottom right

    // update value
    voltmeter.measuredVoltageProperty.link( function( value ) {
      self.setValueText( valueText, value );
      valueText.center = backgroundRect.center;
    } );

    // update position with model
    voltmeter.bodyLocationProperty.link( function( bodyLocation ) {
      if ( bodyLocation instanceof Vector2 ) {
        self.translation = modelViewTransform.modelToViewPosition( bodyLocation.toVector3() );
      }
      else {
        self.translation = modelViewTransform.modelToViewPosition( bodyLocation );
      }
    } );

    // voltmeter is restricted by bounds in model coordinates for `handler, adjusted by dimensions
    // of the voltmeter body
    var adjustedViewBounds = new Bounds2( 0, 0, voltmeter.dragBounds.maxX - imageNode.width, voltmeter.dragBounds.maxY - imageNode.height );
    var bodyDragBounds = modelViewTransform.viewToModelBounds( adjustedViewBounds );

    this.movableDragHandler = new MovableDragHandler( voltmeter.bodyLocationProperty, {
      tandem: tandem.createTandem( 'inputListener' ),
      dragBounds: bodyDragBounds,
      modelViewTransform: modelViewTransform,
      startDrag: function() {
        inUserControlProperty.set( true );
      },
      onDrag: function() {
        // if the user tried to drag the voltmeter out of bounds, MovableDragHandler converted location
        // to a Vector2.  In this case, we need to make sure that the location is a vector3.
        if ( !voltmeter.bodyLocationProperty.value.isVector3 ) {
          voltmeter.bodyLocationProperty.set( voltmeter.bodyLocationProperty.value.toVector3() );
        }
      },
      endDrag: function() {
        inUserControlProperty.set( false );
      }
    } );
    self.addInputListener( this.movableDragHandler );

  }

  capacitorLabBasics.register( 'VoltmeterBodyNode', VoltmeterBodyNode );

  return inherit( Node, VoltmeterBodyNode, {

    /**
     * Set the text for the display value, formatting the units and number of decimal places.
     *
     * @param {Text} valueText
     * @param {number} value
     * @public
     */
    setValueText: function( valueText, value ) {
      if ( value === null ) {
        valueText.setText( StringUtils.fillIn( voltsPatternString, { value: voltsUnknownString } ) );
      }
      else {
        var fixedValue = Util.toFixed( value, 3 );
        valueText.setText( StringUtils.fillIn( voltsPatternString, { value: fixedValue } ) );
      }
    }
  } );
} );
