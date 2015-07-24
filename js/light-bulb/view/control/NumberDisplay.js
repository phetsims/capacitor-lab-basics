// Copyright 2002-2015, University of Colorado Boulder

/**
 * Displays a Property of type {number} in a background rectangle.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 */
define( function( require ) {
  'use strict';

  // modules
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var StringUtils = require( 'PHETCOMMON/util/StringUtils' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Util = require( 'DOT/Util' );
  var ScientificNotationNode = require( 'SCENERY_PHET/ScientificNotationNode' );

  /**
   * @param {Property.<number>} numberProperty
   * @param {Range} numberRange
   * @param {string} units
   * @param {string} pattern
   * @param {Object} [options]
   * @constructor
   */
  function NumberDisplay( numberProperty, numberRange, units, pattern, options ) {

    options = _.extend( {
      font: new PhetFont( 25 ),
      decimalPlaces: 0,
      xMargin: 16,
      yMargin: 2,
      cornerRadius: 0,
      numberFill: 'black',
      backgroundFill: 'white',
      backgroundStroke: 'lightGray',
      mantissaDecimalPlaces: 3
    }, options );

    var valueNode = new ScientificNotationNode( numberProperty, options );
    var unitsNode = new Text( units, options );
    var background = new Rectangle( 0, 0, valueNode.width  + unitsNode.width + 2 * options.xMargin, valueNode.height + 2 * options.yMargin, options.cornerRadius, options.cornerRadius, {
      fill: options.backgroundFill,
      stroke: options.backgroundStroke
    } );
    valueNode.leftCenter = background.leftCenter;
    unitsNode.leftBottom = valueNode.rightBottom.plusXY( options.xMargin, 0 );

    options.children = [ background, valueNode, unitsNode ];

    // display the value
    var numberObserver = function( value ) {
      valueNode.text = StringUtils.format( pattern, Util.toFixed( value, options.decimalPlaces ), units );
      valueNode.left = background.left + options.xMargin; // right justified
    };
    numberProperty.link( numberObserver );

    // @private called by dispose
    this.disposeNumberDisplay = function() {
      numberProperty.unlink( numberObserver );
    };

    Node.call( this, options );
  }

  return inherit( Node, NumberDisplay, {

    dispose: function() {
      this.disposeNumberDisplay();
    }
  } );
} );