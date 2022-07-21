// Copyright 2014-2022, University of Colorado Boulder

/**
 * Visual representation of a wire.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import { Node, Path } from '../../../../scenery/js/imports.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';

// constants
const WIRE_LINE_WIDTH = 2;
const WIRE_STROKE = 'rgb( 143, 143, 143 )';
const WIRE_FILL = 'rgb( 170, 170, 170 )';

class WireNode extends Node {
  /**
   * @constructor
   *
   * @param {Wire} wire
   */
  constructor( wire ) {
    super();

    // @private {Wire}
    this.wire = wire;

    // the stroked wire node.
    const wireNode = new Path( wire.shapeCreator.createWireShape(), {
      fill: WIRE_FILL,
      lineWidth: WIRE_LINE_WIDTH / 2,
      stroke: WIRE_STROKE
    } );

    this.addChild( wireNode );

    wire.shapeProperty.link( shape => {
      wireNode.setShape( shape );
    } );

  }
}

capacitorLabBasics.register( 'WireNode', WireNode );

export default WireNode;