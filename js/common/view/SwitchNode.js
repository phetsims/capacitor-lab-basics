// Copyright 2015-2023, University of Colorado Boulder

/**
 * Visual representation of a switch.  A switch consists of a line that connects a hinge point and at least two other
 * connection points.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import BooleanProperty from '../../../../axon/js/BooleanProperty.js';
import Vector2 from '../../../../dot/js/Vector2.js';
import PhetColorScheme from '../../../../scenery-phet/js/PhetColorScheme.js';
import ShadedSphereNode from '../../../../scenery-phet/js/ShadedSphereNode.js';
import { Circle, Image, Node } from '../../../../scenery/js/imports.js';
import switchCueArrow_png from '../../../images/switchCueArrow_png.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';
import CLBConstants from '../CLBConstants.js';
import CircuitState from '../model/CircuitState.js';
import ConnectionNode from './ConnectionNode.js';
import CircuitSwitchDragHandler from './drag/CircuitSwitchDragHandler.js';
import HingePointNode from './HingePointNode.js';
import WireNode from './WireNode.js';

// Images

// Constants
const SWITCH_CUE_ARROW_WIDTH = 25;
const SWITCH_CUE_ARROW_OFFSET = new Vector2( -80, -250 ); // View coords

class SwitchNode extends Node {
  /**
   * @param {CircuitSwitch} circuitSwitch
   * @param {YawPitchModelViewTransform3} modelViewTransform
   * @param {Property.<boolean>} switchLockedProperty
   * @param {Tandem} tandem
   */
  constructor( circuitSwitch, modelViewTransform, switchLockedProperty, tandem ) {

    assert && assert( circuitSwitch.connections.length === 2 || circuitSwitch.connections.length === 3,
      'circuitSwitch should have 2 or three connections only' );

    super( { tandem: tandem } );

    // @public {CircuitSwitch}
    this.circuitSwitch = circuitSwitch;

    // @private {YawPitchModelViewTransform3}
    this.modelViewTransform = modelViewTransform;

    // @private {WireNode}
    this.wireSwitchNode = new WireNode( circuitSwitch.switchWire, tandem.createTandem( 'wireSwitchNode' ) );
    this.wireSwitchNode.cursor = 'pointer';

    // add a shaded sphere to the end of the wire node to represent a connection point at the end of the switch.
    const shadedSphereNode = new ShadedSphereNode( 2 * CLBConstants.CONNECTION_POINT_RADIUS ); // Diameter

    // Dashed circle on tip of switch used as a contact indicator
    const tipCircle = new Circle( CLBConstants.CONNECTION_POINT_RADIUS, {
      lineWidth: 2,
      lineDash: [ 3, 3 ],
      stroke: PhetColorScheme.RED_COLORBLIND
    } );

    const endPoint = circuitSwitch.switchSegment.endPointProperty.value;

    shadedSphereNode.translation = modelViewTransform.modelToViewPosition( endPoint );
    this.wireSwitchNode.addChild( shadedSphereNode );

    tipCircle.translation = modelViewTransform.modelToViewPosition( endPoint );
    this.wireSwitchNode.addChild( tipCircle );

    // add the hinge
    const hingeNode = new HingePointNode();
    hingeNode.translation = modelViewTransform.modelToViewPosition( circuitSwitch.hingePoint );

    // @public {Node} create connection points and clickable areas
    this.connectionAreaNodes = [];

    const userControlledProperty = new BooleanProperty( false );

    userControlledProperty.link( controlled => {
      tipCircle.fill = controlled ? 'yellow' : null;
    } );

    const dragHandler = new CircuitSwitchDragHandler( this, switchLockedProperty, userControlledProperty, tandem.createTandem( 'dragListener' ) );

    // prefixes for tandem IDs
    const connectionLabels = [ 'battery', 'open', 'lightBulb' ];

    circuitSwitch.connections.forEach( ( connection, index ) => {
      const connectionTandem = tandem.createTandem( `${connectionLabels[ index ]}ConnectionNode` );

      // add the clickable area for the connection point
      this.connectionAreaNodes.push( new ConnectionNode( connection, circuitSwitch, modelViewTransform, connectionTandem, dragHandler, switchLockedProperty ) );
    } );

    circuitSwitch.angleProperty.link( angle => {

      // Endpoint, hinge point, and a vector between them
      const hingePoint = circuitSwitch.switchSegment.hingePoint;
      const delta = Vector2.createPolar( CLBConstants.SWITCH_WIRE_LENGTH, angle ).toVector3();

      // Make sure that the shaded sphere snaps to the correct position when connection property changes.
      shadedSphereNode.translation = modelViewTransform.modelToViewPosition( hingePoint.plus( delta ) );
      tipCircle.translation = modelViewTransform.modelToViewPosition( hingePoint.plus( delta ) );

    } );

    // Circuit connection change listener
    circuitSwitch.circuitConnectionProperty.link( circuitConnection => {

      // Solder joint visibility
      if ( circuitConnection === CircuitState.SWITCH_IN_TRANSIT ||
           circuitConnection === CircuitState.OPEN_CIRCUIT ) {
        shadedSphereNode.setVisible( false );
        tipCircle.radius = CLBConstants.CONNECTION_POINT_RADIUS;
      }
      else {
        shadedSphereNode.setVisible( true );
        tipCircle.radius = CLBConstants.CONNECTION_POINT_RADIUS;
      }

      // Connection circle color
      if ( circuitConnection === CircuitState.SWITCH_IN_TRANSIT ) {
        tipCircle.stroke = PhetColorScheme.RED_COLORBLIND;
      }
      else {
        tipCircle.stroke = 'rgb(0,0,0)'; // black when not in transit
      }
    } );

    // Add arrow for a visual cue
    const switchCueArrow = new Image( switchCueArrow_png );
    switchCueArrow.scale( SWITCH_CUE_ARROW_WIDTH / switchCueArrow.bounds.height );
    switchCueArrow.leftTop = this.wireSwitchNode.center;

    // Reflect bottom arrow about the horizontal axis.
    const segment = circuitSwitch.switchSegment;
    if ( segment.endPointProperty.value.y > segment.hingePoint.y ) {
      switchCueArrow.scale( 1, -1 );
    }

    // Since the y-coordinate for the bottom switch is now inverted, a single translation
    // offset conveniently moves the top arrow up and the bottom arrow down.
    switchCueArrow.translate( SWITCH_CUE_ARROW_OFFSET );

    // @public {Image}
    this.switchCueArrow = switchCueArrow;

    this.addChild( switchCueArrow );

    // rendering order important for behavior of click areas and drag handlers
    _.each( this.connectionAreaNodes, connectionAreaNode => {
      this.addChild( connectionAreaNode.backStrokeNode );
    } );
    this.addChild( this.wireSwitchNode );
    this.addChild( hingeNode );
    _.each( this.connectionAreaNodes, connectionAreaNode => {
      this.addChild( connectionAreaNode.highlightNode );
    } );
  }
}

capacitorLabBasics.register( 'SwitchNode', SwitchNode );

export default SwitchNode;