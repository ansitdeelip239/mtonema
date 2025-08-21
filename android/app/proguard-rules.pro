# Add project specific ProGuard rules here.
# By default, the flags in this file are appended to flags specified
# in /usr/local/Cellar/android-sdk/24.3.3/tools/proguard/proguard-android.txt
# You can edit the include path and order by changing the proguardFiles
# directive in build.gradle.
#
# For more details, see
#   http://developer.android.com/guide/developing/tools/proguard.html

# Add any project specific keep options here:

# React Native
-keep class com.facebook.react.** { *; }
-keep class com.facebook.hermes.** { *; }
-keep class com.facebook.jni.** { *; }

# Keep your main application class
-keep class com.mtonema.MainApplication { *; }
-keep class com.mtonema.MainActivity { *; }

# React Native modules
-keep class * extends com.facebook.react.bridge.ReactPackage
-keep class * extends com.facebook.react.bridge.NativeModule
-keep class * extends com.facebook.react.bridge.JavaScriptModule

# Keep annotations and line numbers for debugging
-keepattributes *Annotation*
-keepattributes SourceFile,LineNumberTable

# Keep Razorpay (for your payments)
-keep class com.razorpay.** { *; }
-dontwarn com.razorpay.**

# Keep any other third-party libraries you're using
# Add specific rules for other libraries as needed

# General Android rules
-dontwarn com.google.android.gms.**
-keep class com.google.android.gms.** { *; }

# Keep Hermes
-keep class com.facebook.hermes.unicode.** { *; }
-keep class com.facebook.jni.** { *; }
