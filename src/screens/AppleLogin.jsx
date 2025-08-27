

const AppleLogin = () => {
  const handleAppleLogin = () => {

    const clientId = import.meta.env.VITE_apple_client_id;

    console.log("Client id : ", clientId);
    
    // const redirectUri = process.env.REACT_APP_BACKEND_URL + "/auth/apple/callback";

    const redirectUri = import.meta.VITE_prod_base_url;

    console.log(" REdirect url : ", redirectUri);
    

    window.location.href =
      `https://appleid.apple.com/auth/authorize?` +
      `response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&scope=name email`;
  };

  return (
    <div className="flex items-center justify-center h-screen">
      <button 
        onClick={handleAppleLogin}
        className="px-4 py-2 bg-black text-white rounded-lg"
      >
        Sign in with Apple
      </button>
    </div>
  );
};

export default AppleLogin;
