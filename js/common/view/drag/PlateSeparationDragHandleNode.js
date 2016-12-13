// Copyright 2015, University of Colorado Boulder

/**
 * Drag handle for changing the plate separation.  Origin is at the end of the dashed line that is farthest from the
 * arrow. Attached to the top capacitor plate, in the center of the plate's top face.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var DragHandleArrowNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/DragHandleArrowNode' );
  var DragHandleLineNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/DragHandleLineNode' );
  var DragHandleValueNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/DragHandleValueNode' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlateSeparationDragHandler = require( 'CAPACITOR_LAB_BASICS/common/view/drag/PlateSeparationDragHandler' );
  var UnitsUtils = require( 'CAPACITOR_LAB_BASICS/common/model/util/UnitsUtils' );
  var Vector2 = require( 'DOT/Vector2' );

  // phet-io modules
  var TNode = require( 'ifphetio!PHET_IO/types/scenery/nodes/TNode' );

  // constants
  // endpoints for vertical double-headed arrow
  var ARROW_START_LOCATION = new Vector2( 0, 0 );
  var ARROW_END_LOCATION = new Vector2( 0, -CLBConstants.DRAG_HANDLE_ARROW_LENGTH );

  // endpoints for vertical line
  var LINE_LENGTH = 60;
  var LINE_START_LOCATION = new Vector2( 0, 0 );
  var LINE_END_LOCATION = new Vector2( 0, -LINE_LENGTH );

  // strings
  var separationString = require( 'string!CAPACITOR_LAB_BASICS/separation' );
  var unitsMillimetersString = require( 'string!CAPACITOR_LAB_BASICS/units.millimeters' );

  /**
   * Constructor for the PlateSeparationDragHandlerNode.
   *
   * @param {Capacitor} capacitor
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Range} valueRange
   * @param {Tandem} tandem
   * @constructor
   */
  function PlateSeparationDragHandleNode( capacitor, modelViewTransform, valueRange, tandem ) {

    Node.call( this );
    var self = this;

    // @private
    this.capacitor = capacitor;
    this.modelViewTransform = modelViewTransform;

    // arrow
    var arrowNode = new DragHandleArrowNode( ARROW_START_LOCATION, ARROW_END_LOCATION,
      tandem.createTandem( 'arrowNode' ) );
    this.addInputListener( new PlateSeparationDragHandler( arrowNode, capacitor, modelViewTransform, valueRange,
      tandem.createTandem( 'inputListener' ) ) );

    this.cursor = 'pointer';

    // line
    var lineNode = new DragHandleLineNode( LINE_START_LOCATION, LINE_END_LOCATION );

    // value
    var millimeters = UnitsUtils.metersToMillimeters( capacitor.plateSeparationProperty.value );
    this.valueNode = new DragHandleValueNode( separationString, millimeters, unitsMillimetersString );

    // Make text part of the draggable area
    this.valueNode.mouseArea = this.valueNode.bounds.dilated( 0 );
    this.valueNode.touchArea = this.valueNode.bounds.dilated( 0 );

    // Highlight the arrow on pointer over text
    this.valueNode.addInputListener( new ButtonListener( {
      over: function( event ) {
        arrowNode.fill = arrowNode.highlightColor;
      },
      up: function( event ) {
        arrowNode.fill = arrowNode.normalColor;
      }
    } ) );

    // rendering order
    this.addChild( lineNode );
    this.addChild( arrowNode );
    this.addChild( this.valueNode );

    // layout: arrow about line, horizontally centered
    var x = 0;
    var y = 0;
    lineNode.translation = new Vector2( x, y );

    x = 0;
    y = lineNode.bounds.minY - 2;
    arrowNode.translation = new Vector2( x, y );

    x = arrowNode.bounds.maxX + 5;
    y = arrowNode.bounds.minY - this.valueNode.bounds.height / 2 + 5;
    this.valueNode.translation = new Vector2( x, y );

    // update when related model properties change
    capacitor.plateSeparationProperty.link( function() {
      self.updateValueDisplay();
      self.updateOffset();
    } );

    capacitor.plateSizeProperty.link( function() {
      self.updateOffset();
    } );

    tandem.addInstance( this, TNode );
  }

  capacitorLabBasics.register( 'PlateSeparationDragHandleNode', PlateSeparationDragHandleNode );

  return inherit( Node, PlateSeparationDragHandleNode, {

    /**
     * Synchronizes the value display with the model.
     * @public
     */
    updateValueDisplay: function() {
      var millimeters = UnitsUtils.metersToMillimeters( this.capacitor.plateSeparationProperty.value );
      this.valueNode.setValue( millimeters, 1 ); // One decimal place
    },

    /**
     * Attach drag handle to top capacitor plate, in center the plate's top face.
     * @public
     */
    updateOffset: function() {
      var width = this.capacitor.plateSizeProperty.value.width;
      var height = this.capacitor.plateSizeProperty.value.height;
      var x = this.capacitor.location.x + ( 0.3 * width );
      var y = this.capacitor.location.y - ( this.capacitor.plateSeparationProperty.value / 2 ) - height;
      var z = 0;
      this.translation = this.modelViewTransform.modelToViewXYZ( x, y, z );
    }
  } );
} );

