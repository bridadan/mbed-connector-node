/*
 * Copyright (c) 2013-2015, ARM Limited, All Rights Reserved
 * SPDX-License-Identifier: Apache-2.0
 *
 * Licensed under the Apache License, Version 2.0 (the "License"); you may
 * not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS, WITHOUT
 * WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

var request = require('request'),
    urljoin = require('url-join'),
    events = require('events'),
    extend = require('node.extend'),
    util = require('util');

var mbedClient = function(options) {
  var defaultOptions = {
    host: "https://api.connector.mbed.com",
    requestCallback: this.requestCallback,
    asyncResponseHandler: this.asyncResponseHandler
  };

  this.options = extend(true, {}, defaultOptions, options);

  this.asyncCallbacks = {};
};

mbedClient.prototype = new events.EventEmitter;

// Endpoint directory lookups

mbedClient.prototype.getEndpoints = function(callback, options) {
  // Default options for this request
  var requestOptions = {
    request: {
      headers: {
        accept: 'application/json'
      }
    }
  };

  // Extend existing options with request options specific to this function,
  // then overwrite with user-specified options if given
  var extendedOptions = extend(true, {}, this.options, requestOptions, options);

  // Array of the URL path after the host name
  var path = ['endpoints'];

  // Form the request options object
  var completeOptions = this.formRequestOptions(path, extendedOptions);

  // Make the request
  this.makeAuthorizedRequest(completeOptions, callback);
}

mbedClient.prototype.getEndpoint = function(endpoint, callback, options) {
  // Default options for this request
  var requestOptions = {
    request: {
      headers: {
        accept: 'application/json'
      }
    }
  };

  // Extend existing options with request options specific to this function,
  // then overwrite with user-specified options if given
  var extendedOptions = extend(true, {}, this.options, requestOptions, options);

  // Array of the URL path after the host name
  var path = ['endpoints', endpoint];

  // Form the request options object
  var completeOptions = this.formRequestOptions(path, extendedOptions);

  // Make the request
  this.makeAuthorizedRequest(completeOptions, callback);
}

mbedClient.prototype.getResource = function(endpoint, resource, callback, options) {
  // Default options for this request
  var requestOptions = {
    request: {
      headers: {
        accept: '*/*'
      }
    }
  };

  // Extend existing options with request options specific to this function,
  // then overwrite with user-specified options if given
  var extendedOptions = extend(true, {}, this.options, requestOptions, options);

  // Array of the URL path after the host name
  var path = ['endpoints', endpoint, resource];

  // Form the request options object
  var completeOptions = this.formRequestOptions(path, extendedOptions);

  // Make the request
  this.makeAuthorizedRequest(completeOptions, callback);
}

mbedClient.prototype.putResource = function(endpoint, resource, value, callback, options) {
  // Default options for this request
  var requestOptions = {
    request: {
      method: 'PUT',
      headers: {
        accept: '*/*'
      },
      body: value.toString()
    }
  };

  // Extend existing options with request options specific to this function,
  // then overwrite with user-specified options if given
  var extendedOptions = extend(true, {}, this.options, requestOptions, options);

  // Array of the URL path after the host name
  var path = ['endpoints', endpoint, resource];

  // Form the request options object
  var completeOptions = this.formRequestOptions(path, extendedOptions);

  // Make the request
  this.makeAuthorizedRequest(completeOptions, callback);
}


// Notifications

mbedClient.prototype.subscribeToResource = function(endpoint, resource, callback, options) {
  // Default options for this request
  var requestOptions = {
    request: {
      method: 'PUT',
      headers: {
        accept: 'application/json'
      }
    }
  };

  // Extend existing options with request options specific to this function,
  // then overwrite with user-specified options if given
  var extendedOptions = extend(true, {}, this.options, requestOptions, options);

  // Array of the URL path after the host name
  var path = ['subscriptions', endpoint, resource];

  // Form the request options object
  var completeOptions = this.formRequestOptions(path, extendedOptions);

  // Make the request
  this.makeAuthorizedRequest(completeOptions, callback);
}

