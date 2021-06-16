// Copyright 2015-2021, University of Colorado Boulder

/**
 * Double arrow used for drag handles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import ArrowNode from '../../../../../scenery-phet/js/ArrowNode.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';

// constants
const NORMAL_COLOR = 'rgb( 61, 179, 79 )';
const HIGHLIGHT_COLOR = 'yellow';
const STROKE_COLOR = 'black';
const LINE_WIDTH = 1;

class DragHandleArrowNode extends ArrowNode {

  /**
   * @param {Vector2} pStart
   * @param {Vector2} pEnd
   * @param {Property.<boolean>} isHighlightedProperty
   * @param {Tandem} tandem
   */
  constructor( pStart, pEnd, isHighlightedProperty, tandem ) {

    // calculate the parameter for head and tail width and height.
    const length = Math.abs( pStart.distance( pEnd ) );

    super( pStart.x, pStart.y, pEnd.x, pEnd.y, {
      fill: NORMAL_COLOR,
      stroke: STROKE_COLOR,
      lineWidth: LINE_WIDTH,
      doubleHead: true,
      headHeight: length,
      headWidth: length / 2,
      tailWidth: length / 5,
      tandem: tandem
    } );

    this.normalColor = NORMAL_COLOR;
    this.highlightColor = HIGHLIGHT_COLOR;

    // make the arrow slightly easier to drag
    this.touchArea = this.bounds.dilated( 10 );

    // highlight the arrow on pointer over
    isHighlightedProperty.link( highlighted => {
      this.fill = highlighted ? HIGHLIGHT_COLOR : NORMAL_COLOR;
    } );
  }
}

capacitorLabBasics.register( 'DragHandleArrowNode', DragHandleArrowNode );
export default DragHandleArrowNode;