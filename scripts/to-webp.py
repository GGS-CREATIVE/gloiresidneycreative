#!/usr/bin/env python3
"""
Convertit les images raster (jpg/jpeg/png) d'un dossier en WebP.
Supprime l'original après conversion réussie.

Usage :
  python3 scripts/to-webp.py [dossier]            # convertit + supprime l'original
  python3 scripts/to-webp.py [dossier] --refs     # + met à jour les références .html/.css/.svg

Sans argument, traite assets/ à la racine du projet.
"""
import sys, os, glob

try:
    from PIL import Image
except ImportError:
    sys.stderr.write("Pillow manquant : pip3 install --user Pillow\n")
    sys.exit(0)  # silencieux pour le hook

QUALITY = 85
EXTS = (".jpg", ".jpeg", ".png")
# fichiers à NE jamais convertir (favicons, icônes app) : restent en PNG/ICO
SKIP = ("favicon", "apple-touch-icon", "icon-", "-icon", "manifest")

root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
target = sys.argv[1] if len(sys.argv) > 1 and not sys.argv[1].startswith("-") else os.path.join(root, "assets")
update_refs = "--refs" in sys.argv

converted = []  # (ancien_nom, nouveau_nom)

for path in glob.glob(os.path.join(target, "*")):
    ext = os.path.splitext(path)[1].lower()
    if ext not in EXTS:
        continue
    base = os.path.basename(path).lower()
    if any(k in base for k in SKIP):
        continue
    webp_path = os.path.splitext(path)[0] + ".webp"
    # idempotent : saute si un .webp à jour existe déjà
    if os.path.exists(webp_path) and os.path.getmtime(webp_path) >= os.path.getmtime(path):
        os.remove(path)
        continue
    try:
        im = Image.open(path)
        has_alpha = im.mode in ("RGBA", "LA") or (im.mode == "P" and "transparency" in im.info)
        im = im.convert("RGBA" if has_alpha else "RGB")
        im.save(webp_path, "WEBP", quality=QUALITY, method=6)
        os.remove(path)
        converted.append((os.path.basename(path), os.path.basename(webp_path)))
    except Exception as e:
        sys.stderr.write("Échec %s : %s\n" % (path, e))

# Mise à jour des références dans le code (option --refs)
if update_refs and converted:
    code_files = []
    for ext in ("*.html", "*.css"):
        code_files += glob.glob(os.path.join(root, ext))
        code_files += glob.glob(os.path.join(root, "css", ext))
    for cf in code_files:
        with open(cf, encoding="utf-8") as fh:
            s = fh.read()
        o = s
        for old, new in converted:
            s = s.replace(old, new)
        if s != o:
            with open(cf, "w", encoding="utf-8") as fh:
                fh.write(s)

if converted:
    print("WebP : %d image(s) convertie(s)" % len(converted))
    for old, new in converted:
        print("  %s -> %s" % (old, new))
