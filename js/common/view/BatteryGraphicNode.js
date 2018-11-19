// Copyright 2017-2018, University of Colorado Boulder

/**
 * Nodes for displaying a battery (either positive end up or down)
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var Color = require( 'SCENERY/util/Color' );
  var inherit = require( 'PHET_CORE/inherit' );
  var LinearGradient = require( 'SCENERY/util/LinearGradient' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  var BATTERY_PERSPECTIVE_RATIO = 0.304;
  var BATTERY_MAIN_HEIGHT = 511;
  var BATTERY_MAIN_RADIUS = 158;
  var BATTERY_SECONDARY_RADIUS = BATTERY_MAIN_RADIUS * BATTERY_PERSPECTIVE_RATIO;
  var BATTERY_POSITIVE_TERMINAL_RADIUS = 55;
  var BATTERY_POSITIVE_TERMINAL_HEIGHT = 26;
  var BATTERY_POSITIVE_SIDE_HEIGHT = 152;
  var BATTERY_NEGATIVE_TERMINAL_RADIUS = 81;

  var POSITIVE_COLOR = new Color( 251, 176, 59 );
  var POSITIVE_HIGHLIGHT_COLOR = Color.WHITE;
  var POSITIVE_SHADOW_COLOR = POSITIVE_COLOR;

  var NEGATIVE_COLOR = new Color( 53, 53, 53 );
  var NEGATIVE_HIGHLIGHT_COLOR = new Color( 142, 142, 142 );
  var NEGATIVE_SHADOW_COLOR = Color.BLACK;

  var TERMINAL_COLOR = new Color( 190, 190, 190 );
  var TERMINAL_SIDE_COLOR = new Color( 168, 168, 168 );
  var TERMINAL_HIGHLIGHT_COLOR = new Color( 227, 227, 227 );

  var STROKE_COLOR = new Color( 33, 33, 33 );
  var LINE_WIDTH = 2;

  function createGradient( radius, leftColor, midColor, rightColor ) {
    function blend( highlightLocation, farLocation, location ) {
      var distance = Math.abs( ( farLocation - location ) / ( highlightLocation - farLocation ) );
      return distance * distance;
    }
    return new LinearGradient( -radius, 0, radius, 0 )
      .addColorStop( 0, leftColor )
      .addColorStop( 0.1, Color.interpolateRGBA( leftColor, midColor, blend( 0.3, 0, 0.1 ) ) )
      .addColorStop( 0.15, Color.interpolateRGBA( leftColor, midColor, blend( 0.3, 0, 0.15 ) ) )
      .addColorStop( 0.2, Color.interpolateRGBA( leftColor, midColor, blend( 0.3, 0, 0.2 ) ) )
      .addColorStop( 0.25, Color.interpolateRGBA( leftColor, midColor, blend( 0.3, 0, 0.25 ) ) )
      .addColorStop( 0.3, midColor )
      .addColorStop( 0.325, Color.interpolateRGBA( rightColor, midColor, blend( 0.3, 0.5, 0.325 ) ) )
      .addColorStop( 0.35, Color.interpolateRGBA( rightColor, midColor, blend( 0.3, 0.5, 0.35 ) ) )
      .addColorStop( 0.375, Color.interpolateRGBA( rightColor, midColor, blend( 0.3, 0.5, 0.375 ) ) )
      .addColorStop( 0.4, Color.interpolateRGBA( rightColor, midColor, blend( 0.3, 0.5, 0.4 ) ) )
      .addColorStop( 0.425, Color.interpolateRGBA( rightColor, midColor, blend( 0.3, 0.5, 0.425 ) ) )
      .addColorStop( 0.45, Color.interpolateRGBA( rightColor, midColor, blend( 0.3, 0.5, 0.45 ) ) )
      .addColorStop( 0.475, Color.interpolateRGBA( rightColor, midColor, blend( 0.3, 0.5, 0.475 ) ) )
      .addColorStop( 0.5, rightColor );
  }

  var POSITIVE_GRADIENT = createGradient( BATTERY_MAIN_RADIUS, POSITIVE_SHADOW_COLOR, POSITIVE_HIGHLIGHT_COLOR, POSITIVE_COLOR );
  var NEGATIVE_GRADIENT = createGradient( BATTERY_MAIN_RADIUS, NEGATIVE_SHADOW_COLOR, NEGATIVE_HIGHLIGHT_COLOR, NEGATIVE_COLOR );
  var TERMINAL_GRADIENT = createGradient( BATTERY_POSITIVE_TERMINAL_RADIUS, TERMINAL_SIDE_COLOR, TERMINAL_HIGHLIGHT_COLOR, TERMINAL_SIDE_COLOR );

  /**
   * @constructor
   *
   * @param {boolean} isPositiveDown
   * @param {Object} [options]
   */
  function BatteryGraphicNode( isPositiveDown, options ) {
    Node.call( this );

    // @private {boolean}
    this.isPositiveDown = isPositiveDown;

    var middleY = isPositiveDown ? ( BATTERY_MAIN_HEIGHT - BATTERY_POSITIVE_SIDE_HEIGHT ) : BATTERY_POSITIVE_SIDE_HEIGHT;
    var terminalTopY = isPositiveDown ? 0 : -BATTERY_POSITIVE_TERMINAL_HEIGHT;
    var terminalRadius = isPositiveDown ? BATTERY_NEGATIVE_TERMINAL_RADIUS : BATTERY_POSITIVE_TERMINAL_RADIUS;

    var bottomSideShape = new Shape().ellipticalArc( 0, middleY, BATTERY_MAIN_RADIUS, BATTERY_SECONDARY_RADIUS, 0, 0, Math.PI, false )
                                     .ellipticalArc( 0, BATTERY_MAIN_HEIGHT, BATTERY_MAIN_RADIUS, BATTERY_SECONDARY_RADIUS, 0, Math.PI, 0, true )
                                     .close();
    var topSideShape = new Shape().ellipticalArc( 0, middleY, BATTERY_MAIN_RADIUS, BATTERY_SECONDARY_RADIUS, 0, 0, Math.PI, false )
                                  .ellipticalArc( 0, 0, BATTERY_MAIN_RADIUS, BATTERY_SECONDARY_RADIUS, 0, Math.PI, 0, true )
                                  .close();
    var topShape = new Shape().ellipticalArc( 0, 0, BATTERY_MAIN_RADIUS, BATTERY_SECONDARY_RADIUS, 0, 0, Math.PI * 2, false ).close();
    var terminalTopShape = new Shape().ellipticalArc( 0, terminalTopY, terminalRadius, terminalRadius * BATTERY_PERSPECTIVE_RATIO, 0, 0, Math.PI * 2, false ).close();
    var terminalSideShape = new Shape().ellipticalArc( 0, terminalTopY, terminalRadius, terminalRadius * BATTERY_PERSPECTIVE_RATIO, 0, 0, Math.PI, false )
                                     .ellipticalArc( 0, 0, terminalRadius, terminalRadius * BATTERY_PERSPECTIVE_RATIO, 0, Math.PI, 0, true )
                                     .close();

    // @public {Shape}
    this.terminalShape = terminalTopShape;

    var bottomSide = new Path( bottomSideShape, {
      fill: isPositiveDown ? POSITIVE_GRADIENT : NEGATIVE_GRADIENT,
      stroke: STROKE_COLOR,
      lineWidth: LINE_WIDTH
    } );
    var topSide = new Path( topSideShape, {
      fill: isPositiveDown ? NEGATIVE_GRADIENT : POSITIVE_GRADIENT,
      stroke: STROKE_COLOR,
      lineWidth: LINE_WIDTH
    } );
    var top = new Path( topShape, {
      fill: isPositiveDown ? NEGATIVE_COLOR : POSITIVE_COLOR,
      stroke: STROKE_COLOR,
      lineWidth: LINE_WIDTH
    } );
    var terminal = new Path( terminalTopShape, {
      fill: TERMINAL_COLOR,
      stroke: STROKE_COLOR,
      lineWidth: LINE_WIDTH
    } );

    if ( !isPositiveDown ) {
      this.terminalShape = this.terminalShape.shapeUnion( terminalSideShape );
      terminal.addChild( new Path( terminalSideShape, {
        fill: TERMINAL_GRADIENT,
        stroke: STROKE_COLOR,
        lineWidth: LINE_WIDTH
      } ) );
    }

    this.children = [
      top, topSide, bottomSide, terminal
    ];

    this.mutate( options );
  }

  capacitorLabBasics.register( 'BatteryGraphicNode', BatteryGraphicNode );

  inherit( Node, BatteryGraphicNode, {
    /**
     * Returns (in the local coordinate frame) the location of the center-top of the top terminal.
     * @public
     *
     * @returns {Vector2}
     */
    getTopLocation: function() {
      return new Vector2( 0, this.isPositiveDown ? 0 : -BATTERY_POSITIVE_TERMINAL_HEIGHT );
    }
  } );

  // @public {Node}
  BatteryGraphicNode.POSITIVE_UP = new BatteryGraphicNode( false );
  BatteryGraphicNode.POSITIVE_DOWN = new BatteryGraphicNode( true );

  return BatteryGraphicNode;
} );