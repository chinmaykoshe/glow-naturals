export function getAuthErrorMessage(error) {
  const code = error?.code || '';

  switch (code) {
    case 'auth/email-already-in-use':
      return 'This email is already registered. Please login instead.';

    case 'auth/invalid-email':
      return 'Please enter a valid email address.';

    case 'auth/weak-password':
      return 'Password must be at least 6 characters.';

    case 'auth/user-not-found':
    case 'auth/wrong-password':
    case 'auth/invalid-credential':
      return 'Invalid email or password.';

    case 'auth/too-many-requests':
      return 'Too many attempts. Please try again later.';

    default:
      return 'Something went wrong. Please try again.';
  }
}