import { useApiStore } from '@/stores/apiStore'
import { oauth2 } from '@/api/axiosConfig'
import { useUserStore } from '@/stores/userStore'

/**
 * Initiates OAuth2 login by redirecting to the authorization URL with PKCE parameters.
 */
export const useLogin = async () => {
  const apiStore = useApiStore()

  const clientId = apiStore.getClientId
  const codeVerifier = generateCodeVerifier()
  apiStore.setCodeVerifier(codeVerifier)
  const codeChallenge = await generateCodeChallenge(codeVerifier)
  const scope = 'openid profile'
  const responseType = 'code'
  const redirectUri = encodeURIComponent(apiStore.getBaseUrl + '/token')
  const authUrl =
    apiStore.getBackendUrl +
    `/oauth2/authorize?client_id=${clientId}&response_type=${responseType}&scope=${scope}&redirect_uri=${redirectUri}&code_challenge=${codeChallenge}&code_challenge_method=S256`
  window.location.href = authUrl
}

/**
 * Exchanges an authorization code for tokens and sets them in the user store.
 *
 * @param {string} code - Authorization code.
 */
export const getTokens = async (code: string) => {
  const apiStore = useApiStore()
  const userStore = useUserStore()

  const clientId = apiStore.getClientId
  const redirectUri = apiStore.getBaseUrl + '/token'

  //Get tokens
  const tokenRes = await oauth2.post(
    '/oauth2/token',
    new URLSearchParams({
      code: code,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
      client_id: clientId,
      code_verifier: apiStore.getCodeVerifier
    }).toString(),
    {
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      }
    }
  )
  if (tokenRes.status === 200) {
    try {
      //Try catch here due to the possibility of the response not being JSON
      userStore.setAccessToken(tokenRes.data.access_token)
      userStore.setIdToken(tokenRes.data.id_token)
      userStore.setTimeToLive(tokenRes.data.expires_in)
    } catch (error) {
      console.error('Failed to parse tokens:', error)
      return
    }
  } else {
    console.error('Failed to get tokens:', tokenRes.data)
    return
  }

  //Get username
  const userInfoRes = await oauth2.post('/userinfo', null, {
    headers: {
      Authorization: `Bearer ${userStore.getAccessToken}`
    }
  })

  if (userInfoRes.status === 200) {
    userStore.setUserName(userInfoRes.data.sub)
    //Other info can also be gotten here
  } else {
    console.error('Failed to get user info:', userInfoRes.data)
    return
  }
}

/**
 * Base64url encodes an ArrayBuffer.
 *
 * @param {ArrayBuffer} arrayBuffer - Data to encode.
 * @returns {string} Encoded string.
 */
function base64URLEncode(arrayBuffer: ArrayBuffer) {
  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(arrayBuffer))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

/**
 * Hashes a string with SHA-256.
 *
 * @param {string} plain - String to hash.
 * @returns {Promise<ArrayBuffer>} Hash as ArrayBuffer.
 */
async function sha256(plain: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return hash
}

/**
 * Generates a code verifier for OAuth2 PKCE.
 *
 * @returns {string} Code verifier.
 */
export const generateCodeVerifier = () => {
  return base64URLEncode(crypto.getRandomValues(new Uint8Array(32)))
}

/**
 * Generates a code challenge from a verifier.
 *
 * @param {string} codeVerifier - Code verifier.
 * @returns {Promise<string>} Code challenge.
 */
export const generateCodeChallenge = async (codeVerifier: string) => {
  return sha256(codeVerifier).then((hash) => {
    return base64URLEncode(hash)
  })
}
