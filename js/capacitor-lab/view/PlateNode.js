//  Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Vector2 = require( 'DOT/Vector2' );

  function PlateNode(options) {
    Node.call( this, options );
    var topX = -70;
    var plateDepth = 8;
    var plateWidth = 200;
    // controls the angle of the diagonal
    var plateShift = 100;
    
    var frontRectangle = new Rectangle( 0, 0, plateWidth, plateDepth, 0, 0, {stroke: 'black', fill: '#aaaaaa'} );
    this.addChild( frontRectangle );
    
    //var endPoint = new Vector2(plateShift, topX);
    var topPlateShape = new Shape().
      lineTo(plateShift, topX).
      lineTo(plateWidth + plateShift, topX).
      lineTo(plateWidth, 0).
      lineTo(0,0).
      lineTo(plateShift, topX);
    var topPlate = new Path( topPlateShape, {stroke: 'black', fill: 'white'});
    this.addChild( topPlate );
    
    var sidePlateShape = new Shape().
      moveTo(plateWidth,0).
      lineTo(plateWidth + plateShift, topX).
      lineTo(plateWidth + plateShift, topX+plateDepth).
      lineTo(plateWidth, plateDepth).
      lineTo(plateWidth, 0);
    var sidePlate = new Path( sidePlateShape, {stroke: 'black', fill: 'gray'});
    this.addChild( sidePlate );
    
  }
  
  return inherit( Node, PlateNode);
} );