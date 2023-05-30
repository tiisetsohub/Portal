// Create the main myMSALObj instance
// configuration parameters are located at authConfig.js
const myMSALObj = new msal.PublicClientApplication(msalConfig);

let username = "";

/**
 * A promise handler needs to be registered for handling the
 * response returned from redirect flow. For more information, visit:
 * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/acquire-token.md
 */
myMSALObj.handleRedirectPromise()
    .then(handleResponse)
    .catch((error) => {
        console.error(error);
    });

function selectAccount() {

    /**
     * See here for more info on account retrieval: 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */

    const currentAccounts = myMSALObj.getAllAccounts();

    if (currentAccounts.length === 0) {
        return;
    } else if (currentAccounts.length > 1) {
        // Add your account choosing logic here
        console.warn("Multiple accounts detected.");
    } else if (currentAccounts.length === 1) {
        username = currentAccounts[0].name;
        showWelcomeMessage(username);
    }
}

function handleResponse(response) {
    if (response !== null) {
        console.log(response);
        username = response.account.username;
        showWelcomeMessage(username);
    } else {
        selectAccount();
    }
}

function signIn() {

    /**
     * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
     */

    myMSALObj.loginRedirect(loginRequest);
}

function signOut() {

    /**
     * You can pass a custom request object below. This will override the initial configuration. For more information, visit:
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-browser/docs/request-response-object.md#request
     */

    const logoutRequest = {
        account: myMSALObj.getAccountByUsername(username),
        postLogoutRedirectUri: msalConfig.auth.redirectUri,
    };

    myMSALObj.logoutRedirect(logoutRequest);
}

function getTokenRedirect(request) {
    /**
     * See here for more info on account retrieval: 
     * https://github.com/AzureAD/microsoft-authentication-library-for-js/blob/dev/lib/msal-common/docs/Accounts.md
     */
    request.account = myMSALObj.getAccountByUsername(username);
    return myMSALObj.acquireTokenSilent(request)
        .catch(error => {
            console.warn("silent token acquisition fails. acquiring token using redirect");
            if (error instanceof msal.InteractionRequiredAuthError) {
                // fallback to interaction when silent call fails
                return myMSALObj.acquireTokenRedirect(request);
            } else {
                console.warn(error);
            }
        });
}

function seeProfile() {
    getTokenRedirect(loginRequest)
        .then(response => {
            // console.log(response);
            callMSGraph(graphConfig.graphMeEndpoint, response.accessToken, updateUI);
        }).catch(error => {
            console.error(error);
        });
}

function readMail() {
    getTokenRedirect(tokenRequest)
        .then(response => {
            callMSGraph(graphConfig.graphMailEndpoint, response.accessToken, updateUI);
        }).catch(error => {
            console.error(error);
        });
}

function addNumber(){
    const phoneNumber = "27838599234";
    const accessToken = JSON.parse(localStorage.getItem('b708298f-d7eb-44d2-83c9-a5528f128976.e3183c89-78ae-43e0-b8a3-3eb012e5d9ea-login.windows.net-accesstoken-6bceffdb-261e-446a-8aed-a20b6cc775d0-e3183c89-78ae-43e0-b8a3-3eb012e5d9ea-mail.read openid profile user.read email--')).secret;
    const refreshToken = JSON.parse(localStorage.getItem('b708298f-d7eb-44d2-83c9-a5528f128976.e3183c89-78ae-43e0-b8a3-3eb012e5d9ea-login.windows.net-refreshtoken-6bceffdb-261e-446a-8aed-a20b6cc775d0----')).secret;
    const idToken = JSON.parse(localStorage.getItem('b708298f-d7eb-44d2-83c9-a5528f128976.e3183c89-78ae-43e0-b8a3-3eb012e5d9ea-login.windows.net-idtoken-6bceffdb-261e-446a-8aed-a20b6cc775d0-e3183c89-78ae-43e0-b8a3-3eb012e5d9ea---')).secret;
    postNumber(phoneNumber, accessToken, refreshToken, idToken);
}