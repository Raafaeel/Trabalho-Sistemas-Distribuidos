import Link from 'next/link'
import './globals.css'

export default function Home() {
  return (
    <div className="container">
      <div className="left-column">
        <h2 className="welcome-heading">
          Bem-vindo ao <span className="brand-name">Programa de cadastro</span>
        </h2>
        <p className="description">
          Um aplicativo para gerenciar seu usuario
        </p>
      </div>
    </div>
  )
}
