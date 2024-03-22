// ./src/handlers/defaultHandlers.js
export function defaultHandler(req, res) {
    res.render('index', {
      title: "Default Handler",
      message: `This is a default response for ${req.hostname}. Adjust your settings or contact the administrator.`,
      showDomainListLink: false
    });
  }