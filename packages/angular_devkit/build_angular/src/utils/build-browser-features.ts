/**
 * @license
 * Copyright Google Inc. All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import * as browserslist from 'browserslist';
import { feature, features } from 'caniuse-lite';
import * as ts from 'typescript';

export class BuildBrowserFeatures {
  private readonly _supportedBrowsers: string[];
  private readonly _es6TargetOrLater: boolean;

  constructor(
    private projectRoot: string,
    private scriptTarget: ts.ScriptTarget,
  ) {
    this._supportedBrowsers = browserslist(undefined, { path: this.projectRoot });
    this._es6TargetOrLater = this.scriptTarget > ts.ScriptTarget.ES5;
  }

  /**
   * True, when one or more browsers requires ES5
   * support and the scirpt target is ES2015 or greater.
   */
  isDifferentialLoadingNeeded(): boolean {
    return this._es6TargetOrLater && this.isEs5SupportNeeded();
  }

  /**
   * True, when one or more browsers requires ES5 support
   */
  isEs5SupportNeeded(): boolean {
    return !caniuse.isSupported('es6-module', this._supportedBrowsers.join(', '));
  }

  /**
   * Safari 10.1 and iOS Safari 10.3 supports modules,
   * but does not support the `nomodule` attribute.
   * While return `true`, when support for Safari 10.1 and iOS Safari 10.3
   * is required and in differential loading is enabled.
   */
  isNoModulePolyfillNeeded(): boolean {
    if (!this.isDifferentialLoadingNeeded()) {
      return false;
    }

    const safariBrowsers = [
      'safari 10.1',
      'ios_saf 10.3',
    ];

    return this._supportedBrowsers.some(browser => safariBrowsers.includes(browser));
  }
}