// Copyright 2015, University of Colorado Boulder

/**
 * Visual representation of a switch.  A switch consists of a line that connects a hinge point and at least two other
 * connection points.
 *
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // Modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CircuitSwitchDragHandler = require( 'CAPACITOR_LAB_BASICS/common/view/drag/CircuitSwitchDragHandler' );
  var ConnectionAreaNode = require( 'CAPACITOR_LAB_BASICS/common/view/ConnectionAreaNode' );
  var ConnectionPointNode = require( 'CAPACITOR_LAB_BASICS/common/view/ConnectionPointNode' );
  var HingePointNode = require( 'CAPACITOR_LAB_BASICS/common/view/HingePointNode' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var WireNode = require( 'CAPACITOR_LAB_BASICS/common/view/WireNode' );

  // Images
  var switchCueArrowImage = require( 'image!CAPACITOR_LAB_BASICS/switch_cue_arrow.png' );

  // Constants
  var SWITCH_CUE_ARROW_WIDTH = 25;
  var SWITCH_CUE_ARROW_OFFSET = new Vector2( -80, -250 ); // View coords

  /**
   * Constructor for a SwitchNode.
   *
   * @param {CircuitSwitch} circuitSwitch
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Tandem} tandem
   * @constructor
   */
  function SwitchNode( circuitSwitch, modelViewTransform, tandem ) {

    assert && assert( circuitSwitch.connections.length === 2 || circuitSwitch.connections.length === 3,
      'circuitSwitch should have 2 or three connections only' );

    Node.call( this );
    var thisNode = this;
    this.circuitSwitch = circuitSwitch;
    this.modelViewTransform = modelViewTransform;

    // add the switch as a wire node
    this.wireSwitchNode = new WireNode( circuitSwitch.switchWire, tandem.createTandem( 'wireSwitchNode' ) );
    this.wireSwitchNode.cursor = 'pointer';

    // add a shaded sphere to the end of the wire node to represent a connection point at the end of the switch.
    var shadedSphereNode = new ShadedSphereNode( 16 );
    shadedSphereNode.translation = modelViewTransform.modelToViewPosition( circuitSwitch.switchSegment.endPoint );
    this.wireSwitchNode.addChild( shadedSphereNode );

    // add the the hinge
    var hingeNode = new HingePointNode();
    hingeNode.translation = modelViewTransform.modelToViewPosition( circuitSwitch.hingePoint );

    // create connection points and clickable areas
    this.connectionPointNodes = [];
    var connectionListeners = [];

    var connectionLabels = [ 'battery', 'open', 'lightBulb' ];

    circuitSwitch.connections.forEach( function( connection, index ) {
      // add the connection point node
      var connectionPointNode = new ConnectionPointNode( connection.connectionType,
        circuitSwitch.circuitConnectionProperty, tandem.createTandem( connectionLabels[ index ] + 'ConnectionPointNode' ) );
      connectionPointNode.translation = modelViewTransform.modelToViewPosition( connection.location );

      // add the clickable area for the connection point
      var connectionAreaNode = new ConnectionAreaNode( connection, circuitSwitch,
        connectionPointNode, modelViewTransform, tandem.createTandem( connectionLabels[ index ] + 'ConnectionAreaNode' ) );

      thisNode.connectionPointNodes.push( connectionPointNode );
      connectionListeners.push( connectionAreaNode );
    } );

    // add the drag handler
    this.wireSwitchNode.addInputListener(
      new CircuitSwitchDragHandler( thisNode, tandem.createTandem( 'inputListener' ) ) );

    // changes visual position as the user drags the switch.
    circuitSwitch.angleProperty.link( function( angle ) {
      thisNode.wireSwitchNode.resetTransform();
      thisNode.wireSwitchNode.translate( circuitSwitch.hingePoint.x, circuitSwitch.hingePoint.y );
      thisNode.wireSwitchNode.rotateAround( modelViewTransform.modelToViewPosition( circuitSwitch.hingePoint ), angle );
    } );

    // Make sure that the shaded sphere snaps to the correct position when connection property changes.
    circuitSwitch.circuitConnectionProperty.link( function( circuitConnection ) {
      shadedSphereNode.translation = modelViewTransform.modelToViewPosition( circuitSwitch.switchSegment.endPoint );
    } );

    // Add arrow for a visual cue
    var switchCueArrow = new Image( switchCueArrowImage );
    switchCueArrow.scale( SWITCH_CUE_ARROW_WIDTH / switchCueArrow.bounds.height );
    switchCueArrow.leftTop = this.wireSwitchNode.center;

    // Reflect bottom arrow about the horizontal axis.
    var segment = circuitSwitch.switchSegment;
    if ( segment.endPoint.y > segment.hingePoint.y ) {
      switchCueArrow.scale( 1, -1 );
    }
    switchCueArrow.translate( SWITCH_CUE_ARROW_OFFSET );
    this.addChild( switchCueArrow );

    // rendering order, important for behavior of click areas and drag handlers
    _.each( connectionListeners, function( connectionListener ) {
      thisNode.addChild( connectionListener );
    } );
    _.each( thisNode.connectionPointNodes, function( connectionPointNode ) {
      thisNode.addChild( connectionPointNode );
    } );
    this.addChild( this.wireSwitchNode );
    this.addChild( hingeNode );

    // Register with tandem.  No need to handle dispose/removeInstance since this
    // exists for the lifetime of the simulation.
    tandem.addInstance( this );
  }

  capacitorLabBasics.register( 'SwitchNode', SwitchNode );

  return inherit( Node, SwitchNode );

} );

