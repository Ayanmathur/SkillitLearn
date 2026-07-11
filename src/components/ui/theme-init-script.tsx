/**
 * Inline script injected into <head> to prevent theme flash.
 *
 * Runs synchronously before React hydration to read the stored
 * theme preference (or system preference) and set the data-theme
 * attribute on <html>. This prevents the brief flash of the wrong
 * theme that occurs when the theme is set after hydration.
 *
 * This is a React Server Component that renders a <script> tag.
 */
export function ThemeInitScript() {
  const script = `
    (function() {
      try {
        var stored = localStorage.getItem('skillitlearn-theme');
        var theme = stored === 'dark' || stored === 'light'
          ? stored
          : (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
        document.documentElement.setAttribute('data-theme', theme);
        if (theme === 'dark') document.documentElement.classList.add('dark');
      } catch (e) {}
    })();
  `;

  return (
    <script
      dangerouslySetInnerHTML={{ __html: script }}
      suppressHydrationWarning
    />
  );
}
