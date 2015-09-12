// Copyright 2002-2015, University of Colorado Boulder

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
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );
  var UnitsUtils = require( 'CAPACITOR_LAB_BASICS/common/model/util/UnitsUtils' );
  var DragHandleArrowNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/DragHandleArrowNode' );
  var PlateSeparationDragHandler = require( 'CAPACITOR_LAB_BASICS/common/view/drag/PlateSeparationDragHandler' );
  var DragHandleValueNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/DragHandleValueNode' );
  var DragHandleLineNode = require( 'CAPACITOR_LAB_BASICS/common/view/drag/DragHandleLineNode' );

  // constants
  // endpoints for vertical double-headed arrow
  var ARROW_START_LOCATION = new Vector2( 0, 0 );
  var ARROW_END_LOCATION = new Vector2( 0, -CLConstants.DRAG_HANDLE_ARROW_LENGTH );

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
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {Range} valueRange
   * @param {Property.<boolean>} valuesVisibleProperty
   * @constructor
   */
  function PlateSeparationDragHandleNode( capacitor, modelViewTransform, valueRange, valuesVisibleProperty ) {

    Node.call( this, PlateSeparationDragHandleNode );
    var thisNode = this;

    // @private
    this.capacitor = capacitor;
    this.modelViewTransform = modelViewTransform;

    // arrow
    var arrowNode = new DragHandleArrowNode( ARROW_START_LOCATION, ARROW_END_LOCATION );
    this.addInputListener( new PlateSeparationDragHandler( arrowNode, capacitor, modelViewTransform, valueRange ) );
    this.touchArea = arrowNode.bounds;
    this.cursor = 'pointer';


    // line
    var lineNode = new DragHandleLineNode( LINE_START_LOCATION, LINE_END_LOCATION );

    // value
    var millimeters = UnitsUtils.metersToMillimeters( capacitor.plateSeparation );
    this.valueNode = new DragHandleValueNode( separationString, millimeters, unitsMillimetersString, valuesVisibleProperty );

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
    x = arrowNode.bounds.maxX;
    y = arrowNode.bounds.minY - this.valueNode.bounds.height / 2;
    this.valueNode.translation = new Vector2( x, y );

    // update when related model properties change
    capacitor.plateSeparationProperty.link( function() {
      thisNode.updateValueDisplay();
      thisNode.updateOffset();
    } );

    capacitor.plateSizeProperty.link( function() {
      thisNode.updateOffset();
    } );

  }

  return inherit( Node, PlateSeparationDragHandleNode, {

    /**
     * Synchronizes the value display with the model.
     */
    updateValueDisplay: function() {
      var millimeters = UnitsUtils.metersToMillimeters( this.capacitor.plateSeparation );
      this.valueNode.setValue( millimeters );
    },

    /**
     * Attach drag handle to top capacitor plate, in center the plate's top face.
     */
    updateOffset: function() {
      var x = this.capacitor.location.x + ( 0.3 * this.capacitor.plateSize.width );
      var y = this.capacitor.location.y - ( this.capacitor.plateSeparation / 2 ) - this.capacitor.plateSize.height;
      var z = 0;
      this.translation = this.modelViewTransform.modelToViewXYZ( x, y, z );
    }
  } );
} );