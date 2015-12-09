// Copyright 2015, University of Colorado Boulder

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
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // digital display
  //private static final NumberFormat DISPLAY_VALUE_FORMAT = new DefaultDecimalFormat( "0.00" );
  var DISPLAY_FONT = new PhetFont( 18 );

  // title display
  var TITLE_FONT = new PhetFont( { size: 20 } );

  // strings
  var unitsVoltsString = require( 'string!CAPACITOR_LAB_BASICS/units.volts' );
  var voltageString = require( 'string!CAPACITOR_LAB_BASICS/voltage' );
  var voltsUnknownString = require( 'string!CAPACITOR_LAB_BASICS/volts.unknown' );
  var accessibleVoltmeterBodyString = require( 'string!CAPACITOR_LAB_BASICS/accessible.voltmeterBody' );
  var pattern0Value1UnitsString = require( 'string!CAPACITOR_LAB_BASICS/pattern.0value.1units' );
  var accessibleVoltmeterUnknownValueString = require( 'string!CAPACITOR_LAB_BASICS/accessible.voltmeterUnknownValue' );
  var accessibleVoltmeterValueString = require( 'string!CAPACITOR_LAB_BASICS/accessible.voltmeterValue' );

  // images
  var voltmeterBodyImage = require( 'image!CAPACITOR_LAB_BASICS/voltmeter_body.png' );

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
    var imageNode = new Image( voltmeterBodyImage, { scale: 0.336 } );
    this.addChild( imageNode );

    // text label
    var labelText = new Text( voltageString, { font: TITLE_FONT } );
    labelText.center = new Vector2( imageNode.width / 2, imageNode.height / 3 );
    this.addChild( labelText );

    var valueString = StringUtils.format( pattern0Value1UnitsString, voltmeter.value, unitsVoltsString );
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
      startDrag: function() {
        inUserControlProperty.set( true );
      },
      endDrag: function() {
        inUserControlProperty.set( false );
      }
    } );
    thisNode.addInputListener( this.movableDragHandler );

    // add the accessible content
    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        var trail = accessibleInstance.trail;

        var domElement = document.createElement( 'div' );
        domElement.className = 'VoltmeterBody';

        // add this voltmeter instance ID to the thisNode so that the panel can have access to the node.
        domElement.id = 'voltmeter-' + trail.getUniqueId();
        thisNode.accessibleVoltmeterBodyId = domElement.id;

        var bodyDescription = document.createElement( 'p' );
        bodyDescription.innerText = accessibleVoltmeterBodyString;
        domElement.appendChild( bodyDescription );
        bodyDescription.id = accessibleVoltmeterBodyString;
        
        var voltageDescription = document.createElement( 'p' );
        voltageDescription.innerText = accessibleVoltmeterUnknownValueString;
        domElement.appendChild( voltageDescription );
        
        domElement.setAttribute( 'aria-describedby', StringUtils.format( accessibleVoltmeterBodyString, voltmeter.value ) );
        domElement.setAttribute( 'aria-live', 'polite' );

        domElement.tabIndex = '-1';

        return new AccessiblePeer( accessibleInstance, domElement );

      }
    };
  }

  capacitorLabBasics.register( 'VoltmeterBodyNode', VoltmeterBodyNode );
  
  return inherit( Node, VoltmeterBodyNode, {

    /**
     * Set the text for the display value, formatting the units and number of decimal places.
     *
     * @param {Text} valueText
     * @param {Number} value
     */
    setValueText: function( valueText, value ) {
      var domElement = document.getElementById( this.accessibleVoltmeterBodyId );
      var description;
      if ( isNaN( value ) ) {
        valueText.setText( StringUtils.format( pattern0Value1UnitsString, voltsUnknownString, unitsVoltsString ) );
        if ( domElement !== null ) {
          description = domElement.childNodes[1];
          description.innerText = accessibleVoltmeterUnknownValueString;
        }
      }
      else {
        var fixedValue = Util.toFixed( value, 3 );
        valueText.setText( StringUtils.format( pattern0Value1UnitsString, fixedValue, unitsVoltsString ) );
        if ( domElement !== null ) {
          description = domElement.childNodes[1];
          description.innerText = StringUtils.format( accessibleVoltmeterValueString, fixedValue );
        }
      }
      //valueText.center = this.center;
    }
  } );
} );
