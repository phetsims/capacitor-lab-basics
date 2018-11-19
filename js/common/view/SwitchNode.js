// Copyright 2015-2018, University of Colorado Boulder

/**
 * Visual representation of a switch.  A switch consists of a line that connects a hinge point and at least two other
 * connection points.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // Modules
  var BooleanProperty = require( 'AXON/BooleanProperty' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var Circle = require( 'SCENERY/nodes/Circle' );
  var CircuitState = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitState' );
  var CircuitSwitchDragHandler = require( 'CAPACITOR_LAB_BASICS/common/view/drag/CircuitSwitchDragHandler' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var ConnectionNode = require( 'CAPACITOR_LAB_BASICS/common/view/ConnectionNode' );
  var HingePointNode = require( 'CAPACITOR_LAB_BASICS/common/view/HingePointNode' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var WireNode = require( 'CAPACITOR_LAB_BASICS/common/view/WireNode' );

  // Images
  var switchCueArrowImage = require( 'image!CAPACITOR_LAB_BASICS/switch_cue_arrow.png' );

  // Constants
  var SWITCH_CUE_ARROW_WIDTH = 25;
  var SWITCH_CUE_ARROW_OFFSET = new Vector2( -80, -250 ); // View coords

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
    var self = this;

    // @public {CircuitSwitch}
    this.circuitSwitch = circuitSwitch;

    // @private {CLBModelViewTransform3D}
    this.modelViewTransform = modelViewTransform;

    // @private {WireNode}
    this.wireSwitchNode = new WireNode( circuitSwitch.switchWire, tandem.createTandem( 'wireSwitchNode' ) );
    this.wireSwitchNode.cursor = 'pointer';

    // add a shaded sphere to the end of the wire node to represent a connection point at the end of the switch.
    var shadedSphereNode = new ShadedSphereNode( 2 * CLBConstants.CONNECTION_POINT_RADIUS ); // Diameter

    // Dashed circle on tip of switch used as a contact indicator
    var tipCircle = new Circle( CLBConstants.CONNECTION_POINT_RADIUS, {
      lineWidth: 2,
      lineDash: [ 3, 3 ],
      stroke: PhetColorScheme.RED_COLORBLIND
    } );

    var endPoint = circuitSwitch.switchSegment.endPointProperty.value;

    shadedSphereNode.translation = modelViewTransform.modelToViewPosition( endPoint );
    this.wireSwitchNode.addChild( shadedSphereNode );

    tipCircle.translation = modelViewTransform.modelToViewPosition( endPoint );
    this.wireSwitchNode.addChild( tipCircle );

    // add the hinge
    var hingeNode = new HingePointNode();
    hingeNode.translation = modelViewTransform.modelToViewPosition( circuitSwitch.hingePoint );

    // @public {Node} create connection points and clickable areas
    this.connectionAreaNodes = [];

    var userControlledProperty = new BooleanProperty( false );

    userControlledProperty.link( function( controlled ) {
      tipCircle.fill = controlled ? 'yellow' : null;
    } );

    var dragHandler = new CircuitSwitchDragHandler( self, switchLockedProperty, userControlledProperty, tandem.createTandem( 'dragHandler' ) );

    // prefixes for tandem IDs
    var connectionLabels = [ 'battery', 'open', 'lightBulb' ];

    circuitSwitch.connections.forEach( function( connection, index ) {
      var connectionTandem = tandem.createTandem( connectionLabels[ index ] + 'ConnectionNode' );

      // add the clickable area for the connection point
      self.connectionAreaNodes.push( new ConnectionNode( connection, circuitSwitch, modelViewTransform, connectionTandem, dragHandler, switchLockedProperty ) );
    } );

    circuitSwitch.angleProperty.link( function( angle ) {

      // Endpoint, hinge point, and a vector between them
      var hingePoint = circuitSwitch.switchSegment.hingePoint;
      var delta = Vector2.createPolar( CLBConstants.SWITCH_WIRE_LENGTH, angle ).toVector3();

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
    var switchCueArrow = new Image( switchCueArrowImage );
    switchCueArrow.scale( SWITCH_CUE_ARROW_WIDTH / switchCueArrow.bounds.height );
    switchCueArrow.leftTop = this.wireSwitchNode.center;

    // Reflect bottom arrow about the horizontal axis.
    var segment = circuitSwitch.switchSegment;
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

