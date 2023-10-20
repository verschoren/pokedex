/**
 * @typedef {Object} Env
 */

export default {
	/**
	 * @param {Request} request
	 * @param {Env} env
	 * @param {ExecutionContext} ctx
	 * @returns {Promise<Response>}
	 */
	async fetch(request, env, ctx) {
		const url = new URL(request.url);
		
		if (request.method === "OPTIONS") {
			// Handle CORS preflight requests
			return handleOptions(request);
		  } else if (
			request.method === "GET" ||
			request.method === "HEAD"
		  ) {

			if (url.pathname.includes("custom_objects")) {
				var myHeaders = new Headers();
				myHeaders.append("Authorization", "Basic tokens");
				
				var requestOptions = {
                    method: 'GET',
                    headers: myHeaders,
                    redirect: 'follow',
                    'content-type': 'application/json'
				};

				let api_url = `https://internalnote.zendesk.com${url.pathname}?${url.searchParams}`;
				
                const data = await fetch(api_url, requestOptions)
				.then(response => response.json())
				.then(result => {
					return result;
				})
				.catch(error => console.log('error', error));
				
				return new Response(JSON.stringify(data), {
					headers: {
						"content-type": "application/json",
						"Access-Control-Allow-Origin": 'https://support.internalnote.com'
					},
				});
			}

			return new Response('Path not supported', {
				headers: {
					"content-type": "text/html",
					"Access-Control-Allow-Origin": '*'
				},
				status: 404
			});
		} else {
			return new Response(null, {
			  status: 405,
			  statusText: "Method Not Allowed",
			});
		}
	}
}		

function handleOptions(request) {
	const corsHeaders = {
		'Access-Control-Allow-Origin': '*',
		'Access-Control-Allow-Methods': 'GET,HEAD,POST,OPTIONS',
		'Access-Control-Max-Age': '86400',
	};
	// Make sure the necessary headers are present
	// for this to be a valid pre-flight request
	let headers = request.headers;
	if (
		headers.get('Origin') !== null &&
		headers.get('Access-Control-Request-Method') !== null &&
		headers.get('Access-Control-Request-Headers') !== null
	) {
		// Handle CORS pre-flight request.
		// If you want to check or reject the requested method + headers
		// you can do that here.
		let respHeaders = {
			...corsHeaders,
			// Allow all future content Request headers to go back to browser
			// such as Authorization (Bearer) or X-Client-Name-Version
			'Access-Control-Allow-Headers': request.headers.get('Access-Control-Request-Headers'),
		};

		return new Response(null, {
			headers: respHeaders,
		});
		} else {
		// Handle standard OPTIONS request.
		// If you want to allow other HTTP Methods, you can do that here.
		return new Response(null, {
			headers: {
			Allow: 'GET, HEAD, POST, OPTIONS',
			},
		});
	}  
}
