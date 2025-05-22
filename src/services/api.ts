// src/services/api.ts
import { API_BASE, handleError, fetchCsrfToken } from './config'

// const API_BASE = 'http://localhost:8000/api'

/**
 * Read a cookie value by name.
 */

// function getCookie(name: string): string | null {
//   const match = document.cookie.match(
//     new RegExp('(^|; )' + name + '=([^;]*)')
//   )
//   return match ? decodeURIComponent(match[2]) : null
// }

/**
 * Fetch the CSRF endpoint to set the `csrftoken` cookie,
 * then return its value.
 */

// export async function fetchCsrfToken(): Promise<string> {
//   // 1) Fetch to set the cookiehandleError
//   return token
// }

/**
 * Only parse JSON if the response has a JSON content-type.
 */
async function parseJsonIfAny(res: Response) {
  const ct = res.headers.get('content-type') || ''
  if (ct.includes('application/json')) {
    return res.json()
  }
  return {}
}

/**
 * Extract and throw a useful error message from a Response.
 */
// async function handleError(res: Response): Promise<never> {
//   let msg = res.statusText
//   try {
//     const data = await res.json()
//     msg = data.detail ||
//           data.error ||
//           data.non_field_errors?.join(' ') ||
//           JSON.stringify(data)
//   } catch {
//     msg = await res.text()
//   }
//   throw new Error(msg || `HTTP ${res.status}`)
// }

/*======================================
  AUTH (Session-Based w/ CSRF)
======================================*/

/**
 * Register a new user.
 * Backend expects { name, email, password, confirm_password }.
 */
export async function register(
  name: string,
  email: string,
  password: string,
  confirm_password: string
) {
  const res = await fetch(`${API_BASE}/auth/register/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',              // include cookies
    body: JSON.stringify({ name, email, password, confirm_password }),
  })

  // always try to parse JSON so we can inspect errors
  let data: any = {}
  try {
    data = await res.clone().json()
  } catch {
    // not JSON? no-op
  }

  if (!res.ok) {
    // if the response is an object of arrays, e.g. { email: ["invalid"], password: ["too short"] }
    if (typeof data === 'object' && data !== null) {
      const parts: string[] = []
      for (const key of Object.keys(data)) {
        const val = data[key]
        if (Array.isArray(val)) {
          parts.push(`${key}: ${val.join(' ')}`)
        } else if (typeof val === 'string') {
          parts.push(`${key}: ${val}`)
        }
      }
      if (parts.length) {
        throw new Error(parts.join(' — '))
      }
    }

    // fallback to detail or generic statusText
    const detail = data.detail || data.error || res.statusText || `HTTP ${res.status}`
    throw new Error(detail)
  }

  // on 2xx just return the parsed JSON
  return data
}

/**
 * Verify a new user’s email address.
 * Backend expects { token } and activates the account.
 */
export async function verifyEmail(token: string) {
  const res = await fetch(`${API_BASE}/auth/verify/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token }),
  })
  if (!res.ok) await handleError(res)
  return res.json() as Promise<{ message: string }>
}

/**
 * Log in with email & password.
 * Returns JSON flags (e.g. mfa_setup_required, mfa_required).
 */
