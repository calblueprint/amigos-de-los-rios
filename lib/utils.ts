/**
 * Random number generator built on top of Math.random().
 *
 * @param min The minimum value (inclusive)
 * @param max The maximum value (inclusive)
 * @returns A random number between min and max.
 */
export function random(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

/**
 * Handle authentication errors from Supabase and return user-friendly messages.
 *
 * @param error The error object from the try-catch block
 * @param context The context of the error (e.g., 'signIn', 'signUp')
 * @returns A user-friendly error message
 */
export function handleAuthError(
  error: unknown,
  context: "signIn" | "signUp",
): string {
  const errorMessage =
    error instanceof Error ? error.message : "An error occurred";

  if (context === "signIn") {
    if (
      errorMessage.includes("Invalid login credentials") ||
      errorMessage.includes("wrong password") ||
      errorMessage.includes("invalid password")
    ) {
      return "Invalid email or password. Please check your credentials and try again.";
    } else if (errorMessage.includes("Email not confirmed")) {
      return "Please check your email and click the confirmation link before signing in.";
    } else if (errorMessage.includes("User not found")) {
      return "No account found with this email. Please sign up first.";
    } else if (errorMessage.includes("Too many requests")) {
      return "Too many failed attempts. Please wait a moment before trying again.";
    } else if (errorMessage.includes("Invalid email")) {
      return "Please enter a valid email address";
    }
    return `Sign in error: ${errorMessage}`;
  }

  // signUp context
  if (errorMessage.includes("User already registered")) {
    return "An account with this email already exists. Please use the sign in button instead.";
  } else if (errorMessage.includes("Password should be at least")) {
    return "Password must be at least 8 characters long";
  } else if (errorMessage.includes("Invalid email")) {
    return "Please enter a valid email address";
  } else if (
    errorMessage.includes("Password is too weak") ||
    errorMessage.includes("weak password")
  ) {
    return "Password is too weak. Please use a stronger password with a mix of letters, numbers, and symbols.";
  } else if (errorMessage.includes("password")) {
    return "Password doesn't meet security requirements. Please use at least 8 characters.";
  }
  return `Sign up error: ${errorMessage}`;
}
