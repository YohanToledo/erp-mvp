import { api } from '@/lib/axios'

export interface SignInRequest {
  username: string,
  password: string,
}

export async function signIn({ username, password }: SignInRequest) {
  // await api.post('/sessions', { email })

  const res = await api.get('/')
  console.log(res.data)
  
  if (username === 'admin' && password === 'admin') {
    return
  } else {
    throw new Error("Usuário ou senha incorretos")
  }
}
