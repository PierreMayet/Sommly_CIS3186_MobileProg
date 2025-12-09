# Sommly_CIS3186_MobileProg
Project CIS3186 Mobile Device Programming

## Project Structure

```
SommlyApp/
├── app/
│   ├── _layout.tsx
│   ├── (tabs)/
│   │   ├── _layout.tsx         # Navigation des onglets principaux
│   │   ├── index.tsx           # Home page
│   │   ├── two.tsx             # Shop page
│   │   ├── recommendation.tsx  # Sommelier page
│   │   ├── cart.tsx            # Cart page
│   ├── +html.tsx
│   ├── +not-found.tsx
│   ├── modal.tsx
├── assets/
│   ├── fonts/
│   └── images/
├── components/
│   ├── EditScreenInfo.tsx
│   ├── ExternalLink.tsx
│   ├── StyledText.tsx
│   └── Themed.tsx
├── constants/
│   └── Colors.ts
├── app.json
├── package.json
├── tsconfig.json
└── ...
```

**Main folders/files :**
- `app/(tabs)/` : Main application pages (tabs)
- `components/` : Reusable UI components
- `assets/` : Images and fonts
- `constants/` : Colors and other constants