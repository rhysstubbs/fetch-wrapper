# fetch-js-wrapper

`fetch-js-wrapper` was designed to be used as a lightweight, drop-in replacement for axios when using the native Fetch API. `fetch-js-wrapper` aims to do as little as possible but provides some of the basic functionality we're used to from libraries such as [axios](https://github.com/axios/axios).

## Installation

```bash
npm i fetch-js-wrapper
```

## Usage

### Basic

Below are some example usages. These are not complete examples, these are intended to demonstrate how you *could* use the library.

**For all available options see [options](#options)**

```js
// Basic HTTP request

import FetchWrapper from './index.js';

const http = new FetchWrapper( {
    baseURL: 'https://api.example.com'
} );

const response = await http.get( '/example/endpoint' );

if ( !response.ok ) {
    // Handle it
}

const something = await response.json();

// Use it
```

### Utilising Middleware

```js
// Use middleware for JWT authentication

import FetchWrapper from './index.js';

const http = new FetchWrapper( {
    baseURL: 'https://api.example.com'
} );

http.use( ( request ) => {
    // Get the token from somewhere and set the header
    const accessToken = localStorage.getItem( 'accessToken' );

    request.headers[ 'Authorization' ] = accessToken;

    return request;
}, 'before' );

http.use( async ( response, request ) => {
    if ( response.status === 401 ) {
        
        const refreshResponse = fetch( '/refresh', {
            headers: {
                'Authorization': localStorage.getItem( 'refreshToken' )
            }
        } );

        if ( !refreshResponse.ok ) {
            // Handle it...
        }

        const tokens = await refreshResponse.json();
        localStorage.setItem( 'accessToken', tokens.access );
        localStorage.setItem( 'refreshToken', tokens.refresh );

        // Retry the original request that failed...
        return http.request( response.url, request );
    }

    return response;
}, 'after' );

const response = await http.get( '/example/endpoint' );

// Do what you need to do
```

### Available Options

Below are all of the options available when creating a new instance of `FetchWrapper`. Pass a single object to the constructor.

|  Key | Type  | Default Value | Description  |
|---            |---        |---    |---
|  `baseURL`    | String    | ""    |       A URL to prefix all relative requests with. |
|               |           |       |

**Example of passing options**

```js
new FetchWrapper( {
    baseURL: 'https://api.example.com'
} );
```

## Browser Support

If you need to support older browsers that do not natively support ES6 (classes, let, const etc.) you can import `index.min.js`, see our `package.json` for browserlist support configuration.

The main bundle comes as-is, i.e. without polyfills, not transpiled or minified in anyway. If you need any of these feature please submit as a feature request or pull request, or feel free to fork the repository and make the changes you require!

## Running the tests

Coming soon!

## And coding style tests

We use [ESLint](https://eslint.org/) for managing code style. See `.eslintrc` for the complete configuration.

## Contributing

Coming soon!

## Authors

* **[Rhys Stubbs](https://github.com/rhysstubbs)** - *Initial work*

## License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details

## Acknowledgments

* Thanks [axios](https://github.com/axios/axios) for the inspiration!
