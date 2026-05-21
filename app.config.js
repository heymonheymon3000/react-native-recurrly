// app.config.js – extends app.json with runtime extras (PostHog config)
// Environment variables are read at build time here, then embedded in the bundle
// via expo-constants so they can be accessed from client code.
const base = require('./app.json')

/** @type {import('expo/config').ExpoConfig} */
module.exports = {
  ...base.expo,
  extra: {
    posthogProjectToken: process.env.POSTHOG_PROJECT_TOKEN,
    posthogHost: process.env.POSTHOG_HOST,
  },
}
