// Copyright 2016, University of Colorado Boulder

/**
 *
 * The bar meter node is composed of a rectangular bar graph and a value node.  The composite parts are added to layout
 * boxes in the BarMeterPanel so that alignment can be perfectly set.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // phet-io modules
  // var TNode = require( 'ifphetio!PHET_IO/types/scenery/nodes/TNode' );

  // constants
  var BASE_LINE_LENGTH = 25;
  var BAR_SIZE = new Dimension2( 270, 18 ); // Controls width and height of the bars
  var BASE_LINE_OFFSET = ( BASE_LINE_LENGTH - BAR_SIZE.height ) / 2;
  var BAR_STROKE_COLOR = 'black';
  var BAR_LINE_WIDTH = 1;


  /**
   * Constructor for a BarNode. The bar which indicates the magnitude of the value being read by the meter. Origin is
   * at upper left of track.
   *
   * @param {string} barColor
   * @param {number} maxValue
   * @param {number} value
   * @constructor
   */
  function BarNode( barColor, value, maxValue ) {

    assert && assert( value >= 0, 'value must be >= 0 : ' + value );

    this.value = value;
    this.maxValue = maxValue;
    this.barSize = BAR_SIZE; // @public

    Rectangle.call( this, 0, 0, BAR_SIZE.width, BAR_SIZE.height, {
      fill: barColor,
      stroke: BAR_STROKE_COLOR,
      lineWidth: BAR_LINE_WIDTH
    } );

    this.update();

  }

  capacitorLabBasics.register( 'BarNode', BarNode );

  return inherit( Rectangle, BarNode, {

    setValue: function( value ) {

      assert && assert( value >= 0, 'value must be >= 0 : ' + value );

      if ( value !== this.value ) {
        this.value = value;
        this.update();
      }
    },

    update: function() {
      var percent = Math.min( 1, Math.abs( this.value ) / this.maxValue );
      var x = ( 1 - percent ) * BAR_SIZE.width;
      var width = BAR_SIZE.width - x;
      this.setRect( 0, -BASE_LINE_LENGTH / 2 + BASE_LINE_OFFSET, width, BAR_SIZE.height );
    }

  } );
} );
