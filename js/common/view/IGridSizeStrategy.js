// Copyright 2015, University of Colorado Boulder

/**
 * Interface for all strategies used to determine the size of the grid used to cover a 2D surface with objects.
 *
 * Only one of these strategies is used. The others are kept for historical purposes, so that we know what we tried,
 * why it didn't work, and how we arrived at the final solution.
 *
 * TODO: I am not porting any of the other solutions for now.  They are still here in original Java for documentation
 * and we can port them later if desired.
 *
 * See TestPlateChargeLayout for a test application. NOTE: THIS IS NOT BEING PORTED AT THIS TIME.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 * @author Sam Reid
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Dimension2 = require( 'DOT/Dimension2' );

  function IGridSizeStrategy() {} // TODO: remove this interface?
  inherit( Object, IGridSizeStrategy, {

    /**
     * Gets the size of the grid.
     * The number of cells in the grid may be more or less than numberOfObjects.
     *
     * @param numberOfObjects number of objects to put on the plate
     * @param width           width of the plate
     * @param height          height of the plate
     * @return
     */
    getGridSize: function( numberOfObjects, width, height ) {
      console.log( 'getGridSize should be overridden by descendant classes.' );
    }
  }, {
    /**
     * This factory determines the strategy used throughout the application.
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

  inherit( Object, CCKStrategyWithRounding, {
    getGridSize: function( numberOfObjects, width, height ) {
      var columns = 0;
      var rows = 0;
      if ( numberOfObjects > 0 ) {

        var alpha = Math.sqrt( numberOfObjects / width / height );
        columns = Math.round( width * alpha );

        // compute rows 2 ways, choose the best fit
        var rows1 = Math.round( height * alpha );
        var rows2 = Math.round( numberOfObjects / columns );
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

//  /**
//   * Strategy borrowed from CCK's view.piccolo.lifelike.CapacitorNode (r40140, line 207).
//   * Problem:  This strategy works well when the plate is square, but falls apart
//   * as the plate becomes narrow. When the plate is narrow, this strategy creates
//   * grid sizes where one of the dimensions is zero (eg, 8x0, 0x14).
//   */
//  public static class CCKStrategy implements IGridSizeStrategy {
//
//    public Dimension getGridSize( int numberOfObjects, double width, double height ) {
//    double alpha = Math.sqrt( numberOfObjects / width / height );
//    // casting here may result in some charges being thrown out, but that's OK
//    int columns = (int) ( width * alpha );
//    int rows = (int) ( height * alpha );
//      return new Dimension( columns, rows );
//    }
//  }

//  /**
//   * Workaround for one of the known issues with CCKGridSizeStrategy.
//   * Ensures that we don't have a grid size where exactly one of the dimensions is zero.
//   * Problem: If numberOfCharges is kept constant, a plate with smaller
//   * area but larger aspect ratio will display more charges.
//   * For example, if charges=7, a 5x200mm plate will display 7 charges,
//   * while a 200x200mm plate will only display 4 charges.
//   */
//  public static class ModifiedCCKStrategy extends CCKStrategy {
//
//    public Dimension getGridSize( int numberOfObjects, double width, double height ) {
//      Dimension gridSize = super.getGridSize( numberOfObjects, width, height );
//      if ( gridSize.width == 0 && gridSize.height != 0 ) {
//      gridSize.setSize( 1, numberOfObjects );
//      }
//      else if ( gridSize.width != 0 && gridSize.height == 0 ) {
//        gridSize.setSize( numberOfObjects, 1 );
//      }
//    return gridSize;
//    }
//  }

  return IGridSizeStrategy;

} );
