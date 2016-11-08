// Copyright 2015, University of Colorado Boulder

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
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var CLBConstants = require( 'CAPACITOR_LAB_BASICS/common/CLBConstants' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Panel = require( 'SUN/Panel' );
  var BarMeterNode = require( 'CAPACITOR_LAB_BASICS/common/view/meters/BarMeterNode' );
  var Vector2 = require( 'DOT/Vector2' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // phet-io modules
  var TPanel = require( 'ifphetio!PHET_IO/types/sun/TPanel' );

  // constants
  var VALUE_FONT = new PhetFont( 15 );
  var VALUE_COLOR = 'black';

  // strings
  var capacitanceString = require( 'string!CAPACITOR_LAB_BASICS/capacitance' );
  var unitsPicoFaradsString = require( 'string!CAPACITOR_LAB_BASICS/units.picoFarads' );

  /**
   * Constructor.
   *
   * @param {BarMeter} model
   * @param {Property.<boolean>} minWidth
   * @param {Tandem} tandem
   * @constructor
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

    // layout
    var x = 0;
    var y = 0;

    // x = capacitanceTitle.centerX + 120; // Add spacing between title text and value text
    x = 0.5 * minWidth;
    y = capacitanceTitle.centerY + 1;
    capacitanceMeterNode.translation = new Vector2( x, y );

    Panel.call( this, parentNode, {
      minWidth: minWidth,
      align: 'left',
      fill: CLBConstants.METER_PANEL_FILL,
      xMargin: 15,
      yMargin: 15,
      resize: false
    } );

    // link visibility of this panel to the checkbox
    model.barGraphsVisibleProperty.link( function( barGraphsPanelVisible ) {
      self.visible = barGraphsPanelVisible;
    } );

    tandem.addInstance( this, TPanel );
  }

  capacitorLabBasics.register( 'CapacitanceBarMeterPanel', CapacitanceBarMeterPanel );

  return inherit( Panel, CapacitanceBarMeterPanel );

} );
