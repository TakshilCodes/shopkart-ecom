import ForgotPasswordForm from "@/components/ForgotPasswordForm";

export default function ForgotPasswordPage() {
  return (
    <main className="min-h-screen bg-neutral-50 flex items-center justify-center px-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8">
        <h1 className="text-3xl font-bold text-center text-neutral-800">
          Forgot Password
        </h1>
        <p className="mt-3 text-sm text-center text-neutral-500">
          Enter your email, set a new password, and verify it with OTP.
        </p>

        <div className="mt-8">
          <ForgotPasswordForm />
        </div>
      </div>
    </main>
  );
}