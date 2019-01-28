# Building the Android version of the project

For a number of these steps, two options will be provided; The first will involve installing from various sources and will attempt to closely follow the original build notes. The second section will feature as many steps as possible done through HomeBrew to enable a _mostly_ CLI setup from scratch.

## Install homebrew

First install [Homebrew](https://brew.sh/) using this site.

## Installation from source websites

### Install nodejs (v 8.4+) and npm (v 5.3+)

Install with homebrew:

```bash
    brew install node
```

Or alternatively download nodejs directly from their website:

```bash
    https://nodejs.org/en/download/  
```

#### Install React Native CLI

```bash
    npm install -g react-native-cli
```

#### Install Watchman

```bash
brew install watchman
```

#### Checkout to master branch and install node_modules

This project uses Yarn to manage its dependancies rather than NPM, you may choose to use either but Yarn is recommended. 

```bash
    cd herc-edge-login
    git checkout master
    yarn
```

#### Android NDK Setup

(MacOS) If the NDK is already installed from Android Studio, it should be in `~/Library/Android/sdk/ndk-bundle`.
`/Users/[user]/Library/Android/sdk/ndk-bundle`.

If not, download and unzip the NDK from https://developer.android.com/ndk/index.html

Or you can install some the needed bits with homebrew:

```bash
brew cask install java android-sdk
```

##### Android NDK HOME

The `ANDROID_NDK_HOME` environment variable needs to be set to the path of the NDK. You should also have a `ANDROID_HOME ` environment variable for general android work that you can leverage to compose the `ANDROID_NDK_HOME`.

> Important Note: Depending on how you installed android SDK (Home brew vs webstie installer), you will need to have a different `ANDROID_HOME` setting as the two installations have different locations.

`ANDROID_HOME` location when installed from website

```bash
 export ANDROID_HOME=$HOME/Library/Android/sdk
```

`ANDROID_HOME` location when installed with homebrew

```bash
export ANDROID_HOME=/usr/local/share/android-sdk
```

This is very important for a succesful installation as all the other environment variables will depend on `ANDROID_HOME`. The goal of this is you only need to change 1 value for the others to update. 

We can now leverage `ANDROID_HOME` to compose the `ANDROID_NDK_HOME`.
```bash
    export ANDROID_NDK_HOME=$ANDROID_HOME/ndk-bundle
```

```bash
export ANDROID_NDK_HOME="/usr/local/share/android-ndk"
```

 Additionally for access to different android-related tools which may prevent potential errors during build export this to your PATH 

 ```bash
export PATH="$PATH:$ANDROID_SDK/tools:$ANDROID_SDK/platform-tools:$ANDROID_NDK"
export PATH="$PATH:$ANDROID_SDK/tools/bin:$ANDROID_SDK/emulator"
 ```

 Load you bash profile changes with :

```bash
source $HOME/.bash_profile
 ```

#### Updating brew, sdkmanager and using avdmanager,genymotion

Depending on your enviroment, some of the things we installed might already have been installed previously. For this reason you should probably do a update for brew and run doctor to ensure your config is a-ok.

```bash
brew update
brew doctor
```

 Additionally you should update sdkmanager specifically.

```bash
sdkmanager --update 
```

> Note: Depending on your setup you might need `android update sdk --no-ui` instead

Ensure to accept the license agreements for the SDK platform version you want to use, here is an example of this when using the homebrew installation steps :

```bash
sdkmanager "platforms;android-27" "build-tools;27.0.3"
```

#### Choosing a virtual device image

There are a list of virtual devices at your disposal with various sizes and memory provisions. Depending on your build machine, you may need to select a smaller screensize emulator with less RAM for best reaults. 

You have options for how you want to run virtual devices. You can try to manage it with `avdmanager` and `emulator`. Or, you can manage with genymotion.

##### Genymotion

Install genymotion with homebrew:

```bash
brew cask install genymotion
```

Depending on your setup of OSx/MacOS, you will likely encounter an issue here. Genymotion uses the `virtualbox` cask as a dependancy, meaning this will be installed also. 
During writing this guide virtualbox failed installing on both Sierra and Mojave due to a cryptic issue. it turns out the issue for this was Oracle being blocked by the native security settings. If this happens to you head to :
`System Preferences → Security & Privacy → General` where you may something by Oracle was blocked. Allow this and retry the installation.

You should now have genymotion available as a System app which you can open using spotlight or directly from application. You may be given a warning when opening which will show it was gotten with homebrew.

##### Running on Genymotion

To get genymotion working you may need ot sign into an account with an existing license or select personal use once signed in, an EULA may need to be approved if you never used this tool before.

Ensure your android sdk is set on genymotion to the right location. To check this, head to the word `Genymotion` in the top left of your menu bar with the tool open and then select Preferences. From there you should be in settings Settings, where you can see ADB in the sidemenu. Select custom android sdk location and add the `ANDROID_HOME` location that we set earlier. 

Review [This step]() for guidance on which value to set

You should now be able to select a virtual device to boot up using Genymotion. Add a new device and then run this device.

Lastly, run the react native app in the emulator

```bash
react-native run-android
```

##### Avdmanager and Emulator

To list all avaialble virtual devices use :

```bash
avdmanager list avd
```

Once you have located a emulator you want to use, take its name and paste into this command :

```bash
emulator -avd <NAME>
```

Where `<NAME>` is to be replaced with your desired device name. 

> Note: This will take some time.

Lastly, run the react native app in the emulator

```bash
react-native run-android
```

This will launch a Metro Bunlder instance in a terminal

###### Appendices

When trying to run the build, did you encounter a CMAKE error for the fast-crypto package ? It might be due to you needing the `ninja` tool. Install it and try running your command again.

```bash
brew install ninja

```