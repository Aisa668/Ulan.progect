import { jwtDecode } from "jwt-decode";
import { useEffect, useState } from "react";

export const AboutPage = () => {
  const [token, setToken] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    try {
      const decoded = jwtDecode(token);
      console.log(decoded);
      setToken(decoded);
    } catch (error) {
      console.error("Ошибка декодирования токена:", error);
    }
  }, []);

  return (
    <div>
      <h1>ABOUT</h1>
      {token && (
        <>
          <div>{token.email}</div>
          <div>{token.role}</div>
          <div>{token.id}</div>
        </>
      )}
      {!token && <div>НЕТ ТОКЕНА</div>}
    </div>
  );
};
