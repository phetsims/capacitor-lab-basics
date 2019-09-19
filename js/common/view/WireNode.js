// Copyright 2014-2018, University of Colorado Boulder

/**
 * Visual representation of a wire.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );

  // constants
  const WIRE_LINE_WIDTH = 2;
  const WIRE_STROKE = 'rgb( 143, 143, 143 )';
  const WIRE_FILL = 'rgb( 170, 170, 170 )';

  /**
   * @constructor
   *
   * @param {Wire} wire
   */
  function WireNode( wire ) {

    Node.call( this );

    // @private {Wire}
    this.wire = wire;

    // the stroked wire node.
    const wireNode = new Path( wire.shapeCreator.createWireShape(), {
      fill: WIRE_FILL,
      lineWidth: WIRE_LINE_WIDTH / 2,
      stroke: WIRE_STROKE
    } );

    this.addChild( wireNode );

    wire.shapeProperty.link( function( shape ) {
      wireNode.setShape( shape );
    } );

  }

  capacitorLabBasics.register( 'WireNode', WireNode );

  return inherit( Node, WireNode );
} );