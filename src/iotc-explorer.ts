#! /usr/bin/env node

/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as yargs from 'yargs';

require('source-map-support').install();

function main(): yargs.Argv {
    return yargs
        .locale('en')
        .commandDir('commands')
        .help()
        .demandCommand(1)
        .strict()
        .wrap(yargs.terminalWidth());
}

// tslint:disable-next-line:no-unused-expression
main().argv;
