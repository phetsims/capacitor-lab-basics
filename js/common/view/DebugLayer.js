// Copyright 2017-2022, University of Colorado Boulder

/**
 * Handles displaying debugging information for showDebugAreas (where the voltmeter tips will intersect things)
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import Multilink from '../../../../axon/js/Multilink.js';
import { Shape } from '../../../../kite/js/imports.js';
import CapacitorConstants from '../../../../scenery-phet/js/capacitor/CapacitorConstants.js';
import { Node, Path } from '../../../../scenery/js/imports.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';
import CLBConstants from '../CLBConstants.js';
import CLBQueryParameters from '../CLBQueryParameters.js';
import CircuitPosition from '../model/CircuitPosition.js';
import CircuitState from '../model/CircuitState.js';

class DebugLayer extends Node {
  /**
   * @param {CLBModel} model
   */
  constructor( model ) {
    super();

    /*
     * TODO: shapeTouchesWireGroup uses intersectsBounds?
     * TODO: Capacitor contains point is only using 1 point (the probe bounds-center)
     * TODO: Battery contains only checks bounds intersection
     * TODO: Light bulb base intersection uses intersectsBounds
     */

    // Don't do anything else unless debugging is enabled
    if ( !CLBQueryParameters.showDebugAreas ) { return; }

    const circuitPositions = [
      CircuitPosition.BATTERY_TOP,
      CircuitPosition.BATTERY_BOTTOM,
      CircuitPosition.CAPACITOR_TOP,
      CircuitPosition.CAPACITOR_BOTTOM
    ];
    if ( model.circuit.lightBulb ) {
      circuitPositions.push( CircuitPosition.LIGHT_BULB_TOP );
      circuitPositions.push( CircuitPosition.LIGHT_BULB_BOTTOM );
    }

    circuitPositions.forEach( circuitPosition => {
      const wires = model.circuit.wireGroup[ circuitPosition ];

      wires.forEach( wire => {
        const wirePath = new Path( null, {
          stroke: 'blue'
        } );
        this.addChild( wirePath );

        wire.shapeProperty.link( shape => {
          wirePath.shape = shape;
        } );
      } );
    } );

    // capacitor top
    const capacitorContainer = new Node();
    this.addChild( capacitorContainer );
    const capacitor = model.circuit.capacitor;
    Multilink.multilink( [ capacitor.plateSizeProperty, capacitor.plateSeparationProperty ], ( size, separation ) => {
      capacitorContainer.children = [
        new Path( capacitor.shapeCreator.createBoxShape( capacitor.position.x, capacitor.getTopConnectionPoint().y, capacitor.position.z, size.width, size.height, size.depth ), {
          stroke: 'blue'
        } ),
        new Path( capacitor.shapeCreator.createBoxShape( capacitor.position.x, capacitor.position.y + separation / 2, capacitor.position.z, size.width, size.height, size.depth ), {
          stroke: 'blue'
        } )
      ];
    } );

    const topSwitchContainer = new Node();
    this.addChild( topSwitchContainer );
    capacitor.topCircuitSwitch.circuitConnectionProperty.link( circuitConnection => {
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
    capacitor.bottomCircuitSwitch.circuitConnectionProperty.link( circuitConnection => {
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
    battery.polarityProperty.link( polarity => {
      terminalContainer.children = [
        new Path( polarity === CapacitorConstants.POLARITY.POSITIVE ? battery.shapeCreator.createPositiveTerminalShape() : battery.shapeCreator.createNegativeTerminalShape(), {
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

    model.voltmeter.positiveProbePositionProperty.link( () => {
      positiveVoltmeterNode.children = [
        new Path( model.voltmeter.shapeCreator.getPositiveProbeTipShape(), {
          stroke: 'blue'
        } )
      ];
    } );
    model.voltmeter.negativeProbePositionProperty.link( () => {
      negativeVoltmeterNode.children = [
        new Path( model.voltmeter.shapeCreator.getNegativeProbeTipShape(), {
          stroke: 'blue'
        } )
      ];
    } );
  }
}

capacitorLabBasics.register( 'DebugLayer', DebugLayer );

export default DebugLayer;
