## Linux Build Notes 

### 1. Clone the repository
`git clone https://github.com/HERCone/herc-edge-login.git`  
`cd herc-edge-login`  

### 2. Install the dependencies

  #### 2.1. Node: (at least version 8.9.1)
  ##### Using Ubuntu
  `curl -sL https://deb.nodesource.com/setup_8.x | sudo -E bash -`  
  `sudo apt-get install -y nodejs`  

  ##### Using Debian, as root
  `curl -sL https://deb.nodesource.com/setup_8.x | bash -`  
  `apt-get install -y nodejs`  

  #### 2.2. yarn (at least version 1.2.3)
  `curl -sS https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -`  
  `echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list`  
  `sudo apt-get update && sudo apt-get install yarn`  


  #### 2.3. JDK (at least version 8.0)
  `sudo add-apt-repository ppa:webupd8team/java -y`  
  `sudo apt update`  
  `sudo echo oracle-java8-installer shared/accepted-oracle-license-v1-1 select true | /usr/bin/debconf-set-selections`  
  `sudo apt install -y oracle-java8-installer`  

  #### 2.4. Android Studio (version 3.3)
  Download the Android Studio Linux package from https://developer.android.com/studio/ and extract it.  
  To launch Android Studio, in the extracted directory, run the following:  
  `cd android-studio/bin`  
  `./studio.sh`  
  
  OR
    
  Use the Ubuntu Software to install Android Studio.
    
  To set ANDROID_SDK_ROOT environment variable(if not set already), run: 
  `sudo gedit ~/.bashrc`   
  And add the following to the text file:  
  `export ANDROID_SDK_ROOT=$HOME/Android/Sdk`  
  `export PATH=$PATH:$ANDROID_HOME/tools`  
  `export PATH=$PATH:$ANDROID_HOME/platform-tools`  
  `export PATH=$PATH:$ANDROID_HOME/tools/bin`  

  #### 2.5. Android NDK (version 18.1.5063045)
  Install Android NDK: https://developer.android.com/ndk/guides/#download-ndk
    
  To set ANDROID_NDK_ROOT environment variable(if not set already), run: 
  `sudo gedit ~/.bashrc`   
  And add the following to the text file:   
  `export ANDROID_NDK_ROOT=$ANDROID_SDK_ROOT/ndk-bundle`  
    
  #### 2.6. Ninja (version 1.8.2)
  `apt-get install ninja-build`  

  #### 2.7. React native cli (version 2.0.1)
  `npm install -g react-native-cli`  

  #### 2.8. Genymotion (version 3.0.0)
  Download and install Genymotion from https://www.genymotion.com/fun-zone/

### 3. Build and run the application
#### 3.1. Run Genymotion
1. Open Genymotion.
2. Install a device from the available templates.
3. Run the installed device.
    
#### 3.2.1 Using node installer and Genymotion   
`yarn install`  
`react-native run-android`  
    
#### 3.2.2 Using Android Studio and Genymotion  
`yarn install`  
    
1. Open Android Studio.
2. Select open existing project with path herc-edge-login/android/app.
3. Waiting for gradle to finish building.
4. Run the project.


