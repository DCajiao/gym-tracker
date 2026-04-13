import { useState } from "react";
import { useAuth } from "@/context/AuthContext";
import { Dumbbell, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const LoginPage = () => {
  const { login, register } = useAuth();
  const [mode, setMode]         = useState<"login" | "register">("login");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState<string | null>(null);
  const [loading, setLoading]   = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (mode === "login") {
        await login(email, password);
      } else {
        await register(email, password);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Top decorative bar */}
      <div className="h-1 w-full bg-primary" />

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="w-full max-w-sm space-y-8">
          {/* Logo block */}
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                <Dumbbell className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1
                  className="text-4xl font-black uppercase tracking-tight leading-none"
                  style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 900 }}
                >
                  GymTracker
                </h1>
                <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
                  Tu entrenamiento, organizado
                </p>
              </div>
            </div>
          </div>

          {/* Mode heading */}
          <div>
            <h2
              className="text-2xl font-bold uppercase tracking-wide text-foreground"
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 800 }}
            >
              {mode === "login" ? "Accede" : "Regístrate"}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              {mode === "login"
                ? "Introduce tu email y contraseña"
                : "Crea tu cuenta para empezar"}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Email
              </label>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="w-full bg-secondary border border-border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/40"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                Contraseña
              </label>
              <input
                type="password"
                required
                minLength={8}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder={mode === "register" ? "Mínimo 8 caracteres" : "••••••••"}
                className="w-full bg-secondary border border-border rounded-lg px-3 py-3 text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-all placeholder:text-muted-foreground/40"
              />
            </div>

            {error && (
              <p className="text-xs text-destructive bg-destructive/10 border border-destructive/20 rounded-lg px-3 py-2 font-medium">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full flex items-center justify-center gap-2 py-3.5 rounded-xl font-bold text-sm uppercase tracking-widest transition-all",
                loading
                  ? "bg-primary/50 text-primary-foreground cursor-default"
                  : "bg-primary text-primary-foreground active:scale-95"
              )}
              style={{ fontFamily: "'Barlow Condensed', sans-serif", fontWeight: 700, letterSpacing: "0.1em" }}
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              {mode === "login" ? "Entrar" : "Crear cuenta"}
            </button>
          </form>

          {/* Toggle mode */}
          <p className="text-center text-xs text-muted-foreground">
            {mode === "login" ? "¿No tienes cuenta?" : "¿Ya tienes cuenta?"}
            {" "}
            <button
              onClick={() => { setMode(mode === "login" ? "register" : "login"); setError(null); }}
              className="text-primary font-bold hover:underline"
            >
              {mode === "login" ? "Regístrate" : "Inicia sesión"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
