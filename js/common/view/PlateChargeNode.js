// Copyright 2016, University of Colorado Boulder

/**
 * Base class for representation of plate charge.  Plate charge is represented
 * as an integer number of '+' or '-' symbols. These symbols are distributed
 * across some portion of the plate's top face.
 *
 * All model coordinates are relative to the capacitor's local coordinate frame.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg
 * @author Andrew Adare
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var IGridSizeStrategy = require( 'CAPACITOR_LAB_BASICS/common/view/IGridSizeStrategy' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var Util = require( 'DOT/Util' );
  var CanvasNode = require( 'SCENERY/nodes/CanvasNode' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var Property = require( 'AXON/Property' );

  // constants
  var DEBUG_OUTPUT_ENABLED = false; // developer tool for debugging
  var POSITIVE_CHARGE_COLOR = PhetColorScheme.RED_COLORBLIND.computeCSS(); // CSS passed into context fillStyle
  var NEGATIVE_CHARGE_COLOR = 'blue';

  /**
   * Draw a positive charge with canvas.  'Plus' sign is painted with two
   * overlapping rectangles around a center location.
   * @private
   *
   * @param {Vector2} location - center location of the charge in view space
   * @param {CanvasRenderingContext2D} context - context for the canvas methods
   */
  function addPositiveCharge( location, context ) {
    var chargeWidth = CLBConstants.NEGATIVE_CHARGE_SIZE.width;
    var chargeHeight = CLBConstants.NEGATIVE_CHARGE_SIZE.height;

    context.fillStyle = POSITIVE_CHARGE_COLOR;
    context.fillRect( location.x - chargeWidth / 2, location.y - chargeHeight / 2, chargeWidth, chargeHeight );
    context.fillRect( location.x - chargeHeight / 2, location.y - chargeWidth / 2, chargeHeight, chargeWidth );
  }

  /**
   * Draw a negative charge with canvas.  'Minus' sign is painted with a single
   * rectangle around a center location.
   * @private
   *
   * @param {Vector2} location
   * @param {CanvasRenderingContext2D} context
   */
  function addNegativeCharge( location, context ) {
    var chargeWidth = CLBConstants.NEGATIVE_CHARGE_SIZE.width;
    var chargeHeight = CLBConstants.NEGATIVE_CHARGE_SIZE.height;

    context.fillStyle = NEGATIVE_CHARGE_COLOR;
    context.fillRect( location.x - chargeWidth / 2, location.y, chargeWidth, chargeHeight );
  }

  /**
   * Constructor for a PlateChargeNode.
   *
   * @param {Capacitor} capacitor
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Object} options
   * @constructor
   */
  function PlateChargeNode( capacitor, modelViewTransform, options ) {

    var defaultOptions = {
      polarity: CLBConstants.POLARITY.POSITIVE,
      maxPlateCharge: Infinity,
      opacity: 1.0,
      canvasBounds: null // Bounds2
    };

    options = _.extend( {}, defaultOptions, options );

    CanvasNode.call( this, {
      canvasBounds: options.canvasBounds
    } );
    var self = this; // extend scope for nested callbacks

    // @private
    this.capacitor = capacitor;
    this.modelViewTransform = modelViewTransform;
    this.polarity = options.polarity;
    this.maxPlateCharge = options.maxPlateCharge;
    this.gridSizeStrategy = IGridSizeStrategy.createStrategy();
    this.opacity = options.opacity;

    this.parentNode = new Node(); // @private parent node for charges
    this.addChild( this.parentNode );

    // No disposal required because the capacitor is persistent
    Property.multilink( [
      capacitor.plateSizeProperty,
      capacitor.plateSeparationProperty,
      capacitor.plateVoltageProperty
    ], function() {
      if ( self.isVisible() ) {
        self.invalidatePaint();
      }
    } );
  }

  capacitorLabBasics.register( 'PlateChargeNode', PlateChargeNode );

  return inherit( CanvasNode, PlateChargeNode, {

    /**
     * Charge on the portion of the plate that this node handles.
     * @public
     */
    getPlateCharge: function() {
      assert && assert( false, 'getPlateCharge function should be implemented in descendant classes.' );
    },

    /**
     * X offset of the portion of the plate that this node handles.
     * This is relative to the plate's origin, and specified in model coordinates.
     * @public
     */
    getContactXOrigin: function() {
      assert && assert( false, 'getContactXOrigin must be overridden  in descendant classes. ' );
    },

    /**
     * Width of the portion of the plate that this node handles.
     * Specified in model coordinates.
     * @public
     */
    getContactWidth: function() {
      assert && assert( false, 'getContactWidth should be overridden in descendant classes.' );
    },

    /**
     * Returns true if plate is positively charged
     *
     * @return {Boolean}
     * @public
     */
    isPositivelyCharged: function() {
      return ( this.getPlateCharge() >= 0 && this.polarity === CLBConstants.POLARITY.POSITIVE ) ||
        ( this.getPlateCharge() < 0 && this.polarity === CLBConstants.POLARITY.NEGATIVE );
    },

    /**
     * Update the node when it becomes visible.
     *
     * @param {boolean} visible
     * @public
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
     * @public
     */
    paintCanvas: function( context ) {

      var plateCharge = this.getPlateCharge();
      var numberOfCharges = this.getNumberOfCharges( plateCharge, this.maxPlateCharge );

      if ( numberOfCharges > 0 ) {

        var zMargin = this.modelViewTransform.viewToModelDeltaXY( CLBConstants.NEGATIVE_CHARGE_SIZE.width, 0 ).x;

        var gridWidth = this.getContactWidth(); // contact between plate and vacuum gap
        var gridDepth = this.capacitor.plateSizeProperty.value.depth - ( 2 * zMargin );

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
            this.isPositivelyCharged() ?
              addPositiveCharge( centerPosition, context ) : addNegativeCharge( centerPosition, context );

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
     * @returns {number} numberOfCharges
     * @public
     */
    getNumberOfCharges: function( plateCharge, maxPlateCharge ) {
      var absCharge = Math.abs( plateCharge );
      var numberOfCharges = Util.toFixedNumber( CLBConstants.NUMBER_OF_PLATE_CHARGES.max * ( absCharge / maxPlateCharge ), 0 );
      if ( absCharge > 0 && numberOfCharges < CLBConstants.NUMBER_OF_PLATE_CHARGES.min ) {
        numberOfCharges = CLBConstants.NUMBER_OF_PLATE_CHARGES.min;
      }
      return numberOfCharges;
    }

  } );
} );