mbedClient.prototype.unsubscribeFromResource = function(endpoint, resource, callback, options) {
  // Default options for this request
  var requestOptions = {
    request: {
      method: 'DELETE'
    }
  };

  // Extend existing options with request options specific to this function,
  // then overwrite with user-specified options if given
  var extendedOptions = extend(true, {}, this.options, requestOptions, options);

  // Array of the URL path after the host name
  var path = ['subscriptions', endpoint, resource];

  // Form the request options object
  var completeOptions = this.formRequestOptions(path, extendedOptions);

  // Make the request
  this.makeAuthorizedRequest(completeOptions, callback);
}

mbedClient.prototype.unsubscribeFromAllResources = function(callback, options) {
  // Default options for this request
  var requestOptions = {
    request: {
      method: 'DELETE'
    }
  };

  // Extend existing options with request options specific to this function,
  // then overwrite with user-specified options if given
  var extendedOptions = extend(true, {}, this.options, requestOptions, options);

  // Array of the URL path after the host name
  var path = ['subscriptions'];

  // Form the request options object
  var completeOptions = this.formRequestOptions(path, extendedOptions);

  // Make the request
  this.makeAuthorizedRequest(completeOptions, callback);
}

// TODO: Return true or false in callback, not error
// Will require adding custom callback
mbedClient.prototype.isSubscribedToResource = function(endpoint, resource, callback, options) {
  // Default options for this request
  var requestOptions = {
    request: {
      method: 'GET',
      headers: {
        accept: '*/*'
      }
    }
  };

  // Extend existing options with request options specific to this function,
  // then overwrite with user-specified options if given
  var extendedOptions = extend(true, {}, this.options, requestOptions, options);

  // Array of the URL path after the host name
  var path = ['subscriptions', endpoint, resource];

  // Form the request options object
  var completeOptions = this.formRequestOptions(path, extendedOptions);

  // Make the request
  this.makeAuthorizedRequest(completeOptions, callback);
}

// TODO: Transform uri-list into json array
mbedClient.prototype.getSubscriptionsForEndpoint = function(endpoint, callback, options) {
  // Default options for this request
  var requestOptions = {
    request: {
      method: 'GET',
      headers: {
        accepts: 'test/uri-list'
      }
    }
  };

  // Extend existing options with request options specific to this function,
  // then overwrite with user-specified options if given
  var extendedOptions = extend(true, {}, this.options, requestOptions, options);

  // Array of the URL path after the host name
  var path = ['subscriptions', endpoint];

  // Form the request options object
  var completeOptions = this.formRequestOptions(path, extendedOptions);

  // Make the request
  this.makeAuthorizedRequest(completeOptions, callback);
}

mbedClient.prototype.unsubscribeFromEndpointResources = function(endpoint, callback, options) {
  // Default options for this request
  var requestOptions = {
    request: {
      method: 'DELETE'
    }
  };

  // Extend existing options with request options specific to this function,
  // then overwrite with user-specified options if given
  var extendedOptions = extend(true, {}, this.options, requestOptions, options);

  // Array of the URL path after the host name
  var path = ['subscriptions', endpoint];

  // Form the request options object
  var completeOptions = this.formRequestOptions(path, extendedOptions);

  // Make the request
  this.makeAuthorizedRequest(completeOptions, callback);
}

mbedClient.prototype.setPreSubscriptionData = function(preSubscriptionData, callback, options) {
  // Default options for this request
  var requestOptions = {
    request: {
      method: 'PUT',
      json: preSubscriptionData
    }
  };

  // Extend existing options with request options specific to this function,
  // then overwrite with user-specified options if given
  var extendedOptions = extend(true, {}, this.options, requestOptions, options);

  // Array of the URL path after the host name
  var path = ['subscriptions'];

  // Form the request options object
  var completeOptions = this.formRequestOptions(path, extendedOptions);

  // Make the request
  this.makeAuthorizedRequest(completeOptions, callback);
}

