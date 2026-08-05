import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import type { PublicUser } from "../lib/api";

type Props = NativeStackScreenProps<RootStackParamList, "Home"> & {
  user: PublicUser;
};

export function HomeScreen({ navigation, user }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.eyebrow}>Medical Concierge</Text>
      <Text style={styles.title}>Hello, {user.name}</Text>
      <Text style={styles.subtitle}>
        Book a consultation, track your reservations, and connect with the Beautiro concierge.
      </Text>
      <Pressable style={styles.button} onPress={() => navigation.navigate("Book")}>
        <Text style={styles.buttonText}>Request consultation</Text>
      </Pressable>
      <Pressable style={styles.secondary} onPress={() => navigation.navigate("Bookings")}>
        <Text style={styles.secondaryText}>My bookings</Text>
      </Pressable>
      <Pressable style={styles.secondary} onPress={() => navigation.navigate("Profile")}>
        <Text style={styles.secondaryText}>My account</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  eyebrow: { color: "#7c6cf0", fontWeight: "700", marginBottom: 8 },
  title: { fontSize: 28, fontWeight: "700", color: "#111" },
  subtitle: { marginTop: 12, lineHeight: 22, color: "#64748b" },
  button: {
    backgroundColor: "#7c6cf0",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 28,
  },
  buttonText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  secondary: {
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginTop: 12,
  },
  secondaryText: { color: "#111", fontWeight: "600" },
});
