// Copyright 2016, University of Colorado Boulder

/**
 * Capacitor Lab Basics uses Vector3 for the model, but MovableDragHandler only supports Vector2 and PhET-iO
 * types Vector2IO and CLBVector3IO cannot be mixed.  This file is a workaround for https://github.com/phetsims/capacitor-lab-basics/issues/215
 * and supports Vector2 and Vector3
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Andrew Adare (PhET Interactive Simulations)
 */
define( function( require ) {
  'use strict';

  // modules
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );

  // phet-io modules
  var assertInstanceOf = require( 'ifphetio!PHET_IO/assertInstanceOf' );
  var phetioInherit = require( 'ifphetio!PHET_IO/phetioInherit' );
  var ObjectIO = require( 'ifphetio!PHET_IO/types/ObjectIO' );

  /**
   * @param {Vector3} vector3
   * @param {string} phetioID
   * @constructor
   */
  function CLBVector3IO( vector3, phetioID ) {
    assert && assertInstanceOf( vector3, phet.dot.Vector3 );
    ObjectIO.call( this, vector3, phetioID );
  }

  phetioInherit( ObjectIO, 'CLBVector3IO', CLBVector3IO, {}, {
    documentation: 'Basic 3-dimensional vector, represented as (x,y,z)',

    /**
     * Decodes a state into a Vector3.
     * @param {Object} stateObject
     * @returns {Vector3}
     */
    fromStateObject: function( stateObject ) {
      return new phet.dot.Vector3( stateObject.x, stateObject.y, stateObject.z || 0 );
    },

    /**
     * Encodes a Vector3 instance to a state.
     * @param {Vector3} vector3
     * @returns {Object}
     */
    toStateObject: function( vector3 ) {

      // The difference between this file and Vector3IO is that there is no type check here.
      return { x: vector3.x, y: vector3.y, z: vector3.z };
    }
  } );

  capacitorLabBasics.register( 'CLBVector3IO', CLBVector3IO );

  return CLBVector3IO;
} );

