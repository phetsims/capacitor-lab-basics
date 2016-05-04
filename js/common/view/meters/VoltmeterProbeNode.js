// Copyright 2015, University of Colorado Boulder

/**
 * Base class for voltmeter probes.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var Bounds2 = require( 'DOT/Bounds2' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );

  // images
  var redVoltmeterProbeImage = require( 'image!CAPACITOR_LAB_BASICS/probe_red.png' );
  var blackVoltmeterProbeImage = require( 'image!CAPACITOR_LAB_BASICS/probe_black.png' );

  /**
   * Constructor.
   *
   * @param {Image} image image of the probe
   * @param {Property} locationProperty property to observer for the probe's location
   * @param {CLBModelViewTransform3D} modelViewTransform model-view transform
   * @param {Bounds2} dragBounds Node bounds in model coordinates
   * @param {Tandem} tandem
   */
  function VoltmeterProbeNode( image, locationProperty, modelViewTransform, dragBounds, tandem ) {

    Node.call( this );
    var thisNode = this;
    this.locationProperty = locationProperty; // @public

    // TODO: A mipmap will likely be necessary at this size.
    var imageNode = new Image( image, {
      scale: 0.25
    } );
    this.addChild( imageNode );
    var x = -imageNode.bounds.width / 2;
    var y = 0;
    imageNode.translate( x, y );

    this.connectionOffset = imageNode.centerBottom; // @public connect wire to bottom center

    // image is vertical, rotate into pseudo-3D perspective after computing the connection offset
    this.rotate( -modelViewTransform.yaw );
    this.connectionOffset.rotate( -modelViewTransform.yaw );

    // update position with model
    locationProperty.link( function( location ) {
      thisNode.translation = modelViewTransform.modelToViewPosition( location );
    } );

    var adjustedViewBounds = new Bounds2( 0, 0, dragBounds.maxX - imageNode.width, dragBounds.maxY - 0.4 * imageNode.height );

    // Drag handler accounting for boundaries
    this.movableDragHandler = new MovableDragHandler( locationProperty, {
      dragBounds: modelViewTransform.viewToModelBounds( adjustedViewBounds ),
      modelViewTransform: modelViewTransform,
      onDrag: function() {
        // MovableDragHandler converts location to a Vector2 if node is dragged
        // out of bounds, so make sure that the location remains a vector3.
        if ( !thisNode.locationProperty.get().isVector3 ) {
          thisNode.locationProperty.set( thisNode.locationProperty.get().toVector3() );
        }
      }

    } );
    this.addInputListener( this.movableDragHandler );

    // set the cursor
    this.cursor = 'pointer';

  }

  capacitorLabBasics.register( 'VoltmeterProbeNode', VoltmeterProbeNode );

  return inherit( Node, VoltmeterProbeNode, {

    /**
     * Gets the point, relative to the probe, where the wire connects to the probe.
     * Returns a new Vector2.
     *
     * @returns {Vector2}
     */
    getConnectionOffset: function() {
      return this.connectionOffset.copy();
    }
  }, {

    // Factory functions to create both Positive and negative probes.
    /**
     * Constructor for a positive probe
     *
     * @param {Voltmeter} voltmeter
     * @param {CLBModelViewTransform3D} modelViewTransform
     * @param {Tandem} tandem
     */
    PositiveVoltmeterProbeNode: function( voltmeter, modelViewTransform, tandem ) { // TODO: Why is this method needed?
      return new VoltmeterProbeNode( redVoltmeterProbeImage,
        voltmeter.positiveProbeLocationProperty, modelViewTransform, voltmeter.dragBounds, tandem );
    },

    NegativeVoltmeterProbeNode: function( voltmeter, modelViewTransform, tandem ) {
      return new VoltmeterProbeNode( blackVoltmeterProbeImage,
        voltmeter.negativeProbeLocationProperty, modelViewTransform, voltmeter.dragBounds, tandem );
    }

  } );

} );

