// Copyright 2002-2015, University of Colorado Boulder

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
  var PlusNode = require( 'SCENERY_PHET/PlusNode' );
  var MinusNode = require( 'SCENERY_PHET/PlusNode' );
  var PhetColorScheme = require( 'SCENERY_PHET/PhetColorScheme' );
  var Color = require( 'SCENERY/util/Color' );
  var Util = require( 'DOT/Util' );

  // constants
  var DEBUG_OUTPUT_ENABLED = false; // developer tool for debugging
  var POSITIVE_CHARGE_COLOR = PhetColorScheme.RED_COLORBLIND;
  var NEGATIVE_CHARGE_COLOR = Color.BLUE;

  /**
   * Convenience constructor for a Positive Charge using constants of this sim.
   */
  function PositiveChargeNode() {
    PlusNode.call( this, { size: CLConstants.NEGATIVE_CHARGE_SIZE, fill: POSITIVE_CHARGE_COLOR } );
  }

  inherit( PlusNode, PositiveChargeNode );

  /**
   * Convenience constructor for a Negative Charge using constants of this sim.
   */
  function NegativeChargeNode() {
    MinusNode.call( this, { size: CLConstants.NEGATIVE_CHARGE_SIZE, fill: NEGATIVE_CHARGE_COLOR } );
  }

  inherit( MinusNode, NegativeChargeNode );

  /**
   * Constructor for a PlateChargeNode.
   *
   * @param {Capacitor} capacitor
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {string} polarity
   * @param {number} maxPlateCharge
   * @param {number} transparency
   * @constructor
   */
  function PlateChargeNode( capacitor, modelViewTransform, polarity, maxPlateCharge, transparency ) {

    Node.call( this );
    var thisNode = this; // extend scope for nested callbacks

    this.capacitor = capacitor;
    this.modelViewTransform = modelViewTransform;
    this.polarity = polarity;
    this.maxPlateCharge = maxPlateCharge;
    this.gridSizeStrategy = IGridSizeStrategy.createStrategy();
    this.transparency = transparency;

    this.parentNode = new Node(); // @private parent node for charges
    this.addChild( this.parentNode );

    // construct and store all charge nodes up front so that they do not need to be constructed in real time.
    /* TODO - this is just a start - come back to clean this up and get working later.
     this.positiveChargeNodes = [];
     this.negativeChargeNodes = [];
     for( var i = 0; i < CLConstants.NUMBER_OF_PLATE_CHARGES.max; i++ ) {
     var newPositiveCharge = new PositiveChargeNode();
     var newNegativeCharge = new NegativeChargeNode();

     newPositiveCharge.opacity = 0;
     newNegativeCharge.opacity = 0;

     this.parentNode.addChild( newPositiveCharge );
     this.parentNode.addChild( newNegativeCharge );

     this.positiveChargeNodes.push( newPositiveCharge );
     this.negativeChargeNodes.push( newNegativeCharge );
     */

    //}

    capacitor.multilink( [ 'plateSize', 'plateSeparation', 'platesVoltage' ], function() {
      if ( thisNode.isVisible() ) {
        thisNode.update();
      }
    } );
  }

  inherit( Node, PlateChargeNode, {

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
      Node.prototype.setVisible.call( this, visible );
      if ( visible ) {
        this.update();
      }
    },

    /**
     * Updates the view to match the model.  Charges are arranged in a grid.
     */
    update: function() {
      var plateCharge = this.getPlateCharge();
      var numberOfCharges = this.getNumberOfCharges( plateCharge, this.maxPlateCharge );

      //console.log( numberOfCharges );

      // remove existing charges by setting opacity to zero
      //this.parentNode.children.forEach( function( child ) {
      //  child.opacity = 0;
      //} );
      this.parentNode.removeAllChildren();

      // compute grid dimensions
      if ( numberOfCharges > 0 ) {

        var zMargin = this.modelViewTransform.viewToModelDeltaXY( new PositiveChargeNode().bounds.width, 0 ).x;

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

        //var positiveChargeNumber = 0;
        //var negativeChargeNumber = 0;

        // populate the grid
        for ( var row = 0; row < rows; row++ ) {
          for ( var column = 0; column < columns; column++ ) {

            // add a charge
            //var chargeNode;
            //if( this.isPositivelyCharged() ) {
            //  chargeNode = this.positiveChargeNodes[ positiveChargeNumber ];
            //  positiveChargeNumber++;
            //}
            //else {
            //  chargeNode = this.negativeChargeNodes[ negativeChargeNumber ];
            //  negativeChargeNumber++;
            //}

            var chargeNode = this.isPositivelyCharged() ? new PositiveChargeNode() : new NegativeChargeNode();

            //chargeNode.opacity = 1 - this.transparency; // TODO: test this.
            //chargeNode.opacity = 0.99; // Make desired chargeNode visible.

            this.parentNode.addChild( chargeNode );

            // position the charge in cell in the grid
            var x = this.getContactXOrigin() + xOffset + ( column * dx );
            var y = 0;
            var z = -( gridDepth / 2 ) + ( zMargin / 2 ) + zOffset + ( row * dz );
            if ( numberOfCharges === 1 ) {
              z -= dz / 6; //#2935, so that single charge is not obscured by wire connected to center of top plate
            }
            chargeNode.center = this.modelViewTransform.modelToViewXYZ( x, y, z );
          }
        }

        // debug output
        if ( DEBUG_OUTPUT_ENABLED ) {
          console.log( numberOfCharges + " charges computed, " + ( rows * columns ) + " charges displayed" );
        }
      }
    },

    /**
     * Computes number of charges, linearly proportional to plate charge.
     * All non-zero values below some minimum are mapped to 1 charge.
     *
     * @param {number} plateCharge
     * @param {number} maxPlateCharge
     * @return {number} numberOfCharges
     */
    getNumberOfCharges: function( plateCharge, maxPlateCharge ) {
      var absCharge = Math.abs( plateCharge );
      var numberOfCharges = Util.toFixedNumber( CLConstants.NUMBER_OF_PLATE_CHARGES.max * ( absCharge / maxPlateCharge ), 0 );
      if ( absCharge > 0 && numberOfCharges < CLConstants.NUMBER_OF_PLATE_CHARGES.min ) {
        numberOfCharges = CLConstants.NUMBER_OF_PLATE_CHARGES.min;
      }
      return numberOfCharges;
    }
  }, {

    /**
     * Factory function for an AirPlateChargeNode.
     */
    AirPlateChargeNode: function( capacitor, modelViewTransform, polarity, maxPlateCharge ) {
      return new AirPlateChargeNode( capacitor, modelViewTransform, polarity, maxPlateCharge );
    }
  } );

  /**
   * Portion of the plate charge due to the air.
   * Charges appear on the portion of the plate that is in contact with air (not in contact with the dielectric.)
   *
   * @param {Capacitor} capacitor
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {string} polarity
   * @param {number} maxPlateCharge
   * @constructor
   */
  function AirPlateChargeNode( capacitor, modelViewTransform, polarity, maxPlateCharge ) {

    PlateChargeNode.call( this, capacitor, modelViewTransform, polarity, maxPlateCharge, 1 );

  }

  inherit( PlateChargeNode, AirPlateChargeNode, {

    // Gets the portion of the plate charge due to air.
    getPlateCharge: function() {
      return this.capacitor.getAirPlateCharge();
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
      //return Math.min( this.capacitor.dielectricOffset, this.capacitor.plateSize.width );
    }
  } );

  return PlateChargeNode;

} );