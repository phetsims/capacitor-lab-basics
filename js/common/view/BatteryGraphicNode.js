// Copyright 2017-2022, University of Colorado Boulder

/**
 * Nodes for displaying a battery (either positive end up or down)
 *
 * @author Jonathan Olson (PhET Interactive Simulations)
 */

import Vector2 from '../../../../dot/js/Vector2.js';
import { Shape } from '../../../../kite/js/imports.js';
import { Color, LinearGradient, Node, Path } from '../../../../scenery/js/imports.js';
import capacitorLabBasics from '../../capacitorLabBasics.js';

const BATTERY_PERSPECTIVE_RATIO = 0.304;
const BATTERY_MAIN_HEIGHT = 511;
const BATTERY_MAIN_RADIUS = 158;
const BATTERY_SECONDARY_RADIUS = BATTERY_MAIN_RADIUS * BATTERY_PERSPECTIVE_RATIO;
const BATTERY_POSITIVE_TERMINAL_RADIUS = 55;
const BATTERY_POSITIVE_TERMINAL_HEIGHT = 26;
const BATTERY_POSITIVE_SIDE_HEIGHT = 152;
const BATTERY_NEGATIVE_TERMINAL_RADIUS = 81;

const POSITIVE_COLOR = new Color( 251, 176, 59 );
const POSITIVE_HIGHLIGHT_COLOR = Color.WHITE;
const POSITIVE_SHADOW_COLOR = POSITIVE_COLOR;

const NEGATIVE_COLOR = new Color( 53, 53, 53 );
const NEGATIVE_HIGHLIGHT_COLOR = new Color( 142, 142, 142 );
const NEGATIVE_SHADOW_COLOR = Color.BLACK;

const TERMINAL_COLOR = new Color( 190, 190, 190 );
const TERMINAL_SIDE_COLOR = new Color( 168, 168, 168 );
const TERMINAL_HIGHLIGHT_COLOR = new Color( 227, 227, 227 );

const STROKE_COLOR = new Color( 33, 33, 33 );
const LINE_WIDTH = 2;

function createGradient( radius, leftColor, midColor, rightColor ) {
  function blend( highlightPosition, farPosition, position ) {
    const distance = Math.abs( ( farPosition - position ) / ( highlightPosition - farPosition ) );
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

const POSITIVE_GRADIENT = createGradient( BATTERY_MAIN_RADIUS, POSITIVE_SHADOW_COLOR, POSITIVE_HIGHLIGHT_COLOR, POSITIVE_COLOR );
const NEGATIVE_GRADIENT = createGradient( BATTERY_MAIN_RADIUS, NEGATIVE_SHADOW_COLOR, NEGATIVE_HIGHLIGHT_COLOR, NEGATIVE_COLOR );
const TERMINAL_GRADIENT = createGradient( BATTERY_POSITIVE_TERMINAL_RADIUS, TERMINAL_SIDE_COLOR, TERMINAL_HIGHLIGHT_COLOR, TERMINAL_SIDE_COLOR );

class BatteryGraphicNode extends Node {
  /**
   * @param {boolean} isPositiveDown
   * @param {Object} [options]
   */
  constructor( isPositiveDown, options ) {
    super();

    // @private {boolean}
    this.isPositiveDown = isPositiveDown;

    const middleY = isPositiveDown ? ( BATTERY_MAIN_HEIGHT - BATTERY_POSITIVE_SIDE_HEIGHT ) : BATTERY_POSITIVE_SIDE_HEIGHT;
    const terminalTopY = isPositiveDown ? 0 : -BATTERY_POSITIVE_TERMINAL_HEIGHT;
    const terminalRadius = isPositiveDown ? BATTERY_NEGATIVE_TERMINAL_RADIUS : BATTERY_POSITIVE_TERMINAL_RADIUS;

    const bottomSideShape = new Shape().ellipticalArc( 0, middleY, BATTERY_MAIN_RADIUS, BATTERY_SECONDARY_RADIUS, 0, 0, Math.PI, false )
      .ellipticalArc( 0, BATTERY_MAIN_HEIGHT, BATTERY_MAIN_RADIUS, BATTERY_SECONDARY_RADIUS, 0, Math.PI, 0, true )
      .close();
    const topSideShape = new Shape().ellipticalArc( 0, middleY, BATTERY_MAIN_RADIUS, BATTERY_SECONDARY_RADIUS, 0, 0, Math.PI, false )
      .ellipticalArc( 0, 0, BATTERY_MAIN_RADIUS, BATTERY_SECONDARY_RADIUS, 0, Math.PI, 0, true )
      .close();
    const topShape = new Shape().ellipticalArc( 0, 0, BATTERY_MAIN_RADIUS, BATTERY_SECONDARY_RADIUS, 0, 0, Math.PI * 2, false ).close();
    const terminalTopShape = new Shape().ellipticalArc( 0, terminalTopY, terminalRadius, terminalRadius * BATTERY_PERSPECTIVE_RATIO, 0, 0, Math.PI * 2, false ).close();
    const terminalSideShape = new Shape().ellipticalArc( 0, terminalTopY, terminalRadius, terminalRadius * BATTERY_PERSPECTIVE_RATIO, 0, 0, Math.PI, false )
      .ellipticalArc( 0, 0, terminalRadius, terminalRadius * BATTERY_PERSPECTIVE_RATIO, 0, Math.PI, 0, true )
      .close();

    // @public {Shape}
    this.terminalShape = terminalTopShape;

    const bottomSide = new Path( bottomSideShape, {
      fill: isPositiveDown ? POSITIVE_GRADIENT : NEGATIVE_GRADIENT,
      stroke: STROKE_COLOR,
      lineWidth: LINE_WIDTH
    } );
    const topSide = new Path( topSideShape, {
      fill: isPositiveDown ? NEGATIVE_GRADIENT : POSITIVE_GRADIENT,
      stroke: STROKE_COLOR,
      lineWidth: LINE_WIDTH
    } );
    const top = new Path( topShape, {
      fill: isPositiveDown ? NEGATIVE_COLOR : POSITIVE_COLOR,
      stroke: STROKE_COLOR,
      lineWidth: LINE_WIDTH
    } );
    const terminal = new Path( terminalTopShape, {
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

  /**
   * Returns (in the local coordinate frame) the position of the center-top of the top terminal.
   * @public
   *
   * @returns {Vector2}
   */
  getTopPosition() {
    return new Vector2( 0, this.isPositiveDown ? 0 : -BATTERY_POSITIVE_TERMINAL_HEIGHT );
  }
}

capacitorLabBasics.register( 'BatteryGraphicNode', BatteryGraphicNode );

// @public {Node}
BatteryGraphicNode.POSITIVE_UP = new BatteryGraphicNode( false );
BatteryGraphicNode.POSITIVE_DOWN = new BatteryGraphicNode( true );

export default BatteryGraphicNode;
