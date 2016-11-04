// Copyright 2015, University of Colorado Boulder

/**
 * Body of the voltmeter.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @autor Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Bounds2 = require( 'DOT/Bounds2' );
  var Util = require( 'DOT/Util' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // digital display
  //private static final NumberFormat DISPLAY_VALUE_FORMAT = new DefaultDecimalFormat( "0.00" );
  var DISPLAY_FONT = new PhetFont( 18 );

  // title display
  var TITLE_FONT = new PhetFont( {
    size: 20
  } );

  // strings
  var unitsVoltsString = require( 'string!CAPACITOR_LAB_BASICS/units.volts' );
  var voltageString = require( 'string!CAPACITOR_LAB_BASICS/voltage' );
  var voltsUnknownString = require( 'string!CAPACITOR_LAB_BASICS/volts.unknown' );
  var pattern0Value1UnitsString = require( 'string!CAPACITOR_LAB_BASICS/pattern.0value.1units' );

  // images
  var voltmeterBodyImage = require( 'image!CAPACITOR_LAB_BASICS/voltmeter_body.png' );

  /**
   * Constructor
   *
   * @param {Voltmeter} voltmeter - the voltmeter model
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Property.<boolean>} inUserControlProperty
   * @param {Tandem} tandem
   */
  function VoltmeterBodyNode( voltmeter, modelViewTransform, inUserControlProperty, tandem ) {

    Node.call( this );
    var self = this;

    this.bodyLocationProperty = voltmeter.bodyLocationProperty; // @public

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
    labelText.center = new Vector2( imageNode.width / 2, imageNode.height / 3 );
    this.addChild( labelText );

    var valueString = StringUtils.format( pattern0Value1UnitsString, voltmeter.valueProperty.get(), unitsVoltsString );
    var valueText = new Text( valueString, {
      font: DISPLAY_FONT,
      maxWidth: imageNode.width * 0.4
    } );

    // add the display to the
    // display area for the value
    var backgroundRectWidth = imageNode.width / 2;
    var backgroundRectHeight = valueText.height + 10;
    var backgroundRect = new Rectangle( new Bounds2( 0, 0, backgroundRectWidth, backgroundRectHeight ), 5, 5, {
      lineWidth: 2,
      fill: 'white',
      stroke: 'black'
    } );

    backgroundRect.center = this.center;
    valueText.center = this.center;
    this.addChild( backgroundRect );
    this.addChild( valueText );

    // offsets for connection points of wires that attach probes to body, determined by visual inspection.  If the
    // voltmeter body images ever changes, these will have to be changed as well.
    var imageBounds = imageNode.bounds;
    this.positiveConnectionOffset = new Vector2( 0.455 * imageBounds.width, 0.875 * imageBounds.maxY ); // @public bottom left
    this.negativeConnectionOffset = new Vector2( 0.565 * imageBounds.width, 0.875 * imageBounds.maxY ); // @public bottom right

    // update value
    voltmeter.valueProperty.link( function( value ) {
      self.setValueText( valueText, value );
      valueText.center = backgroundRect.center;
    } );

    // update position with model
    voltmeter.bodyLocationProperty.link( function( bodyLocation ) {
      self.translation = modelViewTransform.modelToViewPosition( bodyLocation );
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
        if ( !voltmeter.bodyLocation.isVector3 ) {
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
     */
    setValueText: function( valueText, value ) {
      if (  value === null ) {
        valueText.setText( StringUtils.format( pattern0Value1UnitsString, voltsUnknownString, unitsVoltsString ) );
      } else {
        var fixedValue = Util.toFixed( value, 3 );
        valueText.setText( StringUtils.format( pattern0Value1UnitsString, fixedValue, unitsVoltsString ) );
      }
    }
  } );
} );

