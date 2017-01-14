// Copyright 2016, University of Colorado Boulder

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
  var Circle = require( 'SCENERY/nodes/Circle' );
  var CircuitState = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitState' );
  var CircuitSwitchDragHandler = require( 'CAPACITOR_LAB_BASICS/common/view/drag/CircuitSwitchDragHandler' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var ConnectionAreaNode = require( 'CAPACITOR_LAB_BASICS/common/view/ConnectionAreaNode' );
  var ConnectionPointNode = require( 'CAPACITOR_LAB_BASICS/common/view/ConnectionPointNode' );
  var HingePointNode = require( 'CAPACITOR_LAB_BASICS/common/view/HingePointNode' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  var TandemButtonListener = require( 'TANDEM/scenery/input/TandemButtonListener' );
  var Vector2 = require( 'DOT/Vector2' );
  var WireNode = require( 'CAPACITOR_LAB_BASICS/common/view/WireNode' );

  // phet-io modules
  var TNode = require( 'ifphetio!PHET_IO/types/scenery/nodes/TNode' );

  // Images
  var switchCueArrowImage = require( 'image!CAPACITOR_LAB_BASICS/switch_cue_arrow.png' );

  // Constants
  var SWITCH_CUE_ARROW_WIDTH = 25;
  var SWITCH_CUE_ARROW_OFFSET = new Vector2( -80, -250 ); // View coords
  var HIGHLIGHT_COLOR = 'yellow';
  var SWITCH_CIRCLE_SMALL_RADIUS = CLBConstants.CONNECTION_POINT_RADIUS;
  var SWITCH_CIRCLE_LARGE_RADIUS = 1.2 * SWITCH_CIRCLE_SMALL_RADIUS;

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
    var self = this;
    this.circuitSwitch = circuitSwitch; // @public
    this.modelViewTransform = modelViewTransform; // @private

    // add the switch as a wire node
    // @private
    this.wireSwitchNode = new WireNode( circuitSwitch.switchWire, tandem.createTandem( 'wireSwitchNode' ) );
    this.wireSwitchNode.cursor = 'pointer';

    // add a shaded sphere to the end of the wire node to represent a connection point at the end of the switch.
    var shadedSphereNode = new ShadedSphereNode( 2 * SWITCH_CIRCLE_LARGE_RADIUS ); // Diameter

    // Dashed circle on tip of switch used as a contact indicator
    var tipCircle = new Circle( SWITCH_CIRCLE_LARGE_RADIUS, {
      lineWidth: 2,
      lineDash: [ 3, 3 ],
      stroke: PhetColorScheme.RED_COLORBLIND
    } );
    tipCircle.mouseArea = tipCircle.bounds.dilated( 2 );  // px
    tipCircle.touchArea = tipCircle.bounds.dilated( 15 ); // px

    // Dilate the touch area so that it is easier to drag.
    // The mouse area is only slightly dilated so the highlight cue only appears
    // when the mouse pointer is very close to the switch end (see #144).
    shadedSphereNode.mouseArea = shadedSphereNode.bounds.dilated( 2 );  // px
    shadedSphereNode.touchArea = shadedSphereNode.bounds.dilated( 15 ); // px

    var endPoint = circuitSwitch.switchSegment.endPointProperty.value;

    shadedSphereNode.translation = modelViewTransform.modelToViewPosition( endPoint );
    this.wireSwitchNode.addChild( shadedSphereNode );

    tipCircle.translation = modelViewTransform.modelToViewPosition( endPoint );
    this.wireSwitchNode.addChild( tipCircle );

    // add the the hinge
    var hingeNode = new HingePointNode();
    hingeNode.translation = modelViewTransform.modelToViewPosition( circuitSwitch.hingePoint );

    // create connection points and clickable areas
    this.connectionPointNodes = [];
    var connectionAreaNodes = [];
    var openConnectionArea = null;

    // prefixes for tandem IDs
    var connectionLabels = [ 'battery', 'open', 'lightBulb' ];

    circuitSwitch.connections.forEach( function( connection, index ) {
      // add the connection point node
      var connectionPointNode = new ConnectionPointNode( connection.connectionType,
        circuitSwitch.circuitConnectionProperty, tandem.createTandem( connectionLabels[ index ] + 'ConnectionPointNode' ) );
      connectionPointNode.translation = modelViewTransform.modelToViewPosition( connection.location );

      // add the clickable area for the connection point
      var connectionAreaNode = new ConnectionAreaNode( connection, circuitSwitch,
        connectionPointNode, modelViewTransform, tandem.createTandem( connectionLabels[ index ] + 'ConnectionAreaNode' ) );

      if ( connection.connectionType === CircuitState.OPEN_CIRCUIT ) {
        openConnectionArea = connectionAreaNode;
      }

      self.connectionPointNodes.push( connectionPointNode );
      connectionAreaNodes.push( connectionAreaNode );
    } );

    this.wireSwitchNode.addInputListener( new CircuitSwitchDragHandler( self, tandem.createTandem( 'inputListener' ) ) );

    // changes visual position as the user drags the switch.
    circuitSwitch.angleProperty.link( function( angle ) {
      self.wireSwitchNode.resetTransform();
      self.wireSwitchNode.translate( circuitSwitch.hingePoint.x, circuitSwitch.hingePoint.y );
      self.wireSwitchNode.rotateAround( modelViewTransform.modelToViewPosition( circuitSwitch.hingePoint ), angle );
    } );

    // Circuit connection change listener
    circuitSwitch.circuitConnectionProperty.link( function( circuitConnection ) {

      // Endpoint, hinge point, and a vector between them
      var endPoint = circuitSwitch.switchSegment.endPointProperty.get();
      var hingePoint = circuitSwitch.switchSegment.hingePoint;
      var delta = endPoint.minus( hingePoint ).setMagnitude( CLBConstants.SWITCH_WIRE_LENGTH );

      // Make sure that the shaded sphere snaps to the correct position when connection property changes.
      shadedSphereNode.translation = modelViewTransform.modelToViewPosition( hingePoint.plus( delta ) );
      tipCircle.translation = modelViewTransform.modelToViewPosition( hingePoint.plus( delta ) );

      // Solder joint visibility
      if ( circuitConnection === CircuitState.SWITCH_IN_TRANSIT ||
           circuitConnection === CircuitState.OPEN_CIRCUIT ) {
        shadedSphereNode.setVisible( false );
        tipCircle.radius = SWITCH_CIRCLE_SMALL_RADIUS;
      }
      else {
        shadedSphereNode.setVisible( true );
        tipCircle.radius = SWITCH_CIRCLE_LARGE_RADIUS;
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

    this.switchCueArrow = switchCueArrow;

    this.addChild( switchCueArrow );

    // rendering order important for behavior of click areas and drag handlers
    _.each( connectionAreaNodes, function( connectionAreaNode ) {
      self.addChild( connectionAreaNode );
    } );
    _.each( self.connectionPointNodes, function( connectionPointNode ) {
      self.addChild( connectionPointNode );
    } );
    this.addChild( this.wireSwitchNode );
    this.addChild( hingeNode );

    // Introduced for #180, so tipCircle highlights consistently at the center position
    // as for the left and right contact points.
    openConnectionArea.addInputListener( new TandemButtonListener( {
      tandem: tandem.createTandem( 'connectionAreaNodeListener' ),
      over: function( event ) {
        if ( circuitSwitch.circuitConnectionProperty.value === CircuitState.OPEN_CIRCUIT ) {
          tipCircle.fill = HIGHLIGHT_COLOR;
        }
      },
      up: function( event ) {
        tipCircle.fill = 'none';
      },
      out: function( event ) {
        tipCircle.fill = 'none';
      },
      down: function( event ) {
        tipCircle.fill = 'none';
      }
    } ) );

    // Since the switch wire occludes the drag area, the highlight color disappears
    // when hovering over the switch wire. To correct this, add a listener to
    // the swittch node itself and emulate the behavior. See #145.
    this.wireSwitchNode.addInputListener( new TandemButtonListener( {
      tandem: tandem.createTandem( 'wireSwitchListener' ),
      over: function( event ) {
        tipCircle.fill = HIGHLIGHT_COLOR;
      },
      up: function( event ) {
        tipCircle.fill = 'none';
      },
      out: function( event ) {
        tipCircle.fill = 'none';
      },
      down: function( event ) {
        tipCircle.fill = 'none';
      }
    } ) );

    // Register with tandem.  No need to handle dispose/removeInstance since this
    // exists for the lifetime of the simulation.
    tandem.addInstance( this, TNode );
  }

  capacitorLabBasics.register( 'SwitchNode', SwitchNode );

  return inherit( Node, SwitchNode );

} );

