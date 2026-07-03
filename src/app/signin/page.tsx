import { providerOptions } from "@/constants/providers";
import { signIn } from "@/services/auth";

export default function SignInPage() {
  return (
    <div className="flex-1 flex items-center justify-center p-6">
      <div className="w-full max-w-xs space-y-3">
        <h1 className="text-xl font-bold text-center mb-4">Sign in</h1>

        {providerOptions.length === 0 && (
          <p className="text-sm text-muted-foreground text-center">No auth provider configured.</p>
        )}

        {providerOptions.map((provider) => (
          <form
            key={provider.id}
            action={async () => {
              "use server";
              await signIn(provider.id);
            }}
          >
            <button type="submit" className="w-full rounded-md border px-4 py-2 text-sm font-medium hover:bg-muted">
              Sign in with {provider.name}
            </button>
          </form>
        ))}
      </div>
    </div>
  );
}
