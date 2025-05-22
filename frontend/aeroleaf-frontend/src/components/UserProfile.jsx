import { auth } from "../services/firebase";
import { useEffect, useState } from "react";

export default function UserProfile() {
  const [user, setUser] = useState(auth.currentUser);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
    });

    return () => unsubscribe();
  }, []);

  if (!user) return <div>Please login.</div>;

  return (
    <div className="bg-white rounded-xl shadow-md p-4">
      <h2 className="text-xl font-semibold mb-2">User Profile</h2>
      <ul>
        <li>
          <strong>Email:</strong> {user.email}
        </li>
        <li>
          <strong>UID:</strong> {user.uid}
        </li>
      </ul>
    </div>
  );
}
