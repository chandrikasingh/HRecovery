# Himanshu Recovery — Android Project

Ready-to-build Android project for AndroidIDE or another Android Gradle IDE.

## Included
- App name: Himanshu Recovery
- Package: com.himanshu.recovery
- Offline WebView app
- 43,260 vehicle records embedded in `app/src/main/assets/index.html`
- Search by full or partial vehicle number

## Build on Android
1. Extract this ZIP.
2. Open the extracted `HimanshuRecovery` folder as an Android/Gradle project in a compatible Android IDE.
3. Let Gradle sync/download required Android Gradle Plugin dependencies.
4. Run `:app:assembleDebug` or use the IDE's Build APK option.
5. Install the generated debug APK from `app/build/outputs/apk/debug/app-debug.apk`.

## Important
This project is prepared for a standard Android Gradle build. The project uses Android Gradle Plugin 8.5.2, Gradle 8.7, compileSdk 35, and Java 17. If your mobile IDE uses a different supported AGP/Gradle combination, it may ask to update or select a compatible version.
