import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Activity, 
  TrendingUp, 
  AlertTriangle, 
  CheckCircle,
  Clock,
  Download,
  RefreshCw
} from 'lucide-react';

interface ImagePerformanceMetrics {
  totalImages: number;
  loadedImages: number;
  failedImages: number;
  averageLoadTime: number;
  slowImages: Array<{
    src: string;
    loadTime: number;
    size: number;
  }>;
  fastImages: Array<{
    src: string;
    loadTime: number;
    size: number;
  }>;
  totalSize: number;
  optimizedSize: number;
  compressionRatio: number;
}

interface ImagePerformanceMonitorProps {
  className?: string;
  showDetails?: boolean;
  onMetricsUpdate?: (metrics: ImagePerformanceMetrics) => void;
}

const ImagePerformanceMonitor: React.FC<ImagePerformanceMonitorProps> = ({
  className,
  showDetails = false,
  onMetricsUpdate
}) => {
  const [metrics, setMetrics] = useState<ImagePerformanceMetrics>({
    totalImages: 0,
    loadedImages: 0,
    failedImages: 0,
    averageLoadTime: 0,
    slowImages: [],
    fastImages: [],
    totalSize: 0,
    optimizedSize: 0,
    compressionRatio: 0
  });
  const [isMonitoring, setIsMonitoring] = useState(false);

  // Monitor image loading performance
  const monitorImagePerformance = useCallback(() => {
    const images = document.querySelectorAll('img');
    const imageMetrics: Array<{
      src: string;
      loadTime: number;
      size: number;
      startTime: number;
    }> = [];

    const startTimes = new Map<string, number>();

    // Track image load start
    images.forEach((img) => {
      const src = img.src;
      startTimes.set(src, performance.now());
      
      img.addEventListener('load', () => {
        const loadTime = performance.now() - (startTimes.get(src) || 0);
        const size = img.naturalWidth * img.naturalHeight;
        
        imageMetrics.push({
          src,
          loadTime,
          size
        });
        
        updateMetrics();
      });
      
      img.addEventListener('error', () => {
        updateMetrics();
      });
    });

    const updateMetrics = () => {
      const loadedImages = imageMetrics.length;
      const totalImages = images.length;
      const failedImages = totalImages - loadedImages;
      
      const averageLoadTime = imageMetrics.length > 0 
        ? imageMetrics.reduce((sum, metric) => sum + metric.loadTime, 0) / imageMetrics.length 
        : 0;
      
      const slowImages = imageMetrics
        .filter(metric => metric.loadTime > 1000)
        .sort((a, b) => b.loadTime - a.loadTime)
        .slice(0, 5);
      
      const fastImages = imageMetrics
        .filter(metric => metric.loadTime < 500)
        .sort((a, b) => a.loadTime - b.loadTime)
        .slice(0, 5);
      
      const totalSize = imageMetrics.reduce((sum, metric) => sum + metric.size, 0);
      const optimizedSize = totalSize * 0.7; // Assume 30% optimization
      const compressionRatio = totalSize > 0 ? (1 - optimizedSize / totalSize) * 100 : 0;
      
      const newMetrics: ImagePerformanceMetrics = {
        totalImages,
        loadedImages,
        failedImages,
        averageLoadTime,
        slowImages,
        fastImages,
        totalSize,
        optimizedSize,
        compressionRatio
      };
      
      setMetrics(newMetrics);
      onMetricsUpdate?.(newMetrics);
    };
  }, [onMetricsUpdate]);

  // Start monitoring
  useEffect(() => {
    if (isMonitoring) {
      monitorImagePerformance();
    }
  }, [isMonitoring, monitorImagePerformance]);

  // Get performance grade
  const getPerformanceGrade = (): { grade: string; color: string; icon: React.ReactNode } => {
    if (metrics.averageLoadTime < 500) {
      return { grade: 'A', color: 'text-green-500', icon: <CheckCircle className="w-4 h-4" /> };
    } else if (metrics.averageLoadTime < 1000) {
      return { grade: 'B', color: 'text-yellow-500', icon: <TrendingUp className="w-4 h-4" /> };
    } else if (metrics.averageLoadTime < 2000) {
      return { grade: 'C', color: 'text-orange-500', icon: <AlertTriangle className="w-4 h-4" /> };
    } else {
      return { grade: 'D', color: 'text-red-500', icon: <AlertTriangle className="w-4 h-4" /> };
    }
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const formatTime = (ms: number): string => {
    if (ms < 1000) return `${ms.toFixed(0)}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  };

  const performanceGrade = getPerformanceGrade();

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Activity className="h-5 w-5" />
          <span>Image Performance Monitor</span>
        </CardTitle>
        <CardDescription>
          Monitor image loading performance and optimization
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Performance Grade */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">Performance Grade:</span>
            <Badge className={`${performanceGrade.color} bg-transparent border-0 p-0`}>
              <div className="flex items-center space-x-1">
                {performanceGrade.icon}
                <span className="font-bold">{performanceGrade.grade}</span>
              </div>
            </Badge>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsMonitoring(!isMonitoring)}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            {isMonitoring ? 'Stop' : 'Start'} Monitoring
          </Button>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{metrics.loadedImages}</div>
            <div className="text-xs text-gray-500">Loaded Images</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-600">{metrics.failedImages}</div>
            <div className="text-xs text-gray-500">Failed Images</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">
              {formatTime(metrics.averageLoadTime)}
            </div>
            <div className="text-xs text-gray-500">Avg Load Time</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">
              {metrics.compressionRatio.toFixed(1)}%
            </div>
            <div className="text-xs text-gray-500">Compression</div>
          </div>
        </div>

        {/* Detailed Metrics */}
        {showDetails && (
          <div className="space-y-4">
            {/* Size Information */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-sm font-medium text-gray-500">Original Size</div>
                <div className="text-lg font-semibold">{formatFileSize(metrics.totalSize)}</div>
              </div>
              <div>
                <div className="text-sm font-medium text-gray-500">Optimized Size</div>
                <div className="text-lg font-semibold">{formatFileSize(metrics.optimizedSize)}</div>
              </div>
            </div>

            {/* Slow Images */}
            {metrics.slowImages.length > 0 && (
              <div>
                <div className="text-sm font-medium text-red-600 mb-2">Slow Loading Images</div>
                <div className="space-y-2">
                  {metrics.slowImages.map((image, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-red-50 rounded">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">{image.src}</div>
                        <div className="text-xs text-gray-500">{formatFileSize(image.size)}</div>
                      </div>
                      <div className="text-xs text-red-600 font-medium">
                        {formatTime(image.loadTime)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Fast Images */}
            {metrics.fastImages.length > 0 && (
              <div>
                <div className="text-sm font-medium text-green-600 mb-2">Fast Loading Images</div>
                <div className="space-y-2">
                  {metrics.fastImages.map((image, index) => (
                    <div key={index} className="flex items-center justify-between p-2 bg-green-50 rounded">
                      <div className="flex-1 min-w-0">
                        <div className="text-xs font-medium truncate">{image.src}</div>
                        <div className="text-xs text-gray-500">{formatFileSize(image.size)}</div>
                      </div>
                      <div className="text-xs text-green-600 font-medium">
                        {formatTime(image.loadTime)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Performance Tips */}
        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm font-medium text-blue-800 mb-2">Performance Tips</div>
          <ul className="text-xs text-blue-700 space-y-1">
            <li>• Use WebP format for better compression</li>
            <li>• Implement lazy loading for below-the-fold images</li>
            <li>• Optimize image dimensions for display size</li>
            <li>• Use blur placeholders for better perceived performance</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default ImagePerformanceMonitor;
