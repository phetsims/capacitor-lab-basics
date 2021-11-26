// Copyright 2016-2021, University of Colorado Boulder

/**
 *
 * The bar meter node is composed of a rectangular bar graph and a value node.
 * The composite parts are added to layout boxes in the BarMeterPanel so that
 * alignment can be perfectly set.
 *
 * @author Jesse Greenberg (PhET Interactive Simulations)
 */

import Dimension2 from '../../../../../dot/js/Dimension2.js';
import { Rectangle } from '../../../../../scenery/js/imports.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';

// constants
const BASE_LINE_LENGTH = 25;
const BAR_SIZE = new Dimension2( 280, 18 ); // Controls width and height of the bars
const BASE_LINE_OFFSET = ( BASE_LINE_LENGTH - BAR_SIZE.height ) / 2;
const BAR_STROKE_COLOR = 'black';
const BAR_LINE_WIDTH = 1;

class BarNode extends Rectangle {
  /**
   * The bar which indicates the magnitude of the value being read by the meter. Origin is
   * at upper left of track.
   *
   * @param {string} barColor
   * @param {number} value
   * @param {number} maxValue
   */
  constructor( barColor, value, maxValue ) {
    assert && assert( value >= 0, `value must be >= 0 : ${value}` );
    super( 0, 0, BAR_SIZE.width, BAR_SIZE.height, {
      fill: barColor,
      stroke: BAR_STROKE_COLOR,
      lineWidth: BAR_LINE_WIDTH
    } );

    // @private - see https://github.com/phetsims/capacitor-lab-basics/issues/287
    this.transparentWorkaroundBar = new Rectangle( 0, 0, BAR_SIZE.width, BAR_SIZE.height, {
      fill: 'transparent'
    } );
    this.addChild( this.transparentWorkaroundBar );

    // @public
    this.value = value;
    this.maxValue = maxValue;
    this.barSize = BAR_SIZE;
    this.update();
  }


  /**
   * Set bar value
   * @public
   *
   * @param {number} value
   */
  setValue( value ) {

    assert && assert( value >= 0, `value must be >= 0 : ${value}` );

    if ( value !== this.value ) {
      this.value = value;
      this.update();
    }
  }

  /**
   * Update the bar
   * @public
   */
  update() {
    const percent = Math.min( 1, Math.abs( this.value ) / this.maxValue );
    const x = ( 1 - percent ) * BAR_SIZE.width;
    const width = BAR_SIZE.width - x;
    this.setRect( 0, -BASE_LINE_LENGTH / 2 + BASE_LINE_OFFSET, width, BAR_SIZE.height );
    this.transparentWorkaroundBar.setRect( width, -BASE_LINE_LENGTH / 2 + BASE_LINE_OFFSET, BAR_SIZE.width, BAR_SIZE.height );
  }
}

capacitorLabBasics.register( 'BarNode', BarNode );

export default BarNode;