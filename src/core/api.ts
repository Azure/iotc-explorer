/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import ax, { AxiosError } from 'axios';
import * as https from 'https';
import * as util from 'util';

import * as resources from '../resources.json';

import * as config from './config';
import CliError from './error';

export type IotHubSasTokens = {
    iothubTenantSasToken: {
        sasToken: string,
    },
    eventhubSasToken: {
        sasToken: string,
        entityPath: string,
        hostname: string,
    },
    expiry: number,
};

const axios = ax.create({
    baseURL: `https://${config.get('iotc.api.host')}/${config.get('iotc.api.version')}/`,
    httpsAgent: new https.Agent({
        keepAlive: true,
        rejectUnauthorized: !!config.get('core.rejectUnauthorized')
    }),
    responseType: 'json'
});

export async function generateSasTokens(): Promise<IotHubSasTokens> {
    const { token, appId } = getContext();
    const cacheTtl = config.get('core.tokenCacheTtl') as number;
    const cachedTokens = config.get('iotc.credentials.hubs') as any;

    // If we have cached tokens and a nonzero ttl less than the time to expiry,
    // use the cached token.
    if (cacheTtl && cachedTokens && (cachedTokens.expiry * 1000 - Date.now()) > cacheTtl) {
        return cachedTokens;
    }

    try {
        const response = await axios.post<IotHubSasTokens>(
            `/applications/${appId}/diagnostics/sasTokens`,
            undefined,
            {
                headers: {
                    Authorization: token
                }
            }
        );

        config.set('iotc.credentials.hubs', response.data);
        return response.data;
    } catch (e) {
        throw new CliError(
            'IOTC_API_ERROR',
            util.format(resources.errors.iotCentral.genericError, getErrorMessage(e))
        );
    }
}

function getContext() {
    const token = config.get('iotc.credentials.token') as string | undefined;
    const appId = config.get('iotc.credentials.application') as string | undefined;
    // if iot central token does not exist, throw error
    if (!token || !appId) {
        throw new CliError(
            'INVALID_CREDENTIALS',
            resources.errors.iotCentral.invalidCredentials
        );
    }
    return { token, appId };
}

function getErrorMessage(err: AxiosError) {
    const responseCode = err &&
        err.response &&
        err.response.data &&
        err.response.data.error &&
        err.response.data.error.message;
    const errorCode = err.message;

    return responseCode || errorCode || 'unknown error';
}