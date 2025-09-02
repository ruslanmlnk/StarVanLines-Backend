module.exports = {
  apps: [{
    name: 'starvanlines-backend',
    script: 'src/server.js',
    instances: 1,
    autorestart: false,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'production',
      ENV_FILE: './config/env'
    }
  }]
};
