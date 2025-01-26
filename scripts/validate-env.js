const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

function validateEnv() {
  // Required variables for each environment
  const requiredVars = {
    root: ['SUPABASE_URL', 'SUPABASE_SERVICE_ROLE_KEY', 'DB_PASSWORD'],
    api: [
      'PORT',
      'CORS_ORIGIN',
      'SIKKA_APP_ID',
      'SIKKA_APP_KEY',
      'SIKKA_PRACTICE_ID',
      'SIKKA_P1_PRACTICE_KEY'
    ],
    frontend: [
      'VITE_API_URL',
      'VITE_SUPABASE_URL',
      'VITE_SUPABASE_ANON_KEY',
      'VITE_OPENAI_BRAIN_CONSULTANT_ID',
      'VITE_OPENAI_BRAIN_CONSULTANT_API_KEY'
    ]
  };

  // Optional variables that should be validated if present
  const optionalVars = {
    frontend: [
      'VITE_RETELL_BASE_URL',
      'VITE_RETELL_WEBSOCKET_URL',
      'VITE_RETELL_API_KEY'
    ]
  };

  // Check each environment
  Object.entries(requiredVars).forEach(([env, vars]) => {
    const envPath = env === 'root' 
      ? path.join(__dirname, '..', '.env')
      : path.join(__dirname, '..', 'apps', env, '.env');
    
    if (!fs.existsSync(envPath)) {
      console.error(`❌ Missing ${envPath} file`);
      process.exit(1);
    }

    const envConfig = dotenv.parse(fs.readFileSync(envPath));
    const missing = vars.filter(v => !envConfig[v]);
    
    if (missing.length > 0) {
      console.error(`❌ Missing required variables in ${envPath}:`, missing);
      process.exit(1);
    }

    // Validate optional variables if they exist
    const optionals = optionalVars[env] || [];
    const presentOptionals = optionals.filter(v => envConfig[v] !== undefined);
    
    // Add specific validation for URLs
    const urlVars = [...vars, ...presentOptionals].filter(v => 
      v.includes('URL') || v.includes('WEBSOCKET')
    );

    const invalidUrls = urlVars.filter(v => {
      const value = envConfig[v];
      try {
        new URL(value);
        return false;
      } catch {
        return true;
      }
    });

    if (invalidUrls.length > 0) {
      console.error(`❌ Invalid URL format in ${envPath}:`, invalidUrls);
      process.exit(1);
    }
  });

  console.log('✅ Environment validation passed');
}

validateEnv();
