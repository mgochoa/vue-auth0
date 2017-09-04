import {WebAuth} from 'auth0-js'

export default class VueAuth0 {
    constructor(options) {
        this.options = options;
        this.webAuth = new WebAuth({
            domain: options.domain,
            clientID: options.clientId,
            audience: options.audience || options.domain.concat('/userinfo')
        });
        this.profile = {}
    }

    login(username, password) {
        return new Promise((resolve, reject) => {
            this.webAuth.client.login({
                realm: 'Username-Password-Authentication', //connection name or HRD domain
                username: username,
                password: password,
                scope: 'openid profile email offline_access',
                audience: this.options.audience
            }, (err, authResult) => {
                if (err) {
                    reject(err);
                }
                this.setSession(authResult);
                // Auth tokens in the result or an error
                resolve();
            });

        })
    }

    setSession(authResult) {
        if (authResult && authResult.accessToken && authResult.idToken) {
            let expiresAt = JSON.stringify(
                authResult.expiresIn * 1000 + new Date().getTime()
            );
            if (expiresAt == null) {
                this.webAuth.renewAuth({
                    redirectUri: this.options.redirectUri,
                    usePostMessage: true
                }, (error, renewAuthResult) => {
                    let newExpiresAt = JSON.stringify(
                        renewAuthResult.expiresIn * 1000 + new Date().getTime()
                    );
                    console.log(renewAuthResult.expiresIn);
                    console.log('renewAuth successful', error, renewAuthResult);
                    localStorage.setItem('expires_at', newExpiresAt)
                });
            } else {
                localStorage.setItem('expires_at', expiresAt)
            }

            // Set the time that the access token will expire at

            localStorage.setItem('access_token', authResult.accessToken);
            localStorage.setItem('id_token', authResult.idToken);
            this.getUserInfo();

        } else {

        }
    }

    getAccessToken() {
        const accessToken = localStorage.getItem('access_token')
        if (!accessToken) {
            throw new Error('No access token found')
        }
        return accessToken
    }

    getUserInfo() {
        const access_token = this.getAccessToken();
        this.webAuth.client.userInfo(access_token, (error, profile) => {
            if (error) {
                // tmp error handling
                // alert(`Auth service 2: ${error}`);

            }
            localStorage.setItem('profile', JSON.stringify(profile));
            console.log(profile);
            this.profile = profile;

        })

    }

    logout() {
        // Clear access token and ID token from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        // navigate to the home route

    }

    isAuthenticated() {
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'))
        return new Date().getTime() < expiresAt
    }


}