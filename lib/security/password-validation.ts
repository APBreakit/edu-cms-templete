export function validatePassword(password: string): { valid: boolean; message?: string } {
  if (password.length < 8) {
    return { valid: false, message: "Hasło musi mieć co najmniej 8 znaków" }
  }

  if (!/[A-Z]/.test(password)) {
    return { valid: false, message: "Hasło musi zawierać co najmniej jedną wielką literę" }
  }

  if (!/[a-z]/.test(password)) {
    return { valid: false, message: "Hasło musi zawierać co najmniej jedną małą literę" }
  }

  if (!/[0-9]/.test(password)) {
    return { valid: false, message: "Hasło musi zawierać co najmniej jedną cyfrę" }
  }

  return { valid: true }
}

export function sanitizeInput(input: string): string {
  return input.trim().replace(/[<>]/g, "").substring(0, 1000)
}
