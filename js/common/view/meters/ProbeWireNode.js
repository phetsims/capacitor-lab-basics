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
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  // wire is a cubic curve, these are the control point offsets
  var BODY_CONTROL_POINT_OFFSET = new Vector2( 0, 100 );
  var PROBE_CONTROL_POINT_OFFSET = new Vector2( -80, 100 );
  var POSITIVE_WIRE_COLOR = PhetColorScheme.RED_COLORBLIND;
  var NEGATIVE_WIRE_COLOR = 'black';

  /**
   * @param {VoltmeterBodyNode} bodyNode
   * @param {VoltmeterProbeNode} probeNode
   * @param {boolean} isPositive
   * @constructor
   */
  function ProbeWireNode( bodyNode, probeNode, isPositive ) {

    var self = this;

    // @private
    this.bodyNode = bodyNode;
    this.probeNode = probeNode;

    // @private
    this.bodyControlPointOffset = BODY_CONTROL_POINT_OFFSET;
    this.probeControlPointOffset = PROBE_CONTROL_POINT_OFFSET;

    // @private
    this.bodyConnectionOffset = isPositive ? bodyNode.positiveConnectionOffset : bodyNode.negativeConnectionOffset;
    this.probeConnectionOffset = probeNode.connectionOffset;

    // supertype constructor with lazily passed wire shape.
    Path.call( this, null, {
      stroke: isPositive ? POSITIVE_WIRE_COLOR : NEGATIVE_WIRE_COLOR,
      lineWidth: 3
    } );

    // update wire when body or probe moves
    probeNode.locationProperty.link( function( location ) {
      self.update();
    } );

    bodyNode.bodyLocationProperty.link( function( location ) {
      self.update();
    } );

  }

  capacitorLabBasics.register( 'ProbeWireNode', ProbeWireNode );

  return inherit( Path, ProbeWireNode, {

    /**
     * Update the wire path.
     * @public
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
     * @public
     */
    getConnectionPoint: function( node, connectionOffset ) {
      return node.translation.plus( connectionOffset );
    }

  } );
} );

