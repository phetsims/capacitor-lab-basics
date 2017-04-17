// Copyright 2016, University of Colorado Boulder

/**
 * Double arrow used for drag handles.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var ArrowNode = require( 'SCENERY_PHET/ArrowNode' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

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
   * @param {Tandem} tandem
   * @constructor
   */
  function DragHandleArrowNode( pStart, pEnd, tandem ) {
    var self = this;

    // calculate the parameter for head and tail width and height.
    var length = Math.abs( pStart.distance( pEnd ) );

    ArrowNode.call( this, pStart.x, pStart.y, pEnd.x, pEnd.y, {
      fill: NORMAL_COLOR,
      stroke: STROKE_COLOR,
      lineWidth: LINE_WIDTH,
      doubleHead: true,
      headHeight: length,
      headWidth: length / 2,
      tailWidth: length / 5,
      tandem: tandem.createTandem( 'arrowNode' )
    } );

    this.normalColor = NORMAL_COLOR;
    this.highlightColor = HIGHLIGHT_COLOR;

    // make the arrow slightly easier to drag
    this.touchArea = this.bounds.dilated( 10 );

    // highlight the arrow on pointer over
    this.addInputListener( new ButtonListener( {
      over: function( event ) {
        self.fill = HIGHLIGHT_COLOR;
      },
      up: function( event ) {
        self.fill = NORMAL_COLOR;
      }
    } ) );
  }

  capacitorLabBasics.register( 'DragHandleArrowNode', DragHandleArrowNode );

  return inherit( ArrowNode, DragHandleArrowNode );
} );