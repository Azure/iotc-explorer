/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as yargs from 'yargs';

export type OptionType<T> = T extends any[] ? 'array'
    : T extends string ? 'string'
    : T extends number ? 'number' | 'count'
    : T extends boolean ? 'boolean'
    : NonNullable<yargs.Options['type']>;

type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;

export type ArgvNoOptions = Omit<yargs.Argv, 'option' | 'options'>;

export type Arguments<T extends object> = Pick<yargs.Arguments, '_' | '$0'> & T;

export type OptionConfig<T> = Omit<yargs.Options, 'required' | 'require'> & { type: OptionType<T> };
