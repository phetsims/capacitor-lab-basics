// Copyright 2002-2015, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Image = require( 'SCENERY/nodes/Image' );
  
  //Scale up before rasterization so it won't be too pixellated/fuzzy
  var scale = 2;
  // blue minus sign node
  var minusChargeNode = new Node( {
    children: [
    new Rectangle( 0, 0, 11, 2, {
      fill: 'blue',
      centerX: 0,
      centerY: 0
    } )
    ], scale: scale} );
  
    var node = new Node();
    minusChargeNode.toImage( function( im ) {
      //Scale back down so the image will be the desired size
      node.children = [new Image( im, {scale: 1.0 / scale} )];
    } );
    
    function MinusChargeNode( location ) {
      // super constructor
      // Use svg for the shape and text
      Node.call( this, {pickable: false} );
      this.translate( location.x, location.y );
      this.addChild( node );
    }
    return inherit( Node, MinusChargeNode );
} );