const rfc_url = 'https://www.rfc-editor.org/rfc/rfc9110#name-'

/**
 * Construct a URI reference for an HTTP Status Code.
 * 
 * @param {number} status 
 * @param {string} title 
 * @returns {string}
 */
const getType = (status, title) => {
  return `${rfc_url}${status}-${title.replace(' ', '-').toLocaleLowerCase()}`
}

/**
 * @type {import("pijoy").ProblemInstance[]}
 */
export const error_instances = [
  {
    status: 400,
    title: 'Bad Request',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 401,
    title: 'Unauthorized',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 402,
    title: 'Payment Required',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 403,
    title: 'Forbidden',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 404,
    title: 'Not Found',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 405,
    title: 'Method Not Allowed',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 406,
    title: 'Not Acceptable',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 407,
    title: 'Proxy Authentication Required',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 408,
    title: 'Request Timeout',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 409,
    title: 'Conflict',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 410,
    title: 'Gone',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 411,
    title: 'Length Required',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 412,
    title: 'Precondition Failed',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 413,
    title: 'Content Too Large',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 414,
    title: 'URI Too Long',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 415,
    title: 'Unsupported Media Type',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 416,
    title: 'Range Not Satisfiable',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 417,
    title: 'Expectation Failed',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 421,
    title: 'Misdirected Request',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 422,
    title: 'Unprocessable Content',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 426,
    title: 'Upgrade Required',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 500,
    title: 'Internal Server Error',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 501,
    title: 'Not Implemented',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 502,
    title: 'Bad Gateway',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 503,
    title: 'Service Unavailable',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 504,
    title: 'Gateway Timeout',
    get type() { return getType(this.status, this.title) }
  },
  {
    status: 505,
    title: 'HTTP Version Not Supported',
    get type() { return getType(this.status, this.title) }
  }
]
