export const typography = {
  sizes: {
    xxs: 11,
    xs: 12,
    sm: 13,
    md: 14,
    base: 15,
    lg: 16,
    xl: 18,
    xxl: 22,
    header: 26,
  },
  weights: {
    regular: '400' as const,
    medium: '500' as const,
    semibold: '600' as const,
    bold: '700' as const,
  },
  lineHeights: {
    tight: 16,
    normal: 20,
    relaxed: 24,
    header: 32,
  },
};

export type Typography = typeof typography;
