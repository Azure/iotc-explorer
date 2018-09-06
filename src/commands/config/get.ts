/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import command from '../../core/command';
import * as config from '../../core/config';
import * as resources from '../../resources.json';

export = command<{ key: string }>({
    command: 'get <key>',
    describe: resources.commands.config.commands.get.description,

    handler(args, log) {
        const value = config.getOverride(args.key as config.ConfigKey);
        log.info(typeof value === 'string' ? value : JSON.stringify(value));
    }
});
