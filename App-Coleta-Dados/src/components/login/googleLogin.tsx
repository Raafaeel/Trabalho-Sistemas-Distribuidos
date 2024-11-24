import { GoogleOAuthProvider, GoogleLogin } from "@react-oauth/google";
import { loginWithGoogle } from '@/service/authService';
import { useRouter } from 'next/navigation';

const LoginGoogle = () => {
  const router = useRouter();

  const handleGoogleLoginSuccess = async (response: any) => {
    try {
      const googleToken = response.credential;

      await loginWithGoogle(googleToken);
      
      router.push("/dadosColetados");
      console.log("Login com Google bem-sucedido:", response);
    } catch (error) {
      console.error("Erro ao autenticar com Google:", error);
      alert("Erro ao fazer login com Google. Tente novamente.");
    }
  };

  const handleGoogleLoginError = () => {
    console.error("Erro ao fazer login com Google.");
    alert("Erro ao fazer login com Google. Tente novamente.");
  };

  return (
    <GoogleOAuthProvider clientId="668469425698-17ulsbs51rvuejdd1pkco6bhtilotqs5.apps.googleusercontent.com">
      <div className="flex flex-col items-center">
        <h1 className="mb-4 text-xl">Faça login</h1>

        <GoogleLogin
          onSuccess={handleGoogleLoginSuccess}
          onError={handleGoogleLoginError}
          text="signin"
        />
      </div>
    </GoogleOAuthProvider>
  );
};

export default LoginGoogle;