// Copyright 2016, University of Colorado Boulder

/**
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var DielectricMaterial = require( 'CAPACITOR_LAB_BASICS/common/model/DielectricMaterial' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var Capacitor = require( 'CAPACITOR_LAB_BASICS/common/model/Capacitor' );
  var Vector3 = require( 'DOT/Vector3' );
  var CircuitSwitch = require( 'CAPACITOR_LAB_BASICS/common/model/CircuitSwitch' );

  /**
   * Constructor.
   *
   * @param {Vector3} location
   * @param {number} plateWidth
   * @param {number} plateSeparation
   * @param {DielectricMaterial} dielectricMaterial
   * @param {number} dielectricOffset
   * @param {CLModelViewTransform3D} modelViewTransform
   * @param {Tandem} tandem
   * @param {Object} options
   */
  function SwitchedCapacitor( location, config, switchConnections, circuitConnectionProperty, tandem, options ) {

    // options that populate the capacitor with various geometric and dielectric properties
    options = _.extend( {
      plateWidth: CLBConstants.PLATE_WIDTH_RANGE.min,
      plateSeparation: CLBConstants.PLATE_SEPARATION_RANGE.max,
      dielectricMaterial: DielectricMaterial.Air,
      dielectricOffset: CLBConstants.PLATE_WIDTH_RANGE.max + 1
    }, options );

    // create the capacitor
    Capacitor.call( this, location, config.modelViewTransform, tandem, options );

    // create the circuit switches that connect the capacitor to the circuit
    var x = config.batteryLocation.x + config.capacitorXSpacing;
    var topY = config.batteryLocation.y - CLBConstants.PLATE_SEPARATION_RANGE.max - CLBConstants.SWITCH_Y_SPACING;
    var bottomY = config.batteryLocation.y + CLBConstants.PLATE_SEPARATION_RANGE.max + CLBConstants.SWITCH_Y_SPACING;
    var z = config.batteryLocation.z;

    var topStartPoint = new Vector3( x, topY, z );
    var bottomStartPoint = new Vector3( x, bottomY, z );

    this.topCircuitSwitch = CircuitSwitch.CircuitTopSwitch( topStartPoint, config.modelViewTransform, switchConnections, circuitConnectionProperty );
    this.bottomCircuitSwitch = CircuitSwitch.CircuitBottomSwitch( bottomStartPoint, config.modelViewTransform, switchConnections, circuitConnectionProperty );

  }

  capacitorLabBasics.register( 'SwitchedCapacitor', SwitchedCapacitor );

  return inherit( Capacitor, SwitchedCapacitor, {} );
} );
