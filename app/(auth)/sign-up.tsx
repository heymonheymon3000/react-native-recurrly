import { useSignUp } from "@clerk/expo";
import clsx from "clsx";
import { type Href, Link, useRouter } from "expo-router";
import { styled } from "nativewind";
import React from "react";
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";

const SafeAreaView = styled(RNSafeAreaView);

export default function SignUp() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleSubmit = async () => {
    const { error } = await signUp.password({ emailAddress, password });
    if (error) return;
    await signUp.verifications.sendEmailCode();
  };

  const handleVerify = async () => {
    await signUp.verifications.verifyEmailCode({ code });
    if (signUp.status === "complete") {
      await signUp.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          const url = decorateUrl("/");
          router.push(url as Href);
        },
      });
    }
  };

  const isVerifyStep =
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0;

  if (isVerifyStep) {
    return (
      <SafeAreaView className="auth-safe-area">
        <KeyboardAvoidingView
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          className="auth-screen"
        >
          <ScrollView
            className="auth-scroll"
            contentContainerClassName="auth-content"
            keyboardShouldPersistTaps="handled"
          >
            <View className="auth-brand-block">
              <View className="auth-logo-wrap">
                <View className="auth-logo-mark">
                  <Text className="auth-logo-mark-text">R</Text>
                </View>
                <View>
                  <Text className="auth-wordmark">Recurly</Text>
                  <Text className="auth-wordmark-sub">Smart Billing</Text>
                </View>
              </View>
            </View>

            <Text className="auth-title">Verify your email</Text>
            <Text className="auth-subtitle">
              We sent a code to {emailAddress}. Enter it below to confirm your
              account.
            </Text>

            <View className="auth-card">
              <View className="auth-form">
                <View className="auth-field">
                  <Text className="auth-label">Verification code</Text>
                  <TextInput
                    className={clsx(
                      "auth-input",
                      errors.fields.code && "auth-input-error",
                    )}
                    value={code}
                    placeholder="Enter code"
                    placeholderTextColor="rgba(0,0,0,0.35)"
                    onChangeText={setCode}
                    keyboardType="numeric"
                    autoComplete="one-time-code"
                  />
                  {errors.fields.code && (
                    <Text className="auth-error">
                      {errors.fields.code.message}
                    </Text>
                  )}
                </View>

                <Pressable
                  className={clsx(
                    "auth-button",
                    (!code || fetchStatus === "fetching") &&
                      "auth-button-disabled",
                  )}
                  onPress={handleVerify}
                  disabled={!code || fetchStatus === "fetching"}
                >
                  <Text className="auth-button-text">Confirm account</Text>
                </Pressable>

                <Pressable
                  className="auth-secondary-button"
                  onPress={() => signUp.verifications.sendEmailCode()}
                >
                  <Text className="auth-secondary-button-text">
                    Resend code
                  </Text>
                </Pressable>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView className="auth-safe-area">
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        className="auth-screen"
      >
        <ScrollView
          className="auth-scroll"
          contentContainerClassName="auth-content"
          keyboardShouldPersistTaps="handled"
        >
          <View className="auth-brand-block">
            <View className="auth-logo-wrap">
              <View className="auth-logo-mark">
                <Text className="auth-logo-mark-text">R</Text>
              </View>
              <View>
                <Text className="auth-wordmark">Recurly</Text>
                <Text className="auth-wordmark-sub">Smart Billing</Text>
              </View>
            </View>
          </View>

          <Text className="auth-title">Create your account</Text>
          <Text className="auth-subtitle">
            Track and manage all your subscriptions in one place
          </Text>

          <View className="auth-card">
            <View className="auth-form">
              <View className="auth-field">
                <Text className="auth-label">Email</Text>
                <TextInput
                  className={clsx(
                    "auth-input",
                    errors.fields.emailAddress && "auth-input-error",
                  )}
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(0,0,0,0.35)"
                  onChangeText={setEmailAddress}
                  keyboardType="email-address"
                  autoComplete="email"
                />
                {errors.fields.emailAddress && (
                  <Text className="auth-error">
                    {errors.fields.emailAddress.message}
                  </Text>
                )}
              </View>

              <View className="auth-field">
                <Text className="auth-label">Password</Text>
                <TextInput
                  className={clsx(
                    "auth-input",
                    errors.fields.password && "auth-input-error",
                  )}
                  value={password}
                  placeholder="Enter your password"
                  placeholderTextColor="rgba(0,0,0,0.35)"
                  secureTextEntry
                  onChangeText={setPassword}
                  autoComplete="new-password"
                />
                {errors.fields.password && (
                  <Text className="auth-error">
                    {errors.fields.password.message}
                  </Text>
                )}
              </View>

              <Pressable
                className={clsx(
                  "auth-button",
                  (!emailAddress || !password || fetchStatus === "fetching") &&
                    "auth-button-disabled",
                )}
                onPress={handleSubmit}
                disabled={
                  !emailAddress || !password || fetchStatus === "fetching"
                }
              >
                <Text className="auth-button-text">Get started</Text>
              </Pressable>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">Already have an account?</Text>
              <Link href={"/(auth)/sign-in" as Href}>
                <Text className="auth-link">Sign in</Text>
              </Link>
            </View>

            {/* Required for Clerk bot sign-up protection */}
            <View nativeID="clerk-captcha" />
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
