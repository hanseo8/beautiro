import { useState } from "react";
import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import { createBooking, type PublicUser } from "../lib/api";

type Props = NativeStackScreenProps<RootStackParamList, "Book"> & {
  user: PublicUser;
};

export function BookScreen({ user }: Props) {
  const [preferredDate, setPreferredDate] = useState("");
  const [notes, setNotes] = useState("");
  const [van, setVan] = useState(true);
  const [interpreter, setInterpreter] = useState(true);
  const [fx, setFx] = useState(false);
  const [doneId, setDoneId] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const id = await createBooking({
        locale: user.locale,
        guestName: user.name,
        guestEmail: user.email,
        guestPhone: user.phone ?? "000000",
        preferredDate: preferredDate || undefined,
        notes: notes || undefined,
        services: { van, interpreter, fx },
      });
      setDoneId(id);
    } catch {
      setError("Could not submit booking.");
    } finally {
      setLoading(false);
    }
  }

  if (doneId) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Request received</Text>
        <Text style={styles.subtitle}>Reference: {doneId}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Preferred date (YYYY-MM-DD)</Text>
      <TextInput style={styles.input} value={preferredDate} onChangeText={setPreferredDate} />
      <Text style={styles.label}>Notes</Text>
      <TextInput
        style={[styles.input, styles.notes]}
        multiline
        value={notes}
        onChangeText={setNotes}
      />
      <Toggle label="Private transport" value={van} onPress={() => setVan((v) => !v)} />
      <Toggle label="Medical interpreter" value={interpreter} onPress={() => setInterpreter((v) => !v)} />
      <Toggle label="Payment & FX support" value={fx} onPress={() => setFx((v) => !v)} />
      {error ? <Text style={styles.error}>{error}</Text> : null}
      <Pressable style={styles.button} onPress={() => void submit()} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Submitting…" : "Submit request"}</Text>
      </Pressable>
    </View>
  );
}

function Toggle({
  label,
  value,
  onPress,
}: {
  label: string;
  value: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable style={styles.toggle} onPress={onPress}>
      <Text style={styles.toggleText}>{label}</Text>
      <Text style={styles.toggleState}>{value ? "On" : "Off"}</Text>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "700", color: "#111" },
  subtitle: { marginTop: 12, color: "#64748b" },
  label: { marginTop: 12, marginBottom: 6, fontWeight: "600", color: "#111" },
  input: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 14,
  },
  notes: { minHeight: 90, textAlignVertical: "top" },
  toggle: {
    marginTop: 10,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 12,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  toggleText: { fontWeight: "600" },
  toggleState: { color: "#7c6cf0", fontWeight: "700" },
  button: {
    backgroundColor: "#7c6cf0",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 20,
  },
  buttonText: { color: "#fff", fontWeight: "700" },
  error: { color: "#b91c1c", marginTop: 12 },
});
