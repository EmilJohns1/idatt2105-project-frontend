import { useApiStore } from '@/stores/apiStore'

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

function base64URLEncode(arrayBuffer: ArrayBuffer) {
  return btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(arrayBuffer))))
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=+$/, '')
}

async function sha256(plain: string) {
  const encoder = new TextEncoder()
  const data = encoder.encode(plain)
  const hash = await crypto.subtle.digest('SHA-256', data)
  return hash
}

function generateCodeVerifier() {
  return base64URLEncode(crypto.getRandomValues(new Uint8Array(32)))
}

async function generateCodeChallenge(codeVerifier: string) {
  return sha256(codeVerifier).then((hash) => {
    return base64URLEncode(hash)
  })
}
