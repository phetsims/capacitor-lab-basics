// Copyright 2002-2015, University of Colorado Boulder

/**
 * Visual representation of a capacitor.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var Node = require( 'SCENERY/nodes/Node' );
  var inherit = require( 'PHET_CORE/inherit' );
  var PlateNode = require( 'CAPACITOR_LAB_BASICS/common/view/PlateNode' );
  var EFieldNode = require( 'CAPACITOR_LAB_BASICS/common/view/EFieldNode' );

  /**
   * Constructor for a CapacitorNode.
   *
   * @param {Capacitor} capacitor
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {Property} plateChargeVisibleProperty
   * @param {Property} eFieldVisibleProperty
   * @param {number} maxPlateCharge
   * @param {number} maxEffectiveEField
   * @constructor
   */
  function CapacitorNode( capacitor, modelViewTransform, plateChargeVisibleProperty, eFieldVisibleProperty,
                          maxPlateCharge, maxEffectiveEField ) {

    Node.call( this );
    var thisNode = this; // extend scope for nested callbacks
    this.capacitor = capacitor;
    this.modelViewTransform = modelViewTransform;

    // child nodes
    this.topPlateNode = PlateNode.TopPlateNode( capacitor, modelViewTransform, maxPlateCharge );
    this.bottomPlateNode = PlateNode.BottomPlateNode( capacitor, modelViewTransform, maxPlateCharge );
    var eFieldNode = new EFieldNode( capacitor, modelViewTransform, maxEffectiveEField );

    // rendering order
    this.addChild( this.bottomPlateNode );
    this.addChild( eFieldNode ); // Performance is too poor, commenting out for now.
    this.addChild( this.topPlateNode );

    // observers
    capacitor.multilink( [ 'plateSize', 'plateSeparation' ], function() {
      thisNode.updateGeometry();
    } );

    plateChargeVisibleProperty.link( function( visible ) {
      thisNode.topPlateNode.setChargeVisible( visible );
      thisNode.bottomPlateNode.setChargeVisible( visible );
    } );

    eFieldVisibleProperty.link( function( visible ) {
      eFieldNode.setVisible( visible );
    } );

  }

  return inherit( Node, CapacitorNode, {

    /**
     * Update the geometry of the capacitor plates.
     */
    updateGeometry: function() {
      // geometry
      this.topPlateNode.setBoxSize( this.capacitor.plateSize );
      this.bottomPlateNode.setBoxSize( this.capacitor.plateSize );

      // layout nodes with zero dielectric offset
      var x = 0;
      var y = -( this.capacitor.plateSeparation / 2 ) - this.capacitor.plateSize.height;
      var z = 0;
      this.topPlateNode.center = this.modelViewTransform.modelToViewDeltaXYZ( x, y, z );

      //y = -this.capacitor.getDielectricSize().getHeight() / 2;
      //dielectricNode.setOffset( mvt.modelToViewDelta( x, y, z ) );

      y = this.capacitor.plateSeparation / 2;
      this.bottomPlateNode.center = this.modelViewTransform.modelToViewDeltaXYZ( x, y, z );

      // adjust the dielectric offset
      //updateDielectricOffset();
    }
  } );
} );