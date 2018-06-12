// Copyright 2017-2018, University of Colorado Boulder

/**
 * IO type for VoltmeterToolboxPanel
 *
 * @author John Blanco
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var NodeIO = require( 'SCENERY/nodes/NodeIO' );

  // ifphetio
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );

  /**
   * IO type for phet/sun's AccordionBox class.
   * @param {AccordionBox} voltmeterToolboxPanel
   * @param {string} phetioID
   * @constructor
   */
  function VoltmeterToolboxPanelIO( voltmeterToolboxPanel, phetioID ) {
    assert && assertInstanceOf( voltmeterToolboxPanel, phet.capacitorLabBasics.VoltmeterToolboxPanel );
    NodeIO.call( this, voltmeterToolboxPanel, phetioID );
  }

  phetioInherit( NodeIO, 'VoltmeterToolboxPanelIO', VoltmeterToolboxPanelIO, {}, {
    documentation: 'A toolbox that contains a voltmeter',
    events: [ 'dragged' ]
  } );

  capacitorLabBasics.register( 'VoltmeterToolboxPanelIO', VoltmeterToolboxPanelIO );

  return VoltmeterToolboxPanelIO;
} );

