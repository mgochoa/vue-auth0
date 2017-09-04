import WebAuth from 'auth0-js/WebAuth';

var babelHelpers = {};




var asyncGenerator = function () {
  function AwaitValue(value) {
    this.value = value;
  }

  function AsyncGenerator(gen) {
    var front, back;

    function send(key, arg) {
      return new Promise(function (resolve, reject) {
        var request = {
          key: key,
          arg: arg,
          resolve: resolve,
          reject: reject,
          next: null
        };

        if (back) {
          back = back.next = request;
        } else {
          front = back = request;
          resume(key, arg);
        }
      });
    }

    function resume(key, arg) {
      try {
        var result = gen[key](arg);
        var value = result.value;

        if (value instanceof AwaitValue) {
          Promise.resolve(value.value).then(function (arg) {
            resume("next", arg);
          }, function (arg) {
            resume("throw", arg);
          });
        } else {
          settle(result.done ? "return" : "normal", result.value);
        }
      } catch (err) {
        settle("throw", err);
      }
    }

    function settle(type, value) {
      switch (type) {
        case "return":
          front.resolve({
            value: value,
            done: true
          });
          break;

        case "throw":
          front.reject(value);
          break;

        default:
          front.resolve({
            value: value,
            done: false
          });
          break;
      }

      front = front.next;

      if (front) {
        resume(front.key, front.arg);
      } else {
        back = null;
      }
    }

    this._invoke = send;

    if (typeof gen.return !== "function") {
      this.return = undefined;
    }
  }

  if (typeof Symbol === "function" && Symbol.asyncIterator) {
    AsyncGenerator.prototype[Symbol.asyncIterator] = function () {
      return this;
    };
  }

  AsyncGenerator.prototype.next = function (arg) {
    return this._invoke("next", arg);
  };

  AsyncGenerator.prototype.throw = function (arg) {
    return this._invoke("throw", arg);
  };

  AsyncGenerator.prototype.return = function (arg) {
    return this._invoke("return", arg);
  };

  return {
    wrap: function (fn) {
      return function () {
        return new AsyncGenerator(fn.apply(this, arguments));
      };
    },
    await: function (value) {
      return new AwaitValue(value);
    }
  };
}();





var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();











































babelHelpers;

var VueAuth0 = function () {
    function VueAuth0(options) {
        classCallCheck(this, VueAuth0);

        this.options = options;
        this.webAuth = new WebAuth({
            domain: options.domain,
            clientID: options.clientId,
            audience: options.audience || options.domain.concat('/userinfo')
        });
        this.profile = {};
    }

    createClass(VueAuth0, [{
        key: 'login',
        value: function login(username, password) {
            var _this = this;

            return new Promise(function (resolve, reject) {
                _this.webAuth.client.login({
                    realm: 'Username-Password-Authentication', //connection name or HRD domain
                    username: username,
                    password: password,
                    scope: 'openid profile email offline_access',
                    audience: _this.options.audience
                }, function (err, authResult) {
                    if (err) {
                        reject(err);
                    }
                    _this.setSession(authResult);
                    // Auth tokens in the result or an error
                    resolve();
                });
            });
        }
    }, {
        key: 'setSession',
        value: function setSession(authResult) {
            if (authResult && authResult.accessToken && authResult.idToken) {
                var expiresAt = JSON.stringify(authResult.expiresIn * 1000 + new Date().getTime());
                if (expiresAt == null) {
                    this.webAuth.renewAuth({
                        redirectUri: this.options.redirectUri,
                        usePostMessage: true
                    }, function (error, renewAuthResult) {
                        var newExpiresAt = JSON.stringify(renewAuthResult.expiresIn * 1000 + new Date().getTime());
                        console.log(renewAuthResult.expiresIn);
                        console.log('renewAuth successful', error, renewAuthResult);
                        localStorage.setItem('expires_at', newExpiresAt);
                    });
                } else {
                    localStorage.setItem('expires_at', expiresAt);
                }

                // Set the time that the access token will expire at

                localStorage.setItem('access_token', authResult.accessToken);
                localStorage.setItem('id_token', authResult.idToken);
                this.getUserInfo();
            } else {}
        }
    }, {
        key: 'getAccessToken',
        value: function getAccessToken() {
            var accessToken = localStorage.getItem('access_token');
            if (!accessToken) {
                throw new Error('No access token found');
            }
            return accessToken;
        }
    }, {
        key: 'getUserInfo',
        value: function getUserInfo() {
            var _this2 = this;

            var access_token = this.getAccessToken();
            this.webAuth.client.userInfo(access_token, function (error, profile) {
                localStorage.setItem('profile', JSON.stringify(profile));
                console.log(profile);
                _this2.profile = profile;
            });
        }
    }, {
        key: 'logout',
        value: function logout() {
            // Clear access token and ID token from local storage
            localStorage.removeItem('access_token');
            localStorage.removeItem('id_token');
            localStorage.removeItem('expires_at');
            // navigate to the home route
        }
    }, {
        key: 'isAuthenticated',
        value: function isAuthenticated() {
            var expiresAt = JSON.parse(localStorage.getItem('expires_at'));
            return new Date().getTime() < expiresAt;
        }
    }]);
    return VueAuth0;
}();

var auth0Plugin = {
    install: function install(Vue, options) {
        Vue.prototype.$auth0 = new VueAuth0(options);
    }
};

export default auth0Plugin;
