// Copyright 2015-2019, University of Colorado Boulder

/**
 * Dashed line used to connect a drag handle to the thing that it's dragging. This is a string of circles between two
 * points because some browsers do not support dashed lines.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Vector2 = require( 'DOT/Vector2' );

  // constants
  const DOT_COLOR = 'black';
  const DOT_SPACING = 6; // spacing of the dotted line.
  const DOT_RADIUS = 2;

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
    const length = pStart.distance( pEnd );

    // Unit vector from pStart to pEnd.
    const spacingVector = pEnd.minus( pStart ).normalize().multiplyScalar( DOT_SPACING );

    // number of dots to be used along the line
    const numberOfDots = length / DOT_SPACING;

    for ( let i = 0; i < numberOfDots; i++ ) {
      const dotPosition = new Vector2( pStart.x + i * spacingVector.x, pStart.y + i * spacingVector.y );
      this.addChild( new Circle( DOT_RADIUS, { fill: DOT_COLOR, center: dotPosition } ) );
    }
  }

  capacitorLabBasics.register( 'DragHandleLineNode', DragHandleLineNode );

  return inherit( Node, DragHandleLineNode );

} );