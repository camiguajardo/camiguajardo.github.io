# Portafolio de Cami — web estática

Réplica del portafolio que estaba en Cargo (camiguajardo.cargo.site), en inglés y en español.

## Estructura

```
index.html                 ← portada en inglés
about-me/, digital-design/, motion-graphics/, artificial-intelligence/,
art-direction-content-production/, print-design/, branding/
es/                        ← la misma web en español
  index.html, sobre-mi/, diseno-digital/, motion-graphics/, inteligencia-artificial/,
  direccion-de-arte-produccion-de-contenido/, diseno-de-impresos/, branding/
media/                     ← imágenes (WebP), vídeos (MP4) y CVs (PDF)
site.css                   ← estilos (colores, tipografía, marco naranja…)
site.js                    ← galerías, slideshows, reloj y visor de imágenes
```

Para verla en el ordenador basta con abrir `index.html` con doble clic.

## Cómo editar

Cada página es un HTML normal. Las galerías usan las mismas etiquetas que Cargo,
así que se entiende fácil copiando un bloque que ya exista:

- `<column-set>` / `<column-unit style="--span:5">` → columnas (12 en total)
- `<gallery-grid style="--cols:4">` → cuadrícula
- `<gallery-justify row-height="38%">` → fila justificada
- `<gallery-columnized>` → mosaico tipo Pinterest
- `<gallery-slideshow autoplay-delay="1">` → presentación automática
- `<media-item class="zoomable" style="--ar:1080/1350;--ratio:0.8">` con un `<img>` dentro → imagen
  (`--ar` y `--ratio` son ancho/alto de la imagen; `zoomable` hace que se amplíe al hacer clic)

Para añadir una imagen: expórtala como WebP o JPG (máx. ~2000 px de ancho), ponla en `media/`
y copia un `<media-item>` existente cambiando el nombre del archivo y las proporciones.

## Tipografía

En Cargo se usaba **Neue Haas Grotesk** (fuente de pago que ponía Cargo). La web ya la usa si está
disponible; si no, cae a Helvetica/Arial. Si Cami tiene Adobe Creative Cloud, puede crear un kit web
gratuito en Adobe Fonts con "Neue Haas Grotesk Text" y pegar su `<link>` en el `<head>` de cada página.

## Publicar (gratis)

**Netlify** (lo más fácil): app.netlify.com/drop → arrastrar esta carpeta. Luego, en
"Domain settings", conectar el dominio si tiene uno.

Para actualizar después: volver a arrastrar la carpeta en el panel del sitio ("Deploys").