export async function login(email: string, password: string) {
  const csrfToken = await fetchCsrfToken()
  const res = await fetch(`${API_BASE}/auth/login/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrfToken,
    },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) await handleError(res)
  return parseJsonIfAny(res)
}

/**
 * Log out (server-side session clear).
 */
export async function logout() {
  const csrfToken = await fetchCsrfToken()
  const res = await fetch(`${API_BASE}/auth/logout/`, {
    method: 'POST',
    credentials: 'include',
    headers: { 'X-CSRFToken': csrfToken },
  })
  if (!res.ok) await handleError(res)
  return {}
}

/*======================================
  PROFILE & PASSWORD RESET
======================================*/

/** Get current user's profile */
export async function getProfile() {
  const res = await fetch(`${API_BASE}/auth/profile/`, {
    credentials: 'include',
  })
  if (!res.ok) await handleError(res)
  return res.json()
}

/** Update profile fields */
export async function updateProfile(data: { name: string })
{
   // 1) ensure we have a fresh CSRF cookie & token
   const csrf = await fetchCsrfToken()

   // 2) PATCH only the fields you send
   const res = await fetch(`${API_BASE}/auth/profile/`, {
     method: 'PATCH',
     credentials: 'include',
     headers: {
       'Content-Type':  'application/json',
       'X-CSRFToken':    csrf,
     },
     body: JSON.stringify(data),
   })

   if (!res.ok) await handleError(res)
   return res.json()
 }

/** Change password (while logged in) */
export interface ChangePasswordPayload {
  current_password: string
  new_password: string
  confirm_new_password: string
  mfa_code: string
}

/**
 * Change the logged-in user’s password.
 */
 export async function changePassword(data: ChangePasswordPayload) {
   // 1) grab CSRF token
   const csrf = await fetchCsrfToken()

   // 2) send it back in the header
   const res = await fetch(`${API_BASE}/auth/profile/change-password/`, {
     method: 'PATCH',
     credentials: 'include',
     headers: {
       'Content-Type':  'application/json',
       'X-CSRFToken':    csrf,
     },
     body: JSON.stringify(data),
   })

   if (!res.ok) await handleError(res)
   return res.json()
 }

/** Request a password-reset email */
export async function requestPasswordReset(email: string) {
  const res = await fetch(`${API_BASE}/auth/password-reset/request/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email }),
  })
  if (!res.ok) await handleError(res)
  return res.json()
}

/** Confirm password reset: { token, new_password, confirm_password } */
export async function resetPassword(
  token: string,
  new_password: string,
  confirm_password: string
) {
  const res = await fetch(`${API_BASE}/auth/password-reset/confirm/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ token, new_password, confirm_password }),
  })
  if (!res.ok) await handleError(res)
  return res.json()
}

/** Request email change */
export async function requestEmailChange(payload: {
  current_password: string
  new_email:        string
  mfa_code:         string
}) {
  // 1) Grab CSRF token
  const csrf = await fetchCsrfToken()

  // 2) Send all three fields together
  const res = await fetch(`${API_BASE}/auth/profile/request-email-change/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type':  'application/json',
      'X-CSRFToken':    csrf,
    },
    body: JSON.stringify(payload),
  })

  if (!res.ok) await handleError(res)
  return res.json()
}

/** Confirm email change */
export interface ConfirmEmailChangePayload {
  token: string
  subid: string
}

/** Confirm email change */
export async function confirmEmailChange({
  token,
  subid,
}: ConfirmEmailChangePayload) {
  const csrf = await fetchCsrfToken()
  const res = await fetch(`${API_BASE}/auth/profile/confirm-email-change/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrf,
    },
    body: JSON.stringify({ token, subid }),
  })

  if (!res.ok) await handleError(res)
  return res.json()
}

/*======================================
  MFA (Two-Factor)
======================================*/

/** Begin MFA setup: returns { secret, qr_code } */
export async function getMfaSetup() {
  const csrf = await fetchCsrfToken() 
  const res = await fetch(`${API_BASE}/auth/mfa/setup/`, {
    method: 'GET',
    credentials: 'include',
    headers: {
      'X-CSRFToken': csrf,
      'Accept': 'application/json',
    },
  })
  if (!res.ok) await handleError(res)
  return res.json() as Promise<{ secret: string; qr_code: string }>
}

/** Verify the first 6-digit code during MFA setup */
export async function verifyMfa(code: string) {
  const csrf = await fetchCsrfToken()
  const res = await fetch(`${API_BASE}/auth/verify-mfa/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrf,
    },
    body: JSON.stringify({ code }),
  })
  if (!res.ok) await handleError(res)
  return res.json()
}

/** Finalize login when MFA is required */
export async function mfaLogin(email: string, code: string) {
  // 1) fetch & read the CSRF cookie
  const csrf = await fetchCsrfToken()

  // 2) send it in the X-CSRFToken header
  const res = await fetch(`${API_BASE}/auth/mfa-login/`, {
    method: 'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken': csrf,
    },
    body: JSON.stringify({ email, code }),
  })

  if (!res.ok) {
    await handleError(res)
  }
  return res.json()
}
/*======================================
  PRODUCTS
======================================*/

