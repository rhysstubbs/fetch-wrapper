/**
 * FetchWrapper was designed to be used as a lightweight, drop-in replacement
 * for axios (https://github.com/axios/axios) when using the native Fetch API.
 *
 * FetchWrapper aims to do as little as possible and assumes all requests are JSON.
 * For additional features/functionality submit an Issue and/or pull-request and it will be considered.
 */
 class FetchWrapper {
    /**
     * @param {Object} options - the options to use when creating a new instance of FetchWrapper.
     */
    constructor( options ) {
        // Set options with defaults
        this.options = Object.assign( {}, this.optionDefaults, options );

        // always prefer base URLs without a trailing /
        if ( this.options.baseURL.startsWith( '/' ) ) {
            this.options.baseURL.substr( 0, this.options.baseURL.length - 2 );
        }
    }

    /**
     * @param {String} url - the URL to send the request to
     * @param {Object} r - the configuration of the request, e.g. headers.
     * @returns {Promise} - request returns either a response or error
     */
    async request( url, r ) {
        // Set request with defaults
        let request = Object.assign( {}, this.requestDefaults, r );

        try {
            // Apply before request middleware functions
            if ( this.options.middleware.before.length > 0 ) {
                for ( let func = 0; func < this.options.middleware.before.length; func++ ) {
                    r = await this.options.middleware.before[ func ]( request );
                }
            }

            // Construct the URL, handles base URL & path or absolute URLs
            let requestURL = null;
            let path = url.startsWith( '/' ) ? url : "/+" + url;

            if ( url.startsWith( 'http' ) || url.startsWith( 'https' ) ) {
                requestURL = new URL( url );
            } else if ( this.options.baseURL.length > 0 ) {
                requestURL = new URL( this.options.baseURL + path );
            }

            let response = await fetch( requestURL.toString(), request );

            // Apply after request middleware functions
            if ( this.options.middleware.after.length > 0 ) {
                for ( let func  = 0; func < this.options.middleware.after.length; func++ ) {
                    response = await this.options.middleware.after[ func ]( response, request );
                }
            }

            return response;
        } catch ( error ) {
            return Promise.reject( error );
        }
    }

    /**
     * get is a helper function to simplify GET requests.
     * Internally it calls request.
     * @param {String} url - the URL to send the request to
     * @returns {Promise} - returns either a response or error
     */
    async get( url ) {
        return await this.request( url, {
            method: 'GET'
        } );
    }

    /**
     * post is a helper function to simplify POST requests.
     * Internally it calls request.
     * @param {String} url - the URL to send the request to
     * @param {Object} payload
     * @returns {Promise} - returns either a response or error
     */
    async post( url, payload ) {
        return await this.request( url, {
            method: 'POST',
            body: JSON.stringify( payload )
        } );
    }

    /**
     * put is a helper function to simplify PUT requests.
     * Internally it calls request.
     * @param {String} url - the URL to send the request to
     * @param {Object} payload
     * @returns {Promise} - returns either a response or error
     */
    async put( url, payload ) {
        return await this.request( url, {
            method: 'PUT',
            body: JSON.stringify( payload )
        } );
    }

    /**
     * patch is a helper function to simplify PATCH requests.
     * Internally it calls request.
     * @param {String} url - the URL to send the request to
     * @returns {Promise} - returns either a response or error
     */
    async patch( url, payload ) {
        return await this.request( url, {
            method: 'PATCH',
            payload: JSON.stringify( payload )
        } );
    }

    /**
     * delete is a helper function to simplify DELETE requests.
     * Internally it calls request.
     * @param {String} url - the URL to send the request to
     * @returns {Promise} - returns either a response or error
     */
    async delete( url ) {
        return await this.request( url, {
            method: 'DELETE'
        } );
    }

    /**
     * use allows functions to be added to the before/after middleware pipelines.
     * This is useful for JWT access token refreshes etc.
     *
     * @param {Function} func - the function to add to the pipeline
     * @param {String} pipeline - either before/after request pipelines
     * @returns {Promise} - returns either a response or error
     */
    use( func, pipeline ) {
        if ( !func ) {
            return new Error( 'Function required' );
        }

        if ( pipeline !== 'before' && pipeline !== 'after' ) {
            return new Error( 'Valid pipeline values are "before" or "after"' );
        }

        this.options.middleware[ pipeline ].push( func );
    }

    /**
     * The default options for creating a new FetchWrapper
     */
    get optionDefaults() {
        return {
            baseURL: '',
            middleware: {
                before: [],
                after: []
            }
        };
    }

    /**
     * The default request options
     */
    get requestDefaults() {
        return {
            method: 'GET',
            cache: 'no-cache',
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        };
    }
}

export default FetchWrapper;
