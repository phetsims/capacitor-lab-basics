// Copyright 2015, University of Colorado Boulder

/**
 * Panel describing keyboard shortcuts used in accessibility mode
 *
 * @author Emily Randall
 */
define( function( require ) {
  'use strict';

  // modules
  var inherit = require( 'PHET_CORE/inherit' );
  var Dialog = require( 'JOIST/Dialog' );
  var Text = require( 'SCENERY/nodes/Text' );
  var Property = require( 'AXON/Property' );
  var VBox = require( 'SCENERY/nodes/VBox' );
  var PhetFont = require( 'SCENERY_PHET/PhetFont' );
  var AccessiblePeer = require( 'SCENERY/accessibility/AccessiblePeer' );
  var RectangularPushButton = require( 'SUN/buttons/RectangularPushButton' );
  var ButtonListener = require( 'SCENERY/input/ButtonListener' );
  var capacitorLabBasics = require( 'CAPACITOR_LAB_BASICS/capacitorLabBasics' );
  var Input = require( 'SCENERY/input/Input' );

  // constants
  var PANEL_TITLE_FONT = new PhetFont( { weight: 'bold', size: 18 } );
  var SHORTCUT_FONT = new PhetFont( 16 );

  // strings
  var keyDescriptionsTabString = require( 'string!CAPACITOR_LAB_BASICS/keyDescriptions.tab' );
  var keyDescriptionsEnterString = require( 'string!CAPACITOR_LAB_BASICS/keyDescriptions.enter' );
  var keyDescriptionsEscapeString = require( 'string!CAPACITOR_LAB_BASICS/keyDescriptions.escape' );
  var keyDescriptionsSpacebarString = require( 'string!CAPACITOR_LAB_BASICS/keyDescriptions.spacebar' );
  var keyDescriptionsArrowsString = require( 'string!CAPACITOR_LAB_BASICS/keyDescriptions.arrows' );
  var keyDescriptionsHString = require( 'string!CAPACITOR_LAB_BASICS/keyDescriptions.h' );
  var keyDescriptionsTitleString = require( 'string!CAPACITOR_LAB_BASICS/keyDescriptions.title' );
  var keyboardHelpCloseString = require( 'string!CAPACITOR_LAB_BASICS/keyboardHelp.close' );
  var strings = [ keyDescriptionsTabString, keyDescriptionsEnterString, keyDescriptionsEscapeString, keyDescriptionsSpacebarString, keyDescriptionsArrowsString, keyDescriptionsHString ];

  /**
   * Constructor.
   *
   * @param {CapacitorLabBasicsModel} model
   * @param {ScreenView} screenView screenView, parallel DOM element is hidden
   * @constructor
   */
  function KeyboardHelpPanel( model, screenView ) {

    var thisDialog = this;

    var titleText = new Text( keyDescriptionsTitleString, { font: PANEL_TITLE_FONT } );
    var tabText = new Text( keyDescriptionsTabString, { font: SHORTCUT_FONT } );
    var enterText = new Text( keyDescriptionsEnterString, { font: SHORTCUT_FONT } );
    var escapeText = new Text( keyDescriptionsEscapeString, { font: SHORTCUT_FONT } );
    var spacebarText = new Text( keyDescriptionsSpacebarString, { font: SHORTCUT_FONT } );
    var arrowText = new Text( keyDescriptionsArrowsString, { font: SHORTCUT_FONT } );
    var hText = new Text( keyDescriptionsHString, { font: SHORTCUT_FONT } );

    // all visual text in a layout box
    var keyboardHelpTextBox = new VBox( {
      children: [ titleText, tabText, enterText, escapeText, spacebarText, arrowText, hText ],
      spacing: 5,
      align: 'left'
    } );

    // Add a custom close button to this dialdog.
    var closeText = new Text( keyboardHelpCloseString, { font: SHORTCUT_FONT } );
    var closeFunction = function() {
      thisDialog.shownProperty.set( false );

      // set focus to the previously active screen view element
      screenView.activeElement.focus();
    };
    var closeButton = new RectangularPushButton( { 
      content: closeText,
      listener: closeFunction
     } );

    // define the accessible content for the close button - close button neds to have a unique event listener
    // that sets focus to the dialog content if 'tab' is pressed
    closeButton.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        var accessiblePeer = RectangularPushButton.RectangularPushButtonAccessiblePeer( accessibleInstance, keyboardHelpCloseString, closeFunction );

        accessiblePeer.domElement.addEventListener( 'keydown', function( event ) {
          if( event.keyCode === Input.KEY_TAB ) {
            // TODO: Scenery should eventually be able to provide a reference to the node's domElement?
            keyboardHelpTextBox.accessibleInstances[0].peer.domElement.focus();
            event.preventDefault();
          }
        } );

        return accessiblePeer;
      }
    };

    // Create a property that both signals changes to the 'shown' state and can also be used to show/hide the dialog
    // remotely.  Done for a11y so the property can be tracked in the accessibility tree, allowing keyboard and mouse
    // events to be tracked together.
    this.shownProperty = new Property( false );

    var manageDialog = function( shown ) {
      if ( shown ) {
        Dialog.prototype.show.call( thisDialog );
      }
      else {
        Dialog.prototype.hide.call( thisDialog );
      }
    };

    this.shownProperty.lazyLink( function( shown ) {
      manageDialog( shown );
    } );

    // dialogLabelText and closeText in an VBox to center in the dialog
    var contentVBox = new VBox( {
      children: [ keyboardHelpTextBox, closeButton ],
      spacing: 20
    } );

    var dialogAccessibleContent = {
      createPeer: function( accessibleInstance ) {

        var accessiblePeer = Dialog.DialogAccessiblePeer( accessibleInstance, thisDialog );

        accessiblePeer.domElement.addEventListener( 'keydown', function( event ) {
          if( event.keyCode === Input.KEY_ESCAPE ) {

            // hide the keyboardHelpPanel
            thisDialog.shownProperty.set( false );

            // reset focus to the domElement
            if( screenView.activeElement ) { screenView.activeElement.focus(); }
          }
        } );

        return accessiblePeer;
      }
    };

    Dialog.call( this, contentVBox, {
      modal: true,
      focusable: false,
      hasCloseButton: false,
      accessibleContent: dialogAccessibleContent,
      layoutStrategy: function( window, simBounds, screenBounds, scale ) {
        // if simBounds are null, return without setting center.
        if ( simBounds !== null ) {
          // Update the location of the dialog (size is set in Sim.js)
          thisDialog.center = simBounds.center.times( 1.0 / scale );
        }
      }
    } );
    
    var thisNode = this;
    
    // add the accessible content
    keyboardHelpTextBox.accessibleContent = {
      createPeer: function( accessibleInstance ) {
        var trail = accessibleInstance.trail;
        var uniqueId = trail.getUniqueId();
        
        var domElement = document.createElement( 'section' );
        domElement.id = 'help-' + uniqueId;
        thisNode.accessibleId = domElement.id;
        domElement.tabIndex = '0';

        var title = document.createElement( 'h3' );
        title.innerHTML = keyDescriptionsTitleString;
        domElement.appendChild( title );
        title.id = 'keyboard-help-title-' + uniqueId;
        
        var helpDescription = document.createElement( 'div' );
        helpDescription.id = 'help-description-' + uniqueId;
        strings.forEach( function( s ) {
          var description = document.createElement( 'p' );
          description.innerHTML = s;
          helpDescription.appendChild( description );
        } );
        domElement.appendChild( helpDescription );
        
        domElement.setAttribute( 'aria-labeledby', title.id );
        domElement.setAttribute( 'aria-describedby', helpDescription.id );

        // screenView 'hidden' property need to be linked to the shownProperty.  If the dialog is shown, hide everything
        // in the screen view.
        thisDialog.shownProperty.link( function( isShown ) {

          var screenViewElement = screenView.accessibleInstances[0].peer.domElement;
          screenViewElement.setAttribute( 'aria-hidden', isShown );

        } );

        // if shift tab is pressed on this element, we need to restrict navigation to what is in the close dialog
        domElement.addEventListener( 'keydown', function( event ) {
          if( event.keyCode === Input.KEY_TAB ) {
            if( event.shiftKey ) {
              // TODO: Scenery should eventually be able to provide a reference to the node's DOM element?
              closeButton.accessibleInstances[0].peer.domElement.focus();
              event.preventDefault();
            }
          }
        } );

        var accessiblePeer = new AccessiblePeer( accessibleInstance, domElement );
        return accessiblePeer;

      }
    };

    // screenView 'hidden' property need to be linked to the shownProperty.  If the dialog is shown, hide everything
    // in the screen view.
    thisDialog.shownProperty.link( function( isShown ) {

      // if shown, focus immediately - must happen before hiding the screenView, or the AT gets lost in the hidden elements.
      if ( isShown ) {
        // TODO: Scenery should eventually be able to create a reference to the node's DOM element?
        keyboardHelpTextBox.accessibleInstances[0].peer.domElement.focus();
      }
    } );

    // close it on a click
    this.addInputListener( new ButtonListener( {
      fire: thisDialog.hide.bind( thisDialog )
    } ) );
    
    // model.keyboardHelpVisibleProperty.linkAttribute( this, 'visible' );
    
  }

  capacitorLabBasics.register( 'KeyboardHelpPanel', KeyboardHelpPanel );
  
  return inherit( Dialog, KeyboardHelpPanel, {
    hide: function() {
      this.shownProperty.value = false;
    },
    show: function() {
      this.shownProperty.value = true;
    }
  } );
} );