import { signInAnonymously, onAuthStateChanged } from "firebase/auth";
import { auth } from "./firebase";

export const initAnonymousAuth = (): Promise<string> => {
  return new Promise((resolve, reject) => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        resolve(user.uid);
      } else {
        signInAnonymously(auth)
          .then((result) => resolve(result.user.uid))
          .catch(reject);
      }
    });
  });
};
