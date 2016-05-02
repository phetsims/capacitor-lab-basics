// Copyright 2015, University of Colorado Boulder

/**
 * Wire that connects a probe to the body of a meter.
 * The wire is a cubic curve.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * Constructor.
   * @param {Object} [args]
   */
  function ProbeWireNode( args ) {

    var thisNode = this;

    // @private
    this.bodyNode = args.bodyNode;
    this.probeNode = args.probeNode;
    this.bodyControlPointOffset = args.bodyControlPointOffset;
    this.probeControlPointOffset = args.probeControlPointOffset;
    this.bodyConnectionOffset = args.bodyConnectionOffset;
    this.probeConnectionOffset = args.probeConnectionOffset;

    // supertype constructor with lazily passed wire shape.
    Path.call( this, null, {
      stroke: args.color,
      lineWidth: 3
    } );

    // update wire when body or probe moves
    args.probeNode.locationProperty.link( function( location ) {
      thisNode.update();
    } );

    args.bodyNode.bodyLocationProperty.link( function( location ) {
      thisNode.update();
    } );

  }

  capacitorLabBasics.register( 'ProbeWireNode', ProbeWireNode );

  return inherit( Path, ProbeWireNode, {

    /**
     * Update the wire path.
     */
    update: function() {

      var pBody = this.getConnectionPoint( this.bodyNode, this.bodyConnectionOffset );
      var pProbe = this.getConnectionPoint( this.probeNode, this.probeConnectionOffset );

      // control points
      var ctrl1 = new Vector2( pBody.x + this.bodyControlPointOffset.x, pBody.y + this.bodyControlPointOffset.y );
      var ctrl2 = new Vector2( pProbe.x + this.probeControlPointOffset.x, pProbe.y + this.probeControlPointOffset.y );

      var newWireShape = new Shape()
        .moveToPoint( pBody )
        .cubicCurveToPoint( ctrl1, ctrl2, pProbe );
      this.setShape( newWireShape );
    },

    /**
     * Get the connection point for either the voltmeter body or probe.  Adds the node location to the offset connection
     * point vector for a given node.
     *
     * @param {VoltmeterBodyNode||VoltmeterProbeNode} node
     * @param {Vector2} connectionOffset
     * @returns {Vector2}
     */
    getConnectionPoint: function( node, connectionOffset ) {
      return node.translation.plus( connectionOffset );
    }

  } );
} );

