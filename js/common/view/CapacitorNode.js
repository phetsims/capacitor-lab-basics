// Copyright 2014-2018, University of Colorado Boulder

/**
 * Visual representation of a capacitor.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( require => {
  'use strict';

  // modules
  const Bounds2 = require( 'DOT/Bounds2' );
  const capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  const EFieldNode = require( 'CAPACITOR_LAB_BASICS/common/view/EFieldNode' );
  const inherit = require( 'PHET_CORE/inherit' );
  const Node = require( 'SCENERY/nodes/Node' );
  const PlateNode = require( 'CAPACITOR_LAB_BASICS/common/view/PlateNode' );
  const Property = require( 'AXON/Property' );

  /**
   * @constructor
   *
   * @param {ParallelCircuit} circuit
   * @param {CLBModelViewTransform3D} modelViewTransform
   * @param {Property.<boolean>} plateChargeVisibleProperty
   * @param {Property.<boolean>} electricFieldVisibleProperty
   * @param {Tandem} tandem
   */
  function CapacitorNode( circuit, modelViewTransform, plateChargeVisibleProperty, electricFieldVisibleProperty, tandem ) {

    Node.call( this, { tandem: tandem } );
    var self = this; // extend scope for nested callbacks

    // @private
    this.capacitor = circuit.capacitor;
    this.modelViewTransform = modelViewTransform;

    // @private {PlateNode}
    this.topPlateNode = PlateNode.createTopPlateNode( this.capacitor, modelViewTransform, circuit.maxPlateCharge );
    this.bottomPlateNode = PlateNode.createBottomPlateNode( this.capacitor, modelViewTransform, circuit.maxPlateCharge );

    var eFieldNode = new EFieldNode( this.capacitor, modelViewTransform, circuit.maxEffectiveEField, this.getPlatesBounds() );

    // rendering order
    this.addChild( this.bottomPlateNode );
    this.addChild( eFieldNode );
    this.addChild( this.topPlateNode );

    Property.multilink( [
      this.capacitor.plateSizeProperty,
      this.capacitor.plateSeparationProperty
    ], function() {
      self.updateGeometry();
    } );

    plateChargeVisibleProperty.link( function( visible ) {
      self.topPlateNode.setChargeVisible( visible );
      self.bottomPlateNode.setChargeVisible( visible );
    } );

    electricFieldVisibleProperty.link( function( visible ) {
      eFieldNode.setVisible( visible );
    } );
  }

  capacitorLabBasics.register( 'CapacitorNode', CapacitorNode );

  return inherit( Node, CapacitorNode, {

    /**
     * Update the geometry of the capacitor plates.
     * @public
     */
    updateGeometry: function() {
      // geometry
      this.topPlateNode.setBoxSize( this.capacitor.plateSizeProperty.value );
      this.bottomPlateNode.setBoxSize( this.capacitor.plateSizeProperty.value );

      // layout nodes
      var x = 0;
      var y = -( this.capacitor.plateSeparationProperty.value / 2 ) - this.capacitor.plateSizeProperty.value.height;
      var z = 0;
      this.topPlateNode.center = this.modelViewTransform.modelToViewDeltaXYZ( x, y, z );

      y = this.capacitor.plateSeparationProperty.value / 2;
      this.bottomPlateNode.center = this.modelViewTransform.modelToViewDeltaXYZ( x, y, z );
    },

    /**
     * Get the bound of the capacitor from the plates.  Allows for bounds to be passed into the canvas node before the
     * children are added to the view.
     * @public
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
