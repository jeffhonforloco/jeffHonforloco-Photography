import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

interface AnalyticsConfig {
  googleAnalytics: {
    trackingId: string;
    enabled: boolean;
  };
  facebookPixel: {
    pixelId: string;
    enabled: boolean;
  };
  events: {
    portfolioView: string;
    contactForm: string;
    blogPost: string;
  };
}

// Enhanced analytics tracking
export const trackEvent = (eventName: string, parameters: Record<string, any> = {}) => {
  // Google Analytics 4
  if (typeof window !== 'undefined' && (window as any).gtag) {
    (window as any).gtag('event', eventName, {
      ...parameters,
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
      page_location: window.location.href,
      page_title: document.title
    });
  }

  // Facebook Pixel
  if (typeof window !== 'undefined' && (window as any).fbq) {
    (window as any).fbq('track', eventName, parameters);
  }

  // Console logging for development
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', eventName, parameters);
  }
};

// Specific tracking functions
export const trackPortfolioView = (category: string) => {
  trackEvent('portfolio_category_view', {
    category,
    content_type: 'portfolio',
    engagement_time_msec: Date.now()
  });
};

export const trackContactForm = (formData: Record<string, any>) => {
  trackEvent('contact_form_submit', {
    form_type: 'contact',
    location: formData.location || 'not_specified',
    service_type: formData.service || 'not_specified',
    budget_range: formData.budget || 'not_specified'
  });
};

export const trackBlogPost = (slug: string, title: string) => {
  trackEvent('blog_post_view', {
    content_type: 'blog_post',
    content_id: slug,
    content_title: title,
    engagement_time_msec: Date.now()
  });
};

export const trackLocationLanding = (location: string) => {
  trackEvent('location_landing_view', {
    location_name: location,
    content_type: 'location_page',
    traffic_source: document.referrer || 'direct'
  });
};

export const trackBookingIntent = (source: string, location?: string) => {
  trackEvent('booking_intent', {
    source,
    location: location || 'not_specified',
    intent_level: 'high',
    timestamp: new Date().toISOString()
  });
};

// Analytics component for route tracking
const Analytics = () => {
  const location = useLocation();

  useEffect(() => {
    // Load analytics configuration
    fetch('/data/analytics-config.json')
      .then(response => response.json())
      .then((config: AnalyticsConfig) => {
        // Initialize Google Analytics
        if (config.googleAnalytics.enabled && config.googleAnalytics.trackingId !== 'GA_MEASUREMENT_ID') {
          const script = document.createElement('script');
          script.async = true;
          script.src = `https://www.googletagmanager.com/gtag/js?id=${config.googleAnalytics.trackingId}`;
          document.head.appendChild(script);

          (window as any).dataLayer = (window as any).dataLayer || [];
          function gtag(...args: any[]) {
            (window as any).dataLayer.push(args);
          }
          (window as any).gtag = gtag;
          
          gtag('js', new Date());
          gtag('config', config.googleAnalytics.trackingId, {
            page_title: document.title,
            page_location: window.location.href,
            anonymize_ip: true,
            send_page_view: true
          });
        }

        // Initialize Facebook Pixel
        if (config.facebookPixel.enabled && config.facebookPixel.pixelId !== 'FB_PIXEL_ID') {
          (function(f: any, b: any, e: any, v: any, n?: any, t?: any, s?: any) {
            if (f.fbq) return;
            n = f.fbq = function() {
              n.callMethod ? n.callMethod.apply(n, arguments) : n.queue.push(arguments);
            };
            if (!f._fbq) f._fbq = n;
            n.push = n;
            n.loaded = !0;
            n.version = '2.0';
            n.queue = [];
            t = b.createElement(e);
            t.async = !0;
            t.src = v;
            s = b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t, s);
          })(window, document, 'script', 'https://connect.facebook.net/en_US/fbevents.js');

          (window as any).fbq('init', config.facebookPixel.pixelId);
          (window as any).fbq('track', 'PageView');
        }
      })
      .catch(error => console.error('Failed to load analytics config:', error));
  }, []);

  // Track route changes
  useEffect(() => {
    const currentPath = location.pathname;
    
    // Track page views
    if (typeof window !== 'undefined' && (window as any).gtag) {
      (window as any).gtag('config', 'GA_MEASUREMENT_ID', {
        page_path: currentPath,
        page_title: document.title,
        page_location: window.location.href
      });
    }

    // Track specific page types
    if (currentPath.startsWith('/portfolio/')) {
      const category = currentPath.split('/')[2];
      trackPortfolioView(category);
    } else if (currentPath.startsWith('/journal/')) {
      const slug = currentPath.split('/')[2];
      trackBlogPost(slug, document.title);
    } else if (currentPath.startsWith('/location/')) {
      const locationName = currentPath.split('/')[2];
      trackLocationLanding(locationName);
    }
  }, [location]);

  return null; // This component doesn't render anything
};

export default Analytics;