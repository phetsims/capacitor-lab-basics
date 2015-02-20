//  Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Input = require( 'SCENERY/input/Input' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );

  /**
   * Constructor to hold the image of either the red probe or the black probe for the voltmeter
   * @param isRedProbe: boolean to check if the probe is red or black
   **/
  function VoltmeterProbeNode(model, isRedProbe, options) {
    options = _.extend({cursor: 'pointer', focusable:true}, options);
    
    // images
    var redProbeImage = require( 'image!CAPACITOR_LAB/probe_3D_red_large.png' );
    var blackProbeImage = require( 'image!CAPACITOR_LAB/probe_3D_black_large.png' );
    var image = redProbeImage;
    if (!isRedProbe) {
      image = blackProbeImage;
    }
    Image.call( this, image, options );
    
    var thisNode = this;
    
    var locations = [new Vector2(-355, 100),
                     new Vector2(-385, -47),
                     new Vector2(-280, 45),
                     new Vector2(-280, 155),
                     new Vector2(-385, 246)];
    if (!isRedProbe) {
      locations = [new Vector2(-315, 100),
                   new Vector2(-345, -47),
                   new Vector2(-240, 45),
                   new Vector2(-240, 155),
                   new Vector2(-345, 246)];
    }
    var loc = 0;
    
    // drag handler
    var probeOffset = {};
    var probeDragHandler = new SimpleDragHandler( {
      //When dragging across it in a mobile device, pick it up
      allowTouchSnag: true,
      start: function( event ) {
        probeOffset.x = thisNode.globalToParentPoint( event.pointer.point ).x - thisNode.centerX;
        probeOffset.y = thisNode.globalToParentPoint( event.pointer.point ).y - thisNode.centerY;
      },
      //Translate on drag events
      drag: function( event ) {
        var point = thisNode.globalToParentPoint( event.pointer.point );
        var desiredPosition = point.copy().subtract( probeOffset );
        model.moveProbeToPosition( desiredPosition, isRedProbe );
      }
    } );
    this.addInputListener( probeDragHandler );
    
    this.addInputListener( {
      keydown: function( event, trail ) {
        var keyCode = event.domEvent.keyCode;
        if ( keyCode === Input.KEY_RIGHT_ARROW ) {
          loc = (loc + 1) % locations.length;
        }
        else if ( keyCode === Input.KEY_LEFT_ARROW ) {
          loc = (loc - 1) % locations.length;
          if (loc < 0) {
            loc = locations.length - 1;
          }
        }
        model.moveProbeToPosition( locations[loc], isRedProbe );
      }
    } );
  }
  
  return inherit( Image, VoltmeterProbeNode);
} );