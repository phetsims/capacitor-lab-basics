// Copyright 2014-2017, University of Colorado Boulder

/**
 * Handles displaying debugging information for showDebugAreas (where the voltmeter tips will intersect things)
 *
 * @author Jonathan Olson <jonathan.olson@colorado.edu>
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBQueryParameters = require( 'CAPACITOR_LAB_BASICS/common/CLBQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  // var Shape = require( 'KITE/Shape' );
  // var Vector2 = require( 'DOT/Vector2' );

  /**
   * @constructor
   *
   * @param {CLBModel} model
   */
  function DebugLayer( model ) {
    Node.call( this );

    // Don't do anything else unless debugging is enabled
    if ( !CLBQueryParameters.showDebugAreas ) { return; }

    var positiveVoltmeterNode = new Node();
    this.addChild( positiveVoltmeterNode );

    var negativeVoltmeterNode = new Node();
    this.addChild( negativeVoltmeterNode );

    model.voltmeter.positiveProbeLocationProperty.link( function() {
      positiveVoltmeterNode.children = [
        new Path( model.voltmeter.shapeCreator.getPositiveProbeTipShape(), {
          stroke: 'blue',
          lineWidth: 1
        } )
      ];
    } );
    model.voltmeter.negativeProbeLocationProperty.link( function() {
      negativeVoltmeterNode.children = [
        new Path( model.voltmeter.shapeCreator.getNegativeProbeTipShape(), {
          stroke: 'blue',
          lineWidth: 1
        } )
      ];
    } );
  }

  capacitorLabBasics.register( 'DebugLayer', DebugLayer );

  inherit( Node, DebugLayer );

  return DebugLayer;
} );
