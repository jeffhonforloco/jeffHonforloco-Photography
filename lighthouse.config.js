module.exports = {
  ci: {
    collect: {
      url: [
        'http://localhost:4173',
        'http://localhost:4173/portfolios',
        'http://localhost:4173/blog',
        'http://localhost:4173/contact',
        'http://localhost:4173/about'
      ],
      numberOfRuns: 3,
      settings: {
        chromeFlags: '--no-sandbox --disable-setuid-sandbox --disable-dev-shm-usage'
      }
    },
    assert: {
      assertions: {
        'categories:performance': ['error', { minScore: 0.8 }],
        'categories:accessibility': ['error', { minScore: 0.9 }],
        'categories:best-practices': ['error', { minScore: 0.8 }],
        'categories:seo': ['error', { minScore: 0.8 }],
        'categories:pwa': ['error', { minScore: 0.6 }],
        
        // Performance metrics
        'first-contentful-paint': ['error', { maxNumericValue: 2000 }],
        'largest-contentful-paint': ['error', { maxNumericValue: 4000 }],
        'cumulative-layout-shift': ['error', { maxNumericValue: 0.1 }],
        'speed-index': ['error', { maxNumericValue: 3000 }],
        'total-blocking-time': ['error', { maxNumericValue: 300 }],
        
        // Resource budgets
        'resource-summary:script:size': ['error', { maxNumericValue: 1000000 }], // 1MB
        'resource-summary:stylesheet:size': ['error', { maxNumericValue: 500000 }], // 500KB
        'resource-summary:image:size': ['error', { maxNumericValue: 2000000 }], // 2MB
        'resource-summary:font:size': ['error', { maxNumericValue: 300000 }], // 300KB
        
        // Accessibility
        'color-contrast': 'error',
        'image-alt': 'error',
        'label': 'error',
        'link-name': 'error',
        'button-name': 'error',
        
        // SEO
        'meta-description': 'error',
        'document-title': 'error',
        'crawlable-anchors': 'error',
        'is-crawlable': 'error',
        'robots-txt': 'error',
        'sitemap': 'error',
        
        // Best practices
        'uses-https': 'error',
        'no-vulnerable-libraries': 'error',
        'no-unload-listeners': 'error',
        'no-document-write': 'error',
        'no-mixed-content': 'error'
      }
    },
    upload: {
      target: 'temporary-public-storage',
      reportFilename: 'lighthouse-report.html'
    }
  }
};
