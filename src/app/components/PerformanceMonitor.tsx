'use client';
import { useEffect } from 'react';

export const PerformanceMonitor = () => {
  useEffect(() => {
    // Only run in development mode
    if (process.env.NODE_ENV !== 'development') return;

    // Monitor LCP
    const observer = new PerformanceObserver((list) => {
      const entries = list.getEntries();
      entries.forEach((entry) => {
        if (entry.entryType === 'largest-contentful-paint') {
          console.log('🎯 LCP:', entry.startTime.toFixed(2) + 'ms');
          
          // LCP scoring thresholds
          if (entry.startTime <= 2500) {
            console.log('✅ LCP: Good (≤2.5s)');
          } else if (entry.startTime <= 4000) {
            console.log('⚠️ LCP: Needs Improvement (2.5s-4s)');
          } else {
            console.log('❌ LCP: Poor (>4s)');
          }
        }
      });
    });

    // Start observing
    try {
      observer.observe({ entryTypes: ['largest-contentful-paint'] });
    } catch (e) {
      console.log('Performance Observer not supported');
    }

    // Cleanup
    return () => {
      observer.disconnect();
    };
  }, []);

  return null; // This component doesn't render anything
};
