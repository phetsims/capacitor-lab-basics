//  Copyright 2002-2015, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Image = require( 'SCENERY/nodes/Image' );
  var HSlider = require( 'SUN/HSlider' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  
  // images
  var batteryUpImage = require( 'image!CAPACITOR_LAB/battery_3D_up.svg' );
  var batteryDownImage = require( 'image!CAPACITOR_LAB/battery_3D_down.svg' );

  // strings
  var voltString = require( 'string!CAPACITOR_LAB/volt' );
  
  /**
   * Constructor for the battery image
   * Also contains the slider to change the voltage
   * @param {CapacitorLabModel} model
   **/
  function BatteryNode(model, options) {
    Image.call( this, batteryUpImage, options );
    var thisNode = this;
    
    // Changes the voltage
    var slider = new HSlider(model.voltageProperty, {min: -1.5, max: 1.5}, {
      x: 415,
      y: 375,
      rotation: Math.PI / -2,
      majorTickLength: 20
    });
    var labelOptions = {
      fill: '#ffffff',
      rotation: Math.PI / 2,
      font: new PhetFont( 13 ),
      fontWeight: 'bold'
    };
    // Maximum voltage
    var topLabel = new Text("1.5" + voltString, labelOptions);
    // Zero volts
    var midLabel = new Text("0" + voltString, labelOptions);
    // Minimum voltage
    var bottomLabel = new Text("-1.5" + voltString , labelOptions);
    slider.addMajorTick( 1.5, topLabel );
    slider.addMajorTick( 0, midLabel );
    slider.addMajorTick( -1.5, bottomLabel );
    this.addChild( slider );
    
    model.voltageProperty.link( function () {
      if (model.voltageProperty.value < 0) {
        thisNode.setImage( batteryDownImage );
      }
      if (model.voltageProperty.value >= 0) {
        thisNode.setImage( batteryUpImage );
      }
      model.updateCapacitanceAndCharge();
    });
  }
  
  return inherit( Image, BatteryNode );
} );