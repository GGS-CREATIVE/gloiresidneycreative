// Serveur statique minimal (zéro dépendance) pour GGS Creative
// Sert les fichiers HTML/CSS/JS/images + URLs propres (sans .html)
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT = __dirname;
const PORT = process.env.PORT || 3000;

const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.webp': 'image/webp',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon',
  '.woff2': 'font/woff2',
  '.txt': 'text/plain; charset=utf-8',
  '.xml': 'application/xml; charset=utf-8',
  '.webmanifest': 'application/manifest+json'
};

function send(res, status, body, type) {
  var headers = {};
  if (type) headers['Content-Type'] = type;
  // HTML : jamais mis en cache (les MAJ apparaissent tout de suite)
  // Autres (css/js/images/polices) : revalidation à chaque visite ; changer de version (styles-vN.css, main-vN.js) reste la règle
  if (type && type.indexOf('text/html') === 0) {
    headers['Cache-Control'] = 'no-cache, no-store, must-revalidate';
  } else {
    headers['Cache-Control'] = 'public, max-age=0, must-revalidate';
  }
  res.writeHead(status, headers);
  res.end(body);
}

// Fichiers internes jamais servis : fichiers/dossiers cachés (.git, .claude…),
// scripts, doc (.md) et fichiers du serveur lui-même
const BLOCKED = /(^|\/)\.|^\/(scripts|node_modules)(\/|$)|^\/(server\.js|package(-lock)?\.json)$/i;

// Vraie page 404 du site (FR, ou EN sous /en/)
function notFound(res, p) {
  var page = p.indexOf('/en/') === 0 ? 'en/404.html' : '404.html';
  fs.readFile(path.join(ROOT, page), function (err, data) {
    if (err) return send(res, 404, 'Not found', 'text/plain');
    send(res, 404, data, 'text/html; charset=utf-8');
  });
}

const server = http.createServer(function (req, res) {
  try {
    var qIndex = req.url.indexOf('?');
    var query = qIndex >= 0 ? req.url.slice(qIndex) : '';
    var p = decodeURIComponent(qIndex >= 0 ? req.url.slice(0, qIndex) : req.url);

    // Redirige *.html -> URL propre (sans extension)
    if (p !== '/' && p.toLowerCase().endsWith('.html')) {
      var clean = p.slice(0, -5);
      if (clean.toLowerCase().endsWith('/index')) clean = clean.slice(0, -6) || '/';
      res.writeHead(301, { Location: clean + query });
      return res.end();
    }

    if (BLOCKED.test(p)) return notFound(res, p);
    if (p.endsWith('/')) p += 'index.html';

    var fp = path.normalize(path.join(ROOT, p));
    if (fp.indexOf(ROOT) !== 0) return send(res, 403, 'Forbidden', 'text/plain');

    // URL propre : pas d'extension -> tente .html ou /index.html
    if (!path.extname(fp)) {
      if (fs.existsSync(fp + '.html')) fp = fp + '.html';
      else if (fs.existsSync(path.join(fp, 'index.html'))) fp = path.join(fp, 'index.html');
    }

    // Seuls les types du site sont servis (.md, .py, .gitignore… → 404)
    var type = MIME[path.extname(fp).toLowerCase()];
    if (!type) return notFound(res, p);

    fs.readFile(fp, function (err, data) {
      if (err) return notFound(res, p);
      send(res, 200, data, type);
    });
  } catch (e) {
    send(res, 500, 'Server error', 'text/plain');
  }
});

server.listen(PORT, function () {
  console.log('GGS Creative en ligne sur le port ' + PORT);
});
