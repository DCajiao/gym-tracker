import jwt from "jsonwebtoken";

/**
 * Middleware que verifica el JWT en el header Authorization.
 * Adjunta req.user = { id, email } si el token es válido.
 */
export function requireAuth(req, res, next) {
  const header = req.headers.authorization;
  if (!header?.startsWith("Bearer ")) {
    return res.status(401).json({ error: "Token requerido" });
  }

  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    req.user = { id: payload.sub, email: payload.email };
    next();
  } catch {
    return res.status(401).json({ error: "Token inválido o expirado" });
  }
}
