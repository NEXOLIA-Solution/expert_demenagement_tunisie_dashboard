export function checkAuth() {
  if (typeof window === "undefined") return false

  const cookies = document.cookie.split(";")
  const authCookie = cookies.find((c) => c.trim().startsWith("auth_token="))

  return !!authCookie
}

export function logout() {
  document.cookie = "auth_token=; path=/; max-age=0"
  localStorage.removeItem("admin_email")
  localStorage.removeItem("verification_code")
  localStorage.removeItem("verification_email")
  localStorage.removeItem("verification_time")
}

export function getAdminEmail() {
  if (typeof window === "undefined") return null
  return localStorage.getItem("admin_email")
}
