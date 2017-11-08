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
  var CircuitState = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitState' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var CLBQueryParameters = require( 'CAPACITOR_LAB_BASICS/common/CLBQueryParameters' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Property = require( 'AXON/Property' );
  var Shape = require( 'KITE/Shape' );

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

    var topSwitchContainer = new Node();
    this.addChild( topSwitchContainer );
    capacitor.topCircuitSwitch.circuitConnectionProperty.link( function( circuitConnection ) {
      topSwitchContainer.removeAllChildren();

      if ( circuitConnection !== CircuitState.SWITCH_IN_TRANSIT && circuitConnection !== CircuitState.OPEN_CIRCUIT ) {
        var endPoint = capacitor.topCircuitSwitch.switchSegment.endPointProperty.value;
        var hingePoint = capacitor.topCircuitSwitch.switchSegment.hingePoint;
        var delta = endPoint.minus( hingePoint ).setMagnitude( CLBConstants.SWITCH_WIRE_LENGTH );

        var point = model.modelViewTransform.modelToViewPosition( hingePoint.plus( delta ) );
        topSwitchContainer.addChild( new Path( Shape.circle( point.x, point.y, CLBConstants.CONNECTION_POINT_RADIUS ), {
          stroke: 'blue'
        } ) );
      }
    } );

    var bottomSwitchContainer = new Node();
    this.addChild( bottomSwitchContainer );
    capacitor.bottomCircuitSwitch.circuitConnectionProperty.link( function( circuitConnection ) {
      bottomSwitchContainer.removeAllChildren();

      if ( circuitConnection !== CircuitState.SWITCH_IN_TRANSIT && circuitConnection !== CircuitState.OPEN_CIRCUIT ) {
        var endPoint = capacitor.bottomCircuitSwitch.switchSegment.endPointProperty.value;
        var hingePoint = capacitor.bottomCircuitSwitch.switchSegment.hingePoint;
        var delta = endPoint.minus( hingePoint ).setMagnitude( CLBConstants.SWITCH_WIRE_LENGTH );

        var point = model.modelViewTransform.modelToViewPosition( hingePoint.plus( delta ) );
        bottomSwitchContainer.addChild( new Path( Shape.circle( point.x, point.y, CLBConstants.CONNECTION_POINT_RADIUS ), {
          stroke: 'blue'
        } ) );
      }
    } );

    var terminalContainer = new Node();
    this.addChild( terminalContainer );
    var battery = model.circuit.battery;
    battery.polarityProperty.link( function( polarity ) {
      terminalContainer.children = [
        new Path( polarity === CLBConstants.POLARITY.POSITIVE ? battery.shapeCreator.createPositiveTerminalShape() : battery.shapeCreator.createNegativeTerminalShape(), {
          stroke: 'blue'
        } )
      ];
    } );

    if ( model.circuit.lightBulb ) {
      this.addChild( new Path( model.circuit.lightBulb.shapeCreator.createTopBaseShape(), {
        stroke: 'blue'
      } ) );
      this.addChild( new Path( model.circuit.lightBulb.shapeCreator.createBottomBaseShape(), {
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
