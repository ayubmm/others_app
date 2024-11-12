import React, {
  createContext,
  useState,
  useContext,
  ReactNode,
  useEffect,
} from "react";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { RouteProp, useNavigation } from "@react-navigation/native";
import { RootStackParamList } from "@/types/navigation";
import { NativeStackNavigationProp } from "react-native-screens/lib/typescript/native-stack/types";

interface AuthContextType {
  token: string | null;
  role: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  getBerita: () => Promise<any>;
  setRole: (newRole: string | null) => Promise<void>; // Add setRole function to the interface
}

interface AuthProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

type NavigationProp = NativeStackNavigationProp<
  RootStackParamList,
  "detail/detailevent"
>;

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [token, setToken] = useState<string | null>(null);
  const [role, setRoleState] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigation = useNavigation<NavigationProp>();

  useEffect(() => {
    const loadAuthData = async () => {
      try {
        const storedToken = await AsyncStorage.getItem("token");
        const storedRole = await AsyncStorage.getItem("role");

        if (storedToken) setToken(storedToken);
        if (storedRole) setRoleState(storedRole);
      } catch (error) {
        console.error("Failed to load auth data:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAuthData();
  }, []);

  useEffect(() => {
    if (!token && !loading) {
      navigation.navigate("(login)/index");
    }
  }, [token, loading]);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const response = await axios.post(
        "https://skripsi.krayu.shop/api/alumni/login",
        { email, password }
      );
      const { token, role } = response.data;

      await AsyncStorage.setItem("token", token);
      await AsyncStorage.setItem("role", role);
      setToken(token);
      setRoleState(role);
    } catch (error) {
      console.error("Login failed:", error);
      throw new Error("Login gagal. Periksa kembali email dan password Anda.");
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      await AsyncStorage.removeItem("token");
      await AsyncStorage.removeItem("role");
      setToken(null);
      setRoleState(null);
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      setLoading(false);
    }
  };

  const setRole = async (newRole: string | null) => {
    try {
      setRoleState(newRole); // Update role in state
      if (newRole) {
        await AsyncStorage.setItem("role", newRole); // Save new role in AsyncStorage
      } else {
        await AsyncStorage.removeItem("role"); // Remove role if set to null
      }
    } catch (error) {
      console.error("Failed to set role:", error);
    }
  };

  const getBerita = async () => {
    setLoading(true);
    try {
      const storedToken = await AsyncStorage.getItem("token");
      if (!storedToken)
        throw new Error("Token tidak ditemukan, silakan login ulang.");

      const response = await axios.get(
        "https://six-bears-shout.loca.lt/api/berita",
        {
          headers: { Authorization: `Bearer ${storedToken}` },
        }
      );

      return response.data;
    } catch (error) {
      console.error("Failed to fetch berita:", error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{ token, role, login, logout, getBerita, loading, setRole }}
    >
      {children}
    </AuthContext.Provider>
  );
};
