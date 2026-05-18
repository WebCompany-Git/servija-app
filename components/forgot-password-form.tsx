// components/forgot-password-form.tsx
export function ForgotPasswordForm() {
  return (
    <form>
      <input type="email" placeholder="Seu e-mail" required />
      <button type="submit">Recuperar Senha</button>
    </form>
  );
}
