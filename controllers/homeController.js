/**
 * Display the home page 
 * @param {*} req 
 * @param {*} res 
 */
exports.getHomePage = async function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/html'}).end('<h1>Bienvenue sur la Page accueil</h1>');
}