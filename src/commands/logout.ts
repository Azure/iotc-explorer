/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import command from '../core/command';
import * as config from '../core/config';
import * as resources from '../resources.json';

export = command<{ token?: string }>({
    command: 'logout',
    describe: resources.commands.logout.description,

    async handler(args, log) {
        config.del('iotc.credentials.token');
        config.del('iotc.credentials.application');
        config.del('iotc.credentials.hubs');

        // Inform the user
        log.info(resources.commands.logout.success);
    }
});
