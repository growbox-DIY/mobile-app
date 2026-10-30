import { ReactNode } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import Text from "@/components/AppText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "@/constants/Colors";
import { useBoxStore } from "@/store";
import SignalStatus from "@/components/SignalStatus";

interface AppShellProps {
  children: ReactNode;
  title: string;
  onRefresh?: () => void;
  refreshing?: boolean;
}

export default function AppShell({
  children,
  title,
  onRefresh,
  refreshing = false,
}: AppShellProps) {
  const mode = useBoxStore((state) => state.mode);
  const insets = useSafeAreaInsets();

  return (
    <View style={styles.container}>
      {/* opaque from the top edge down, so scrolled content never shows
          behind the status bar or the title */}
      <View
        style={[
          styles.header,
          { paddingTop: insets.top, height: HEADER_HEIGHT + insets.top },
        ]}
      >
        <Text style={styles.title} numberOfLines={1} adjustsFontSizeToFit>
          {title}
        </Text>

        <SignalStatus />

        <View style={styles.modeStatus}>
          <Text style={styles.modeLabel}>MODE</Text>
          <Text style={styles.modeValue}>{mode}</Text>
        </View>

        {onRefresh && (
          <TouchableOpacity
            style={styles.refreshButton}
            onPress={onRefresh}
            disabled={refreshing}
            activeOpacity={0.7}
          >
            <Ionicons
              name="refresh-outline"
              size={22}
              color={refreshing ? COLORS.textMuted : COLORS.text}
            />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        alwaysBounceVertical={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </View>
  );
}

const HEADER_HEIGHT = 64;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },

  // lets decorative glow from the content spill under the cards around it
  scroll: {
    flex: 1,
    overflow: "visible",
  },

  // flexGrow keeps flex: 1 screens filling the space when content is short
  scrollContent: {
    flexGrow: 1,
  },

  header: {
    zIndex: 1,
    backgroundColor: COLORS.background,
    paddingHorizontal: 20,
    flexDirection: "row",
    alignItems: "center",
  },

  title: {
    flexShrink: 1,
    color: COLORS.text,
    fontSize: 18,
    fontWeight: "700",
  },

  modeStatus: {
    flex: 1,
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "flex-end",
    gap: 5,
    marginRight: 8,
  },

  modeLabel: {
    color: COLORS.textMuted,
    fontSize: 10,
    fontWeight: "600",
  },

  modeValue: {
    color: COLORS.green,
    fontSize: 12,
    fontWeight: "700",
  },

  refreshButton: {
    width: 44,
    height: 44,
    alignItems: "center",
    justifyContent: "center",
  },
});
