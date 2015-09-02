// Copyright 2002-2015, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var EFieldProbeNode = require( 'CAPACITOR_LAB_BASICS/capacitor-lab/view/meters/EFieldProbeNode' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var Vector2 = require( 'DOT/Vector2' );

  // strings
  var zeroFieldString = require( 'string!CAPACITOR_LAB_BASICS/voltsPerMeter.0' );
  var voltsPerMeterString = require( 'string!CAPACITOR_LAB_BASICS/voltsPerMeter' );

  // images
  var probeCutoutImage = require( 'image!CAPACITOR_LAB_BASICS/probe_3D_field_cutout.png' );

  /**
   * Constructor for the electric field meter
   * @param {CapacitorLabBasicsModel} model
   * @param {CapacitorNode} capacitor
   **/
  function EFieldMeterNode(model, capacitor, options) {
    options = _.extend({cursor: 'pointer'}, options);
    Node.call( this, options);

    var eFieldString = zeroFieldString;
    var probeScale = 0.65;

    // dark grey rectangle for meter body
    var bodyNode = new Rectangle( 0, 0, 80, 160, 5, 5, {fill: "#434343"} );

    // Redraws the wire when either the probe or the meter body move
    function updateWire() {
      // connection points
      var probeConnectionPoint = new Vector2( probeNode.left + 8, probeNode.bottom - 6 );
      var meterConnectionPoint = new Vector2( bodyNode.left, bodyNode.centerY );

      // control points
      // The y coordinate of the body's control point varies with the x distance between the body and probe.
      var c1Offset = new Vector2( 0, 5 );
      var c2Offset = new Vector2( 0, Util.linear( 0, 800, 0, 200, bodyNode.centerX - probeNode.left ) ); // x distance -> y coordinate
      var c1 = new Vector2( probeConnectionPoint.x + c2Offset.x, probeConnectionPoint.y + c2Offset.y );
      var c2 = new Vector2( meterConnectionPoint.x + c1Offset.x, meterConnectionPoint.y + c1Offset.y );

      var wireShape = new Shape()
        .moveTo( probeConnectionPoint.x, probeConnectionPoint.y )
        .cubicCurveTo( c1.x, c1.y, c2.x, c2.y, meterConnectionPoint.x, meterConnectionPoint.y );
      return wireShape;
    }

    // Updates the value being displayed when the electric field changes
    // Also updates when the probe is moved into or out of the area inside the capacitor
    function updateDisplay() {
      // update string to display correct electric field value
      // translate probe tip into coordinates of capacitor
      var parentPoint = thisNode.localToParentPoint( new Vector2( probeNode.right - 15, probeNode.top + 16 ) );
      var circuitPoint = capacitor.getParent().parentToLocalPoint( parentPoint );
      var capPoint = capacitor.parentToLocalPoint( circuitPoint );

      var leftBound = capacitor.topPlate.left;
      var insideShape = new Shape().moveTo( leftBound, capacitor.topPlate.bottom ).
        horizontalLineTo( leftBound + capacitor.topPlate.plateWidth ).
        lineTo( capacitor.topPlate.right, capacitor.topPlate.top + capacitor.topPlate.plateDepth ).
        verticalLineTo( capacitor.bottomPlate.top ).
        lineTo( leftBound + capacitor.topPlate.plateWidth, capacitor.bottomPlate.bottom - capacitor.bottomPlate.plateDepth ).
        horizontalLineTo( leftBound ).
        verticalLineTo( capacitor.topPlate.bottom );
      if ( insideShape.containsPoint( capPoint ) ) {
        eFieldString = ( Util.htoFixed( model.eFieldProperty.value, 0 ) )+ voltsPerMeterString;
      }
      else {
        eFieldString = zeroFieldString;
      }
      eFieldTextNode.text = eFieldString;
      eFieldTextNode.centerX = meterDisplayNode.centerX;
    }

    // image of meter probe
    var probeNode = new EFieldProbeNode( model, {
      scale: probeScale,
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
    } );

    // Ghost images of probes, to be displayed when the probe is in focus
    this.ghostNode = new Node( {visible: false} );
    for (var i = 0; i < probeNode.locations.length; i++) {
      this.ghostNode.addChild( new Image( probeCutoutImage, {
        scale: probeScale,
        centerX: probeNode.locations[i].x,
        centerY: probeNode.locations[i].y,
        rotation: Math.PI / 4
      } ) );
    }
    this.ghostNode.children[ 0 ].visible = false;
    this.addChild( this.ghostNode );

    this.addChild( bodyNode );
    this.addChild( probeNode );
    this.addChild( wire );

    // white box on the side of the meter
    var meterDisplayNode = new Rectangle( bodyNode.left + 5,
                                         bodyNode.top + 5,
                                         bodyNode.width -10,
                                         25,
                                         0,
                                         0,
                                         {fill: 'white'} );
    bodyNode.addChild( meterDisplayNode );

    // displays the value of the electric field at the location of the probe
    var eFieldTextNode = new Text( eFieldString, {
      top: meterDisplayNode.top + 5,
      centerX: meterDisplayNode.centerX,
      font: new PhetFont( 12 )
    } );
    meterDisplayNode.addChild( eFieldTextNode );

    var thisNode = this;

    // drag handler for body of meter
    var meterOffset = {};
    var meterDragHandler = new SimpleDragHandler( {
      //When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,
      start: function( event ) {
        meterOffset.x = bodyNode.globalToParentPoint( event.pointer.point ).x - bodyNode.centerX;
        meterOffset.y = bodyNode.globalToParentPoint( event.pointer.point ).y - bodyNode.centerY;
      },
      //Translate on drag events
      drag: function( event ) {
        var point = bodyNode.globalToParentPoint( event.pointer.point );
        var desiredPosition = point.copy().subtract( meterOffset );
        model.moveMeterToPosition( desiredPosition, model.eFieldMeterPositionProperty );
      }
    } );
    bodyNode.addInputListener( meterDragHandler );

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
      bodyNode.centerX = model.eFieldMeterPositionProperty.value.x;
      bodyNode.centerY = model.eFieldMeterPositionProperty.value.y;

      wire.shape = updateWire();
    });

    model.eFieldMeterProperty.link( function () {
      thisNode.visible = model.eFieldMeterProperty.value;
    });
  }

  return inherit( Node, EFieldMeterNode, {
    toggleGhosts: function( ) {
      this.ghostNode.visible = !this.ghostNode.visible;
    },

    moveToGhost: function( probeNode, loc ) {
      for ( var i = 0; i < probeNode.locations.length; i++ ) {
        this.ghostNode.children[ i ].visible = true;
      }
      this.ghostNode.children[ loc ].visible = false;
    }
  } );
} );