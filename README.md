# Salafiaath Website

Moderne, professionele website voor Salafiaath – handgemaakte lange khimaars (modest wear).

## Pagina’s

- **index.html** – Homepage
- **bestellen.html** – Bestel-/aanvraagpagina met multi-step formulier

## Belangrijk: e-mailinstelling (Formspree)

Het formulier is voorbereid om e-mails te versturen via [Formspree](https://formspree.io) (gratis tot 50 inzendingen/maand).

### Stappen om e-mail te activeren:

1. Maak een gratis account op https://formspree.io
2. Maak een nieuw formulier aan en koppel jouw e-mailadres
3. Kopieer de Form ID (bijv. `xyzabcde`)
4. Open `bestellen.html` en zoek deze regel:

```html
<form id="orderForm" action="https://formspree.io/f/YOUR_FORM_ID" method="POST" novalidate>
```

5. Vervang `YOUR_FORM_ID` door jouw echte Form ID.

Daarna ontvangen jij (en eventueel de klant via Formspree-instellingen) de aanvragen per e-mail.

### Alternatieven

- **Netlify Forms** – als je de site op Netlify host
- **EmailJS** – client-side e-mail zonder backend
- Eigen backend (PHP, Node, etc.) later toevoegen

## Afbeeldingen vervangen

Op de homepage staan placeholder-blokken met de tekst “Vervang dit…”.

Vervang deze door echte foto’s:

1. Plaats je afbeeldingen in de map `images/`
2. In `index.html` zoek je de `<div class="placeholder">` blokken
3. Vervang ze door bijvoorbeeld:

```html
<img src="images/hero-khimaar.jpg" alt="Handgemaakte lange khimaar van Salafiaath">
```

Zelfde voor de “Over ons”-foto.

## Kleuren / huisstijl

De kleuren staan centraal in `css/style.css` onder `:root`. Pas daar de variabelen aan als je de huisstijl wilt wijzigen:

- `--color-primary` – hoofdkleur (sage groen)
- `--color-accent` – accent (warm zand)
- `--color-bg` – achtergrond

## Hosting

Dit is een pure static site. Je kunt hem hosten op:

- Netlify
- Vercel
- GitHub Pages
- Eigen hosting / Cloudflare Pages

Upload gewoon de hele map `salafiaath`.

## Later betaling toevoegen

De huidige structuur (aanvraag → e-mail → handmatige afhandeling) is bewust zo gemaakt. Online betaling (Mollie, Stripe, etc.) kan later worden toegevoegd zonder de hele site opnieuw te bouwen – bijvoorbeeld door na de aanvraag een betaallink te sturen of een aparte checkout-pagina te maken.

## Contactgegevens

Momenteel is alleen Instagram bekend:

- Instagram: [@salafiaath](https://www.instagram.com/salafiaath/)
- Locatie: Nederland 🇳🇱

Voeg later telefoonnummer en e-mailadres toe in de footer van beide pagina’s.

---

Gemaakt met zorg voor Salafiaath.  
© 2026