/** List all categories */
export async function getCategories() {
  const res = await fetch(`${API_BASE}/products/categories/`)
  if (!res.ok) await handleError(res)
  return res.json()
}

/** List full product catalog */
export async function listAllProducts() {
  const res = await fetch(`${API_BASE}/products/all-products/`)
  if (!res.ok) await handleError(res)
  return res.json()
}

/** Products in a category */
export async function getProductsByCategory(categoryId: number) {
  const res = await fetch(
    `${API_BASE}/products/products-by-category/${categoryId}/`
  )
  if (!res.ok) await handleError(res)
  return res.json()
}

/** Search products */
export async function searchProducts(query: string) {
  const res = await fetch(
    `${API_BASE}/products/search/?q=${encodeURIComponent(query)}`
  )
  if (!res.ok) await handleError(res)
  return res.json()
}

/** Product detail */
export async function getProductDetail(productId: number) {
  const res = await fetch(`${API_BASE}/products/${productId}/`)
  if (!res.ok) await handleError(res)
  return res.json()
}

/** All variants of a product */
export async function getAllVariants(productId: number) {
  const res = await fetch(
    `${API_BASE}/products/all-variants/${productId}/`
  )
  if (!res.ok) await handleError(res)
  return res.json()
}

/** Best deal for a product */
export async function getBestDeal(productId: number) {
  const res = await fetch(
    `${API_BASE}/products/best-deal/${productId}/`
  )
  if (!res.ok) await handleError(res)
  return res.json()
}

/*======================================
  SHOPPING LIST
======================================*/

/** View your cart */
export async function getShoppingList() {
  const res = await fetch(`${API_BASE}/shopping-list/view/`, {
    credentials: 'include',
  })
  if (!res.ok) await handleError(res)
  return res.json()
}

/** Add an item: { product_id, quantity, variant_id? } */
export async function addToShoppingList(item: {
  product_id: number
  quantity:   number
  variant_id?: number
}) {
  const csrf = await fetchCsrfToken()
  const res = await fetch(`${API_BASE}/shopping-list/add/`, {
    method:      'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken':   csrf,
    },
    body: JSON.stringify(item),
  })
  if (!res.ok) await handleError(res)
  return res.json()
}

/** Remove an item: { product_id } */
export async function removeFromShoppingList(product_id: number) {
  const csrf = await fetchCsrfToken()
  const res = await fetch(`${API_BASE}/shopping-list/remove/`, {
    method:      'POST',
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      'X-CSRFToken':   csrf,
    },
    body: JSON.stringify({ product_id }),
  })
  if (!res.ok) await handleError(res)
  return res.json()
}

/** Clear the cart (DELETE) */
export async function clearShoppingList() {
  const csrf = await fetchCsrfToken()
  const res = await fetch(`${API_BASE}/shopping-list/clear/`, {
    method:      'DELETE',
    credentials: 'include',
    headers: {
      'X-CSRFToken': csrf,
    },
  })
  if (!res.ok) await handleError(res)
  return {}
}
/** Compare your cart across supermarkets */
export async function compareShoppingList() {
  const res = await fetch(`${API_BASE}/shopping-list/compare/`, {
    credentials: 'include',
  })
  if (!res.ok) await handleError(res)
  return res.json()
}

/** Mixed-basket recommendation */
export async function getMixedBasket() {
  const res = await fetch(`${API_BASE}/shopping-list/mixed-basket/`, {
    credentials: 'include',
  })
  if (!res.ok) await handleError(res)
  return res.json()
}

/** Price breakdown by supermarket */
export async function getSupermarketBreakdown() {
  const res = await fetch(
    `${API_BASE}/shopping-list/supermarket-breakdown/`,
    { credentials: 'include' }
  )
  if (!res.ok) await handleError(res)
  return res.json()
}

/** Total basket cost */
export async function calculateBasket() {
  const res = await fetch(`${API_BASE}/shopping-list/basket/`, {
    credentials: 'include',
  })
  if (!res.ok) await handleError(res)
  return res.json()
}
