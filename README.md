# Penny Up: app para tiendas (Capacitor)

El juego es el HTML de `www/` (misma base que la PWA de prueba) empaquetado como app nativa para Google Play y App Store.

- Id de la app: `com.pennyup.game` (no se puede cambiar después de publicar).
- `www/` = PWA de prueba con estos cambios de "store build": sin estado inicial de prueba, autoguardado cada 30 s, sin el truco de JSON de testers en Ajustes, títulos "Estadísticas"/"Guardado", `native.js` (vibración nativa, guardado espejado en almacenamiento nativo, oculta barra de estado, cierra la pantalla de carga) y `privacy.html` (completar `{{DEVELOPER}}`, `{{EMAIL}}`, `{{DATE}}`).
- Plugins: haptics, preferences, status-bar, splash-screen, local-notifications (aviso de "alcancía llena", inexacto: sin permiso de alarma exacta). Solo vertical; iOS solo iPhone.
- `assets/` = fuentes de íconos y splash. Regenerar con `npm run assets`.

## Compilar (en la Mac)
1. Node 22+, Android Studio y Xcode instalados.
2. `npm install` y `npx cap sync`.
3. Android: `cd android && JAVA_HOME=<JDK 21> ./gradlew bundleRelease` (el JDK que trae Android Studio es demasiado nuevo para Gradle 8.14). La firma se lee de `~/PennyUp-keys/keystore.properties`, fuera del repo; sin ese archivo el .aab sale sin firmar. También se puede usar `npx cap open android` → Build > Generate Signed App Bundle (.aab). La clave de subida se crea ahí y queda en la Mac: guardarla con respaldo, sin ella no se pueden subir actualizaciones (Play App Signing permite resetearla, pero lleva días).
4. iOS: `npx cap open ios` → elegir el equipo de Apple Developer en Signing & Capabilities → Product > Archive → subir a App Store Connect / TestFlight.

## Actualizar el juego
Copiar el `index.html` nuevo a `www/` re-aplicando los cambios de "store build" de arriba, subir `versionCode`/`versionName` (android/app/build.gradle) y la versión en Xcode, y `npx cap sync`.

Este entorno en la nube no puede compilar: las herramientas de Android (dl.google.com) están bloqueadas y Xcode solo corre en macOS.
