/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import command from '../../core/command';
import * as config from '../../core/config';
import * as opts from '../../core/options';
import * as resources from '../../resources.json';

export = command<{}, opts.color & opts.raw>({
    command: 'list',
    describe: resources.commands.config.commands.list.description,
    options: {
        ...opts.raw,
        ...opts.color,
    },

    handler(args, log) {
        log.json(config.list());
    }
});
