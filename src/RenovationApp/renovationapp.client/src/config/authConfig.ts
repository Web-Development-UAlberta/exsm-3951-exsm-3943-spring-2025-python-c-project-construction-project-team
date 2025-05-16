import { LogLevel } from '@azure/msal-browser';

export const msalConfig = {
  auth: {
    clientId: '99ffb099-af80-41d1-9c16-e844f8ed5308',
    authority: `https://renovationstationexsm3943.ciamlogin.com/`,
    redirectUri: '/',
  },
  cache: {
    cacheLocation: 'localStorage', // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you want to use cookies to store auth state
},
  system: {
    loggerOptions: {
        /**
         * Below you can configure MSAL.js logs. For more information, visit:
         * https://docs.microsoft.com/azure/active-directory/develop/msal-logging-js
         */
        loggerCallback: (level: LogLevel, message: string, containsPii: boolean) => {
            if (containsPii) {
                return;
            }
            switch (level) {
                case LogLevel.Error:
                    console.error(message);
                    return;
                case LogLevel.Info:
                    console.info(message);
                    return;
                case LogLevel.Verbose:
                    console.debug(message);
                    return;
                case LogLevel.Warning:
                    console.warn(message);
                    return;
                default:
                    return;
            }
        },
    },
},
};

/**
 * Scopes you add here will be prompted for user consent during sign-in.
 * By default, MSAL.js will add OIDC scopes (openid, profile, email) to any login request.
 * For more information about OIDC scopes, visit:
 * https://docs.microsoft.com/en-us/azure/active-directory/develop/v2-permissions-and-consent#openid-connect-scopes
 */
export const loginRequest = {
    scopes: ["openid", "offline_access", "profile","api://99ffb099-af80-41d1-9c16-e844f8ed5308/user_impersonation", "user.read"],
};

 export const silentRequest = {
     scopes: ["openid", "offline_access", "profile","api://99ffb099-af80-41d1-9c16-e844f8ed5308/user_impersonation", "user.read"],
     loginHint: "example@renovationstationexsm3943.onmicrosoft.com"
 };
 