// Copyright 2014-2017, University of Colorado Boulder

/**
 * Visual representation of a wire.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );

  // constants
  var WIRE_LINE_WIDTH = 2;
  var WIRE_STROKE = 'rgb( 143, 143, 143 )';
  var WIRE_FILL = 'rgb( 170, 170, 170 )';

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
    var wireNode = new Path( wire.shapeCreator.createWireShape(), {
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