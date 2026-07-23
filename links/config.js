/**
 * SEDRA STORE – Configuration
 * Edit default links here, or manage via admin.html
 */

const SEDRA_CONFIG = {
  adminPassword: 'sedra2025', // ← Change this password

  defaultButtons: [
    {
      id: 'btn-website',
      label: 'زيارة الموقع',
      description: 'تصفح جميع منتجاتنا وعروضنا',
      url: 'https://sedrastores.com',
      icon: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <circle cx="12" cy="12" r="9" stroke="#D4AF37" stroke-width="1.5"/>
        <path d="M12 3c-2.5 3-3.5 5.5-3.5 9s1 6 3.5 9M12 3c2.5 3 3.5 5.5 3.5 9s-1 6-3.5 9" stroke="#D4AF37" stroke-width="1.5"/>
        <path d="M3 12h18" stroke="#D4AF37" stroke-width="1.5"/>
        <path d="M3.5 8h17M3.5 16h17" stroke="#D4AF37" stroke-width="1.2" opacity="0.5"/>
      </svg>`
    },
    {
      id: 'btn-whatsapp',
      label: 'التواصل عبر واتساب',
      description: 'اطلب مباشرة أو استفسر عن أي منتج',
      url: 'https://wa.me/201033035681',
      icon: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <path d="M12 2C6.477 2 2 6.477 2 12c0 1.89.527 3.66 1.44 5.17L2 22l4.93-1.41A9.955 9.955 0 0012 22c5.523 0 10-4.477 10-10S17.523 2 12 2z" stroke="#D4AF37" stroke-width="1.5"/>
        <path d="M8.5 9.5c.2.9.7 1.8 1.5 2.6.8.8 1.7 1.3 2.6 1.5.3.07.6-.05.8-.3l.4-.5c.2-.25.5-.3.75-.15l2 1.15c.3.17.37.55.17.83-.5.7-1.4 1.32-2.42 1.12C11.07 15.2 8.8 12.93 8.38 10.6c-.2-1.02.42-1.92 1.12-2.42.28-.2.66-.13.83.17L11.48 10c.15.25.1.55-.15.75l-.5.4c-.25.2-.37.5-.3.8z" fill="#D4AF37" opacity="0.7"/>
      </svg>`
    },
    {
      id: 'btn-facebook',
      label: 'صفحتنا على فيسبوك',
      description: 'تابع أحدث المنتجات والعروض',
      url: 'https://www.facebook.com/share/18yL6Nezks/',
      icon: `<svg width="36" height="36" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
        <rect x="2" y="2" width="20" height="20" rx="5" stroke="#D4AF37" stroke-width="1.5"/>
        <path d="M13 21v-8h2.5l.5-3H13V8.5c0-.83.67-1.5 1.5-1.5H16V4.5S15 4 13.5 4C11.57 4 10 5.57 10 7.5V10H8v3h2v8h3z" fill="#D4AF37" opacity="0.8"/>
      </svg>`
    }
  ]
};