mbedClient.prototype.getPreSubscriptionData = function(callback, options) {
  // Default options for this request
  var requestOptions = {
    request: {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    }
  };

  // Extend existing options with request options specific to this function,
  // then overwrite with user-specified options if given
  var extendedOptions = extend(true, {}, this.options, requestOptions, options);

  // Array of the URL path after the host name
  var path = ['subscriptions'];

  // Form the request options object
  var completeOptions = this.formRequestOptions(path, extendedOptions);

  // Make the request
  this.makeAuthorizedRequest(completeOptions, callback);
}


mbedClient.prototype.setCallbackURL = function(url, callback, options) {
  // Default options for this request
  var requestOptions = {
    request: {
      method: 'PUT',
      json: {
        url: url
      }
    }
  };

  // Extend existing options with request options specific to this function,
  // then overwrite with user-specified options if given
  var extendedOptions = extend(true, {}, this.options, requestOptions, options);

  // Array of the URL path after the host name
  var path = ['notification', 'callback'];

  // Form the request options object
  var completeOptions = this.formRequestOptions(path, extendedOptions);

  // Make the request
  this.makeAuthorizedRequest(completeOptions, callback);
}

mbedClient.prototype.getCallbackURL = function(callback, options) {
  // Default options for this request
  var requestOptions = {
    request: {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    }
  };

  // Extend existing options with request options specific to this function,
  // then overwrite with user-specified options if given
  var extendedOptions = extend(true, {}, this.options, requestOptions, options);

  // Array of the URL path after the host name
  var path = ['notification', 'callback'];

  // Form the request options object
  var completeOptions = this.formRequestOptions(path, extendedOptions);

  // Make the request
  this.makeAuthorizedRequest(completeOptions, callback);
}

mbedClient.prototype.deleteCallbackURL = function(callback, options) {
  // Default options for this request
  var requestOptions = {
    request: {
      method: 'DELETE'
    }
  };

  // Extend existing options with request options specific to this function,
  // then overwrite with user-specified options if given
  var extendedOptions = extend(true, {}, this.options, requestOptions, options);

  // Array of the URL path after the host name
  var path = ['notification', 'callback'];

  // Form the request options object
  var completeOptions = this.formRequestOptions(path, extendedOptions);

  // Make the request
  this.makeAuthorizedRequest(completeOptions, callback);
}

mbedClient.prototype.startLongPolling = function(callback, options) {
  var _this = this;

  // Default options for this request
  var requestOptions = {
    request: {
      method: 'GET'
    }
  };

  // Extend existing options with request options specific to this function,
  // then overwrite with user-specified options if given
  var extendedOptions = extend(true, {}, this.options, requestOptions, options);

  // Array of the URL path after the host name
  var path = ['notification', 'pull'];

  // Form the request options object
  var completeOptions = this.formRequestOptions(path, extendedOptions);

  function poll(error) {
    if (error) {
      console.log('ERROR: Long poll failed [Status ' + error.status + ']');
      console.log(error);
      throw error;
    } else {
      _this.longPollRequestObj = _this.makeAuthorizedRequest(completeOptions, poll);
    }
  }


  if (this.longPollRequestObj) {
    this.stopLongPolling();
  }

  poll();

  if (callback) {
    callback();
  }
}

mbedClient.prototype.stopLongPolling = function(callback) {
  if (this.longPollRequestObj) {
    this.longPollRequestObj.abort();
    this.longPollRequestObj.end
    this.longPollRequestObj = null;
    c
  }
}

mbedClient.prototype.handleNotifications = function(payload) {
  if (payload['notifications']) {
    payload['notifications'].forEach(function(notification) {
      var data = new Buffer(notification.payload, 'base64');
      notification.payload = data.toString();
    });

    this.emit('notifications', payload['notifications']);
  }

  if (payload['registrations']) {
    this.emit('registrations', payload['registrations']);
  }

  if (payload['reg-updates']) {
    this.emit('reg-updates', payload['reg-updates']);
  }

  if (payload['de-registrations']) {
    this.emit('de-registrations', payload['de-registrations']);
  }

  if (payload['registrations-expired']) {
    this.emit('registrations-expired', payload['registrations-expired']);
  }

  if (payload["async-responses"]) {
    var _this = this;
    payload['async-responses'].forEach(function(asyncResponse) {
      _this.asyncResponseHandler(asyncResponse);
    });
  }
}


