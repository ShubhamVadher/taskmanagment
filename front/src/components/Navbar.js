import React, { useState, useEffect } from "react";
import { useAuth0 } from "@auth0/auth0-react";
import axios from "axios";
import { Link } from "react-router-dom";
export const Navbar = () => {
  const { loginWithRedirect, logout, user, isAuthenticated } = useAuth0();
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    const sendToBackend = async () => {
      if (isAuthenticated && user) {
        try {
            const isSocial = user.identities?.[0]?.isSocial ?? false;
            const nameToSend = isSocial? user.name:user.nickname || user.name || user.email;
            const response = await axios.post(
            "http://localhost:5000/signin",
            {
              email: user.email,
              name: nameToSend,
            }
          );

          setDisplayName(response.data.name);
        } catch (err) {
          console.error("Signin failed:", err);

          setDisplayName(user.name || user.nickname || user.username || "");
        }
      }
    };

    sendToBackend();
  }, [isAuthenticated, user]);

  const handleLogin = () => loginWithRedirect();

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        padding: "10px 20px",
        borderBottom: "1px solid #ccc",
      }}
    >
      <Link style={{ fontWeight: "bold", fontSize: "20px" }} to="/">TaskManager</Link>

      <div>
        {isAuthenticated ? (
          <>
            <span style={{ marginRight: "10px" }}>Hello, {displayName}</span>
            <button
              onClick={() =>
                logout({ logoutParams: { returnTo: window.location.origin } })
              }
            >
              Logout
            </button>
          </>
        ) : (
          <button onClick={handleLogin}>Log In</button>
        )}
      </div>
    </div>
  );
};
