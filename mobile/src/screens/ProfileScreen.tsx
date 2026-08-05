import { Pressable, StyleSheet, Text, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamList } from "../../App";
import { logout, type PublicUser } from "../lib/api";

type Props = NativeStackScreenProps<RootStackParamList, "Profile"> & {
  user: PublicUser;
  onLogout: () => void;
};

export function ProfileScreen({ user, onLogout }: Props) {
  return (
    <View style={styles.container}>
      <Text style={styles.name}>{user.name}</Text>
      <Text style={styles.meta}>{user.email}</Text>
      <Text style={styles.meta}>
        Email verified: {user.emailVerified ? "Yes" : "No"}
      </Text>
      <Pressable
        style={styles.button}
        onPress={() => {
          void logout().finally(onLogout);
        }}
      >
        <Text style={styles.buttonText}>Log out</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: "#fff" },
  name: { fontSize: 24, fontWeight: "700", color: "#111" },
  meta: { marginTop: 8, color: "#64748b" },
  button: {
    marginTop: 24,
    borderWidth: 1,
    borderColor: "#e5e7eb",
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
  },
  buttonText: { fontWeight: "700", color: "#111" },
});
