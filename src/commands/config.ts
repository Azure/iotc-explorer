/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import { group } from '../core/command';
import * as resources from '../resources.json';

export = group(
    'config',
    resources.commands.config.description
);
