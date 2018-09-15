/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import command from '../../core/command';
import * as config from '../../core/config';
import CliError from '../../core/error';
import * as opts from '../../core/options';
import * as resources from '../../resources.json';

export = command<{ key: string }, opts.color & opts.raw>({
    command: 'get <key>',
    describe: resources.commands.config.commands.get.description,
    options: {
        ...opts.raw,
        ...opts.color,
    },

    handler(args, log) {
        const value = config.getOverride(args.key as config.ConfigKey);
        if (value === undefined) {
            log.error(new CliError('KEY_NOT_FOUND', resources.commands.config.commands.get.errorNotFound));
        } else if (typeof value === 'string') {
            log.info(value);
        } else {
            log.json(value);
        }
    }
});
