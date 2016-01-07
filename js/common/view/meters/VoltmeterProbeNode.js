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
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var Image = require( 'SCENERY/nodes/Image' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Input = require( 'SCENERY/input/Input' );
  var Node = require( 'SCENERY/nodes/Node' );
  var MovableDragHandler = require( 'SCENERY_PHET/input/MovableDragHandler' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // images
  var redVoltmeterProbeImage = require( 'image!CAPACITOR_LAB_BASICS/probe_red.png' );
  var blackVoltmeterProbeImage = require( 'image!CAPACITOR_LAB_BASICS/probe_black.png' );

  // strings
  var accessibleVoltmeterRedProbeString = require( 'string!CAPACITOR_LAB_BASICS/accessible.voltmeterRedProbe' );
  var accessibleVoltmeterBlackProbeString = require( 'string!CAPACITOR_LAB_BASICS/accessible.voltmeterBlackProbe' );

  /**
   * Constructor.
   *
   * @param {Image} image image of the probe
   * @param {String} descriptionString aria description for accessibility
   * @param {String} className class of object in parallel dom
   * @param {Property} locationProperty property to observer for the probe's location
   * @param {CLModelViewTransform3D} modelViewTransform model-view transform
   */
  function VoltmeterProbeNode( image, descriptionString, className, locationProperty, probeLocations, modelViewTransform ) {

    Node.call( this );
    var thisNode = this;
    this.locationProperty = locationProperty; // @public
    var loc = -1; // @private, used for accessibility

    // TODO: dot notation is better here, will change soon
    var locs = probeLocations[ 'points' ]; //eslint-disable-line dot-notation
    var strings = probeLocations[ 'strings' ]; //eslint-disable-line dot-notation

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
    this.cursor = 'pointer';

    // add the accessible content
    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        var trail = accessibleInstance.trail;

        var domElement = document.createElement( 'div' );
        domElement.className = className;
        domElement.setAttribute( 'aria-live', 'polite' );

        // add this probe instance ID to the thisNode so that the panel can have access to the node.
        domElement.id = 'probe-' + trail.getUniqueId();
        thisNode.accessibleProbeId = domElement.id;

        var description = document.createElement( 'p' );
        description.textContent = descriptionString;
        domElement.appendChild( description );
        description.id = descriptionString;
        domElement.setAttribute( 'aria-describedby', descriptionString );

        domElement.tabIndex = '-1';

        domElement.addEventListener( 'keydown', function( event ) {
          var keyCode = event.keyCode;
          if ( keyCode === Input.KEY_LEFT_ARROW || keyCode === Input.KEY_DOWN_ARROW ) {
            loc = loc <= 0 ? locs.length - 1 : loc - 1;
            locationProperty.set( locs[ loc ] );
            description.textContent = strings[ loc ];
          }
          else if ( keyCode === Input.KEY_RIGHT_ARROW || keyCode === Input.KEY_UP_ARROW ) {
            loc = ( loc + 1 ) % locs.length;
            locationProperty.set( locs[ loc ] );
            description.textContent = strings[ loc ];
          }
        } );

        var accessiblePeer = new AccessiblePeer( accessibleInstance, domElement );
        return accessiblePeer;

      }
    };
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
    PositiveVoltmeterProbeNode: function( voltmeter, modelViewTransform ) {
      return new VoltmeterProbeNode( redVoltmeterProbeImage, accessibleVoltmeterRedProbeString, 'RedProbe', voltmeter.positiveProbeLocationProperty, voltmeter.getUsefulProbeLocations(), modelViewTransform );
    },
    NegativeVoltmeterProbeNode: function( voltmeter, modelViewTransform ) {
      return new VoltmeterProbeNode( blackVoltmeterProbeImage, accessibleVoltmeterBlackProbeString, 'BlackProbe', voltmeter.negativeProbeLocationProperty, voltmeter.getUsefulProbeLocations(), modelViewTransform );
    }

  } );

} );