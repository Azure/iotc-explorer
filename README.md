# iotc-explorer

Command-line interface for interacting with Azure IoT Central devices and
applications.

## Prerequisites
+ Node.js version 8.x or higher - https://nodejs.org
+ You will need Administrator access in IoT Central to generate an access token

## Installing `iotc-explorer`

Run the following command from your command line to install:

```
npm install -g iotc-explorer
```

> NOTE: You will typically need to run the install command with `sudo` in Unix-like environments.

Once installed, you can run `iotc-explorer --help` to verify everything is
working and get an overview of the available commands:

```
$ iotc-explorer --help

iotc-explorer <command>

Commands:
  iotc-explorer config                       Manage configuration values for the CLI
  iotc-explorer get-twin <deviceId>          Get the IoT Hub device twin for a specific device
  iotc-explorer login [token]                Log in to an Azure IoT Central application
  iotc-explorer monitor-messages [deviceId]  Monitor messages being sent to a specific device (if
                                             device id is provided), or all devices

Options:
  --version  Show version number                                                           [boolean]
  --help     Show help                                                                     [boolean]
```

## Running `iotc-explorer`

Below are some commands and common options that you can run when using
`iotc-explorer`. To view the full set of commands and options, you can pass
`--help` to `iotc-explorer` or any of its subcommands.

### Login

Before you get going, you need to have an administrator of your IoT Central application to get an access token for you to use. The administrator takes the following steps:
- Go to **Administration/Access Tokens**. 
- Click **Generate**, and enter a Token name.  
- Click **Next**, and **copy the Token value**.

> NOTE: The token value will only be shown once, so it must be copied before closing the dialog. After closing the dialog, it will never be shown again.

You can then use that token to log in to the CLI by running:

```sh
iotc-explorer login "<Token value>"
```

If you would rather not have the token persisted in your shell history, you can
leave the token out and instead provide it when prompted:

```
iotc-explorer login
```

### Monitor Device Messages

You can watch the messages coming from either a specific device or all devices
in your application using the `monitor-messages` command. This will start a
watcher that will continuously output new messages as they come in.

To watch all devices in your application, run the following command:

```
iotc-explorer monitor-messages
```

To watch a specific device, just add the Device ID to the end of the command:

```
iotc-explorer monitor-messages <your-device-id>
```

You can also have the command output a more machine-friendly format by adding
the `--raw` option to the command:

```
iotc-explorer monitor-messages --raw
```

### Get Device Twin

You can use the `get-twin` command to get the contents of the twin for an IoT
Central device. To do so, run the following command:

```
iotc-explorer get-twin <your-device-id>
```

As with `monitor-messages`, you can get a more machine-friendly output by
passing the `--raw` option:

```
iotc-explorer get-twin <your-device-id> --raw
```

## Contributing

### Developer Setup

For your first time setup, make sure you've done the following:

 1. Make sure you have the [prerequisites](#installing) installed.
 2. Clone this repository to wherever you want to develop.
 3. Run `cd iotc-explorer` to enter the repository folder.
 4. Run `npm install`, then `npm run build` to get things configured.

### Writing Code

Once you're ready to start changing code, it is recommended that you link your
project to the `iotc-explorer` executable by running the following (may require
`sudo`):

```
npm link
```

Now, when you run `iotc-explorer`, it will point to the code in your development
folder. To make the executable reflect your changes as they're made, set up a
watch task in a terminal window to the side:

```
npm run watch
```

Now, whenever you make edits to the code you will be able to use them by running
the `iotc-explorer` command on your machine.

When you're ready to stop local development, you can remove your connection to
the `iotc-explorer` executable by running the following (may require `sudo`):

```
npm unlink
```

### Committing

This project uses the [Angular commit style][angular commit style] for
generating changelogs and determining release versions. Any pull request with
commits that don't follow this style will fail continuous integration. If you're
not familiar with the style, you can run the following instead of the standard
`git commit` to get a guided walkthrough to generating your commit message:

```
npm run commit
```

### Releasing

When it's time to cut a new release, run the following from the repository
folder. This will (1) fetch the latest updates, (2) automatically update the
package version and the changelog, (3) publish the package and (4) push the
changes back into the repository:

```
git checkout master
git pull
npm run build-verify
npm run release
npm publish
git push
```

### Contributor License Agreement

This project welcomes contributions and suggestions.  Most contributions require
you to agree to a Contributor License Agreement (CLA) declaring that you have
the right to, and actually do, grant us the rights to use your contribution. For
details, visit https://cla.microsoft.com.

When you submit a pull request, a CLA-bot will automatically determine whether
you need to provide a CLA and decorate the PR appropriately (e.g., label,
comment). Simply follow the instructions provided by the bot. You will only need
to do this once across all repos using our CLA.

### Code of Conduct

This project has adopted the [Microsoft Open Source Code of Conduct][]. For more
information see the [Code of Conduct FAQ][] or contact
[opencode@microsoft.com][] with any additional questions or comments.

[Microsoft Open Source Code of Conduct]: https://opensource.microsoft.com/codeofconduct/
[Code of Conduct FAQ]: https://opensource.microsoft.com/codeofconduct/faq/
[opencode@microsoft.com]: mailto:opencode@microsoft.com
[angular commit style]: https://github.com/angular/angular/blob/master/CONTRIBUTING.md#-commit-message-guidelines