// Traffic limits

mbedClient.prototype.getTrafficLimits = function(callback, options) {
  // Default options for this request
  var requestOptions = {
    request: {
      method: 'GET',
      headers: {
        accept: 'application/json'
      }
    }
  };

  // Extend existing options with request options specific to this function,
  // then overwrite with user-specified options if given
  var extendedOptions = extend(true, {}, this.options, requestOptions, options);

  // Array of the URL path after the host name
  var path = ['limits'];

  // Form the request options object
  var completeOptions = this.formRequestOptions(path, extendedOptions);

  // Make the request
  this.makeAuthorizedRequest(completeOptions, callback);
}

// Helper functions

mbedClient.prototype.modifyOptionsWithAuth = function(options) {
  if (options.accessKey) {
    // If an access key is set, assume using access key authentication

    // Remove basic auth
    if (options.request.auth) {
      delete options.request.auth;
    }

    if (!options.request.headers) {
      options.request.headers = {};
    }

    options.request.headers.Authorization = 'bearer ' + options.accessKey;
  } else if (options.username && options.password) {
    // If an access key is not set but a username and password are set, assume using basic auth


    if (!options.domain) {
      throw new Error('Using basic auth, but no valid domain found before making request');
    }

    // Remove access key authorization header if it exists
    if (options.request.headers && options.request.headers.Authorization) {
      delete options.request.headers.Autorization;
    }

    options.request.auth = { user: options.domain + '/' + options.username, pass: options.password };
  }
};

mbedClient.prototype.formRequestOptions = function(path, options) {
  // Create an array containg all of the parts for the URL
  var fullPathArray = [options.host].concat(path);

  // Join the parts of the URL into a string
  var fullPath = urljoin.apply(urljoin, fullPathArray);

  var requestOptions = extend(true, {}, options, {
    request: {
      url: fullPath
    }
  });

  return requestOptions;
};

mbedClient.prototype.requestCallback = function(error, response, body, callback) {
  //console.log(body);
  if (error || (response && response.statusCode >= 400)) {
    var status;

    if (response && response.statusCode) {
      status = response.statusCode;
    } else {
      status = "error in callback";
    }

    var e = new Error('Request failed: [Status ' + status + '] ' + body);
    e.response = response;
    e.error = error;
    e.status = status;

    if (callback) {
      callback(e);
    }
  } else {
    if (body) {
      var obj = null;

      if (util.isString(body)) {
        try {
          obj = JSON.parse(body);
        } catch (e) {
          // Do nothing here, just catching exception (handled below)
        }
      } else {
        obj = body;
      }

      if (obj) {
        if (obj["async-response-id"]) {
          this.asyncCallbacks[obj["async-response-id"]] = function(err, body) {
            if (callback) {
              callback(err, body);
            }
          };
        } else {
          this.handleNotifications(obj);

          if (callback) {
            callback(null, obj);
          }
        }
      } else {
        if (callback) {
          callback(null, body);
        }
      }
    } else {
      if (callback) {
        callback(null, body);
      }
    }
  }
};

mbedClient.prototype.makeAuthorizedRequest = function(options, callback) {
  if (!options.request) {
    throw new Error('No "request" property given in options');
  }

  if (!options.request.url) {
    throw new Error('No "url" property specified in request options');
  }

  this.modifyOptionsWithAuth(options);

  var _this = this;
  request(options.request, function(error, response, body) {
    _this.requestCallback(error, response, body, callback);
  });
}

mbedClient.prototype.asyncResponseHandler = function(asyncResponse) {
  if (this.asyncCallbacks[asyncResponse.id]) {
    if (asyncResponse.status >= 400) {
      var e = new Error('Request failed with status ' + asyncResponse.status);
      e.status = asyncResponse.status;
      this.asyncCallbacks[asyncResponse.id](e);
    } else {
      var data = new Buffer(asyncResponse.payload, 'base64');
      this.asyncCallbacks[asyncResponse.id](null, data.toString());
      delete this.asyncCallbacks[asyncResponse.id];
    }
  }
}


module.exports = mbedClient;
