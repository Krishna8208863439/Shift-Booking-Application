/**
 * ShiftBook Design Specification Color Palette
 * Sourced directly from Wolt Design Spec (Page 3)
 */
export const colors = {
  // Brand & Navigation
  primary: '#004FB4',           // Active link in main navigation, brand blue
  primaryLight: '#E8F1FC',
  
  // Backgrounds & Surfaces
  background: '#F1F4F8',        // Main app background
  cardBackground: '#FFFFFF',    // Shift cards background
  headerBackground: '#F7F8FB',  // Date section header background
  
  // Text & Labels
  textPrimary: '#4F6C92',       // Primary typography (times, headings, labels)
  textSecondary: '#A4B8D3',     // Secondary typography (locations, inactive tabs, counts)
  textMuted: '#8A9DB7',
  
  // Borders & Dividers
  border: '#CBD2E1',            // Section borders, card dividers
  borderLight: '#E5EBF3',
  
  // Disabled States
  disabledBorder: '#CBD2E1',
  disabledText: '#A4B8D3',
  disabledBackground: '#F7F8FB',
  
  // Book Action (Green)
  bookGreen: '#16A64D',         // Book button text, spinner green
  bookBorder: '#55CB82',        // Book button border
  bookTint: '#CAEFD8',          // Book badge/pill background tint
  
  // Cancel Action (Red / Magenta)
  cancelRed: '#E2006A',         // Cancel button text, overlapping text, spinner red
  cancelBorder: '#FE93B3',      // Cancel button border
  cancelTint: '#EED2DF',        // Cancel background tint
  
  // Feedback & Status
  success: '#16A64D',
  error: '#E2006A',
  warning: '#F5A623',
  info: '#004FB4',
  
  // Neutrals
  white: '#FFFFFF',
  black: '#1A2533',
  overlay: 'rgba(26, 37, 51, 0.45)',
  shadow: 'rgba(79, 108, 146, 0.08)',
};

export type Colors = typeof colors;
