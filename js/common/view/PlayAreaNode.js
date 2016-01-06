// Copyright 2015, University of Colorado Boulder

/**
 * Node to represent the play area in the parallel DOM
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Node = require( 'SCENERY/nodes/Node' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );

  /**
   * Constructor for the PlayAreaNode.
   *
   * @param {string} accessibleLabelString
   * @param {string} accessibleDescriptionString
   * @constructor
   */
  function PlayAreaNode( accessibleLabelString, accessibleDescriptionString ) {

    Node.call( this );

    // add the accessible content
    this.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        var domElement = document.createElement( 'div' );
        var trail = accessibleInstance.trail;
        
        var label = document.createElement( 'h2' );
        label.innerText = accessibleLabelString;
        label.id = 'playAreaLabel' + trail.getUniqueId();
        domElement.appendChild( label );

        var description = document.createElement( 'p' );
        description.innerText = accessibleDescriptionString;
        description.id = 'playAreaDescription' + trail.getUniqueId();
        domElement.appendChild( description );

        domElement.setAttribute( 'aria-describedby', description.id );
        domElement.setAttribute( 'aria-labeledby', label.id );

        domElement.tabIndex = '-1';

        var accessiblePeer = new AccessiblePeer( accessibleInstance, domElement );
        domElement.id = accessiblePeer.id;
        return accessiblePeer;

      }
    };

  }

  capacitorLabBasics.register( 'PlayAreaNode', PlayAreaNode );
  
  return inherit( Node, PlayAreaNode );
} );



