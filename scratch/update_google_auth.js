const fs = require('fs');
const path = require('path');

// 1. Update src/app/auth/actions.ts getSiteUrl
const actionsPath = path.join(__dirname, '..', 'src', 'app', 'auth', 'actions.ts');
let actionsContent = fs.readFileSync(actionsPath, 'utf8');

actionsContent = actionsContent.replace(
  `let url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    (process.env.NEXT_PUBLIC_VERCEL_URL
      ? \`https://\${process.env.NEXT_PUBLIC_VERCEL_URL}\`
      : "http://localhost:3000");`,
  `let url =
    process.env.NEXT_PUBLIC_SITE_URL ||
    "https://skillitlearn.vercel.app";`
);

fs.writeFileSync(actionsPath, actionsContent, 'utf8');
console.log('Updated getSiteUrl in auth/actions.ts!');

// 2. Update src/app/(auth)/login/page.tsx for direct browser OAuth redirect
const loginPath = path.join(__dirname, '..', 'src', 'app', '(auth)', 'login', 'page.tsx');
let loginContent = fs.readFileSync(loginPath, 'utf8');

loginContent = loginContent.replace(
  `import { signIn, signInWithGoogle } from "@/app/auth/actions";`,
  `import { signIn } from "@/app/auth/actions";\nimport { createBrowserClient } from "@supabase/ssr";`
);

loginContent = loginContent.replace(
  `async function handleGoogleSignIn() {
    setLoading(true);
    setError(null);
    const result = await signInWithGoogle();
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }`,
  `async function handleGoogleSignIn() {
    setLoading(true);
    setError(null);
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: \`\${window.location.origin}/auth/callback\`,
        },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to initialize Google Sign In");
      setLoading(false);
    }
  }`
);

fs.writeFileSync(loginPath, loginContent, 'utf8');
console.log('Updated login/page.tsx with direct browser OAuth handler!');

// 3. Update src/app/(auth)/signup/page.tsx for direct browser OAuth redirect
const signupPath = path.join(__dirname, '..', 'src', 'app', '(auth)', 'signup', 'page.tsx');
if (fs.existsSync(signupPath)) {
  let signupContent = fs.readFileSync(signupPath, 'utf8');

  signupContent = signupContent.replace(
    `import { signUp, signInWithGoogle } from "@/app/auth/actions";`,
    `import { signUp } from "@/app/auth/actions";\nimport { createBrowserClient } from "@supabase/ssr";`
  );

  signupContent = signupContent.replace(
    `async function handleGoogleSignIn() {
    setLoading(true);
    setError(null);
    const result = await signInWithGoogle();
    if (result?.error) {
      setError(result.error);
      setLoading(false);
    }
  }`,
    `async function handleGoogleSignIn() {
    setLoading(true);
    setError(null);
    try {
      const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      );
      const { error } = await supabase.auth.signInWithOAuth({
        provider: "google",
        options: {
          redirectTo: \`\${window.location.origin}/auth/callback\`,
        },
      });
      if (error) {
        setError(error.message);
        setLoading(false);
      }
    } catch (err: any) {
      setError(err.message || "Failed to initialize Google Sign In");
      setLoading(false);
    }
  }`
  );

  fs.writeFileSync(signupPath, signupContent, 'utf8');
  console.log('Updated signup/page.tsx with direct browser OAuth handler!');
}
