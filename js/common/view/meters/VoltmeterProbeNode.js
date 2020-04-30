// Copyright 2015-2020, University of Colorado Boulder

/**
 * Class for voltmeter probes in the view.  Static functions create each of the
 * positive and negative nodes.
 *
 * @author Chris Malley (PixelZoom, Inc.)
 * @author Jesse Greenberg (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */

import DynamicProperty from '../../../../../axon/js/DynamicProperty.js';
import Property from '../../../../../axon/js/Property.js';
import Bounds2 from '../../../../../dot/js/Bounds2.js';
import Vector2 from '../../../../../dot/js/Vector2.js';
import inherit from '../../../../../phet-core/js/inherit.js';
import MovableDragHandler from '../../../../../scenery-phet/js/input/MovableDragHandler.js';
import Image from '../../../../../scenery/js/nodes/Image.js';
import Node from '../../../../../scenery/js/nodes/Node.js';
import blackVoltmeterProbeImage from '../../../../images/probe_black_png.js';
import redVoltmeterProbeImage from '../../../../images/probe_red_png.js';
import capacitorLabBasics from '../../../capacitorLabBasics.js';

/**
 * @constructor
 *
 * @param {Image} image image of the probe
 * @param {Property.<Vector3>} positionProperty property to observer for the probe's position
 * @param {YawPitchModelViewTransform3} modelViewTransform model-view transform
 * @param {Bounds2} dragBounds Node bounds in model coordinates
 * @param {Tandem} tandem
 */
function VoltmeterProbeNode( image, positionProperty, modelViewTransform, dragBounds, tandem ) {

  Node.call( this );
  const self = this;

  // @public {Property.<Vector3>}
  this.positionProperty = positionProperty;

  const imageNode = new Image( image, {
    scale: 0.25
  } );
  this.addChild( imageNode );
  imageNode.translate( -imageNode.bounds.width / 2, 0 );

  // @public {Vector2}
  this.connectionOffset = imageNode.centerBottom; // @public connect wire to bottom center

  // image is vertical, rotate into pseudo-3D perspective after computing the connection offset
  this.rotate( -modelViewTransform.yaw );
  this.connectionOffset.rotate( -modelViewTransform.yaw );

  // update position with model
  positionProperty.link( function( position ) {
    if ( position instanceof Vector2 ) {
      self.translation = modelViewTransform.modelToViewPosition( position.toVector3() );
    }
    else {
      self.translation = modelViewTransform.modelToViewPosition( position );
    }
  } );

  // Don't allow pushing the probes too far to the left, see https://github.com/phetsims/capacitor-lab-basics/issues/202
  const adjustedViewBounds = new Bounds2( 40, 0, dragBounds.maxX - imageNode.width, dragBounds.maxY - 0.4 * imageNode.height );

  // Convert the 3d property to a 2d property for use in the MovableDragHandler
  const position2DProperty = new DynamicProperty( new Property( positionProperty ), {
    bidirectional: true,
    useDeepEquality: true,
    map: function( vector3 ) { return vector3.toVector2(); },
    inverseMap: function( vector2 ) { return vector2.toVector3(); }
  } );

  // Drag handler accounting for boundaries
  this.movableDragHandler = new MovableDragHandler( position2DProperty, {
    tandem: tandem.createTandem( 'dragHandler' ),
    dragBounds: modelViewTransform.viewToModelBounds( adjustedViewBounds ),
    modelViewTransform: modelViewTransform.modelToViewTransform2D,
    useDeepEquality: true
  } );
  this.addInputListener( this.movableDragHandler );

  // set the cursor
  this.cursor = 'pointer';

}

capacitorLabBasics.register( 'VoltmeterProbeNode', VoltmeterProbeNode );

inherit( Node, VoltmeterProbeNode, {}, {

  /**
   * Factory for a positive VoltmeterProbeNode
   * @public
   *
   * @param {Voltmeter} voltmeter
   * @param {YawPitchModelViewTransform3} modelViewTransform
   * @param {Tandem} tandem
   */
  createPositiveVoltmeterProbeNode: function( voltmeter, modelViewTransform, tandem ) {
    return new VoltmeterProbeNode( redVoltmeterProbeImage,
      voltmeter.positiveProbePositionProperty, modelViewTransform, voltmeter.dragBounds, tandem );
  },

  /**
   * Factory for a positive VoltmeterProbeNode
   * @public
   *
   * @param {Voltmeter} voltmeter
   * @param {YawPitchModelViewTransform3} modelViewTransform
   * @param {Tandem} tandem
   */
  createNegativeVoltmeterProbeNode: function( voltmeter, modelViewTransform, tandem ) {
    return new VoltmeterProbeNode( blackVoltmeterProbeImage,
      voltmeter.negativeProbePositionProperty, modelViewTransform, voltmeter.dragBounds, tandem );
  }
} );

export default VoltmeterProbeNode;
