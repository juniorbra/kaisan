import { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import Navbar from '../components/Navbar'
import { Session } from '@supabase/supabase-js'

type Profile = {
  id: string
  wa_number: string | null
  updated_at: string
}

export default function Whatsapp() {
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [countryCode, setCountryCode] = useState('55')
  const [cityCode, setCityCode] = useState('')
  const [whatsappNumber, setWhatsappNumber] = useState('')
  const [message, setMessage] = useState<{ text: string; type: 'success' | 'error' } | null>(null)
  
  const router = useRouter()

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
      if (!session) {
        router.push('/')
      } else {
        fetchProfile(session)
      }
    })

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      if (!session) {
        router.push('/')
      } else {
        fetchProfile(session)
      }
    })

    return () => subscription.unsubscribe()
  }, [router])

  const fetchProfile = async (session: Session) => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', session.user.id)
        .single()
      
      if (error) {
        if (error.code === 'PGRST116') {
          setMessage({ text: 'Perfil de usuário não encontrado. Por favor, entre em contato com o suporte.', type: 'error' })
        } else {
          setMessage({ text: `Erro ao buscar perfil: ${error.message}`, type: 'error' })
        }
        setProfile(null)
        return
      }

      setProfile(data)
      // Se já existe um número de WhatsApp, formatar para exibição
      if (data.wa_number) {
        const phoneStr = data.wa_number.toString()
        if (phoneStr.length >= 12) {
          const countryCodePart = phoneStr.substring(0, 2)
          const cityCodePart = phoneStr.substring(2, 4)
          const numberFirstPart = phoneStr.substring(4, phoneStr.length - 4)
          const numberLastPart = phoneStr.substring(phoneStr.length - 4)
          setCountryCode(countryCodePart)
          setCityCode(cityCodePart)
          setWhatsappNumber(numberFirstPart + '-' + numberLastPart)
        } else {
          setWhatsappNumber(phoneStr)
        }
      }
    } catch (error: any) {
      setMessage({ text: `Erro ao buscar perfil: ${error.message}`, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  const handleCityCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').substring(0, 2)
    setCityCode(value)
  }

  const handleWhatsappNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/[^\d-]/g, '')
    if (value.includes('-')) {
      const digits = value.replace(/-/g, '')
      if (digits.length > 4) {
        value = digits.substring(0, digits.length - 4) + '-' + digits.substring(digits.length - 4)
      } else {
        value = digits
      }
    } else {
      if (value.length > 4) {
        value = value.substring(0, value.length - 4) + '-' + value.substring(value.length - 4)
      }
    }
    setWhatsappNumber(value)
  }

  const updateWhatsapp = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!cityCode.trim() || !whatsappNumber.trim()) {
      setMessage({ text: 'Por favor, preencha todos os campos', type: 'error' })
      return
    }
    if (!session?.user.id) {
      setMessage({ text: 'Usuário não autenticado.', type: 'error' })
      return
    }
    try {
      setLoading(true)
      const formattedNumber = countryCode + cityCode + whatsappNumber.replace(/-/g, '')
      const { error } = await supabase
        .from('profiles')
        .update({
          wa_number: formattedNumber,
          updated_at: new Date().toISOString()
        })
        .eq('id', session.user.id)
      if (error) throw error
      setMessage({ text: 'Número de WhatsApp cadastrado com sucesso!', type: 'success' })
      fetchProfile(session)
    } catch (error: any) {
      setMessage({ text: error.message, type: 'error' })
    } finally {
      setLoading(false)
    }
  }

  if (!session) {
    return <div>Redirecionando para o login...</div>
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {session && <Navbar session={session} />}
      <div className="max-w-md mx-auto p-4 pt-6">
        <div className="bg-white rounded-lg shadow p-6">
          <h1 className="text-2xl font-bold mb-6">Configuração do WhatsApp</h1>
          {message && (
            <div className={`p-3 mb-4 rounded ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}
          <form onSubmit={updateWhatsapp}>
            <div className="mb-6">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                Número de WhatsApp
              </label>
              <div className="flex items-center space-x-2">
                <div className="flex-none">
                  <div className="flex items-center border rounded shadow px-3 py-2 bg-gray-100">
                    <span className="text-gray-700">+</span>
                    <input
                      className="w-8 bg-gray-100 text-gray-700 ml-1"
                      type="text"
                      value={countryCode}
                      readOnly
                    />
                  </div>
                </div>
                <div className="flex-none">
                  <div className="flex items-center border rounded shadow px-3 py-2">
                    <span className="text-gray-700">(</span>
                    <input
                      className="w-8 text-gray-700"
                      type="text"
                      value={cityCode}
                      onChange={handleCityCodeChange}
                      placeholder=""
                      maxLength={2}
                    />
                    <span className="text-gray-700">)</span>
                  </div>
                </div>
                <div className="flex-grow">
                  <input
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700"
                    type="text"
                    value={whatsappNumber}
                    onChange={handleWhatsappNumberChange}
                    placeholder="98765-4321"
                  />
                </div>
              </div>
              <p className="text-sm text-gray-500 mt-2">
                Exemplo: + 55 (21) 98765-4321
              </p>
            </div>
            <div className="flex flex-col gap-2">
              <button
                type="submit"
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
                disabled={loading}
              >
                {loading ? 'Salvando...' : 'Salvar'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  )
} 