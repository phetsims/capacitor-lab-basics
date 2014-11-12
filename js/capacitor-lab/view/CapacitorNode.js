//  Copyright 2002-2014, University of Colorado Boulder

define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var PlateNode = require( 'CAPACITOR_LAB/capacitor-lab/view/PlateNode' );

  function CapacitorNode(model, options) {
    Node.call( this, options );
    var plateSeparation = 100;
    
    var topPlate = new PlateNode({x: 0, y: plateSeparation});
    var bottomPlate = new PlateNode({x: 0, y: -plateSeparation});
    this.addChild( topPlate );
    this.addChild( bottomPlate );
  }
  
  return inherit( Node, CapacitorNode);
} );