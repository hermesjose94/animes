const boom = require('@hapi/boom');

function scopesValidationHandler(allowedScopes) {
  return function (req, res, next) {
    if (!req.user || (req.user && !req.user.scopes)) {
      next(boom.unauthorized('Missing scopes'));
    }

    // Mapeo el arreglo de scopes pasados a la ruta y verifico si cada uno de esos elementos se encuentra definido en los scopes del usuario. El resultado va a ser un nuevo arreglo de elementos true y/o false
    const permisions = allowedScopes.map((scope) =>
      req.user.scopes.includes(scope)
    );

    //verifico que no haya elemetos false en el arreglo de permisos (es decir, todos tienen que ser true para pasar al siguiente middleware, con uno que tenga false, significa que todos los permisos no se cumplen y por tanto se le niega el acceso)
    const hasAccess = !permisions.includes(false);

    if (hasAccess) {
      next();
    } else {
      next(boom.unauthorized('Insufficent scoopes'));
    }
  };
}

module.exports = scopesValidationHandler;
