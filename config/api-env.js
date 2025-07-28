/**
 * API Environment Configuration
 * Contains settings for different test environments
 */

const environments = {
  // Staging environment
  staging: {
    baseURL: 'https://stage-api.ecarehealth.com',
    tenantId: 'stage_aithinkitive',
    apiTimeout: 30000,
    credentials: {
      username: 'rose.gomez@jourrapide.com',
      password: 'Pass@123'
    }
  },
  
  // Development environment (if needed)
  development: {
    baseURL: 'https://dev-api.ecarehealth.com',
    tenantId: 'dev_aithinkitive',
    apiTimeout: 30000,
    credentials: {
      username: 'rose.gomez@jourrapide.com',
      password: 'Pass@123'
    }
  }
};

// Default environment to use
const defaultEnv = 'staging';

// Get environment from command line arguments or use default
const getEnvironment = () => {
  // Check if environment is passed via command line
  const envArg = process.argv.find(arg => arg.startsWith('--env='));
  if (envArg) {
    const env = envArg.split('=')[1];
    if (environments[env]) {
      console.log(`Using ${env} environment`);
      return environments[env];
    }
    console.warn(`Environment ${env} not found, using default: ${defaultEnv}`);
  }
  
  // Use default environment
  return environments[defaultEnv];
};

module.exports = {
  environments,
  defaultEnv,
  getEnvironment,
  current: getEnvironment()
}; 