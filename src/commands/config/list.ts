/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import command from '../../core/command';
import * as config from '../../core/config';
import * as resources from '../../resources.json';

export = command({
    command: 'list',
    describe: resources.commands.config.commands.list.description,

    handler(args, log) {
        log.json(config.list());
    }
});
