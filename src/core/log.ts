/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as prettyjson from 'prettyjson';
import stringWidth = require('string-width');
import * as util from 'util';

import * as resources from '../resources.json';

import { DEFAULT_CLI_WIDTH, DIVIDER_CHAR, MIN_DIVIDER_PAD } from './constants';
import CliError from './error';
import * as opts from './options';

export default class Log {
    private _raw: boolean;

    constructor(options?: Partial<opts.raw>) {
        this._raw = !!(options && options.raw);
    }

    info(message: string) {
        if (!this._raw) {
            console.log(message);
        }
    }

    error(error: any) {
        if (error instanceof CliError) {
            console.error(util.format(resources.general.knownError, error.message, error.code));
        } else {
            console.error(util.format(resources.general.unknownError, error && error.message || error));
        }
    }

    json(value: any) {
        if (this._raw) {
            console.log(JSON.stringify(value));
        } else {
            console.log(prettyjson.render(value));
        }
    }

    divider(message?: string) {
        if (this._raw) {
            return;
        }

        const cliWidth = typeof (process.stdout as any).getWindowSize === 'function'
            ? (process.stdout as any).getWindowSize()[0]
            : DEFAULT_CLI_WIDTH;

        if (!message) {
            console.log(DIVIDER_CHAR.repeat(cliWidth));
        } else {
            const messageWidth = stringWidth(message);
            const averagePad = Math.max(MIN_DIVIDER_PAD, (cliWidth - messageWidth) / 2);

            // If there is an odd difference between the widths, we give the extra pad to the left
            const leftPad = Math.ceil(averagePad);
            const rightPad = Math.floor(averagePad);

            console.log(`${DIVIDER_CHAR.repeat(leftPad - 1)} ${message} ${DIVIDER_CHAR.repeat(rightPad - 1)}`);
        }
    }

    blank() {
        if (!this._raw) {
            console.log();
        }
    }
}
