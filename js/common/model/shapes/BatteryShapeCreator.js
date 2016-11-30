// Copyright 2015, University of Colorado Boulder

/**
 * Creates 2D projections of shapes that are related to the 3D battery model. Shapes are in the global view coordinate
 * frame.
 *
 * @author Chris Malley (cmalley@pixelzoom.com)
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Shape = require( 'KITE/Shape' );
  var Rectangle = require( 'DOT/Rectangle' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  /**
   * Constructor for a BatteryShapeCreator.
   *
   * @param {Battery} battery
   * @param {ModelViewTransform2} modelViewTransform REVIEW: nope, see below
   */
  function BatteryShapeCreator( battery, modelViewTransform ) {
    if ( assert ) {
      if ( modelViewTransform.constructor.name !== 'ModelViewTransform2' ) {
        console.log( 'REVIEW (BatteryShapeCreator): Probably not a ModelViewTransform2: ' + modelViewTransform.constructor.name );
      }
    }
    this.battery = battery; // @public
    this.modelViewTransform = modelViewTransform; // @private
  }

  capacitorLabBasics.register( 'BatteryShapeCreator', BatteryShapeCreator );

  return inherit( Object, BatteryShapeCreator, {

    /**
     * Creates the shape of the top terminal in the world coordinate frame. Which terminal is on top depends on the
     * polarity.
     * REVIEW: visibility doc
     * REVIEW: return value
     */
    createTopTerminalShape: function() {
      if ( this.battery.polarityProperty.value === CLBConstants.POLARITY.POSITIVE ) {
        return this.createPositiveTerminalShapeBody( this.battery.location );
      }
      else {
        return this.createNegativeTerminalShape( this.battery.location );
      }
    },

    /**
     * Creates the shape of the positive terminal body relative to some specified origin.  The positive terminal is a
     * cylinder.  This shape does not include the elliptical top of the cylinder.  Use with
     * createPositiveTerminalShapeTop() to create entire to terminal shape.
     * REVIEW: visibility doc
     *
     * @param {Vector3} origin
     * @returns {Shape}
     */
    createPositiveTerminalShapeBody: function( origin ) {

      // Create the height of the top ellipse of this cylinder.  This is needed to draw the body outline.
      var ellipseHeight = this.createPositiveTerminalShapeTop( origin ).bounds.height;

      // wall of the cylinder
      var cylinderWidth = this.battery.getPositiveTerminalEllipseSize().width;
      var cylinderHeight = this.battery.getPositiveTerminalCylinderHeight();
      var cylinderY = origin.y + this.battery.getTopTerminalYOffset();
      var wallShape = new Rectangle( origin.x, cylinderY, cylinderWidth, cylinderHeight );

      return this.modelViewTransform.modelToViewShape( new Shape()
        .moveTo( wallShape.minX, wallShape.minY )// Top left of wall.
        .ellipticalArc( wallShape.centerX, wallShape.minY, wallShape.width / 2, ellipseHeight / 2, 0, Math.PI, 0, false )
        .lineTo( wallShape.maxX, wallShape.maxY )// Bottom right of wall.
        .ellipticalArc( wallShape.centerX, wallShape.maxY, wallShape.width / 2, wallShape.height / 2, 0, 0, Math.PI, false )
        .close() // Connect final line.
      );

    },

    /**
     * Create the top of the positive terminal.  Use with createPositiveTerminalBodyShape() to create the entire shape
     * of the top terminal.
     * REVIEW: visibility doc
     *
     * @param {Vector3} origin
     * REVIEW: return doc
     */
    createPositiveTerminalShapeTop: function( origin ) {
      //REVIEW: only request the ellipse size once?
      var ellipseWidth = this.battery.getPositiveTerminalEllipseSize().width;
      var ellipseHeight = this.battery.getPositiveTerminalEllipseSize().height;
      var ellipseY = origin.y + this.battery.getTopTerminalYOffset();
      return Shape.ellipse( origin.x, ellipseY, ellipseWidth / 2, ellipseHeight / 2, 0, 0, Math.PI / 2, false );

    },

    /**
     * Creates the shape of the negative terminal relative to some specified origin.
     * REVIEW: visibility doc
     *
     * @param {Vector3} origin
     * @returns {Shape}
     */
    createNegativeTerminalShape: function( origin ) {
      //REVIEW: only request the ellipse size once?
      var width = this.battery.getNegativeTerminalEllipseSize().width;
      var height = this.battery.getNegativeTerminalEllipseSize().height;
      var y = origin.y + this.battery.getTopTerminalYOffset();
      return this.modelViewTransform.modelToViewShape( Shape.ellipse( origin.x, y, width / 2, height / 2, 0, 0, Math.PI, false ) );
    }

  } );

} );
