import { useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import { fetchBookings } from "../lib/api";

type Props = NativeStackScreenProps<RootStackParamList, "Bookings">;

export function BookingsScreen(_props: Props) {
  const [bookings, setBookings] = useState<
    Array<{
      id: string;
      status: string;
      createdAt: string;
      preferredDate: string | null;
      services: Array<{ type: string }>;
    }>
  >([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    void fetchBookings()
      .then(setBookings)
      .finally(() => setLoading(false));
  }, []);

  return (
    <View style={styles.container}>
      {loading ? (
        <Text style={styles.muted}>Loading…</Text>
      ) : bookings.length === 0 ? (
        <Text style={styles.muted}>No bookings yet.</Text>
      ) : (
        <FlatList
          data={bookings}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <View style={styles.card}>
              <Text style={styles.status}>{item.status}</Text>
              <Text style={styles.meta}>{item.id}</Text>
              {item.preferredDate ? (
                <Text style={styles.meta}>
                  Preferred: {new Date(item.preferredDate).toLocaleDateString()}
                </Text>
              ) : null}
              <Text style={styles.meta}>
                {item.services.map((service) => service.type).join(" · ")}
              </Text>
            </View>
          )}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  muted: { color: "#64748b" },
  card: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
  },
  status: { color: "#7c6cf0", fontWeight: "700" },
  meta: { marginTop: 6, color: "#64748b", fontSize: 12 },
});
