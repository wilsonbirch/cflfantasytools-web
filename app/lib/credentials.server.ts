/** Boundary validation for login/register bodies. Returns the credentials or an error string. */
export function parseCredentials(form: FormData) {
    const email = form.get('email')
    const password = form.get('password')
    if (typeof email !== 'string' || typeof password !== 'string')
        return { error: 'Missing fields' }
    const trimmed = email.trim().toLowerCase()
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmed)) return { error: 'Enter a valid email' }
    if (password.length < 8) return { error: 'Password must be at least 8 characters' }
    return { email: trimmed, password }
}
