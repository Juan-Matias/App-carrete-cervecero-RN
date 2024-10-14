/* eslint-disable */
import * as Router from 'expo-router';

export * from 'expo-router';

declare module 'expo-router' {
  export namespace ExpoRouter {
    export interface __routes<T extends string = string> extends Record<string, unknown> {
      StaticRoutes: `/` | `/(app)` | `/(app)/Cart` | `/(app)/Home` | `/(app)/Orders` | `/(app)/Products` | `/(app)/Profile` | `/Cart` | `/Home` | `/HomeScreen` | `/Orders` | `/PasswordRecovery` | `/Products` | `/Profile` | `/SignInScreen` | `/SignUpScreen` | `/_sitemap`;
      DynamicRoutes: never;
      DynamicRouteTemplate: never;
    }
  }
}
