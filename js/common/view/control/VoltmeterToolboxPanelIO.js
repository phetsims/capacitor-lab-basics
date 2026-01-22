// Copyright 2018-2019, University of Colorado Boulder

/**
 * IO type for VoltmeterToolboxPanel.   TODO: This type seems like it isn't doing anything.  Can it be deleted?
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var NodeIO = require( 'SCENERY/nodes/NodeIO' );
  var phetioInherit = require( 'TANDEM/phetioInherit' );

  /**
   * IO type for phet/sun's AccordionBox class.
   * @param {AccordionBox} voltmeterToolboxPanel
   * @param {string} phetioID
   * @constructor
   */
  function VoltmeterToolboxPanelIO( voltmeterToolboxPanel, phetioID ) {
    NodeIO.call( this, voltmeterToolboxPanel, phetioID );
  }

  phetioInherit( NodeIO, 'VoltmeterToolboxPanelIO', VoltmeterToolboxPanelIO, {}, {
    documentation: 'A toolbox that contains a voltmeter',
    events: [ 'dragged' ],
    validator: { isValidValue: v => v instanceof phet.capacitorLabBasics.VoltmeterToolboxPanel }
  } );

  capacitorLabBasics.register( 'VoltmeterToolboxPanelIO', VoltmeterToolboxPanelIO );

  return VoltmeterToolboxPanelIO;
} );

