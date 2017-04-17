// Copyright 2016, University of Colorado Boulder

/**
 * Interface for all strategies used to determine the size of the grid used to cover a 2D surface with objects.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var Dimension2 = require( 'DOT/Dimension2' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Util = require( 'DOT/Util' );

  function IGridSizeStrategy() {}

  capacitorLabBasics.register( 'IGridSizeStrategy', IGridSizeStrategy );

  inherit( Object, IGridSizeStrategy, {

    /**
     * Gets the size of the grid.
     * The number of cells in the grid may be more or less than numberOfObjects.
     * @private
     *
     * @param numberOfObjects number of objects to put on the plate
     * @param width           width of the plate
     * @param height          height of the plate
     */
    getGridSize: function( numberOfObjects, width, height ) {
      assert && assert( false, 'getGridSize should be overridden by descendant classes.' );
    }
  }, {
    /**
     * This factory determines the strategy used throughout the application.
     * @public
     */
    createStrategy: function() { return new CCKStrategyWithRounding(); }
  } );

  /**
   * Strategy developed by Sam Reid, here's how he described it:
   * The main change is to use rounding instead of clamping to get the rows and columns.
   * Also, for one row or column, it should be exact (similar to the intent of the ModifiedCCKGridSizeStrategy subclass).
   * It looks like it exhibits better (though understandably imperfect) behavior in the problem cases.
   * Also, as opposed to the previous versions, the visible number of objects can exceed the specified numberOfObjects.
   * This may be the best we can do if we are showing a rectangular grid of charges.  We could get the count exactly
   * right if we show some (or one) of the columns having different numbers of charges than the others, but then
   * it may look nonuniform (and would require more extensive changes to the sim).
   *
   * @author Sam Reid
   */
  function CCKStrategyWithRounding() {}

  capacitorLabBasics.register( 'CCKStrategyWithRounding', CCKStrategyWithRounding );

  inherit( Object, CCKStrategyWithRounding, {
    /**
     * @param  {number} numberOfObjects [description]
     * @param  {number} width
     * @param  {number} height
     * @returns {Dimension2}
     * @private
     */
    getGridSize: function( numberOfObjects, width, height ) {
      var columns = 0;
      var rows = 0;
      if ( numberOfObjects > 0 ) {

        var alpha = Math.sqrt( numberOfObjects / width / height );
        columns = Util.roundSymmetric( width * alpha );

        // compute rows 2 ways, choose the best fit
        var rows1 = Util.roundSymmetric( height * alpha );
        var rows2 = Util.roundSymmetric( numberOfObjects / columns );
        if ( rows1 !== rows2 ) {
          var error1 = Math.abs( numberOfObjects - ( rows1 * columns ) );
          var error2 = Math.abs( numberOfObjects - ( rows2 * columns ) );
          rows = ( error1 < error2 ) ? rows1 : rows2;
        }
        else {
          rows = rows1;
        }

        // handle boundary cases
        if ( columns === 0 ) {
          columns = 1;
          rows = numberOfObjects;
        }
        else if ( rows === 0 ) {
          rows = 1;
          columns = numberOfObjects;
        }
      }
      assert && assert( columns >= 0 && rows >= 0, 'There must be at least 1 column or 1 row of charges.' );
      return new Dimension2( columns, rows );
    }
  } );

  return IGridSizeStrategy;

} );
