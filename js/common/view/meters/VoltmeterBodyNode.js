// Copyright 2002-2015, University of Colorado Boulder

/**
 * Body of the voltmeter.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @autor Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules  var Circle = require( 'SCENERY/nodes/Circle' );
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
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );

  // digital display
  //private static final NumberFormat DISPLAY_VALUE_FORMAT = new DefaultDecimalFormat( "0.00" );
  var DISPLAY_FONT = new PhetFont( 18 );

  // title display
  var TITLE_FONT = new PhetFont( { size: 20 } );

  // strings
  var unitsVoltageString = require( 'string!CAPACITOR_LAB_BASICS/units.volts' );
  var voltageString = require( 'string!CAPACITOR_LAB_BASICS/voltage' );
  var voltsUnknownString = require( 'string!CAPACITOR_LAB_BASICS/volts.unknown' );
  var voltmeterBodyDescriptionString = require( 'string!CAPACITOR_LAB_BASICS/accessible.voltmeterBody' );

  // images
  var voltmeterBodyImage = require( 'image!CAPACITOR_LAB_BASICS/voltmeter_body.png' );
  var pattern_0value_1units = require( 'string!CAPACITOR_LAB_BASICS/pattern.0value.1units' );

  /**
   * Constructor
   *
   * @param {Voltmeter} voltmeter - the voltmeter model
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {Property.<boolean>} inUserControlProperty
   */
  function VoltmeterBodyNode( voltmeter, modelViewTransform, inUserControlProperty ) {

    Node.call( this );
    var thisNode = this;

    this.bodyLocationProperty = voltmeter.bodyLocationProperty; // @public

    // body of the meter
    var imageNode = new Image( voltmeterBodyImage, { scale: 0.42 } );
    this.addChild( imageNode );

    // text label
    var labelText = new Text( voltageString, { font: TITLE_FONT } );
    labelText.center = new Vector2( imageNode.width / 2, imageNode.height / 3 );
    this.addChild( labelText );

    var valueString = StringUtils.format( pattern_0value_1units, voltmeter.value, unitsVoltageString );
    var valueText = new Text( valueString, { font: DISPLAY_FONT } );

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
    this.positiveConnectionOffset = new Vector2( 3 * imageBounds.width / 7, imageBounds.maxY * 7 / 8 ); // @public bottom left
    this.negativeConnectionOffset = new Vector2( 4 * imageBounds.width / 7, imageBounds.maxY * 7 / 8 ); // @public bottom right

    // update value
    voltmeter.valueProperty.link( function( value ) {
      thisNode.setValueText( valueText, value );
      valueText.center = backgroundRect.center;
    } );

    // update position with model
    voltmeter.bodyLocationProperty.link( function( bodyLocation ) {
      thisNode.translation = modelViewTransform.modelToViewPosition( bodyLocation );
    } );

    // TODO: Add restrictive bounds for MovableDragHandler.
    this.movableDragHandler = new MovableDragHandler( voltmeter.bodyLocationProperty, {
      dragBounds: voltmeter.dragBounds,
      modelViewTransform: modelViewTransform,
      endDrag: function() {
        inUserControlProperty.set( false );
      }
    } );
    thisNode.addInputListener( this.movableDragHandler );
    
    // add the accessible content
    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        var domElement = document.createElement( 'div' );
        domElement.className = 'VoltmeterBody';
        var description = document.createElement( 'p' );
        description.hidden = 'true';
        description.innerText = StringUtils.format( voltmeterBodyDescriptionString, voltmeter.value );
        domElement.appendChild( description );
        description.id = voltmeterBodyDescriptionString;
        domElement.setAttribute( 'aria-describedby', voltmeterBodyDescriptionString );
        
        domElement.tabIndex = '-1';

        var accessiblePeer = new AccessiblePeer( accessibleInstance, domElement );
        domElement.id = accessiblePeer.id;
        return accessiblePeer;

      }
    };
  }

  return inherit( Node, VoltmeterBodyNode, {

    /**
     * Set the text for the display value, formatting the units and number of decimal places.
     *
     * @param {Text} valueText
     * @param {Number} value
     */
    setValueText: function( valueText, value ) {
      if ( isNaN( value ) ) {
        valueText.setText( StringUtils.format( pattern_0value_1units, voltsUnknownString, unitsVoltageString ) );
      }
      else {
        var fixedValue = Util.toFixed( value, 3 );
        valueText.setText( StringUtils.format( pattern_0value_1units, fixedValue, unitsVoltageString ) );
      }
      //valueText.center = this.center;
    }
  } );
} );
