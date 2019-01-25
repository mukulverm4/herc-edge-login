# Building the iOS version of the project with XCode

For a number of these steps, two options will be provided; The first will involve installing from various sources and will attempt to closely follow the original build notes. The second section will feature as many steps as possible done through HomeBrew to enable a _mostly_ CLI setup from scratch.

- [Building the iOS version of the project with XCode](#building-the-ios-version-of-the-project-with-xcode)
- [Install homebrew](#install-homebrew)
- [Installation from source websites](#installation-from-source-websites)
- [Install nodejs (v 8.4+) and npm (v 5.3+)](#install-nodejs-v-84-and-npm-v-53)
- [Install React Native CLI](#install-react-native-cli)
- [Install Watchman](#install-watchman)
- [Checkout to master branch and install node_modules](#checkout-to-master-branch-and-install-node_modules)
- [Updating brew](#updating-brew)
- [Installing the XCode Build tools](#installing-the-xcode-build-tools)
- [Appendices](#appendices)

## Install homebrew

First install [Homebrew](https://brew.sh/) using this site

### Install nodejs (v 8.4+) and npm (v 5.3+)

Install with homebrew:

```bash
    brew install node
```

Or alternatively download nodejs directly from their website:

```bash
    https://nodejs.org/en/download/  
```

### Install React Native CLI

```bash
    npm install -g react-native-cli
```

### Install Watchman

```bash
brew install watchman
```

### Checkout to master branch and install node_modules

This project uses Yarn to manage its dependancies rather than NPM, you may choose to use either but Yarn is recommended. 

```bash
    cd herc-edge-login
    git checkout master
    yarn
```

### Updating brew

Depending on your enviroment, some of the things we installed might already have been installed previously. For this reason you should probably do a update for brew and run doctor to ensure your config is a-ok.

```bash
brew update
brew doctor
```

### Installing the XCode Build tools

There are two ways you can install the xcode build tools. The first method involves the App Store and is a more complete instalaltion with all of XCodes bits incase you end up needing them. 

To install this way, head to the MacOS App Store and download XCode which is free. From there once the app downloads there will be further prompts to install certain build tools. Unless you are saving on space, install everything it recommends.

Alternatively you can install XCode entirely with the CLI. Enter

```bash
 `xcode-select --install`
```

 and you will be given a number of prompts to approve as each part of XCode is installed.

```bash
react-native run-ios
```

This will launch a Metro Bunlder instance in a terminal

The iOS build will take some time to complete the first time, a good indication that your build is working is the Simulator will be fired up during the process.

### Appendices

When trying to run the build, did you encounter a CMAKE error for the fast-crypto package ? It might be due to you needing the `ninja` tool. Install it and try running your command again.

```bash
brew install ninja

```