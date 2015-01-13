//  Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  /**
   * Constructor to contain the image of the electric field probe and its drag handler
   **/
  function EFieldProbeNode(model, options) {
    options = _.extend({cursor: 'pointer'}, options);
    
    // images
    var probeImage = require( 'image!CAPACITOR_LAB/probe_3D_field.png' );
    Image.call( this, probeImage, options );
    
    var thisNode = this;
    
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
  }
  
  return inherit( Image, EFieldProbeNode);
} );