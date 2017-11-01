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
  var CircuitLocation = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitLocation' );
  var CLBQueryParameters = require( 'CAPACITOR_LAB_BASICS/common/CLBQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );

  /**
   * @constructor
   *
   * @param {CLBModel} model
   */
  function DebugLayer( model ) {
    var self = this;

    Node.call( this );

    /*
     * TODO: shapeTouchesWireGroup uses intersectsBounds?
     * TODO: Capacitor contains point is only using 1 point (the probe bounds-center)
     * TODO: Battery contains only checks bounds intersection
     * TODO: Light bulb base intersection uses intersectsBounds
     */

    // Don't do anything else unless debugging is enabled
    if ( !CLBQueryParameters.showDebugAreas ) { return; }

    var circuitLocations = [
      CircuitLocation.BATTERY_TOP,
      CircuitLocation.BATTERY_BOTTOM,
      CircuitLocation.CAPACITOR_TOP,
      CircuitLocation.CAPACITOR_BOTTOM
    ];
    if ( model.circuit.lightBulb ) {
      circuitLocations.push( CircuitLocation.LIGHT_BULB_TOP );
      circuitLocations.push( CircuitLocation.LIGHT_BULB_BOTTOM );
    }

    circuitLocations.forEach( function( circuitLocation ) {
      var wires = model.circuit.wireGroup[ circuitLocation ];

      wires.forEach( function( wire ) {
        var wirePath = new Path( null, {
          stroke: 'blue'
        } );
        self.addChild( wirePath );

        wire.shapeProperty.link( function( shape ) {
          wirePath.shape = shape;
        } );
      } );
    } );

    // capacitor top
    var capacitorContainer = new Node();
    this.addChild( capacitorContainer );
    var capacitor = model.circuit.capacitor;
    Property.multilink( [ capacitor.plateSizeProperty, capacitor.plateSeparationProperty ], function( size, separation ) {
      capacitorContainer.children = [
        new Path( capacitor.shapeCreator.createBoxShape( capacitor.location.x, capacitor.getTopConnectionPoint().y, capacitor.location.z, size.width, size.height, size.depth ), {
          stroke: 'blue'
        } ),
        new Path( capacitor.shapeCreator.createBoxShape( capacitor.location.x, capacitor.location.y + separation / 2, capacitor.location.z, size.width, size.height, size.depth ), {
          stroke: 'blue'
        } )
      ];
    } );

    this.addChild( new Path( model.circuit.battery.shapeCreator.createTopTerminalShape(), {
      stroke: 'blue'
    } ) );

    if ( model.circuit.lightBulb ) {
      this.addChild( new Path( model.circuit.lightBulb.shapeCreator.createBaseShape(), {
        stroke: 'blue'
      } ) );
    }

    var positiveVoltmeterNode = new Node();
    this.addChild( positiveVoltmeterNode );

    var negativeVoltmeterNode = new Node();
    this.addChild( negativeVoltmeterNode );

    model.voltmeter.positiveProbeLocationProperty.link( function() {
      positiveVoltmeterNode.children = [
        new Path( model.voltmeter.shapeCreator.getPositiveProbeTipShape(), {
          stroke: 'blue'
        } )
      ];
    } );
    model.voltmeter.negativeProbeLocationProperty.link( function() {
      negativeVoltmeterNode.children = [
        new Path( model.voltmeter.shapeCreator.getNegativeProbeTipShape(), {
          stroke: 'blue'
        } )
      ];
    } );
  }

  capacitorLabBasics.register( 'DebugLayer', DebugLayer );

  inherit( Node, DebugLayer );

  return DebugLayer;
} );
