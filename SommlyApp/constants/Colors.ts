export const palette = {
  primary: '#800020', // Merlot Intense
  secondary: '#C5A059', // Champagne Gold
  textPrimary: '#2D2D2D',
  textSecondary: '#757575',
  background: '#F9F9F9',
  surface: '#FFFFFF',
  border: '#E6E0DC',
  muted: '#EDE7E3',
};

export const typography = {
  heading: 'PlayfairDisplay_700Bold',
  subheading: 'PlayfairDisplay_600SemiBold',
  body: 'Lato_400Regular',
  bodyBold: 'Lato_700Bold',
  accent: 'Lato_700Bold',
};

const Colors = {
  light: {
    text: palette.textPrimary,
    background: palette.background,
    tint: palette.primary,
    tabIconDefault: palette.textSecondary,
    tabIconSelected: palette.primary,
    card: palette.surface,
    border: palette.border,
    muted: palette.muted,
  },
  dark: {
    text: '#F3F1ED',
    background: '#12090A',
    tint: palette.secondary,
    tabIconDefault: palette.textSecondary,
    tabIconSelected: palette.secondary,
    card: '#1E1212',
    border: '#3A2A2A',
    muted: '#5B4A4A',
  },
  palette,
  typography,
};

export default Colors;
