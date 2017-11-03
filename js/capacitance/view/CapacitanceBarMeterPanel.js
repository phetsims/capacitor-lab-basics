// Copyright 2015-2017, University of Colorado Boulder

/**
 * Panel which holds the bar meter and check box for visibility of the Capacitance Graph.
 *
 * This panel uses several layout boxes to achieve the desired alignment.  The meter value nodes are aligned to the
 * right while the bar meters are aligned to the left.  The checkboxes are also aligned to the left.
 *
 * @author Jesse Greenberg
 */
define( function( require ) {
  'use strict';

  // modules
  var BarMeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/BarMeterNode' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var Panel = require( 'SUN/Panel' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Vector2 = require( 'DOT/Vector2' );

  // constants
  var VALUE_FONT = new PhetFont( 16 );
  var VALUE_COLOR = 'black';

  // strings
  var capacitanceString = require( 'string!CAPACITOR_LAB_BASICS/capacitance' );
  var unitsPicoFaradsString = require( 'string!CAPACITOR_LAB_BASICS/units.picoFarads' );

  /**
   * @constructor
   *
   * @param {BarMeter} model
   * @param {number} minWidth
   * @param {Tandem} tandem
   */
  function CapacitanceBarMeterPanel( model, minWidth, tandem ) {

    var self = this;
    var parentNode = new Node();

    var capacitanceMeterNode = new BarMeterNode(
      model.capacitanceMeter,
      CLBConstants.CAPACITANCE_COLOR,
      CLBConstants.CAPACITANCE_METER_MAX_VALUE,
      unitsPicoFaradsString,
      capacitanceString,
      tandem.createTandem( 'capacitanceMeterNode' ) );

    // title for capacitance meter
    var fontOptions = {
      font: VALUE_FONT,
      fill: VALUE_COLOR,
      maxWidth: 120
    };
    var capacitanceTitle = new Text( capacitanceString, fontOptions );

    parentNode.children = [ capacitanceMeterNode, capacitanceTitle ];

    // Position the left edge (x) and vertical center (y) of BarMeterNode
    capacitanceMeterNode.translation = new Vector2( 0.45 * minWidth, capacitanceTitle.centerY );

    Panel.call( this, parentNode, {
      minWidth: minWidth,
      align: 'left',
      fill: CLBConstants.METER_PANEL_FILL,
      xMargin: 15,
      yMargin: 15,
      resize: false,
      tandem: tandem
    } );

    // link visibility of this panel to the checkbox
    model.barGraphsVisibleProperty.link( function( barGraphsPanelVisible ) {
      self.visible = barGraphsPanelVisible;
    } );
  }

  capacitorLabBasics.register( 'CapacitanceBarMeterPanel', CapacitanceBarMeterPanel );

  return inherit( Panel, CapacitanceBarMeterPanel );

} );