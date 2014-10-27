//  Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Image = require( 'SCENERY/nodes/Image' );
  var HSlider = require( 'SUN/HSlider' );
  
  // images
  var batteryUpImage = require( 'image!CAPACITOR_LAB/battery_3D_up.svg' );
  var batteryDownImage = require( 'image!CAPACITOR_LAB/battery_3D_down.svg' );

  function BatteryNode(model, options) {
    Image.call( this, batteryUpImage, options );
    var slider = new HSlider(model.voltageProperty, {min: -1.5, max: 1.5});
    this.addChild(slider);
  }
  
  return inherit( Image, BatteryNode);
} );