import { useSignIn } from "@clerk/expo";
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

export default function SignIn() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [code, setCode] = React.useState("");

  const handleSubmit = async () => {
    const { error } = await signIn.password({ emailAddress, password });
    if (error) return;

    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          const url = decorateUrl("/");
          router.push(url as Href);
        },
      });
    } else if (
      signIn.status === "needs_client_trust" ||
      signIn.status === "needs_second_factor"
    ) {
      const emailFactor = signIn.supportedSecondFactors?.find(
        (f) => f.strategy === "email_code",
      );
      if (emailFactor) {
        await signIn.mfa.sendEmailCode();
      }
    }
  };

  const handleVerify = async () => {
    await signIn.mfa.verifyEmailCode({ code });
    if (signIn.status === "complete") {
      await signIn.finalize({
        navigate: ({ session, decorateUrl }) => {
          if (session?.currentTask) return;
          const url = decorateUrl("/");
          router.push(url as Href);
        },
      });
    }
  };

  const isVerifyStep =
    signIn.status === "needs_client_trust" ||
    signIn.status === "needs_second_factor";

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

            <Text className="auth-title">Check your email</Text>
            <Text className="auth-subtitle">
              Enter the verification code we sent to your email address
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
                  <Text className="auth-button-text">Verify</Text>
                </Pressable>

                <Pressable
                  className="auth-secondary-button"
                  onPress={() => signIn.mfa.sendEmailCode()}
                >
                  <Text className="auth-secondary-button-text">
                    Resend code
                  </Text>
                </Pressable>
              </View>

              <View className="auth-link-row">
                <Pressable onPress={() => signIn.reset()}>
                  <Text className="auth-link">Start over</Text>
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

          <Text className="auth-title">Welcome back</Text>
          <Text className="auth-subtitle">
            Sign in to continue managing your subscriptions
          </Text>

          <View className="auth-card">
            <View className="auth-form">
              <View className="auth-field">
                <Text className="auth-label">Email</Text>
                <TextInput
                  className={clsx(
                    "auth-input",
                    errors.fields.identifier && "auth-input-error",
                  )}
                  autoCapitalize="none"
                  value={emailAddress}
                  placeholder="Enter your email"
                  placeholderTextColor="rgba(0,0,0,0.35)"
                  onChangeText={setEmailAddress}
                  keyboardType="email-address"
                  autoComplete="email"
                />
                {errors.fields.identifier && (
                  <Text className="auth-error">
                    {errors.fields.identifier.message}
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
                  autoComplete="password"
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
                <Text className="auth-button-text">Sign in</Text>
              </Pressable>
            </View>

            <View className="auth-link-row">
              <Text className="auth-link-copy">New to Recurly?</Text>
              <Link href={"/(auth)/sign-up" as Href}>
                <Text className="auth-link">Create an account</Text>
              </Link>
            </View>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
