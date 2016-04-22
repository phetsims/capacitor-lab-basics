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
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // images
  var redVoltmeterProbeImage = require( 'image!CAPACITOR_LAB_BASICS/probe_red.png' );
  var blackVoltmeterProbeImage = require( 'image!CAPACITOR_LAB_BASICS/probe_black.png' );

  /**
   * Constructor.
   *
   * @param {Image} image image of the probe
   * @param {Property} locationProperty property to observer for the probe's location
   * @param {CLBModelViewTransform3D} modelViewTransform model-view transform
   */
  function VoltmeterProbeNode( image, locationProperty, modelViewTransform ) {

    Node.call( this );
    var thisNode = this;
    this.locationProperty = locationProperty; // @public

    // TODO: A mipmap will likely be necessary at this size.
    var imageNode = new Image( image, { scale: 0.25 } );
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

    // make draggable TODO: Add restrictive bounds for MovableDragHandler.
    this.movableDragHandler = new MovableDragHandler( locationProperty, {
      modelViewTransform: modelViewTransform
    } );
    this.addInputListener( this.movableDragHandler );

    // set the cursor
    this.cursor = 'pointer';

  }

  capacitorLabBasics.register( 'VoltmeterProbeNode', VoltmeterProbeNode );
  
  return inherit( Node, VoltmeterProbeNode, {

    /**
     * Gets the point, relative to the probe, where the wire connects to the probe. Returns a new Vector2.
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
     * @param {CLBModelViewTransform3D} modelViewTransform - 
     */
    PositiveVoltmeterProbeNode: function( voltmeter, modelViewTransform ) {
      return new VoltmeterProbeNode( redVoltmeterProbeImage, voltmeter.positiveProbeLocationProperty, modelViewTransform );
    },

    NegativeVoltmeterProbeNode: function( voltmeter, modelViewTransform ) {
      return new VoltmeterProbeNode( blackVoltmeterProbeImage, voltmeter.negativeProbeLocationProperty, modelViewTransform );
    }

  } );

} );