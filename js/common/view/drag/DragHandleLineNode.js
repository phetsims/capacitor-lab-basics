// Copyright 2015-2022, University of Colorado Boulder

/**
 * Dashed line used to connect a drag handle to the thing that it's dragging. This is a string of circles between two
 * points because some browsers do not support dashed lines.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Vector2 from '../../../../../dot/js/Vector2.js';
import { Circle, Node } from '../../../../../scenery/js/imports.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';

// constants
const DOT_COLOR = 'black';
const DOT_SPACING = 6; // spacing of the dotted line.
const DOT_RADIUS = 2;

class DragHandleLineNode extends Node {
  /**
   * This is a string of circles that connects the capacitor plate to the drag handler node.
   *
   * @param {Vector2} pStart
   * @param {Vector2} pEnd
   */
  constructor( pStart, pEnd ) {

    super();
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
}

capacitorLabBasics.register( 'DragHandleLineNode', DragHandleLineNode );

export default DragHandleLineNode;