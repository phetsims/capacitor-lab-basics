// Copyright 2015-2018, University of Colorado Boulder

/**
 * Visual representation of a switch.  A switch consists of a line that connects a hinge point and at least two other
 * connection points.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // Modules
  const BooleanProperty = require( 'AXON/BooleanProperty' );
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const Circle = require( 'SCENERY/nodes/Circle' );
  const CircuitState = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitState' );
  const CircuitSwitchDragHandler = require( 'CAPACITOR_LAB_BASICS/common/view/drag/CircuitSwitchDragHandler' );
  const CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  const ConnectionNode = require( 'CAPACITOR_LAB_BASICS/common/view/ConnectionNode' );
  const HingePointNode = require( 'CAPACITOR_LAB_BASICS/common/view/HingePointNode' );
  const Image = require( 'SCENERY/nodes/Image' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  const ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  const Vector2 = require( 'DOT/Vector2' );
  const WireNode = require( 'CAPACITOR_LAB_BASICS/common/view/WireNode' );

  // Images
  const switchCueArrowImage = require( 'image!CAPACITOR_LAB_BASICS/switch_cue_arrow.png' );

  // Constants
  const SWITCH_CUE_ARROW_WIDTH = 25;
  const SWITCH_CUE_ARROW_OFFSET = new Vector2( -80, -250 ); // View coords

  /**
   * @constructor
   *
   * @param {CircuitSwitch} circuitSwitch
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Property.<boolean>} switchLockedProperty
   * @param {Tandem} tandem
   */
  function SwitchNode( circuitSwitch, modelViewTransform, switchLockedProperty, tandem ) {

    assert && assert( circuitSwitch.connections.length === 2 || circuitSwitch.connections.length === 3,
      'circuitSwitch should have 2 or three connections only' );

    Node.call( this, { tandem: tandem } );
    const self = this;

    // @public {CircuitSwitch}
    this.circuitSwitch = circuitSwitch;

    // @private {CLBModelViewTransform3D}
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

    userControlledProperty.link( function( controlled ) {
      tipCircle.fill = controlled ? 'yellow' : null;
    } );

    const dragHandler = new CircuitSwitchDragHandler( self, switchLockedProperty, userControlledProperty, tandem.createTandem( 'dragHandler' ) );

    // prefixes for tandem IDs
    const connectionLabels = [ 'battery', 'open', 'lightBulb' ];

    circuitSwitch.connections.forEach( function( connection, index ) {
      const connectionTandem = tandem.createTandem( connectionLabels[ index ] + 'ConnectionNode' );

      // add the clickable area for the connection point
      self.connectionAreaNodes.push( new ConnectionNode( connection, circuitSwitch, modelViewTransform, connectionTandem, dragHandler, switchLockedProperty ) );
    } );

    circuitSwitch.angleProperty.link( function( angle ) {

      // Endpoint, hinge point, and a vector between them
      const hingePoint = circuitSwitch.switchSegment.hingePoint;
      const delta = Vector2.createPolar( CLBConstants.SWITCH_WIRE_LENGTH, angle ).toVector3();

      // Make sure that the shaded sphere snaps to the correct position when connection property changes.
      shadedSphereNode.translation = modelViewTransform.modelToViewPosition( hingePoint.plus( delta ) );
      tipCircle.translation = modelViewTransform.modelToViewPosition( hingePoint.plus( delta ) );

    } );

    // Circuit connection change listener
    circuitSwitch.circuitConnectionProperty.link( function( circuitConnection ) {

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
    const switchCueArrow = new Image( switchCueArrowImage );
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
    _.each( this.connectionAreaNodes, function( connectionAreaNode ) {
      self.addChild( connectionAreaNode.backStrokeNode );
    } );
    this.addChild( this.wireSwitchNode );
    this.addChild( hingeNode );
    _.each( this.connectionAreaNodes, function( connectionAreaNode ) {
      self.addChild( connectionAreaNode.highlightNode );
    } );
  }

  capacitorLabBasics.register( 'SwitchNode', SwitchNode );

  return inherit( Node, SwitchNode );

} );

