module.exports = {
  apps: [
    {
      name: 'YouAreWe-backend',
      cwd: '/root/YouAreWe/packages/backend',
      script: 'dist/index.js',
      env: {
        NODE_ENV: 'production',
        PORT: 4000
      }
    },
    {
      name: 'YouAreWe-frontend',
      cwd: '/root/YouAreWe/packages/frontend',
      script: '/usr/local/bin/serve',
      args: ['build', '--listen', '3000', '--no-clipboard', '--public'],
      env: {
        NODE_ENV: 'production'
      }
    }
  ]
};
