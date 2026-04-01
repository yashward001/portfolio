import Script from 'next/script';

export const Analytics = () => {
  const plausibleDomain = process.env.NEXT_PUBLIC_PLAUSIBLE_DOMAIN;
  const umamiWebsiteId = process.env.NEXT_PUBLIC_UMAMI_WEBSITE_ID;

  if (plausibleDomain) {
    return (
      <Script
        defer
        data-domain={plausibleDomain}
        src="https://plausible.io/js/script.js"
        strategy="afterInteractive"
      />
    );
  }

  if (umamiWebsiteId) {
    return (
      <Script
        defer
        data-website-id={umamiWebsiteId}
        src="https://analytics.umami.is/script.js"
        strategy="afterInteractive"
      />
    );
  }

  return null;
};
