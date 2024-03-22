// ./src/handlers/defaultRoutes.js
/**
 * Renders a default response when no specific handler is found for a request.
 * This function serves as a fallback handler to provide informative feedback to the user or administrator.
 * It indicates whether no handlers are defined at all or if a specific handler for the requested domain is missing.
 * 
 * @param {Object} req - The HTTP request object provided by Express.js.
 * @param {Object} res - The HTTP response object provided by Express.js.
 * @param {boolean} [noRoutessDefined=false] - Indicates whether no handlers have been defined in the gateway.
 */
export default function defaultRoutes(req, res, noRoutesDefined = false) {
  let message = " ";
  if (noRoutesDefined) {
    message += " No Routes have been defined.<br/> To configure your Domain Routes, please refer to Docs: <br/>  https://netget.me ";
  } else {
    message += ` No Route found for ${req.hostname}.<br/> If you are the administrator, please define a route for this domain. <br/>  https://netget.me `;
  } 

  const showDomainListLink = !noRoutesDefined;

  res.render('index', {
      title: "Gateway Initiated!",
      message: message,
      showDomainListLink: showDomainListLink
  });
}
