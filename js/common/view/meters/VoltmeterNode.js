// Copyright 2002-2015, University of Colorado Boulder

/**
 * A voltmeter has a body, 2 probes, and 2 wires connecting the probes to the body.
 * This node is designed to be located at (0,0), so that we don't need to deal with
 * coordinate frame issues when the voltmeter's components move.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules  var Circle = require( 'SCENERY/nodes/Circle' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Vector2 = require( 'DOT/Vector2' );
  var VoltmeterBodyNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/VoltmeterBodyNode' );
  var VoltmeterProbeNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/VoltmeterProbeNode' );
  var ProbeWireNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/ProbeWireNode' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );

  // constants
  // wire is a cubic curve, these are the control point offsets
  var BODY_CONTROL_POINT_OFFSET = new Vector2( 0, 100 );
  var PROBE_CONTROL_POINT_OFFSET = new Vector2( -80, 100 );

  var POSITIVE_WIRE_COLOR = PhetColorScheme.RED_COLORBLIND;
  var NEGATIVE_WIRE_COLOR = 'black';

  /**
   * Constructor.
   *
   * @param {Voltmeter} voltmeter - the voltmeter model
   * @param {CLModelViewTransform3D} modelViewTransform
   */
  function VoltmeterNode( voltmeter, modelViewTransform ) {

    Node.call( this );

    // construct all parts of the probe
    var bodyNode = new VoltmeterBodyNode( voltmeter, modelViewTransform );
    var positiveProbeNode = VoltmeterProbeNode.PositiveVoltmeterProbeNode( voltmeter, modelViewTransform );
    var negativeProbeNode = VoltmeterProbeNode.NegativeVoltmeterProbeNode( voltmeter, modelViewTransform );
    var positiveWireNode = new ProbeWireNode( bodyNode, positiveProbeNode, BODY_CONTROL_POINT_OFFSET, PROBE_CONTROL_POINT_OFFSET,
      bodyNode.positiveConnectionOffset, positiveProbeNode.connectionOffset, POSITIVE_WIRE_COLOR );
    var negativeWireNode = new ProbeWireNode( bodyNode, negativeProbeNode, BODY_CONTROL_POINT_OFFSET, PROBE_CONTROL_POINT_OFFSET,
      bodyNode.negativeConnectionOffset, negativeProbeNode.connectionOffset, NEGATIVE_WIRE_COLOR );

    // rendering order
    this.addChild( bodyNode );
    this.addChild( positiveProbeNode );
    this.addChild( negativeProbeNode );
    this.addChild( positiveWireNode );
    this.addChild( negativeWireNode );

  }

  return inherit( Node, VoltmeterNode );

} );