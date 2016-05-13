// Copyright 2014-2015, University of Colorado Boulder

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
  var Bounds2 = require( 'DOT/Bounds2' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * Constructor for a CapacitorNode.
   *
   * @param {AbstractCircuit} circuit
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Property} plateChargeVisibleProperty
   * @param {Property} eFieldVisibleProperty
   * @param {Tandem} tandem
   * @constructor
   */
  function CapacitorNode( circuit, modelViewTransform, plateChargeVisibleProperty, eFieldVisibleProperty, tandem ) {

    Node.call( this );
    var thisNode = this; // extend scope for nested callbacks

    // @private
    this.capacitor = circuit.capacitor;
    this.modelViewTransform = modelViewTransform;
    this.topPlateNode = PlateNode.TopPlateNode( this.capacitor, modelViewTransform, circuit.maxPlateCharge );
    this.bottomPlateNode = PlateNode.BottomPlateNode( this.capacitor, modelViewTransform, circuit.maxPlateCharge );

    var eFieldNode = new EFieldNode( this.capacitor, modelViewTransform, circuit.maxEffectiveEField, this.getPlatesBounds() );

    // rendering order
    this.addChild( this.bottomPlateNode );
    this.addChild( eFieldNode );
    this.addChild( this.topPlateNode );

    // observers
    this.capacitor.multilink( [ 'plateSize', 'plateSeparation' ], function() {
      thisNode.updateGeometry();
    } );

    plateChargeVisibleProperty.link( function( visible ) {
      thisNode.topPlateNode.setChargeVisible( visible );
      thisNode.bottomPlateNode.setChargeVisible( visible );
    } );

    eFieldVisibleProperty.link( function( visible ) {
      eFieldNode.setVisible( visible );
    } );

    // Register with tandem.  No need to handle dispose/removeInstance since the
    // CLBViewControlPanel exists for the lifetime of the simulation.
    tandem.addInstance( this );
  }

  capacitorLabBasics.register( 'CapacitorNode', CapacitorNode );

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
    },

    /**
     * Get the bound of the capacitor from the plates.  Allows for bounds to be passed into the canvas node before the
     * children are added to the view.
     *
     * @returns {Bounds2}
     */
    getPlatesBounds: function() {
      return new Bounds2(
        this.topPlateNode.left,
        this.topPlateNode.top,
        this.bottomPlateNode.right,
        this.bottomPlateNode.bottom );
    }
  } );
} );

