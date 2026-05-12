function AuthForm({
  mode,
  formData,
  onChange,
  onSubmit,
  onToggleMode
}) {
  const isRegister = mode === "register";

  return (
    <section className="panel auth-panel">
      <h2>{isRegister ? "Create Account" : "Login"}</h2>

      <form onSubmit={onSubmit} className="clip-form">
        {isRegister && (
          <>
            <label>
              Username
              <input
                name="username"
                value={formData.username}
                onChange={onChange}
                placeholder="username"
                required
              />
            </label>

            <label>
              Email
              <input
                name="email"
                type="email"
                value={formData.email}
                onChange={onChange}
                placeholder="email@example.com"
                required
              />
            </label>
          </>
        )}

        {!isRegister && (
          <label>
            Username or Email
            <input
              name="usernameOrEmail"
              value={formData.usernameOrEmail}
              onChange={onChange}
              placeholder="username or email"
              required
            />
          </label>
        )}

        <label>
          Password
          <input
            name="password"
            type="password"
            value={formData.password}
            onChange={onChange}
            placeholder="password"
            required
          />
        </label>

        <button type="submit">
          {isRegister ? "Register" : "Login"}
        </button>
      </form>

      <button type="button" className="secondary auth-toggle" onClick={onToggleMode}>
        {isRegister
          ? "Already have an account? Login"
          : "Need an account? Register"}
      </button>
    </section>
  );
}

export default AuthForm;