// Copyright 2002-2015, University of Colorado Boulder

/**
 * Double arrow used for drag handles.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var Property = require( 'AXON/Property' );

  // constants
  var NORMAL_COLOR = 'rgb( 61, 179, 79 )';
  var HIGHLIGHT_COLOR = 'yellow';
  var STROKE_COLOR = 'black';
  var LINE_WIDTH = 1;

  /**
   * Constructor for the DragHandleArrowNode.
   *
   * @param {Vector2} pStart
   * @param {Vector2} pEnd
   * @constructor
   */
  function DragHandleArrowNode( pStart, pEnd ) {
    var thisArrowNode = this; // extend scope for input listener callbacks

    // calculate the parameter for head and tail width and height.
    var length = Math.abs( pStart.distance( pEnd ) );

    // location property of the node in 'model space'.
    this.locationProperty = new Property( new Vector2( 0, 0 ) ); // @public

    ArrowNode.call( this, pStart.x, pStart.y, pEnd.x, pEnd.y, {
      fill: NORMAL_COLOR,
      stroke: STROKE_COLOR,
      lineWidth: LINE_WIDTH,
      doubleHead: true,
      headHeight: length,
      headWidth: length / 2,
      tailWidth: length / 5
    } );

    // highlight the arrow on pointer over
    this.addInputListener( new ButtonListener( {
      over: function( event ) {
        thisArrowNode.fill = HIGHLIGHT_COLOR;
      },
      up: function( event ) {
        thisArrowNode.fill = NORMAL_COLOR;
      }
    } ) );
  }

  return inherit( ArrowNode, DragHandleArrowNode );
} );