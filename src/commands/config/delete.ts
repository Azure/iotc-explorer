/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import command from '../../core/command';
import * as config from '../../core/config';
import * as resources from '../../resources.json';

export = command<{ key: string; }>({
    command: 'delete <key>',
    describe: resources.commands.config.commands.delete.description,

    handler(args, log) {
        config.del(args.key as config.ConfigKey);
        log.info(resources.commands.config.commands.delete.success);
    }
});
