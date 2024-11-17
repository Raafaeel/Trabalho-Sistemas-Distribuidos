import { setCookie } from 'cookies-next';
import { useEffect } from 'react';
import { verifica } from '../services/user';
export default function Home() {
  return ( 
  <div>
    Pagina Segura - Usuário
  </div>
  )
}

export const getServerSideProps = async(req, res) => {
  try{
    const token = getCookie('authorization', ({req, res}))
    if (!token) throw new Error('Token inválido')

      verifica(token)
      return {
        props: {}
      }

    return{
      props: {}
    }
  } catch (err){
     return{
        redirect: {
          permanent: false,
          destination: '/login'
        },
    props: {}
     }
  }
}