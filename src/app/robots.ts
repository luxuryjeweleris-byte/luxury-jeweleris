import { MetadataRoute } from 'next';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.luxuryjeweleris.com';

const PROTECTED_ROUTES = [
  '/admin',
  '/admin/*',
  '/account',
  '/account/*',
  '/cart',
  '/wishlist',
  '/api/*',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      // 1. General Search Crawlers
      {
        userAgent: '*',
        allow: '/',
        disallow: PROTECTED_ROUTES,
      },
      // 2. OpenAI / ChatGPT & SearchGPT
      {
        userAgent: 'GPTBot',
        allow: '/',
        disallow: PROTECTED_ROUTES,
      },
      {
        userAgent: 'ChatGPT-User',
        allow: '/',
        disallow: PROTECTED_ROUTES,
      },
      {
        userAgent: 'OAI-SearchBot',
        allow: '/',
        disallow: PROTECTED_ROUTES,
      },
      // 3. Perplexity AI Search Engine
      {
        userAgent: 'PerplexityBot',
        allow: '/',
        disallow: PROTECTED_ROUTES,
      },
      // 4. Anthropic Claude AI
      {
        userAgent: 'ClaudeBot',
        allow: '/',
        disallow: PROTECTED_ROUTES,
      },
      {
        userAgent: 'anthropic-ai',
        allow: '/',
        disallow: PROTECTED_ROUTES,
      },
      // 5. Google Gemini & AI Overviews
      {
        userAgent: 'Googlebot',
        allow: '/',
        disallow: PROTECTED_ROUTES,
      },
      {
        userAgent: 'Google-Extended',
        allow: '/',
        disallow: PROTECTED_ROUTES,
      },
      // 6. Apple Intelligence & Siri Spotlight
      {
        userAgent: 'Applebot',
        allow: '/',
        disallow: PROTECTED_ROUTES,
      },
      {
        userAgent: 'Applebot-Extended',
        allow: '/',
        disallow: PROTECTED_ROUTES,
      },
      // 7. Microsoft Copilot & Bing Search
      {
        userAgent: 'Bingbot',
        allow: '/',
        disallow: PROTECTED_ROUTES,
      },
      // 8. Meta AI
      {
        userAgent: 'Meta-ExternalAgent',
        allow: '/',
        disallow: PROTECTED_ROUTES,
      },
      // 9. Cohere AI
      {
        userAgent: 'cohere-ai',
        allow: '/',
        disallow: PROTECTED_ROUTES,
      },
    ],
    sitemap: `${BASE_URL}/sitemap.xml`,
    host: BASE_URL,
  };
}
