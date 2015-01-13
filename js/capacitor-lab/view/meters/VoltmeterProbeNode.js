//  Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var SimpleDragHandler = require( 'SCENERY/input/SimpleDragHandler' );

  /**
   * Constructor to hold the image of either the red probe or the black probe for the voltmeter
   * @param image: the image to be displayed
   * @param isRedProbe: boolean to check if the probe is red or black
   **/
  function VoltmeterProbeNode(model, image, isRedProbe, options) {
    options = _.extend({cursor: 'pointer'}, options);
    Image.call( this, image, options );
    
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
        model.moveProbeToPosition( desiredPosition, thisNode, isRedProbe );
      }
    } );
    this.addInputListener( probeDragHandler );
  }
  
  return inherit( Image, VoltmeterProbeNode);
} );