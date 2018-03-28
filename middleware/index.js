
// CUSTOM MIDDLEWARE
//		1. make middleware
//		2. export that shit!
//		3. require this shit in the index.js file or wherever you may want to call it
//		4. call it in a route (between route and callback function)!



const loggedOut = (req, res, next) => {
	if (req.session && req.session.userId) {
		return res.redirect('/profile');
	}
	return next();
}

const requiresLogin = (req, res, next) => {
	if (req.session && req.session.userId) {
		next();
	} else {
		var err = new Error('You must be logged in to view this page.');
		err.status = 401;
		next(err);
	}
}


module.exports.loggedOut = loggedOut;
module.exports.requiresLogin = requiresLogin;