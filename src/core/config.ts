/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import Conf = require('conf');

import { CONFIG_FOLDER } from './constants';

export type ConfigKey =
    'core.rejectUnauthorized' |
    'core.tokenCacheTtl' |
    'iotc.api.host' |
    'iotc.api.version' |
    'iotc.credentials.token' |
    'iotc.credentials.application' |
    'iotc.credentials.hubs';

const defaults: { [K in ConfigKey]?: unknown } = {
    'core.rejectUnauthorized': false,
    'core.tokenCacheTtl': 10 * 60 * 1000, // 10 minutes
    'iotc.api.host': 'api.azureiotcentral.com',
    'iotc.api.version': 'v1-beta'
};

// Default configuration values. We keep these out of the defaults provided to
// conf because if we ever have to change the defaults, they will not be
// respected.

const conf = new Conf<any>({ projectName: CONFIG_FOLDER });

export function get(key: ConfigKey): unknown {
    return conf.has(key) ? conf.get(key) : defaults[key];
}

export function getOverride(key: ConfigKey): unknown {
    return conf.get(key);
}

export function getDefault(key: ConfigKey): unknown {
    return defaults[key];
}

export function set(key: ConfigKey, value: any) {
    return conf.set(key, value);
}

export function list(): unknown {
    return conf.store;
}

export function del(key: ConfigKey) {
    conf.delete(key);
}