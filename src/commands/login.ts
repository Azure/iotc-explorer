/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as inquirer from 'inquirer';
import * as querystring from 'querystring';
import * as util from 'util';

import command from '../core/command';
import * as config from '../core/config';
import { SAS_TOKEN_PREFIX } from '../core/constants';
import CliError from '../core/error';
import * as resources from '../resources.json';

export = command<{ token?: string }>({
    command: 'login [token]',
    describe: resources.commands.login.description,

    async handler(args, log) {
        let inputToken: string;
        if (args.token) {
            // The token was provided as an option to the command. Just use it
            // directly
            inputToken = args.token;
        } else {
            // Prompt the user for their token and use that value.
            inputToken = (await inquirer.prompt<{ token: string }>({
                type: 'input',
                name: 'token',
                message: 'SAS Token',
                prefix: '',
                suffix: ':'
            })).token;
        }

        const invalidSasTokenCode = 'INVALID_SAS_TOKEN';

        // Tokens must start with "SharedAccessSignature "
        if (!inputToken.startsWith(SAS_TOKEN_PREFIX)) {
            throw new CliError(
                invalidSasTokenCode,
                resources.errors.sasToken.invalidPrefix
            );
        }

        const token = inputToken.substring(SAS_TOKEN_PREFIX.length);

        // If the token isn't a valid uri fragment, this can throw. Catch it and
        // indicate that the token is malformed
        let parsed: querystring.ParsedUrlQuery;
        try {
            parsed = querystring.parse(token);
        } catch {
            throw new CliError(
                invalidSasTokenCode,
                resources.errors.sasToken.malformed
            );
        }

        // The token must have the sr, se, and skn properties to be valid
        if (!parsed || !parsed.sr || !parsed.se || !parsed.skn) {
            throw new CliError(
                invalidSasTokenCode,
                resources.errors.sasToken.invalid
            );
        }

        // If there is a token expiry, it cannot be in the past
        if (parsed.se && Number(parsed.se) < Date.now()) {
            throw new CliError(
                invalidSasTokenCode,
                resources.errors.sasToken.expired
            );
        }

        // Set the relevant information in the configuration store
        config.set('iotc.credentials.token', inputToken);
        config.set('iotc.credentials.application', parsed.sr);

        // Delete any cached hub credentials we have as they may be pointing to
        // the wrong place
        config.del('iotc.credentials.hubs');

        // Inform the user
        log.info(
            parsed.se
                ? util.format(
                    resources.commands.login.logs.successWithExpiry,
                    new Date(Number(parsed.se)).toString()
                )
                : resources.commands.login.logs.successNoExpiry
        );
    }
});
