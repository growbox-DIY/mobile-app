import { useEffect, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { COLORS } from "@/constants/Colors";
import { useBoxStore } from "@/store";
import { useBoxControllerContext } from "@/context/BoxControllerContext";
import RangeControl from "@/components/controlers/RangeControl";
import SwitchControl from "@/components/controlers/SwitchControl";

// the slider fires on every move; the ESP serves one request at a time, so
// only the value the finger stopped on is sent
const SEND_DELAY_MS = 400;

// TFT monitor (growbox-monitor): screen on / off and its day brightness.
// The monitor reads them from the ESP on its next poll, within 15 s.
export default function MonitorControl() {
  const monitor = useBoxStore((state) => state.monitor);
  const { setMonitor } = useBoxControllerContext();
  const pending = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(
    () => () => {
      if (pending.current) clearTimeout(pending.current);
    },
    [],
  );

  // monitor not plugged in (or firmware without it)
  if (!monitor) return null;

  const setBrightness = (brightness: number) => {
    if (pending.current) clearTimeout(pending.current);

    pending.current = setTimeout(() => {
      pending.current = null;
      void setMonitor({ brightness }).catch(() => undefined);
    }, SEND_DELAY_MS);
  };

  return (
    <View style={styles.container}>
      <SwitchControl
        title="Monitor"
        value={monitor.enabled}
        onChange={(enabled) => {
          void setMonitor({ enabled }).catch(() => undefined);
        }}
        icon="tv-outline"
        iconColor={COLORS.blue}
      />

      {monitor.enabled && (
        <RangeControl
          label="Monitor brightness"
          value={monitor.brightness}
          onChange={setBrightness}
          min={5}
          max={100}
          step={5}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 10,
    gap: 10,
  },
});
