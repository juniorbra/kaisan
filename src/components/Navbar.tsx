import { useRouter } from 'next/router'
import { supabase } from '../lib/supabaseClient'
import { Session } from '@supabase/supabase-js'

type NavbarProps = {
  session: Session
}

export default function Navbar({ session }: NavbarProps) {
  const router = useRouter()
  const currentPath = router.pathname

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex-shrink-0 flex items-center">
            <span className="text-blue-600 font-bold text-xl">Kaisan</span>
          </div>
          <div className="hidden sm:flex sm:flex-1 sm:justify-center">
            <div className="flex space-x-8">
              <a
                href="/whatsapp"
                className={`${
                  currentPath === '/whatsapp'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                WhatsApp
              </a>
              <a
                href="/prompt"
                className={`${
                  currentPath === '/prompt'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Prompt do Sistema
              </a>
              <a
                href="/base-de-conhecimento"
                className={`${
                  currentPath === '/base-de-conhecimento'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Base de Conhecimento
              </a>
              <a
                href="/reset-memory"
                className={`${
                  currentPath === '/reset-memory'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Resetar Memória
              </a>
              <a
                href="/profile"
                className={`${
                  currentPath === '/profile'
                    ? 'border-blue-500 text-gray-900'
                    : 'border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700'
                } inline-flex items-center px-1 pt-1 border-b-2 text-sm font-medium`}
              >
                Meu Perfil
              </a>
            </div>
          </div>
          <div className="hidden sm:flex sm:items-center">
            <div className="text-sm text-gray-500 mr-4">{session.user.email}</div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white text-sm font-medium py-1 px-3 rounded"
            >
              Sair
            </button>
          </div>
          <div className="flex items-center sm:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500"
              aria-expanded="false"
              onClick={() => {
                const menu = document.getElementById('mobile-menu')
                if (menu) {
                  menu.classList.toggle('hidden')
                }
              }}
            >
              <span className="sr-only">Abrir menu</span>
              <svg
                className="block h-6 w-6"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <div className="sm:hidden hidden" id="mobile-menu">
        <div className="pt-2 pb-3 space-y-1 text-center">
          <a
            href="/whatsapp"
            className={`${
              currentPath === '/whatsapp'
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            } block px-4 py-2 text-base font-medium`}
          >
            WhatsApp
          </a>
          <a
            href="/prompt"
            className={`${
              currentPath === '/prompt'
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            } block px-4 py-2 text-base font-medium`}
          >
            Prompt do Sistema
          </a>
          <a
            href="/base-de-conhecimento"
            className={`${
              currentPath === '/base-de-conhecimento'
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            } block px-4 py-2 text-base font-medium`}
          >
            Base de Conhecimento
          </a>
          <a
            href="/reset-memory"
            className={`${
              currentPath === '/reset-memory'
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            } block px-4 py-2 text-base font-medium`}
          >
            Limpar Memória
          </a>
          <a
            href="/profile"
            className={`${
              currentPath === '/profile'
                ? 'bg-blue-50 border-blue-500 text-blue-700'
                : 'border-transparent text-gray-500 hover:bg-gray-50 hover:border-gray-300 hover:text-gray-700'
            } block px-4 py-2 text-base font-medium`}
          >
            Meu Perfil
          </a>
        </div>
        <div className="pt-4 pb-3 border-t border-gray-200">
          <div className="flex flex-col items-center px-4">
            <div className="text-sm font-medium text-gray-500 mb-2">{session.user.email}</div>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-700 text-white text-sm font-medium py-1 px-3 rounded"
            >
              Sair
            </button>
          </div>
        </div>
      </div>
    </nav>
  )
}
