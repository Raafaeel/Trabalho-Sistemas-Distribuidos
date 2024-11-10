import Link from 'next/link'
import './globals.css'

export default function Home() {
  return (
    <div className="container">
      <div className="left-column">
        <h2 className="welcome-heading">
          Bem-vindo ao <span className="brand-name">Simulador de IoMT</span>
        </h2>
        <p className="description">
          Um aplicativo para cadastro de dados sobre saúde
        </p>
      </div>
    </div>
  )
}
