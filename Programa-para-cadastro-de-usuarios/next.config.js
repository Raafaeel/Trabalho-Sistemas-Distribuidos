module.exports = {
    async rewrites() {
      return [
        {
          source: '/usuarios/:path*',
          destination: 'https://myfastapiapp-668469425698.southamerica-east1.run.app/usuarios/:path*'
        },
        {
          source: '/dados/:path*',
          destination: 'https://apisimuladoresimagem-v2-668469425698.southamerica-east1.run.app/dados/:path*',
        },
      ];
    },
  };
  