/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import command from '../../core/command';
import * as config from '../../core/config';
import * as resources from '../../resources.json';

export = command<{ key: string; value: string; }>({
    command: 'set <key> <value>',
    describe: resources.commands.config.commands.set.description,

    handler(args) {
        let value: any;
        try {
            value = JSON.parse(args.value);
        } catch {
            value = args.value;
        }

        config.set(args.key as config.ConfigKey, value);
    }
});
