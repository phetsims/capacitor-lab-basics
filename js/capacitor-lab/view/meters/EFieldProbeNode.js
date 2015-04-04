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
  var probeImage = require( 'image!CAPACITOR_LAB/probe_3D_field.png' );

  /**
   * Constructor to contain the image of the electric field probe and its drag handler
   * @param {CapacitorLabModel} model
   */
  function EFieldProbeNode(model, options) {
    options = _.extend({cursor: 'pointer', focusable: true}, options);
    
    Image.call( this, probeImage, options );
    
    var thisNode = this;
    var focusGone = true;
    
    this.locations = [new Vector2( -213, 10 ),
                     new Vector2( -270, -20 ),
                     new Vector2( -190, 60 ),
                     new Vector2( -325, 10 )];
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
        model.moveEFieldProbeToPosition( desiredPosition );
      }
    } );
    this.addInputListener( probeDragHandler );
    
    this.addInputListener( {
      keydown: function( event, trail ) {
        var keyCode = event.domEvent.keyCode;
        if ( keyCode === Input.KEY_RIGHT_ARROW ) {
          thisNode.loc = (thisNode.loc + 1) % thisNode.locations.length;
        }
        else if ( keyCode === Input.KEY_LEFT_ARROW ) {
          thisNode.loc = (thisNode.loc - 1) % thisNode.locations.length;
          if (thisNode.loc < 0) {
            thisNode.loc = thisNode.locations.length - 1;
          }
        }
        model.moveEFieldProbeToPosition( thisNode.locations[ thisNode.loc ] );
        thisNode.getParent().moveToGhost( thisNode, thisNode.loc );
      }
    } );
    Input.focusedTrailProperty.link( function() {
      if (Input.focusedTrailProperty.value !== null) {
        if (thisNode === Input.focusedTrailProperty.value.lastNode()) {
          thisNode.getParent().toggleGhosts( );
          focusGone = false;
        }
        else if (!focusGone) {
          thisNode.getParent().toggleGhosts( );
          focusGone = true;
        }
      }
    } );
  }
  
  return inherit( Image, EFieldProbeNode );
} );