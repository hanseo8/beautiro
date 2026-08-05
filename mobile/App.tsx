import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { StatusBar } from "expo-status-bar";
import { useEffect, useState } from "react";
import { ActivityIndicator, SafeAreaView, StyleSheet, View } from "react-native";
import type { PublicUser } from "./src/lib/api";
import { fetchMe } from "./src/lib/api";
import { BookScreen } from "./src/screens/BookScreen";
import { BookingsScreen } from "./src/screens/BookingsScreen";
import { HomeScreen } from "./src/screens/HomeScreen";
import { LoginScreen } from "./src/screens/LoginScreen";
import { ProfileScreen } from "./src/screens/ProfileScreen";
import { SignupScreen } from "./src/screens/SignupScreen";

export type RootStackParamList = {
  Login: undefined;
  Signup: undefined;
  Home: undefined;
  Book: undefined;
  Bookings: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator<RootStackParamList>();

export default function App() {
  const [booting, setBooting] = useState(true);
  const [user, setUser] = useState<PublicUser | null>(null);

  useEffect(() => {
    void fetchMe()
      .then(setUser)
      .finally(() => setBooting(false));
  }, []);

  if (booting) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#7c6cf0" />
      </SafeAreaView>
    );
  }

  return (
    <NavigationContainer>
      <StatusBar style="dark" />
      <Stack.Navigator screenOptions={{ headerTintColor: "#111" }}>
        {!user ? (
          <>
            <Stack.Screen name="Login" options={{ title: "Beautiro Login" }}>
              {(props) => <LoginScreen {...props} onAuthed={setUser} />}
            </Stack.Screen>
            <Stack.Screen name="Signup" options={{ title: "Create account" }}>
              {(props) => <SignupScreen {...props} onAuthed={setUser} />}
            </Stack.Screen>
          </>
        ) : (
          <>
            <Stack.Screen name="Home" options={{ title: "Beautiro" }}>
              {(props) => <HomeScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="Book" options={{ title: "Request consultation" }}>
              {(props) => <BookScreen {...props} user={user} />}
            </Stack.Screen>
            <Stack.Screen name="Bookings" options={{ title: "My bookings" }}>
              {(props) => <BookingsScreen {...props} />}
            </Stack.Screen>
            <Stack.Screen name="Profile" options={{ title: "My account" }}>
              {(props) => (
                <ProfileScreen {...props} user={user} onLogout={() => setUser(null)} />
              )}
            </Stack.Screen>
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  center: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#fff",
  },
});
