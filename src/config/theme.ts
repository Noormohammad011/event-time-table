import type { ThemeConfig } from 'antd'

export const themeConfig: ThemeConfig = {
  token: {
    // Primary color
    colorPrimary: '#2563eb', // primary-600
    colorPrimaryHover: '#1d4ed8', // primary-700
    colorPrimaryActive: '#1e40af', // primary-800

    // Secondary color (used for accents)
    colorInfo: '#9333ea', // secondary-600
    colorSuccess: '#10b981',
    colorWarning: '#f59e0b',
    colorError: '#ef4444',

    // Border radius
    borderRadius: 8,
    borderRadiusLG: 12,
    borderRadiusSM: 6,

    // Font
    fontFamily:
      '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',

    // Shadows
    boxShadow: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
    boxShadowSecondary:
      '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  },
  components: {
    Button: {
      borderRadius: 8,
      controlHeight: 40,
      fontWeight: 500,
    },
    Input: {
      borderRadius: 8,
      controlHeight: 40,
    },
    Card: {
      borderRadius: 12,
      boxShadow:
        '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
    },
    Menu: {
      borderRadius: 8,
      itemBorderRadius: 8,
      itemMarginInline: 8,
      itemMarginBlock: 4,
    },
    Layout: {
      headerBg: '#ffffff',
      siderBg: '#ffffff',
    },
  },
}
