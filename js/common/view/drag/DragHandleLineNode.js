// Copyright 2015-2018, University of Colorado Boulder

/**
 * Dashed line used to connect a drag handle to the thing that it's dragging. This is a string of circles between two
 * points because some browsers do not support dashed lines.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var DOT_COLOR = 'black';
  var DOT_SPACING = 6; // spacing of the dotted line.
  var DOT_RADIUS = 2;

  /**
   * This is a string of circles that connects the capacitor plate to the drag handler node.
   * @constructor
   *
   * @param {Vector2} pStart
   * @param {Vector2} pEnd
   */
  function DragHandleLineNode( pStart, pEnd ) {

    Node.call( this );
    // length of line
    var length = pStart.distance( pEnd );

    // Unit vector from pStart to pEnd.
    var spacingVector = pEnd.minus( pStart ).normalize().multiplyScalar( DOT_SPACING );

    // number of dots to be used along the line
    var numberOfDots = length / DOT_SPACING;

    for ( var i = 0; i < numberOfDots; i++ ) {
      var dotPosition = new Vector2( pStart.x + i * spacingVector.x, pStart.y + i * spacingVector.y );
      this.addChild( new Circle( DOT_RADIUS, { fill: DOT_COLOR, center: dotPosition } ) );
    }
  }

  capacitorLabBasics.register( 'DragHandleLineNode', DragHandleLineNode );

  return inherit( Node, DragHandleLineNode );

} );