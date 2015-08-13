// Copyright 2002-2015, University of Colorado Boulder

/**
 * Visual representation of a wire.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );

  // constants
  var WIRE_LINE_WIDTH = 2;
  var WIRE_STROKE = 'rgb( 143, 143, 143 )';
  var WIRE_FILL = 'rgb( 170, 170, 170 )';

  /**
   * Constructor for the wire node.
   *
   * @param {Wire} wire
   * @constructor
   */
  function WireNode( wire ) {

    Node.call( this );
    this.wire = wire;

    // create the wire fill.  Unstroked path so that the acute stroked path is covered.
    // See https://github.com/phetsims/kite/issues/49
    var wireNodeFill = new Path( wire.shapeCreator.createWireShape(), {
      fill: WIRE_FILL
    } );

    // the stroked wire node.
    var wireNode = new Path( wire.shapeCreator.createWireShape(), {
      lineWidth: WIRE_LINE_WIDTH,
      stroke: WIRE_STROKE,
      fill: WIRE_FILL
    } );

    // layout order - fill covers stroked shape
    this.addChild( wireNode );
    this.addChild( wireNodeFill );

    wire.shapeProperty.link( function( shape ) {
      wireNode.setShape( shape );
      wireNodeFill.setShape( shape );
    } );

  }

  return inherit( Node, WireNode );
} );