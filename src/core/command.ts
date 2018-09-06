/*!
 * Copyright (c) Microsoft Corporation. All rights reserved.
 * Licensed under the MIT License.
 */

import * as path from 'path';
import * as yargs from 'yargs';

import Log from './log';
import { Arguments, ArgvNoOptions, OptionConfig } from './types';

export interface Command<P extends object, O extends object> {
    /**
     * Command name and positional arguments as specified to yargs.
     */
    command: string;

    /**
     * Optional aliases that can be used instead of the main command name.
     */
    aliases?: string[];

    /**
     * Description of the command functionality and behavior.
     */
    describe: string;

    /**
     * Map of command option names to their configurations. All configuration
     * that can be passed to a yargs option is allowed, except for the
     * `required` key.
     */
    options?: {
        [K in keyof O]: OptionConfig<O[K]>;
    };

    /**
     * Optional builder function for specifying additional command setup. Allows
     * all of the same capabilities as the yargs function of the same name
     * except for setting options as those are done using the `options` key.
     */
    builder?: (yargs: ArgvNoOptions) => ArgvNoOptions;

    /**
     * Command handler function invoked when executing this command. It may be
     * synchronous or asynchronous.
     */
    handler: (args: Arguments<P & O>, log: Log) => void | Promise<void>;
}

/**
 * Register a command with the given configuration parameters in the CLI.
 *
 * @param command Command configuration object.
 */
export default function command<P extends object = {}, O extends object = {}>(command: Command<P, O>) {
    return {
        command: command.command,
        aliases: Array.isArray(command.aliases) && command.aliases.length > 0 ? command.aliases : undefined,
        describe: command.describe,
        builder(yargs: yargs.Argv) {
            if (command.builder) {
                yargs = command.builder(yargs) as yargs.Argv;
            }

            if (command.options) {
                yargs = yargs.options(command.options);
            }

            return yargs;
        },
        async handler(args: Arguments<P & O>) {
            const log = new Log(args);

            const rejectionHandler = (err: any) => {
                log.error(err);
                process.exit(1);
            };
            process.on('unhandledRejection', rejectionHandler);

            try {
                await command.handler(args, log);
            } catch (e) {
                rejectionHandler(e);
            } finally {
                process.removeListener('unhandledRejection', rejectionHandler);
            }
        }
    };
}

/**
 * Create a command group with the given name(s) and description. All commands
 * created in a sibling directory with the same name as the group will be
 * available as part of that group.
 *
 * @param cmd      The name of the command group as it appears in the command
 *                 line. Can also be specified as an array, where entries after
 *                 the first one are aliases for the command group. Please note
 *                 that the expected folder name (as well as the name that
 *                 appears in the help text) is always the first entry in the
 *                 array.
 * @param describe The description of the command group that appears in the help
 *                text.
 */
export function group(cmd: string | string[], describe: string) {
    const callerDir = path.dirname(require('get-caller-file')());
    const relativeToCaller = path.relative(__dirname, callerDir);
    const mainCommand = Array.isArray(cmd) ? cmd[0] : cmd;
    return command({
        command: mainCommand,
        aliases: Array.isArray(cmd) ? cmd.slice(1) : [],
        describe,
        builder(yargs) {
            return yargs
                .demandCommand(1)
                .commandDir(path.join(relativeToCaller, mainCommand));
        },
        handler: () => { }
    });
}
