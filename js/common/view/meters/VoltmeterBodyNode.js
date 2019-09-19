// Copyright 2015-2018, University of Colorado Boulder

/**
 * Body of the voltmeter.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const DynamicProperty = require( 'AXON/DynamicProperty' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetFont = require( 'SCENERY_PHET/PhetFont' );
  const Property = require( 'AXON/Property' );
  const Rectangle = require( 'SCENERY/nodes/Rectangle' );
  const StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  const Text = require( 'SCENERY/nodes/Text' );
  const Util = require( 'DOT/Util' );
  const Vector2 = require( 'DOT/Vector2' );

  // digital display
  var DISPLAY_FONT = new PhetFont( 18 );

  // title display
  var TITLE_FONT = new PhetFont( {
    size: 20
  } );

  // strings
  const voltageString = require( 'string!CAPACITOR_LAB_BASICS/voltage' );
  const voltsPatternString = require( 'string!CAPACITOR_LAB_BASICS/voltsPattern' );
  const voltsUnknownString = require( 'string!CAPACITOR_LAB_BASICS/volts.unknown' );

  // images
  const voltmeterBodyImage = require( 'image!CAPACITOR_LAB_BASICS/voltmeter_body.png' );

  /**
   * @constructor
   *
   * @param {Voltmeter} voltmeter - the voltmeter model
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Property.<boolean>} isDraggedProperty
   * @param {Tandem} tandem
   */
  function VoltmeterBodyNode( voltmeter, modelViewTransform, isDraggedProperty, tandem ) {

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

    var body2DProperty = new DynamicProperty( new Property( voltmeter.bodyLocationProperty ), {
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
        valueText.setText( voltsUnknownString );
      }
      else {
        var fixedValue = Util.toFixed( value, 3 );
        valueText.setText( StringUtils.fillIn( voltsPatternString, { value: fixedValue } ) );
      }
    }
  } );
} );
