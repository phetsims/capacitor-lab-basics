// Copyright 2002-2015, University of Colorado Boulder

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

  /**
   * Constructor for a capacitor plate
   * @param {CapacitorLabModel} model
   * @param {number} charge: determines if the plate is the bottom or top plate
   **/
  function PlateNode( model, charge, options ) {
    Node.call( this, options );
    // apparent "height" on the screen of the plate
    this.plateHeight = -60;
    // height of the front rectangle
    this.plateDepth = 8;
    // length in the x direction of the plate
    this.plateWidth = 160;
    // controls the angle of the diagonal
    this.plateShift = 80;
    // minimum height of the plate
    this.minPlateHeight = -60;
    // minimum plate width
    this.minPlateWidth = 160;
    // minimum plate shift
    this.minPlateShift = 80;
    // minimum number of charges visible when plate is charged
    this.minChargeNum = 1;
    // maximum number of charges visible
    this.maxChargeNum = 625;
    // maximum amount of plate charge
    this.maxCharge = 0.53E-11;
    
    this.model = model;
    this.charge = charge;
    var thisNode = this;
    
    // create the shape for the top plate
    function makeTopPlate() {
      var shape = new Shape().
        lineTo( thisNode.plateShift, thisNode.plateHeight ).
        lineTo( thisNode.plateWidth + thisNode.plateShift, thisNode.plateHeight ).
        lineTo( thisNode.plateWidth, 0 ).
        lineTo( 0, 0 ).
        lineTo( thisNode.plateShift, thisNode.plateHeight );
      return shape;
    }
    
    // create the shape for the side plate
    function makeSidePlate() {
      var shape = new Shape().
        moveTo( thisNode.plateWidth, 0 ).
        lineTo( thisNode.plateWidth + thisNode.plateShift, thisNode.plateHeight ).
        lineTo( thisNode.plateWidth + thisNode.plateShift, thisNode.plateHeight + thisNode.plateDepth ).
        lineTo( thisNode.plateWidth, thisNode.plateDepth ).
        lineTo( thisNode.plateWidth, 0 );
      return shape;
    }
    
    // The front of the capacitor plate
    this.frontRectangle = new Rectangle( 0, 0, this.plateWidth, this.plateDepth, 0, 0, {
      stroke: 'black',
      fill: '#aaaaaa'
    } );
    this.addChild( this.frontRectangle );
    
    // The top of the capacitor plate
    var topPlateShape = makeTopPlate();
    this.topPlate = new Path( topPlateShape, {
      stroke: 'black',
      fill: 'white'
    } );
    this.addChild( this.topPlate );
    
    // The side of the capacitor plate
    var sidePlateShape = makeSidePlate();
    this.sidePlate = new Path( sidePlateShape, {
      stroke: 'black',
      fill: 'gray'
    } );
    this.addChild( this.sidePlate );
    
    model.plateChargeVisibleProperty.link( function () {
      if (model.plateChargeVisibleProperty.value) {
        for (var i = 0; i < thisNode.topPlate.children.length; i++) {
          thisNode.topPlate.children[i].visible = true;
        }
      }
      else {
        for (var j = 0; j < thisNode.topPlate.children.length; j++) {
          thisNode.topPlate.children[j].visible = false;
        }
      }
    });
    
    model.capacitorPlateAreaProperty.link( function () {
      thisNode.plateWidth = thisNode.minPlateWidth * Math.sqrt(model.capacitorPlateAreaProperty.value / 100);
      thisNode.plateShift = thisNode.minPlateShift * Math.sqrt(model.capacitorPlateAreaProperty.value / 100);
      thisNode.plateHeight = thisNode.minPlateHeight * Math.sqrt(model.capacitorPlateAreaProperty.value / 100);
      
      thisNode.frontRectangle.setRect( 0, 0, thisNode.plateWidth, thisNode.plateDepth, 0, 0 );
      thisNode.topPlate.shape = makeTopPlate();
      thisNode.sidePlate.shape = makeSidePlate();
    } );
  }
  
  return inherit( Node, PlateNode, {
    // Returns the number of columns and rows that the charges should occupy
    getGridSize: function( numCharges ) {
      var height = Math.sqrt(Math.pow(this.plateHeight, 2)+Math.pow(this.plateShift, 2));
      var alpha = Math.sqrt(numCharges / height / this.plateWidth);
      var columns = Math.floor(this.plateWidth * alpha);
      var rows = Math.floor(height * alpha);
      return [columns, rows];
    },
    
    // Returns the number of charge nodes to be drawn
    getNumberOfCharges: function() {
      var absCharge = Math.abs(this.model.upperPlateChargeProperty.value);
      var numCharges = Math.floor( this.maxChargeNum * absCharge / this.maxCharge);
      if (absCharge > 0 && numCharges < this.minChargeNum) {
        numCharges = this.minChargeNum;
      }
      return numCharges;
    },
    
    // Constructs the grid of charges on the surface of the plate
    makeChargeGrid: function() {
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
          y = -((j +0.5)*rowSpacing);
          x = (i + 0.25)*colSpacing - this.plateShift / -this.plateHeight * y;
          if (this.charge > 0 && this.model.upperPlateChargeProperty.value > 0) {
            this.topPlate.addChild( new PlusChargeNode( {x: x, y: y-5} ) );
          }
          else if (this.charge < 0 && this.model.upperPlateChargeProperty.value < 0) {
            this.topPlate.addChild( new PlusChargeNode( {x: x, y: y-5} ) );
          }
          else {
            this.topPlate.addChild( new MinusChargeNode( {x: x, y: y} ) );
          }
        }
      }
    }
  });
} );