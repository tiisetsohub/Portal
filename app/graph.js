/** 
 * Helper function to call MS Graph API endpoint
 * using the authorization bearer token scheme
*/
function callMSGraph(endpoint, token, callback) {
    const headers = new Headers();
    const bearer = `Bearer ${token}`;

    headers.append("Authorization", bearer);

    const options = {
        method: "GET",
        headers: headers
    };

    console.log('request made to Graph API at: ' + new Date().toString());

    fetch(endpoint, options)
        .then(response => response.json())
        .then(response => callback(response, endpoint))
        .catch(error => console.log(error));
}

function postNumber(phoneNumber, accessToken, refreshToken, idToken) {

    axios.post("http://localhost:8080/api/user",
        {
            phoneNumber: phoneNumber,
            accessToken: accessToken,
            refreshToken: refreshToken,
            idToken: idToken

        }).then(function (response) {
        console.log(response)
    })
}