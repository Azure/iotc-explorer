/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as resources from '../resources.json';

import { OptionConfig } from './types';

export type Options<T extends object> = {
    [K in keyof T]: OptionConfig<T[K]>
};

export type raw = { raw: boolean; };
export const raw: Options<raw> = {
    raw: {
        alias: 'r',
        default: false,
        describe: resources.options.raw,
        type: 'boolean'
    }
};
