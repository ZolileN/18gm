# 18 Gangster Museum — Website

Official website for **18 Gangster Museum**, Africa's first living museum dedicated to demystifying gangsterism, based in Khayelitsha, Cape Town.

## 🗂 Project Structure

```
18gm/
├── index.html              # Homepage
├── pages/
│   ├── tours.html          # All tours listing
│   ├── about.html          # About the museum
│   ├── contact.html        # Contact page
│   ├── media.html          # Media & press
│   ├── donate.html         # Donations
│   └── booking.html        # Standalone booking page
├── css/
│   ├── main.css            # Global styles, variables, reset
│   ├── nav.css             # Navigation
│   ├── hero.css            # Hero section
│   ├── tours.css           # Tour cards & grid
│   ├── booking.css         # Booking modal & form
│   └── footer.css          # Footer
├── js/
│   ├── main.js             # Init, scroll reveal, utilities
│   ├── nav.js              # Mobile nav, sticky nav
│   ├── booking.js          # Booking modal logic & form
│   └── carousel.js         # Hero image carousel
├── images/
│   └── README.md           # Image asset notes
└── README.md
```

## 🚀 Deploy to GitHub Pages

```bash
# 1. Clone / push to GitHub
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/ZolileN/18gm
git push -u origin main

# 2. In GitHub repo → Settings → Pages
#    Source: Deploy from branch → main → / (root)
#    Your site will be live at: https://ZolileN.github.io/18gm/
```

## 🛠 Local Development

No build tools required — pure HTML/CSS/JS.

```bash
# Option A: Python
python3 -m http.server 8080

# Option B: Node
npx serve .

# Option C: VS Code Live Server extension
```

## 🎨 Brand Colors

| Token | Hex | Usage |
|---|---|---|
| `--red` | `#d41217` | Primary accent, CTAs, highlights |
| `--red-dark` | `#a50d11` | Hover states |
| `--black` | `#111111` | Page background |
| `--charcoal` | `#1e1e1e` | Card backgrounds |
| `--dark-grey` | `#2a2a2a` | Borders, dividers |
| `--mid-grey` | `#888888` | Secondary text |
| `--light-grey` | `#cccccc` | Body text on dark |
| `--white` | `#ffffff` | Headings, labels |

## 📦 Production Checklist

- [ ] Replace placeholder images in `/images/` with real photos
- [ ] Update contact info in `index.html` and `pages/contact.html`
- [ ] Connect booking form to backend (FormSubmit / Netlify Forms / custom API)
- [ ] Add Google Analytics tag to `<head>` in all pages
- [ ] Set correct `og:image` and meta descriptions per page
- [ ] Compress all images (use [Squoosh](https://squoosh.app))
- [ ] Test on mobile (iOS Safari, Android Chrome)

## 📬 Booking Form Integration

The booking form in `js/booking.js` is ready for drop-in backend connection.  
Options:
- **Netlify Forms** — add `netlify` attribute to form, zero config
- **FormSubmit.co** — change `action` to `https://formsubmit.co/info@18gm.co.za`
- **Custom API** — edit the `submitBooking()` function in `js/booking.js`

## 📄 License

© 18 Gangster Museum. All rights reserved.
