// Copyright 2002-2013, University of Colorado Boulder
/**
* Scenery display object (scene graph node) for the plusCharge.
*
@author Vasily Shakhov (Mlearner)
*/
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var RadialGradient = require( 'SCENERY/util/RadialGradient' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Image = require( 'SCENERY/nodes/Image' );
  
  var radius = 5;
  
  //Scale up before rasterization so it won't be too pixellated/fuzzy
  var scale = 2;
  var plusChargeNode = new Node( {
    children: [
      new Circle( radius, {
        x: 0, y: 0,
        fill: new RadialGradient( 2, -3, 2, 2, -3, 7 )
          .addColorStop( 0, '#f97d7d' )
          .addColorStop( 0.5, '#ed4545' )
          .addColorStop( 1, '#f00' )
    } ),
      
    new Rectangle( 0, 0, 11, 2, {
      fill: 'white',
      centerX: 0,
      centerY: 0
    } ),
    
    new Rectangle( 0, 0, 2, 11, {
      fill: 'white',
      centerX: 0,
      centerY: 0
    } )
    ], scale: scale} );
  
    var node = new Node();
    plusChargeNode.toImage( function( im ) {
      //Scale back down so the image will be the desired size
      node.children = [new Image( im, {scale: 1.0 / scale} )];
    } );
    
    function PlusChargeNode( location ) {
      // super constructor
      // Use svg for the shape and text
      Node.call( this, {pickable: false} );
      this.translate( location.x - radius, location.y - radius );
      this.addChild( node );
    }
    return inherit( Node, PlusChargeNode );
} );