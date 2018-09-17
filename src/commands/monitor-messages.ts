/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { EventHubClient, TokenType } from '@azure/event-hubs';
import * as util from 'util';

import * as api from '../core/api';
import command from '../core/command';
import * as opts from '../core/options';
import * as resources from '../resources.json';

export = command<{ deviceId?: string; }, { 'start-time': number } & opts.raw & opts.color>({
    command: 'monitor-messages [deviceId]',
    describe: resources.commands.monitorMessages.description,

    options: {
        'start-time': {
            describe: resources.commands.monitorMessages.options.startTime,
            type: 'number',
            default: Date.now()
        },
        ...opts.raw,
        ...opts.color,
    },

    async handler(args, log): Promise<void> {
        const sasTokens = await api.generateSasTokens();
        const eventhubClient = EventHubClient.createFromTokenProvider(
            sasTokens.eventhubSasToken.hostname.substring(5),
            sasTokens.eventhubSasToken.entityPath,
            {
                tokenRenewalMarginInSeconds: -1,
                tokenValidTimeInSeconds: 3600,
                getToken: () => Promise.resolve({
                    tokenType: TokenType.CbsTokenTypeSas,
                    token: sasTokens.eventhubSasToken.sasToken,
                    expiry: sasTokens.expiry,
                }),
            },
        );
        const partitionIds = await eventhubClient.getPartitionIds();

        const deviceId = args.deviceId;
        const startTime = args['start-time'];

        // Once we get here we know we can set up the client and start receiving
        // messages.
        log.info(
            deviceId
                ? util.format(resources.commands.monitorMessages.logs.monitoringDevice, deviceId)
                : resources.commands.monitorMessages.logs.monitoringAll
        );
        log.blank();

        partitionIds.map(partitionId => {
            eventhubClient.receive(
                partitionId,
                message => {
                    const messageDeviceId = message.annotations && message.annotations['iothub-connection-device-id'];

                    // If device id is provided, and the message is not sent to it, return
                    const isDeviceRelevant = !deviceId || messageDeviceId === deviceId;

                    // If message time is before the specified start time, return
                    const messageTime = message.annotations && message.annotations['x-opt-enqueued-time'] || Date.now();
                    const isMessageBeforeStartTime = messageTime < startTime;

                    // We don't want messages that don't fit our conditions
                    if (!isDeviceRelevant || isMessageBeforeStartTime) {
                        return;
                    }

                    const dateString = new Date(messageTime).toUTCString();

                    // Log the metadata and the message body
                    log.divider(messageDeviceId
                        ? util.format(
                            resources.commands.monitorMessages.logs.messageHeaderKnownDevice,
                            messageDeviceId,
                            dateString
                        )
                        : util.format(
                            resources.commands.monitorMessages.logs.messageHeaderUnknownDevice,
                            dateString
                        )
                    );
                    log.json(message.body);
                    log.blank();
                },
                error => {
                    // Errors here should be fatal. Log it and exit
                    log.error(error);
                    process.exit(1);
                }
            );
        });
    }
});