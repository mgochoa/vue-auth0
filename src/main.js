import VueAuth0 from './Auth0/VueAuh0'


const auth0Plugin = {
    install(Vue, options){
        Vue.prototype.$auth0 = new VueAuth0(options);
    }

};

export default auth0Plugin;
