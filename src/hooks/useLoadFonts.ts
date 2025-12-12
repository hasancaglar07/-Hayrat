import { useEffect, useState } from "react";
import * as Font from "expo-font";

// Loads bundled font assets and exposes a simple boolean for readiness
export const useLoadFonts = () => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    Font.loadAsync({
      InterVariable: require("../../assets/fonts/Inter-Variable.ttf"),
      "ScheherazadeNew-Regular": require("../../assets/fonts/ScheherazadeNew-Regular.ttf"),
      "ScheherazadeNew-Bold": require("../../assets/fonts/ScheherazadeNew-Bold.ttf"),
    })
      .then(() => setLoaded(true))
      .catch((err) => {
        console.warn("Font load failed", err);
        setError(err instanceof Error ? err : new Error("Font load failed"));
      });
  }, []);

  return { loaded, error };
};
