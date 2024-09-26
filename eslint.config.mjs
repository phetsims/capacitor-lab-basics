// Copyright 2024, University of Colorado Boulder

/**
 * ESLint configuration for capacitor-lab-basics.
 *
 * @author Sam Reid (PhET Interactive Simulations)
 * @author Michael Kauzmann (PhET Interactive Simulations)
 */

import simEslintConfig from '../chipper/eslint/sim.eslint.config.mjs';

export default [
  ...simEslintConfig,
  {
    rules: {
      'phet/no-view-imported-from-model': 'off'
    }
  }
];