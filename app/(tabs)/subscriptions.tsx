import {
  Text,
  View,
  FlatList,
  TextInput,
  Platform,
  Keyboard,
} from "react-native";
import React, { useEffect, useMemo, useState } from "react";
import {
  SafeAreaView as RNSafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import { styled } from "nativewind";
import { useSubscriptions } from "@/lib/subscriptionsStore";
import SubscriptionCard from "@/components/SubscriptionCard";
import ListHeading from "@/components/ListHeading";
import { components } from "@/constants/theme";

const SafeAreaView = styled(RNSafeAreaView);

const Subscriptions = () => {
  const [query, setQuery] = useState("");
  const [expandedSubscriptionId, setExpandedSubscriptionId] = useState<
    string | null
  >(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const showEvt =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvt =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";
    const showSub = Keyboard.addListener(showEvt, (e) => {
      setKeyboardHeight(e.endCoordinates.height);
    });
    const hideSub = Keyboard.addListener(hideEvt, () => {
      setKeyboardHeight(0);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  const tabBarSpace =
    components.tabBar.height +
    Math.max(insets.bottom, components.tabBar.horizontalInset);
  const bottomPadding =
    keyboardHeight > 0
      ? keyboardHeight - insets.bottom + 16
      : tabBarSpace + 16;

  const subscriptions = useSubscriptions();

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return subscriptions;
    return subscriptions.filter((sub) => {
      return (
        sub.name?.toLowerCase().includes(q) ||
        sub.category?.toLowerCase().includes(q) ||
        sub.plan?.toLowerCase().includes(q) ||
        sub.billing?.toLowerCase().includes(q)
      );
    });
  }, [query, subscriptions]);

  const ListHeader = (
    <View className="mb-4">
      <ListHeading title="Subscriptions" />
      <TextInput
        value={query}
        onChangeText={setQuery}
        placeholder="Search subscriptions..."
        placeholderTextColor="#9ca3af"
        className="bg-card rounded-2xl px-4 py-3 text-base text-foreground mb-2"
        autoCorrect={false}
        autoCapitalize="none"
        clearButtonMode="while-editing"
      />
    </View>
  );

  return (
    <SafeAreaView className="flex-1 bg-background p-5">
      <FlatList
        ListHeaderComponent={ListHeader}
        data={filtered}
        renderItem={({ item }) => (
          <SubscriptionCard
            {...item}
            expanded={expandedSubscriptionId === item.id}
            onPress={() =>
              setExpandedSubscriptionId((currentId) =>
                currentId === item.id ? null : item.id,
              )
            }
          />
        )}
        keyExtractor={(item) => item.id?.toString() ?? item.name}
        extraData={expandedSubscriptionId}
        ItemSeparatorComponent={() => <View className="h-4" />}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        keyboardDismissMode="on-drag"
        ListEmptyComponent={
          <Text className="home-empty-state">No subscriptions found.</Text>
        }
        contentContainerStyle={{ paddingBottom: bottomPadding }}
      />
    </SafeAreaView>
  );
};

export default Subscriptions;
