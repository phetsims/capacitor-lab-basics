// Copyright 2015, University of Colorado Boulder

/**
 * Base class for representation of plate charge.  Plate charge is represented as an integer number of '+' or '-'
 * symbols. These symbols are distributed across some portion of the plate's top face.
 *
 * All model coordinates are relative to the capacitor's local coordinate frame.
 *
 * NOTE: Skipping the port of DielectricPlateChargeNode for now.  Without dielectrics this should not be needed.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var CLConstants = require( 'CAPACITOR_LAB_BASICS/common/CLConstants' );
  var IGridSizeStrategy = require( 'CAPACITOR_LAB_BASICS/common/view/IGridSizeStrategy' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var Util = require( 'DOT/Util' );
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // constants
  var DEBUG_OUTPUT_ENABLED = false; // developer tool for debugging
  var POSITIVE_CHARGE_COLOR = PhetColorScheme.RED_COLORBLIND.computeCSS(); // CSS passed into context fillStyle
  var NEGATIVE_CHARGE_COLOR = 'blue';

  /**
   * Draw a positive charge with canvas.  'Plus' sign is painted with two overlapping rectangles around a center
   * location.
   *
   * TODO: THIS COULD BE COLLAPSED WITH addNegativeCharge INTO A SINGLE FUNCTION.  COULD BE A CLEANER SOLUTION.
   *
   * @param {Vector2} location - center location of the charge in view space
   * @param {CanvasRenderingContext2D} context - context for the canvas methods
   */
  function addPositiveCharge( location, context ) {
    var chargeWidth = CLConstants.NEGATIVE_CHARGE_SIZE.width;
    var chargeHeight = CLConstants.NEGATIVE_CHARGE_SIZE.height;

    context.fillStyle = POSITIVE_CHARGE_COLOR;
    context.fillRect( location.x - chargeWidth / 2, location.y - chargeHeight / 2, chargeWidth, chargeHeight );
    context.fillRect( location.x - chargeHeight / 2, location.y - chargeWidth / 2, chargeHeight, chargeWidth );

  }

  /**
   * Draw a negative charge with canvas.  'Minus' sign is painted with a single rectangle around a center location.
   *
   * @param {Vector2} location
   * @param {CanvasRenderingContext2D} context
   */
  function addNegativeCharge( location, context ) {
    var chargeWidth = CLConstants.NEGATIVE_CHARGE_SIZE.width;
    var chargeHeight = CLConstants.NEGATIVE_CHARGE_SIZE.height;

    context.fillStyle = NEGATIVE_CHARGE_COLOR;
    context.fillRect( location.x - chargeWidth / 2, location.y - chargeHeight, chargeWidth, chargeHeight );
  }

  /**
   * Constructor for a PlateChargeNode.
   *
   * @param {Capacitor} capacitor
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {string} polarity
   * @param {number} maxPlateCharge
   * @param {number} transparency
   * @param {Bounds2} canvasBounds
   * @constructor
   */
  function PlateChargeNode( capacitor, modelViewTransform, polarity, maxPlateCharge, transparency, canvasBounds ) {

    CanvasNode.call( this, { canvasBounds: canvasBounds } );
    var thisNode = this; // extend scope for nested callbacks

    // @private
    this.capacitor = capacitor;
    this.modelViewTransform = modelViewTransform;
    this.polarity = polarity;
    this.maxPlateCharge = maxPlateCharge;
    this.gridSizeStrategy = IGridSizeStrategy.createStrategy();
    this.transparency = transparency;

    this.parentNode = new Node(); // @private parent node for charges
    this.addChild( this.parentNode );

    capacitor.multilink( [ 'plateSize', 'plateSeparation', 'platesVoltage' ], function() {
      if ( thisNode.isVisible() ) {
        thisNode.invalidatePaint();
      }
    } );
  }

  capacitorLabBasics.register( 'PlateChargeNode', PlateChargeNode );
  
  inherit( CanvasNode, PlateChargeNode, {

    /**
     * Charge on the portion of the plate that this node handles.
     */
    getPlateCharge: function() {
      console.log( 'getPlateCharge function should be implemented in descendant classes.' );
    },

    /**
     * X offset of the portion of the plate that this node handles.
     * This is relative to the plate's origin, and specified in model coordinates.
     */
    getContactXOrigin: function() {
      console.log( 'getContactXOrigin must be overridden  in descendant classes. ' );
    },

    /**
     * Width of the portion of the plate that this node handles.
     * Specified in model coordinates.
     */
    getContactWidth: function() {
      console.log( 'getContactWidth should be overridden in descendant classes.' );
    },

    isPositivelyCharged: function() {
      return ( this.getPlateCharge() >= 0 && this.polarity === CLConstants.POLARITY.POSITIVE ) || ( this.getPlateCharge() < 0 && this.polarity === CLConstants.POLARITY.NEGATIVE );
    },

    /**
     * Update the node when it becomes visible.
     *
     * @param {boolean} visible
     */
    setVisible: function( visible ) {
      CanvasNode.prototype.setVisible.call( this, visible );
      if ( visible ) {
        this.invalidatePaint();
      }
    },

    /**
     * Updates the view to match the model.  Charges are arranged in a grid.
     *
     * @param {CanvasRenderingContext2D} context
     */
    paintCanvas: function( context ) {

      var plateCharge = this.getPlateCharge();
      var numberOfCharges = this.getNumberOfCharges( plateCharge, this.maxPlateCharge );

      if ( numberOfCharges > 0 ) {

        var zMargin = this.modelViewTransform.viewToModelDeltaXY( CLConstants.NEGATIVE_CHARGE_SIZE.width, 0 ).x;

        var gridWidth = this.getContactWidth(); // contact between plate and dielectric
        var gridDepth = this.capacitor.plateSize.depth - ( 2 * zMargin );

        // grid dimensions
        var gridSize = this.gridSizeStrategy.getGridSize( numberOfCharges, gridWidth, gridDepth );
        var rows = gridSize.height;
        var columns = gridSize.width;

        // distance between cells
        var dx = gridWidth / columns;
        var dz = gridDepth / rows;

        // offset to move us to the center of cells
        var xOffset = dx / 2;
        var zOffset = dz / 2;

        // populate the grid
        for ( var row = 0; row < rows; row++ ) {
          for ( var column = 0; column < columns; column++ ) {

            // calculate center position for the charge in cell of the grid
            var x = this.getContactXOrigin() + xOffset + ( column * dx );
            var y = 0;
            var z = -( gridDepth / 2 ) + ( zMargin / 2 ) + zOffset + ( row * dz );
            if ( numberOfCharges === 1 ) {
              z -= dz / 6; //#2935, so that single charge is not obscured by wire connected to center of top plate
            }
            var centerPosition = this.modelViewTransform.modelToViewXYZ( x, y, z );

            // add the signed charge to the grid
            this.isPositivelyCharged() ? addPositiveCharge( centerPosition, context ) : addNegativeCharge( centerPosition, context );

          }
        }

        // debug output
        if ( DEBUG_OUTPUT_ENABLED ) {
          console.log( numberOfCharges + ' charges computed, ' + ( rows * columns ) + ' charges displayed' );
        }
      }
    },

    /**
     * Computes number of charges, linearly proportional to plate charge.  If plate charge is less than half of an
     * electron charge, number of charges is zero.
     *
     * @param {number} plateCharge
     * @param {number} maxPlateCharge
     * @return {number} numberOfCharges
     */
    getNumberOfCharges: function( plateCharge, maxPlateCharge ) {
      var absCharge = Math.abs( plateCharge );
      //console.log( absCharge );
      var numberOfCharges = Util.toFixedNumber( CLConstants.NUMBER_OF_PLATE_CHARGES.max * ( absCharge / maxPlateCharge ), 0 );
      if( absCharge > 0 && numberOfCharges < CLConstants.NUMBER_OF_PLATE_CHARGES.min ) {
        numberOfCharges = CLConstants.NUMBER_OF_PLATE_CHARGES.min;
      }
      return numberOfCharges;
    }
  }, {

    /**
     * Factory function for an AirPlateChargeNode.
     */
    AirPlateChargeNode: function( capacitor, modelViewTransform, polarity, maxPlateCharge, canvasBounds ) {
      return new AirPlateChargeNode( capacitor, modelViewTransform, polarity, maxPlateCharge, canvasBounds );
    }
  } );

  /**
   * Portion of the plate charge due to the air.
   * Charges appear on the portion of the plate that is in contact with air (not in contact with the dielectric.)
   *
   * @param {Capacitor} capacitor
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {string} polarity
   * @param {number} maxPlateCharge,
   * @param {Bounds2} canvasBounds
   * @constructor
   */
  function AirPlateChargeNode( capacitor, modelViewTransform, polarity, maxPlateCharge, canvasBounds ) {

    PlateChargeNode.call( this, capacitor, modelViewTransform, polarity, maxPlateCharge, 1, canvasBounds );

  }

  inherit( PlateChargeNode, AirPlateChargeNode, {

    // Gets the portion of the plate charge due to air.
    getPlateCharge: function() {
      return this.capacitor.getTotalPlateCharge();
    },

    // Gets the x offset (relative to the plate origin) of the portion of the plate that is in contact with air.
    getContactXOrigin: function() {
      return -this.capacitor.plateSize.width / 2;
    },

    /**
     * Gets the width of the portion of the plate that is in contact with air.
     * NOTE: This should always return the width of the capacitor plates since dielectrics have not been introduced
     * yet.
     *
     * @returns {number}
     */
    getContactWidth: function() {
      return this.capacitor.plateSize.width;
    }
  } );

  return PlateChargeNode;

} );