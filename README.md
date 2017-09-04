# Vue Auth0

A pusher plugin for auth0-js V8

## Why?

I've seen my self in the need of create my own logins with Auth0 without the plugin they offer.

## Usage

Install the plugin like any other plugin. :)

~~~js
var Vue = require('vue');

Vue.use(require('vue-auth0'), {
  clientId: 'XXXXXXXXXXX',
  domain: 'myhost.auth0.com',
  callbackUrl: 'http://myhost/callback',
  audience: 'https://myhost.auth0.com/userinfo',
  redirectUri: 'https://myhost/callback',
})

~~~

### Manually using the auth0 instance.

Inside your components, you just need to access the `$auth0` object.

~~~js
export default {
    ready () {
        this.$auth0.login(username,password).then(() => {
            console.log(this.$auth0.profile)
        },error => {
            console.log(error)
        })
    },
    logout(){
        this.$auth0.logout();
    }
}
~~~


### After first login

Following data is saved on Local Storage:

- **expires_at:** Tiempo de vida del token
- **id_token:** JWT que devuelve Auth0
- **access_token:** Token necesario para consultar información y permisos del usuario
- **profile:** Profile information saved in a JSON.


### Also accessible on components

- **this.$auth0.webAuth:** WebAuth object provided by Auth0.
- **this.$auth0.profile:** Profile information
- **this.$auth9.options:** Options of the Initialization

