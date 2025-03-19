import React, { useState } from "react";
import { useGlobalContext } from '../../context/GlobalState';

function Authenticator() {
  const { isAuth, loginApi, message, error, email, setEmail, password, setPassword } = useGlobalContext();

  const handleLogin = (e) => {
    e.preventDefault();
    loginApi()
  };

  return (
    <>
      {!isAuth && (
        <div style={styles.container}>
          <form onSubmit={handleLogin} style={styles.form}>
            <h1 style={styles.title}>Connexion</h1>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              style={styles.input}
            />
            <input
              type="password"
              placeholder="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              style={styles.input}
            />
            {error && <p style={styles.error}>{error}</p>}
            {message && <p style={styles.message}>{message}</p>}
            <button type="submit" style={styles.button}>
              Se connecter
            </button>
          </form>
        </div>
      )}
    </>
  )
};

export default Authenticator

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    backgroundColor: "#f7f8fa",
  },
  title: {
    fontSize: "2rem",
    color: "#333",
    marginBottom: "1.5rem",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    maxWidth: "400px",
    backgroundColor: "#fff",
    padding: "2rem",
    marginBottom: "150px",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  input: {
    padding: "0.75rem",
    margin: "0.5rem 0",
    borderRadius: "4px",
    border: "1px solid #ccc",
    fontSize: "1rem",
  },
  button: {
    padding: "0.75rem",
    marginTop: "1rem",
    backgroundColor: "#4CAF50",
    color: "#fff",
    border: "none",
    borderRadius: "4px",
    fontSize: "1rem",
    cursor: "pointer",
  },
  error: {
    color: "red",
    marginTop: "1rem",
    fontSize: "0.875rem",
  },
  message: {
    color: "red",
    marginTop: "1rem",
    fontSize: "0.875rem",
  },
};
