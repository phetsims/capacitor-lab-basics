// Copyright 2017-2019, University of Colorado Boulder

/**
 * Handles displaying debugging information for showDebugAreas (where the voltmeter tips will intersect things)
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const CircuitLocation = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitLocation' );
  const CircuitState = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitState' );
  const CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  const CLBQueryParameters = require( 'CAPACITOR_LAB_BASICS/common/CLBQueryParameters' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const Path = require( 'SCENERY/nodes/Path' );
  const Property = require( 'AXON/Property' );
  const Shape = require( 'KITE/Shape' );

  /**
   * @constructor
   *
   * @param {CLBModel} model
   */
  function DebugLayer( model ) {
    const self = this;

    Node.call( this );

    /*
     * TODO: shapeTouchesWireGroup uses intersectsBounds?
     * TODO: Capacitor contains point is only using 1 point (the probe bounds-center)
     * TODO: Battery contains only checks bounds intersection
     * TODO: Light bulb base intersection uses intersectsBounds
     */

    // Don't do anything else unless debugging is enabled
    if ( !CLBQueryParameters.showDebugAreas ) { return; }

    const circuitLocations = [
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
      const wires = model.circuit.wireGroup[ circuitLocation ];

      wires.forEach( function( wire ) {
        const wirePath = new Path( null, {
          stroke: 'blue'
        } );
        self.addChild( wirePath );

        wire.shapeProperty.link( function( shape ) {
          wirePath.shape = shape;
        } );
      } );
    } );

    // capacitor top
    const capacitorContainer = new Node();
    this.addChild( capacitorContainer );
    const capacitor = model.circuit.capacitor;
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

    const topSwitchContainer = new Node();
    this.addChild( topSwitchContainer );
    capacitor.topCircuitSwitch.circuitConnectionProperty.link( function( circuitConnection ) {
      topSwitchContainer.removeAllChildren();

      if ( circuitConnection !== CircuitState.SWITCH_IN_TRANSIT && circuitConnection !== CircuitState.OPEN_CIRCUIT ) {
        const endPoint = capacitor.topCircuitSwitch.switchSegment.endPointProperty.value;
        const hingePoint = capacitor.topCircuitSwitch.switchSegment.hingePoint;
        const delta = endPoint.minus( hingePoint ).setMagnitude( CLBConstants.SWITCH_WIRE_LENGTH );

        const point = model.modelViewTransform.modelToViewPosition( hingePoint.plus( delta ) );
        topSwitchContainer.addChild( new Path( Shape.circle( point.x, point.y, CLBConstants.CONNECTION_POINT_RADIUS ), {
          stroke: 'blue'
        } ) );
      }
    } );

    const bottomSwitchContainer = new Node();
    this.addChild( bottomSwitchContainer );
    capacitor.bottomCircuitSwitch.circuitConnectionProperty.link( function( circuitConnection ) {
      bottomSwitchContainer.removeAllChildren();

      if ( circuitConnection !== CircuitState.SWITCH_IN_TRANSIT && circuitConnection !== CircuitState.OPEN_CIRCUIT ) {
        const endPoint = capacitor.bottomCircuitSwitch.switchSegment.endPointProperty.value;
        const hingePoint = capacitor.bottomCircuitSwitch.switchSegment.hingePoint;
        const delta = endPoint.minus( hingePoint ).setMagnitude( CLBConstants.SWITCH_WIRE_LENGTH );

        const point = model.modelViewTransform.modelToViewPosition( hingePoint.plus( delta ) );
        bottomSwitchContainer.addChild( new Path( Shape.circle( point.x, point.y, CLBConstants.CONNECTION_POINT_RADIUS ), {
          stroke: 'blue'
        } ) );
      }
    } );

    const terminalContainer = new Node();
    this.addChild( terminalContainer );
    const battery = model.circuit.battery;
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

    const positiveVoltmeterNode = new Node();
    this.addChild( positiveVoltmeterNode );

    const negativeVoltmeterNode = new Node();
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
