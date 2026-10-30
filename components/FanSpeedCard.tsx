import { StyleSheet, View } from "react-native";
import Text from "@/components/AppText";
import { COLORS } from "@/constants/Colors";
import { useBoxStore } from "@/store";
import FanGauge from "@/components/FanGauge";
import HumidifierStatus from "@/components/HumidifierStatus";

// MANUAL (veg) home: fan and humidifier side by side, in the same columns
// as the flowering card (label, ring, value, detail)
export default function FanSpeedCard() {
  const fanLevel = useBoxStore((state) => state.devices.fanLevel);
  const fanOn = useBoxStore((state) => state.devices.fan);
  const fanAuto = useBoxStore((state) => state.devices.fanAuto);
  const humidifier = useBoxStore((state) => state.humidifier);

  // the dimmer keeps its level while the fan relay is off - that is 0 %
  const pct = fanOn ? Math.round(Math.min(100, Math.max(0, fanLevel))) : 0;

  return (
    <View style={styles.container}>
      <View style={styles.column}>
        <Text style={styles.label} numberOfLines={1}>
          Fan
        </Text>
        <FanGauge pct={pct} />
        <View style={styles.info}>
          <Text
            style={[styles.value, fanOn && styles.valueOn]}
            numberOfLines={1}
          >
            {fanOn ? `${pct}%` : "OFF"}
          </Text>
          <Text style={styles.detail} numberOfLines={1}>
            {/* stopped by its relay: still show the level it is set to */}
            {!fanOn
              ? `set to ${Math.round(fanLevel)}%`
              : fanAuto
                ? "by temperature"
                : "manual"}
          </Text>
        </View>
      </View>

      {humidifier && (
        <>
          <View style={styles.divider} />
          <View style={styles.column}>
            <HumidifierStatus humidifier={humidifier} column showValue />
          </View>
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginHorizontal: 16,
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    flexDirection: "row",
    alignItems: "center",
  },
  column: {
    flex: 1,
    minWidth: 0,
    alignItems: "center",
    gap: 6,
  },
  divider: {
    width: 1,
    alignSelf: "stretch",
    backgroundColor: COLORS.border,
  },
  info: {
    alignItems: "center",
  },
  label: {
    color: COLORS.textMuted,
    fontSize: 12,
  },
  value: {
    color: COLORS.textMuted,
    fontSize: 15,
    fontWeight: "600",
  },
  valueOn: {
    color: COLORS.text,
  },
  detail: {
    color: COLORS.textMuted,
    fontSize: 11,
  },
});
