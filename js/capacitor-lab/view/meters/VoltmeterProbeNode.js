//  Copyright 2002-2015, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Input = require( 'SCENERY/input/Input' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );
  var Vector2 = require( 'DOT/Vector2' );

  // images
  var redProbeImage = require( 'image!CAPACITOR_LAB/probe_3D_red_large.png' );
  var blackProbeImage = require( 'image!CAPACITOR_LAB/probe_3D_black_large.png' );
  
  /**
   * Constructor to hold the image of either the red probe or the black probe for the voltmeter
   * @param {CapacitorLabModel} model
   * @param {boolean} isRedProbe: checks if the probe is red or black
   **/
  function VoltmeterProbeNode(model, isRedProbe, options) {
    options = _.extend({cursor: 'pointer', focusable:true}, options);
    
    var image = redProbeImage;
    if (!isRedProbe) {
      image = blackProbeImage;
    }
    Image.call( this, image, options );
    
    var thisNode = this;
    var focusGone = true;
    
    this.locations = [new Vector2(-355, 100),
                      new Vector2(-385, -47),
                      new Vector2(-280, 45),
                      new Vector2(-280, 155),
                      new Vector2(-385, 246)];
    if (!isRedProbe) {
      this.locations = [new Vector2(-315, 100),
                        new Vector2(-345, -47),
                        new Vector2(-240, 45),
                        new Vector2(-240, 155),
                        new Vector2(-345, 246)];
    }
    this.loc = 0;
    
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
          thisNode.loc = (thisNode.loc + 1) % thisNode.locations.length;
          model.moveProbeToPosition( thisNode.locations[thisNode.loc], isRedProbe );
          thisNode.getParent().moveToGhost( thisNode, isRedProbe, thisNode.loc );
        }
        else if ( keyCode === Input.KEY_LEFT_ARROW ) {
          thisNode.loc = (thisNode.loc - 1) % thisNode.locations.length;
          if (thisNode.loc < 0) {
            thisNode.loc = thisNode.locations.length - 1;
          }
          model.moveProbeToPosition( thisNode.locations[thisNode.loc], isRedProbe );
          thisNode.getParent().moveToGhost( thisNode, isRedProbe, thisNode.loc );
        }
      }
    } );
    Input.focusedTrailProperty.link( function() {
      if (Input.focusedTrailProperty.value !== null) {
        if (thisNode === Input.focusedTrailProperty.value.lastNode()) {
          thisNode.getParent().toggleGhosts( isRedProbe );
          focusGone = false;
        }
        else if (!focusGone) {
          thisNode.getParent().toggleGhosts( isRedProbe );
          focusGone = true;
        }
      }
    } );
  }
  
  return inherit( Image, VoltmeterProbeNode);
} );