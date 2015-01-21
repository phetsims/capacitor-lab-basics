//  Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var CheckBox = require( 'SUN/CheckBox' );
  var EFieldProbeNode = require( 'CAPACITOR_LAB/capacitor-lab/view/meters/EFieldProbeNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var HTMLText = require( 'SCENERY/nodes/HTMLText' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );
  var ZoomButton = require( 'SCENERY_PHET/buttons/ZoomButton' );

  /**
   * Constructor for the electric field meter
   * @param capacitor: the node containing the representation of the capacitor
   **/
  function EFieldMeterNode(model, capacitor, options) {
    options = _.extend({cursor: 'pointer'}, options);
    Node.call( this, options);
    
    // strings
    var meterTitleString = require( 'string!CAPACITOR_LAB/eField' );
    var zeroFieldString = require( 'string!CAPACITOR_LAB/voltsPerMeter.0' );
    var plateString = require( 'string!CAPACITOR_LAB/plate' );
    var voltsPerMeterString = require( 'string!CAPACITOR_LAB/voltsPerMeter' );
    var zoomString = require( 'string!CAPACITOR_LAB/zoom' );
    var showValueString = require( 'string!CAPACITOR_LAB/showVals' );
    
    var eFieldString = zeroFieldString;
    
    // dark grey rectangle for meter body
    var backgroundNode = new Rectangle( 0, 0, 150, 160, 5, 5, {fill: "#434343"} );
    
    var arrowScale = 1;
    // height of the arrow at the maxEField
    var maxArrowHeight = 55;
    // maximum electric field with the battery connected and the plates at the initial setting
    var maxEField = 150;
    
    // image of meter probe
    var probeNode = new EFieldProbeNode( model, {
      scale: .65,
      x: -300,
      y: -130,
      rotation: Math.PI/4});
    
    // wire connecting probe to meter
    var wire = new Path( updateWire(), {
        stroke: "#8d8d8d",
        lineWidth: 3,
        lineCap: 'square',
        lineJoin: 'round',
        pickable: false
      });
    
    this.addChild( backgroundNode );
    this.addChild( probeNode );
    this.addChild( wire );
    
    // title of meter
    var titleNode = new HTMLText( meterTitleString, {
      top: backgroundNode.top + 5,
      centerX: backgroundNode.centerX,
      font: new PhetFont(12),
      fill: 'white',
    });
    backgroundNode.addChild( titleNode );
    
    // white box on the side of the meter
    var meterDisplayNode = new Rectangle( backgroundNode.centerX + 20,
                                         titleNode.bottom + 5,
                                         backgroundNode.width / 2 - 25,
                                         backgroundNode.height - titleNode.height - 20,
                                         0,
                                         0,
                                         {fill: 'white'} );
    var meterClipArea = meterDisplayNode.createRectangleShape();
    meterDisplayNode.setClipArea( meterClipArea );
    backgroundNode.addChild( meterDisplayNode );
    
    // vector arrow to represent the magnitude of the field
    var arrow = new ArrowNode( meterDisplayNode.centerX, meterDisplayNode.centerY, meterDisplayNode.centerX, meterDisplayNode.centerY, {
      fill: '#acacac',
      tailWidth: 0,
      headWidth: 0,
      headHeight: 0,
      centerX: meterDisplayNode.centerX,
    });
    meterDisplayNode.addChild( arrow );
    
    // displays the value of the electric field at the location of the probe
    var eFieldTextNode = new Text( eFieldString, {
      bottom: meterDisplayNode.centerY - 3,
      centerX: meterDisplayNode.centerX,
      font: new PhetFont(11)});
    meterDisplayNode.addChild( eFieldTextNode );
    
    // text node that says "Plate", at the top of the arrow
    var plateTextNode = new Text( plateString, {
      bottom: eFieldTextNode.top - 3,
      centerX: meterDisplayNode.centerX,
      font: new PhetFont(11)
    });
    meterDisplayNode.addChild( plateTextNode );
    
    // check box to control whether the value of the electric field is displayed
    var showValueText = new HTMLText( showValueString, {font: new PhetFont(10), fill: 'white'} );
    var showValueCheckBox = new CheckBox( showValueText, model.eFieldValueVisibleProperty, {
      bottom: backgroundNode.bottom - 15,
      left: backgroundNode.left + 5,
      boxWidth: 14});
    backgroundNode.addChild( showValueCheckBox );
      
    // buttons to zoom in and out
    var zoomText = new HTMLText( zoomString, {
      font: new PhetFont(12),
      fill: 'white',
      left: backgroundNode.left + 5,
      top: backgroundNode.top + 80});
    backgroundNode.addChild( zoomText );
    var zoomInButton = new ZoomButton({
      bottom: zoomText.bottom,
      left: zoomText.right + 5,
      scale: .4,
      baseColor: 'white',
      enabled: false,
      listener: function () {
        arrowScale = maxEField / Math.abs(model.eFieldProperty.value);
        updateArrow();
      },
      });
    zoomInButton.enabled = false;
    backgroundNode.addChild(zoomInButton);
    var zoomOutButton = new ZoomButton({
      top: zoomInButton.bottom + 7,
      right: zoomInButton.right,
      scale: .4,
      in: false,
      baseColor: 'white',
      enabled: false,
      listener: function () {
        arrowScale = arrowScale * maxArrowHeight / arrow.height;
        console.log(arrowScale);
        updateArrow();
      },
      });
    zoomOutButton.enabled = false;
    backgroundNode.addChild(zoomOutButton);
    
    var thisNode = this;

    // drag handler for body of meter
    var meterOffset = {};
    var meterDragHandler = new SimpleDragHandler( {
      //When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,
      start: function( event ) {
        meterOffset.x = backgroundNode.globalToParentPoint( event.pointer.point ).x - backgroundNode.centerX;
        meterOffset.y = backgroundNode.globalToParentPoint( event.pointer.point ).y - backgroundNode.centerY;
      },
      //Translate on drag events
      drag: function( event ) {
        var point = backgroundNode.globalToParentPoint( event.pointer.point );
        var desiredPosition = point.copy().subtract( meterOffset );
        model.moveMeterToPosition( desiredPosition, model.eFieldMeterPositionProperty );
      }
    } );
    backgroundNode.addInputListener( meterDragHandler );
    
    model.eFieldProperty.link( function () {
      updateDisplay();
    });
    
    model.eFieldProbePositionProperty.link( function () {
      probeNode.centerX = model.eFieldProbePositionProperty.value.x;
      probeNode.centerY = model.eFieldProbePositionProperty.value.y;
      wire.shape = updateWire();
      
      updateDisplay();
    });
    
    model.eFieldMeterPositionProperty.link( function () {
      backgroundNode.centerX = model.eFieldMeterPositionProperty.value.x;
      backgroundNode.centerY = model.eFieldMeterPositionProperty.value.y;
      
      wire.shape = updateWire();
    });
    
    model.eFieldMeterProperty.link( function () {
      thisNode.visible = model.eFieldMeterProperty.value;
    });
    
    model.eFieldValueVisibleProperty.link( function () {
      eFieldTextNode.visible = model.eFieldValueVisibleProperty.value;
      if ( model.eFieldValueVisibleProperty.value ) {
        if ( model.eFieldProperty.value < 0 ) {
          plateTextNode.top = arrow.bottom + 3;
          eFieldTextNode.top = plateTextNode.bottom + 3;
        }
        else {
          eFieldTextNode.bottom = arrow.top - 3;
          plateTextNode.bottom = eFieldTextNode.top - 3;
        }
      }
      else {
        if ( model.eFieldProperty.value < 0 ) {
          plateTextNode.top = arrow.bottom + 3;
        }
        else {
          plateTextNode.bottom = arrow.top - 3;
        }
      }
      
    });
    
    // Redraws the wire when either the probe or the meter body move
    function updateWire() {
      // connection points
      var probeConnectionPoint = new Vector2( probeNode.left + 8, probeNode.bottom - 6 );
      var meterConnectionPoint = new Vector2( backgroundNode.left, backgroundNode.centerY );

      // control points
      // The y coordinate of the body's control point varies with the x distance between the body and probe.
      var c1Offset = new Vector2( 0, 5 );
      var c2Offset = new Vector2( 0, Util.linear( 0, 800, 0, 200, backgroundNode.centerX - probeNode.left ) ); // x distance -> y coordinate
      var c1 = new Vector2( probeConnectionPoint.x + c2Offset.x, probeConnectionPoint.y + c2Offset.y );
      var c2 = new Vector2( meterConnectionPoint.x + c1Offset.x, meterConnectionPoint.y + c1Offset.y );
      
      var wireShape = new Shape()
        .moveTo( probeConnectionPoint.x, probeConnectionPoint.y )
        .cubicCurveTo( c1.x, c1.y, c2.x, c2.y, meterConnectionPoint.x, meterConnectionPoint.y );
      return wireShape;
    }
    
    // Redraws the arrow when the electric field changes or the zoom buttons are clicked
    function updateArrow() {
      var height = maxArrowHeight * model.eFieldProperty.value / maxEField * arrowScale;
      if (Math.abs(height) < maxArrowHeight / 3) {
        arrow.options =  {
          headHeight: 13 * arrowScale * Math.abs(model.eFieldProperty.value) / (maxEField / 3),
          tailWidth: 7 * arrowScale * Math.abs(model.eFieldProperty.value) / (maxEField / 3),
          headWidth: 15 * arrowScale * Math.abs(model.eFieldProperty.value) / (maxEField / 3),
        };
        zoomInButton.enabled = true && height;
      }
      else if (Math.abs(height) < 2 * maxArrowHeight / 3) {
        zoomInButton.enabled = true;
      }
      else {
        arrow.options =  {
          headHeight: 13,
          tailWidth: 7,
          headWidth: 15,
        };
        zoomInButton.enabled = false;
        if (Math.abs(height) > maxArrowHeight * 17 / 15) {
          zoomOutButton.enabled = true;
        }
        else {
          zoomOutButton.enabled = false;
        }
      }
      arrow.setTailAndTip( meterDisplayNode.centerX, meterDisplayNode.centerY, meterDisplayNode.centerX, meterDisplayNode.centerY + height );
      arrow.centerY = meterDisplayNode.centerY;
      if ( model.eFieldValueVisibleProperty.value ) {
        if ( model.eFieldProperty.value < 0 ) {
          plateTextNode.top = arrow.bottom + 3;
          eFieldTextNode.top = plateTextNode.bottom + 3;
        }
        else {
          eFieldTextNode.bottom = arrow.top - 3;
          plateTextNode.bottom = eFieldTextNode.top - 3;
        }
      }
      else {
        if ( model.eFieldProperty.value < 0 ) {
          plateTextNode.top = arrow.bottom + 3;
        }
        else {
          plateTextNode.bottom = arrow.top - 3;
        }
      }
    }
    
    // Updates the value being displayed when the electric field changes
    // Also updates when the probe is moved into or out of the area inside the capacitor
    function updateDisplay() {
      // update string to display correct electric field value
      // translate probe tip into coordinates of capacitor
      var probeTip = new Vector2( probeNode.right / .56 + 457.5, probeNode.top / .56 + 68 );
      var leftBound = capacitor.topPlate.left;
      var insideShape = new Shape().moveTo( leftBound, capacitor.topPlate.bottom ).
        horizontalLineTo( leftBound + capacitor.topPlate.plateWidth ).
        lineTo( capacitor.topPlate.right, capacitor.topPlate.top + capacitor.topPlate.plateDepth ).
        verticalLineTo( capacitor.bottomPlate.top ).
        lineTo( leftBound + capacitor.topPlate.plateWidth, capacitor.bottomPlate.bottom - capacitor.bottomPlate.plateDepth ).
        horizontalLineTo( leftBound ).
        verticalLineTo( capacitor.topPlate.bottom );
      if ( insideShape.containsPoint(probeTip) ) {
        eFieldString = (Math.abs(model.eFieldProperty.value)).toFixed(0) + voltsPerMeterString;
      }
      else {
        eFieldString = zeroFieldString;
      }
      eFieldTextNode.text = eFieldString;
      eFieldTextNode.centerX = meterDisplayNode.centerX;
      
      // update arrow
      updateArrow();
    }

  }
  
  return inherit( Node, EFieldMeterNode);
} );