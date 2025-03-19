// Social authentication providers configuration

// Google OAuth configuration
export const googleAuthConfig = {
  clientId: process.env.GOOGLE_CLIENT_ID || "",
  clientSecret: process.env.GOOGLE_CLIENT_SECRET || "",
  redirectUri: process.env.NEXT_PUBLIC_URL
    ? `${process.env.NEXT_PUBLIC_URL}/api/auth/callback/google`
    : "http://localhost:3000/api/auth/callback/google",
  scopes: ["profile", "email"],
}

// Facebook OAuth configuration
export const facebookAuthConfig = {
  appId: process.env.FACEBOOK_APP_ID || "",
  appSecret: process.env.FACEBOOK_APP_SECRET || "",
  redirectUri: process.env.NEXT_PUBLIC_URL
    ? `${process.env.NEXT_PUBLIC_URL}/api/auth/callback/facebook`
    : "http://localhost:3000/api/auth/callback/facebook",
  scopes: ["email", "public_profile"],
}

// GitHub OAuth configuration
export const githubAuthConfig = {
  clientId: process.env.GITHUB_CLIENT_ID || "",
  clientSecret: process.env.GITHUB_CLIENT_SECRET || "",
  redirectUri: process.env.NEXT_PUBLIC_URL
    ? `${process.env.NEXT_PUBLIC_URL}/api/auth/callback/github`
    : "http://localhost:3000/api/auth/callback/github",
  scopes: ["user:email", "read:user"],
}

// LinkedIn OAuth configuration
export const linkedinAuthConfig = {
  clientId: process.env.LINKEDIN_CLIENT_ID || "",
  clientSecret: process.env.LINKEDIN_CLIENT_SECRET || "",
  redirectUri: process.env.NEXT_PUBLIC_URL
    ? `${process.env.NEXT_PUBLIC_URL}/api/auth/callback/linkedin`
    : "http://localhost:3000/api/auth/callback/linkedin",
  scopes: ["r_liteprofile", "r_emailaddress"],
}

// Helper function to generate OAuth URLs
export const generateOAuthUrl = (provider: string) => {
  switch (provider) {
    case "google":
      return `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleAuthConfig.clientId}&redirect_uri=${encodeURIComponent(googleAuthConfig.redirectUri)}&response_type=code&scope=${encodeURIComponent(googleAuthConfig.scopes.join(" "))}&access_type=offline&prompt=consent`

    case "facebook":
      return `https://www.facebook.com/v13.0/dialog/oauth?client_id=${facebookAuthConfig.appId}&redirect_uri=${encodeURIComponent(facebookAuthConfig.redirectUri)}&scope=${encodeURIComponent(facebookAuthConfig.scopes.join(","))}`

    case "github":
      return `https://github.com/login/oauth/authorize?client_id=${githubAuthConfig.clientId}&redirect_uri=${encodeURIComponent(githubAuthConfig.redirectUri)}&scope=${encodeURIComponent(githubAuthConfig.scopes.join(" "))}`

    case "linkedin":
      return `https://www.linkedin.com/oauth/v2/authorization?client_id=${linkedinAuthConfig.clientId}&redirect_uri=${encodeURIComponent(linkedinAuthConfig.redirectUri)}&response_type=code&scope=${encodeURIComponent(linkedinAuthConfig.scopes.join(" "))}`

    default:
      throw new Error(`Unsupported provider: ${provider}`)
  }
}

// Helper function to validate user credentials (for demo purposes)
export const validateCredentials = async (identifier: string, password: string) => {
  // In a real app, this would check against a database
  // For demo purposes, we'll accept any non-empty values
  if (!identifier || !password) {
    return false
  }

  // Simulate API call
  await new Promise((resolve) => setTimeout(resolve, 500))

  return true
}

// Helper function to hash passwords
export const hashPassword = async (password: string) => {
  // In a real app, you would use a proper hashing library like bcrypt
  // For demo purposes, we'll just return the password
  return password
}

// Helper function to verify password
export const verifyPassword = async (password: string, hashedPassword: string) => {
  // In a real app, you would use a proper hashing library like bcrypt
  // For demo purposes, we'll just compare the strings
  return password === hashedPassword
}

