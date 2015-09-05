// Copyright 2002-2015, University of Colorado Boulder

/**
 * Arrow and electron that indicates the direction of current flow. Visibility of this node is handled via its
 * transparency. The node appears while current is flowing. When current stops flowing, the node fades out over a
 * period of time.
 *
 * By default, the arrow points to the left. Origin is at the geometric center, so that this node can be easily rotated
 * when current changes direction.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Vector2 = require( 'DOT/Vector2' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var Node = require( 'SCENERY/nodes/Node' );
  var ShadedSphereNode = require( 'SCENERY_PHET/ShadedSphereNode' );
  var MinusNode = require( 'SCENERY_PHET/MinusNode' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var Color = require( 'SCENERY/util/Color' );

  // constants
  // arrow properties
  var ARROW_LENGTH = 88;
  var ARROW_HEAD_WIDTH = 30;
  var ARROW_HEAD_HEIGHT = 25;
  var ARROW_TAIL_WIDTH = 0.4 * ARROW_HEAD_WIDTH;
  var ARROW_TIP_LOCATION = new Vector2( 0, 0 ); // origin at the tip
  var ARROW_TAIL_LOCATION = new Vector2( ARROW_LENGTH, 0 );
  var ARROW_COLOR = new Color( 83, 200, 236 );

  // electron properties
  var ELECTRON_DIAMETER = 0.8 * ARROW_TAIL_WIDTH;
  var ELECTRON_FILL_COLOR = ARROW_COLOR;
  var ELECTRON_LINE_WIDTH = 1;
  var ELECTRON_STROKE_COLOR = 'black';
  var ELECTRON_MINUS_COLOR = 'black';
  var ELECTRON_MINUS_SIZE = new Dimension2( 0.6 * ELECTRON_DIAMETER, 0.1 * ELECTRON_DIAMETER );

  /**
   * Constructor. Rotation angles should be set such that +dV/dt indicates current flow towards the positive terminal
   * of the battery.
   *
   * @param {CurrentIndicator} currentIndicator
   * @param {number} positiveOrientation
   * @constructor
   */
  function CurrentIndicatorNode( currentIndicator, positiveOrientation ) {

    Node.call( this, { opacity: 0 } ); // TODO: Perhaps extend ArrowNode?
    var thisNode = this;
    this.positiveOrientation = positiveOrientation;

    var arrowNode = new ArrowNode( ARROW_TAIL_LOCATION.x, ARROW_TAIL_LOCATION.y, ARROW_TIP_LOCATION.x, ARROW_TIP_LOCATION.y, {
      headHeight: ARROW_HEAD_HEIGHT,
      headWidth: ARROW_HEAD_WIDTH,
      tailWidth: ARROW_TAIL_WIDTH,
      fill: ARROW_COLOR
    } );

    this.addChild( arrowNode );

    var electronNode = new ShadedSphereNode( ELECTRON_DIAMETER, {
      fill: ELECTRON_FILL_COLOR,
      stroke: ELECTRON_STROKE_COLOR,
      lineWidth: ELECTRON_LINE_WIDTH,
      mainColor: ARROW_COLOR,
      highlightXOffset: 0,
      highlightYOffset: 0
    } );
    this.addChild( electronNode );

    // Use scenery-phet's minus node because Text("-") can't be accurately centered.
    var minusNode = new MinusNode( {
      size: ELECTRON_MINUS_SIZE,
      fill: ELECTRON_MINUS_COLOR
    } );
    this.addChild( minusNode );

    // layout
    var x = -arrowNode.bounds.width / 2;
    var y = 0;
    arrowNode.translate( x, y );
    x = arrowNode.bounds.maxX - ( 0.6 * ( arrowNode.bounds.width - ARROW_HEAD_HEIGHT ) );
    y = arrowNode.bounds.centerY;
    electronNode.translate( x, y );
    minusNode.center = electronNode.center;

    // observer current
    currentIndicator.multilink( [ 'opacity', 'rotation' ], function() {
      thisNode.opacity = currentIndicator.opacity;
      thisNode.rotation = currentIndicator.rotation;
    } );

  }

  return inherit( Node, CurrentIndicatorNode );
} );