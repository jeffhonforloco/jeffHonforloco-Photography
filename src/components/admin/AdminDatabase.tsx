import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Database, 
  Download, 
  Upload, 
  RefreshCw,
  HardDrive,
  Activity,
  AlertTriangle,
  CheckCircle,
  Clock,
  Server
} from 'lucide-react';

interface DatabaseStats {
  contacts: number;
  blogPosts: number;
  portfolioImages: number;
  emailTemplates: number;
  emailSequences: number;
  analytics: number;
  totalSize: number;
  lastBackup?: string;
}

interface DatabaseHealth {
  status: 'healthy' | 'warning' | 'error';
  message: string;
  fileSize: number;
  timestamp: string;
}

const AdminDatabase: React.FC = () => {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [health, setHealth] = useState<DatabaseHealth | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [backupProgress, setBackupProgress] = useState(0);
  const [isBackingUp, setIsBackingUp] = useState(false);

  useEffect(() => {
    fetchDatabaseInfo();
  }, []);

  const fetchDatabaseInfo = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const [statsResponse, healthResponse] = await Promise.all([
        fetch('/api/v1/admin/database/stats', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('/api/v1/admin/health', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        if (statsData.success) {
          setStats(statsData.data);
        }
      }

      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        if (healthData.success) {
          setHealth(healthData.health);
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createBackup = async () => {
    try {
      setIsBackingUp(true);
      setBackupProgress(0);
      
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/v1/admin/database/backup', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Backup failed');
      }

      // Simulate progress
      const interval = setInterval(() => {
        setBackupProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsBackingUp(false);
            fetchDatabaseInfo(); // Refresh stats
            return 100;
          }
          return prev + 10;
        });
      }, 200);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Backup failed');
      setIsBackingUp(false);
    }
  };

  const exportDatabase = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch('/api/v1/admin/export/database?format=sql', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });

      if (!response.ok) {
        throw new Error('Export failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'database_export.sql';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    }
  };

  const getHealthStatus = () => {
    if (!health) return { status: 'unknown', color: 'text-gray-500', icon: Clock };
    
    switch (health.status) {
      case 'healthy':
        return { status: 'Healthy', color: 'text-green-500', icon: CheckCircle };
      case 'warning':
        return { status: 'Warning', color: 'text-yellow-500', icon: AlertTriangle };
      case 'error':
        return { status: 'Error', color: 'text-red-500', icon: AlertTriangle };
      default:
        return { status: 'Unknown', color: 'text-gray-500', icon: Clock };
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading database information...</span>
      </div>
    );
  }

  const healthStatus = getHealthStatus();
  const HealthIcon = healthStatus.icon;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Database Management</h1>
          <p className="text-muted-foreground">Monitor and manage your database</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchDatabaseInfo} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={createBackup} disabled={isBackingUp}>
            <Download className="h-4 w-4 mr-2" />
            {isBackingUp ? 'Backing up...' : 'Create Backup'}
          </Button>
        </div>
      </div>

      {/* Database Health */}
      <Card>
        <CardHeader>
          <CardTitle>Database Health</CardTitle>
          <CardDescription>
            Current database status and performance
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <HealthIcon className={`h-6 w-6 ${healthStatus.color}`} />
              <div>
                <p className="font-medium">Status: {healthStatus.status}</p>
                <p className="text-sm text-gray-500">
                  {health?.message || 'Database is running normally'}
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-500">File Size</p>
              <p className="font-medium">{formatFileSize(health?.fileSize || 0)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Database Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Contacts</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.contacts || 0}</div>
            <p className="text-xs text-muted-foreground">
              Contact records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.blogPosts || 0}</div>
            <p className="text-xs text-muted-foreground">
              Blog post records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Images</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.portfolioImages || 0}</div>
            <p className="text-xs text-muted-foreground">
              Portfolio records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Templates</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.emailTemplates || 0}</div>
            <p className="text-xs text-muted-foreground">
              Email template records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Email Sequences</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.emailSequences || 0}</div>
            <p className="text-xs text-muted-foreground">
              Email sequence records
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Analytics</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.analytics || 0}</div>
            <p className="text-xs text-muted-foreground">
              Analytics records
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Backup Progress */}
      {isBackingUp && (
        <Card>
          <CardHeader>
            <CardTitle>Creating Backup</CardTitle>
            <CardDescription>
              Please wait while we create a database backup
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Progress value={backupProgress} className="w-full" />
              <p className="text-sm text-center">{backupProgress}% complete</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Database Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Backup & Restore</CardTitle>
            <CardDescription>
              Manage database backups and restores
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Last Backup</p>
                <p className="text-sm text-gray-500">
                  {stats?.lastBackup ? new Date(stats.lastBackup).toLocaleString() : 'No backups yet'}
                </p>
              </div>
              <Button onClick={createBackup} disabled={isBackingUp}>
                <Download className="h-4 w-4 mr-2" />
                Create Backup
              </Button>
            </div>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium">Export Database</p>
                <p className="text-sm text-gray-500">Download SQL dump</p>
              </div>
              <Button onClick={exportDatabase} variant="outline">
                <Upload className="h-4 w-4 mr-2" />
                Export
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Database Information</CardTitle>
            <CardDescription>
              Database configuration and details
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Server className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Database Type</span>
              </div>
              <Badge variant="outline">SQLite</Badge>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <HardDrive className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Total Size</span>
              </div>
              <span className="text-sm">{formatFileSize(stats?.totalSize || 0)}</span>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Activity className="h-4 w-4 text-gray-400" />
                <span className="text-sm font-medium">Last Updated</span>
              </div>
              <span className="text-sm">
                {health?.timestamp ? new Date(health.timestamp).toLocaleString() : 'Unknown'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminDatabase;
