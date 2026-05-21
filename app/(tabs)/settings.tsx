import { useClerk, useUser } from "@clerk/expo";
import dayjs from "dayjs";
import { styled } from "nativewind";
import React from "react";
import { Image, Pressable, Text, View } from "react-native";
import { SafeAreaView as RNSafeAreaView } from "react-native-safe-area-context";
import { usePostHog } from "posthog-react-native";

const SafeAreaView = styled(RNSafeAreaView);

const truncateId = (id: string) =>
  id.length > 14 ? `${id.slice(0, 8)}...${id.slice(-4)}` : id;

const Settings = () => {
  const { signOut } = useClerk();
  const { user, isLoaded } = useUser();
  const posthog = usePostHog();

  if (!isLoaded || !user) return null;

  const displayName = user.fullName ?? user.primaryEmailAddress?.emailAddress ?? "Account";
  const email = user.primaryEmailAddress?.emailAddress;
  const joinedDate = user.createdAt ? dayjs(user.createdAt).format("MMMM YYYY") : null;

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <Text className="text-2xl font-sans-bold text-primary mb-6">Settings</Text>

      {/* Profile card */}
      <View className="rounded-3xl border border-border bg-card p-5 gap-4 mb-6">
        {/* Avatar + info row */}
        <View className="flex-row items-center gap-4">
          {user.imageUrl ? (
            <Image
              source={{ uri: user.imageUrl }}
              className="size-16 rounded-full"
            />
          ) : (
            <View className="size-16 items-center justify-center rounded-full bg-accent">
              <Text className="text-2xl font-sans-extrabold text-background">
                {displayName.charAt(0).toUpperCase()}
              </Text>
            </View>
          )}

          <View className="flex-1 gap-0.5">
            <Text className="text-xl font-sans-bold text-primary" numberOfLines={1}>
              {displayName}
            </Text>
            {email && (
              <Text className="text-sm font-sans-medium text-muted-foreground" numberOfLines={1}>
                {email}
              </Text>
            )}
            {joinedDate && (
              <Text className="text-sm font-sans-medium text-muted-foreground">
                Joined {joinedDate}
              </Text>
            )}
          </View>
        </View>

        {/* Divider */}
        <View className="h-px bg-border" />

        {/* Account ID row */}
        <View className="flex-row items-center justify-between">
          <Text className="text-sm font-sans-semibold text-muted-foreground">Account ID</Text>
          <Text className="text-sm font-sans-medium text-primary">{truncateId(user.id)}</Text>
        </View>
      </View>

      <Pressable
        className="auth-button"
        onPress={async () => {
          posthog.capture("user_signed_out");
          try {
            await signOut();
            await posthog.flush();
            posthog.reset();
          } catch (error) {
            console.error("Sign out failed:", error);
          }
        }}
      >
        <Text className="auth-button-text">Sign out</Text>
      </Pressable>
    </SafeAreaView>
  );
};
export default Settings;
