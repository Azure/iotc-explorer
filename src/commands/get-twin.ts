/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { Registry } from 'azure-iothub';
import * as util from 'util';

import * as api from '../core/api';
import command from '../core/command';
import CliError from '../core/error';
import * as opts from '../core/options';
import * as resources from '../resources.json';

export = command<{ deviceId: string }, { 'hide-metadata': boolean } & opts.raw & opts.color>({
    command: 'get-twin <deviceId>',
    describe: resources.commands.getTwin.description,

    options: {
        'hide-metadata': {
            describe: resources.commands.getTwin.options.hideMetadata,
            alias: 'h',
            type: 'boolean',
            default: false
        },
        ...opts.raw,
        ...opts.color,
    },

    async handler(args, log) {
        const sasTokens = await api.generateSasTokens();
        const iothubRegistry = Registry.fromSharedAccessSignature(sasTokens.iothubTenantSasToken.sasToken);

        let twin: any;
        try {
            twin = await util.promisify(iothubRegistry.getTwin.bind(iothubRegistry))(args.deviceId);
        } catch (e) {
            switch (e && e.name) {
                // The device was not found.
                case 'DeviceNotFoundError':
                    throw new CliError(
                        'DEVICE_NOT_FOUND',
                        util.format(resources.errors.iotHub.deviceNotFound, args.deviceId)
                    );
                // We just group other errors together for now since we don't
                // expect to see any of them.
                default:
                    throw new CliError(
                        'IOTHUB_REGISTRY_ERROR',
                        util.format(resources.errors.iotHub.registryError, e && (e.name || e.message))
                    );
            }
        }

        // We don't want internal information to be displayed
        delete twin._registry;

        // If the user does not want metadata, delete $metadata and $version
        if (args['hide-metadata'] && twin.properties) {
            if (twin.properties.desired) {
                delete twin.properties.desired.$metadata;
                delete twin.properties.desired.$version;
            }

            if (twin.properties.reported) {
                delete twin.properties.reported.$metadata;
                delete twin.properties.reported.$version;
            }
        }

        log.json(twin);
    }
});
