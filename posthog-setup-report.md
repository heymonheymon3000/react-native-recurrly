<wizard-report>
# PostHog post-wizard report

The wizard has completed a deep integration of PostHog analytics into the Recurly React Native (Expo) app. Here is a summary of all changes made:

## Changes summary

- **`app.config.js`** (new) — Converts `app.json` to a dynamic config that reads `POSTHOG_PROJECT_TOKEN` and `POSTHOG_HOST` from environment variables and exposes them as Expo constants extras.
- **`src/config/posthog.ts`** (new) — PostHog singleton client configured via `expo-constants`. Reads token and host from `app.config.js` extras; disables itself gracefully if no token is set.
- **`app/_layout.tsx`** — Wraps the app in `PostHogProvider` (inside `ClerkProvider`) and adds manual screen tracking for Expo Router using `usePathname` + `useGlobalSearchParams`.
- **`app/(auth)/sign-in.tsx`** — Captures `user_signed_in` (with method property) and `user_sign_in_failed` (with error details). Calls `posthog.identify()` with the user's email on successful sign-in.
- **`app/(auth)/sign-up.tsx`** — Captures `user_sign_up_started` on form submit and `user_signed_up` on email verification. Calls `posthog.identify()` with `$set_once: { sign_up_date }` on completion.
- **`app/(tabs)/settings.tsx`** — Captures `user_signed_out` before sign-out and calls `posthog.reset()` to clear the PostHog identity.
- **`app/(tabs)/index.tsx`** — Captures `subscription_expanded` and `subscription_collapsed` with `subscription_name`, `subscription_category`, and `subscription_billing` properties when users tap subscription cards.
- **`app/(tabs)/insights.tsx`** — Captures `insights_viewed` on component mount to track Insights tab adoption.
- **`.env`** — PostHog project token and host set as environment variables.
- **`eslint.config.js`** — Added `posthog-react-native` to `import/no-unresolved` ignore list (false positive — package resolves correctly at build time).

## Events tracked

| Event | Description | File |
|---|---|---|
| `user_signed_in` | User successfully signed in with email/password or MFA | `app/(auth)/sign-in.tsx` |
| `user_sign_in_failed` | Sign-in attempt failed (error message and code captured) | `app/(auth)/sign-in.tsx` |
| `user_sign_up_started` | User submitted the initial sign-up form | `app/(auth)/sign-up.tsx` |
| `user_signed_up` | User completed registration and verified their email | `app/(auth)/sign-up.tsx` |
| `user_signed_out` | User explicitly signed out from settings | `app/(tabs)/settings.tsx` |
| `subscription_expanded` | User tapped a subscription card to expand its details | `app/(tabs)/index.tsx` |
| `subscription_collapsed` | User tapped an expanded card to collapse it | `app/(tabs)/index.tsx` |
| `insights_viewed` | User navigated to the Insights tab | `app/(tabs)/insights.tsx` |

## Next steps

We've built some insights and a dashboard for you to keep an eye on user behavior, based on the events we just instrumented:

- [Analytics basics dashboard](/dashboard/1615252)
- [Sign-ups & Sign-ins over time](/insights/DX2mb7tm) — daily trend of new registrations vs. returning sign-ins
- [Sign-up Conversion Funnel](/insights/n4GtzyNW) — drop-off between form submit and email verification
- [Subscription Engagement](/insights/nUVOwiMy) — how often users explore their subscription details
- [Sign-out Rate (Churn Signal)](/insights/FXdre1BL) — rising sign-outs may indicate dissatisfaction
- [Insights Feature Adoption](/insights/ERzN8oRu) — unique daily users visiting the Insights tab

### Agent skill

We've left an agent skill folder in your project at `.claude/skills/integration-expo/`. You can use this context for further agent development when using Claude Code. This will help ensure the model provides the most up-to-date approaches for integrating PostHog.

</wizard-report>
