//  Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var MinusChargeNode = require( 'CAPACITOR_LAB/capacitor-lab/view/MinusChargeNode' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Path = require( 'SCENERY/nodes/Path' );
  var PlusChargeNode = require( 'CAPACITOR_LAB/capacitor-lab/view/PlusChargeNode' );
  var Rectangle = require( 'SCENERY/nodes/Rectangle' );
  var Shape = require( 'KITE/Shape' );
  var Vector2 = require( 'DOT/Vector2' );

  function PlateNode(model, options) {
    Node.call( this, options );
    // apparent "height" on the screen of the plate
    this.plateHeight = -60;
    // height of the front rectangle
    this.plateDepth = 8;
    // length in the x direction of the plate
    this.plateWidth = 160;
    // controls the angle of the diagonal
    this.plateShift = 80;
    // minimum number of charges visible when plate is charged
    this.minChargeNum = 1;
    // maximum number of charges visible
    this.maxChargeNum = 625;
    // maximum amount of plate charge
    this.maxCharge = 0.53E-11;
    
    this.model = model;
    
    var frontRectangle = new Rectangle( 0, 0, this.plateWidth, this.plateDepth, 0, 0, {stroke: 'black', fill: '#aaaaaa'} );
    this.addChild( frontRectangle );
    
    var topPlateShape = new Shape().
      lineTo(this.plateShift, this.plateHeight).
      lineTo(this.plateWidth + this.plateShift, this.plateHeight).
      lineTo(this.plateWidth, 0).
      lineTo(0,0).
      lineTo(this.plateShift, this.plateHeight);
    var topPlate = new Path( topPlateShape, {stroke: 'black', fill: 'white'});
    this.topPlate = topPlate;
    this.addChild( topPlate );
    
    var sidePlateShape = new Shape().
      moveTo(this.plateWidth,0).
      lineTo(this.plateWidth + this.plateShift, this.plateHeight).
      lineTo(this.plateWidth + this.plateShift, this.plateHeight+this.plateDepth).
      lineTo(this.plateWidth, this.plateDepth).
      lineTo(this.plateWidth, 0);
    var sidePlate = new Path( sidePlateShape, {stroke: 'black', fill: 'gray'});
    this.addChild( sidePlate );
    
    model.plateChargeVisibleProperty.link( function () {
      if (model.plateChargeVisibleProperty.value) {
        for (var i = 0; i < topPlate.children.length; i++) {
          topPlate.children[i].visible = true;
        }
      }
      else {
        for (var i = 0; i < topPlate.children.length; i++) {
          topPlate.children[i].visible = false;
        }
      }
    });
  }
  
  return inherit( Node, PlateNode, {
    getGridSize: function(numCharges) {
      var height = Math.sqrt(Math.pow(this.plateHeight, 2)+Math.pow(this.plateShift, 2));
      var alpha = Math.sqrt(numCharges / height / this.plateWidth);
      var columns = Math.floor(this.plateWidth * alpha);
      var rows = Math.floor(height * alpha);
      return [columns, rows];
    },
    
    getNumberOfCharges: function() {
      var absCharge = Math.abs(this.model.upperPlateChargeProperty.value);
      var numCharges = Math.floor( this.maxChargeNum * absCharge / this.maxCharge);
      if (absCharge > 0 && numCharges < this.minChargeNum) {
        numCharges = this.minChargeNum;
      }
      return numCharges;
    },
    
    makeChargeGrid: function(charge) {
      var numCharges = this.getNumberOfCharges();
      var columns = this.getGridSize(numCharges)[0];
      var rows = this.getGridSize(numCharges)[1];
      var colSpacing = this.plateWidth / columns;
      var rowSpacing = -this.plateHeight / rows;
      var x = 0;
      var y = 0;
      this.topPlate.removeAllChildren();
      for (var i = 0; i < columns; i++) {
        for (var j = 0; j < rows; j++) {
          y = -((j + .5)*rowSpacing + 5);
          x = (i + .25)*colSpacing - this.plateShift / -this.plateHeight * y;
          if (charge > 0) {
            this.topPlate.addChild(new PlusChargeNode({x: x, y: y}));
          }
          else {
            this.topPlate.addChild(new MinusChargeNode({x: x, y: y}));
          }
        }
      }
    }
  });
} );