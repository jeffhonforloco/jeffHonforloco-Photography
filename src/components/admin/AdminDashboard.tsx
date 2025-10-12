import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Progress } from '@/components/ui/progress';
import { 
  Users, 
  FileText, 
  Image, 
  Mail, 
  TrendingUp, 
  Activity,
  Calendar,
  Eye,
  MessageSquare,
  Download,
  RefreshCw
} from 'lucide-react';

interface DashboardStats {
  contacts: {
    total: number;
    new: number;
    contacted: number;
    qualified: number;
    booked: number;
    completed: number;
  };
  blogPosts: {
    total: number;
    published: number;
    draft: number;
  };
  portfolioImages: {
    total: number;
    featured: number;
  };
  recentActivity: Array<{
    type: string;
    title: string;
    created_at: string;
    status: string;
  }>;
}

interface AnalyticsData {
  pageViews: number;
  contactForms: number;
  newsletterSignups: number;
  portfolioViews: number;
  blogViews: number;
  dailyData: Record<string, Record<string, number>>;
}

const AdminDashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('adminToken');
      
      const [statsResponse, analyticsResponse] = await Promise.all([
        fetch('/api/v1/admin/dashboard', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        }),
        fetch('/api/v1/admin/analytics?period=30d', {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        })
      ]);

      if (!statsResponse.ok || !analyticsResponse.ok) {
        throw new Error('Failed to fetch dashboard data');
      }

      const statsData = await statsResponse.json();
      const analyticsData = await analyticsResponse.json();

      setStats(statsData.data.overview);
      setAnalytics(analyticsData.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const exportData = async (type: string) => {
    try {
      const token = localStorage.getItem('adminToken');
      const response = await fetch(`/api/v1/admin/export/${type}?format=csv`, {
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
      a.download = `${type}_export.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <RefreshCw className="h-8 w-8 animate-spin" />
        <span className="ml-2">Loading dashboard...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 mb-4">Error: {error}</p>
        <Button onClick={fetchDashboardData}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <p className="text-muted-foreground">Overview of your photography platform</p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={fetchDashboardData} variant="outline">
            <RefreshCw className="h-4 w-4 mr-2" />
            Refresh
          </Button>
          <Button onClick={() => exportData('contacts')} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Data
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Contacts</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.contacts.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.contacts.new || 0} new contacts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Blog Posts</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.blogPosts.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.blogPosts.published || 0} published
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Portfolio Images</CardTitle>
            <Image className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats?.portfolioImages.total || 0}</div>
            <p className="text-xs text-muted-foreground">
              {stats?.portfolioImages.featured || 0} featured
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Page Views</CardTitle>
            <Eye className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{analytics?.pageViews || 0}</div>
            <p className="text-xs text-muted-foreground">
              Last 30 days
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
          <TabsTrigger value="contacts">Contacts</TabsTrigger>
          <TabsTrigger value="content">Content</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Contact Status Breakdown */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Status</CardTitle>
                <CardDescription>Breakdown of contact statuses</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.contacts && Object.entries(stats.contacts).map(([status, count]) => (
                    status !== 'total' && (
                      <div key={status} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <Badge variant="outline" className="capitalize">
                            {status}
                          </Badge>
                        </div>
                        <div className="text-sm font-medium">{count}</div>
                      </div>
                    )
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
                <CardDescription>Latest platform activity</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats?.recentActivity?.slice(0, 5).map((activity, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <div className="w-2 h-2 bg-blue-500 rounded-full" />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{activity.title}</p>
                        <p className="text-xs text-muted-foreground">
                          {new Date(activity.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {activity.type}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Page Views</CardTitle>
                <CardDescription>Total page views</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics?.pageViews || 0}</div>
                <TrendingUp className="h-4 w-4 text-green-500 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Contact Forms</CardTitle>
                <CardDescription>Form submissions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics?.contactForms || 0}</div>
                <MessageSquare className="h-4 w-4 text-blue-500 mt-2" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Newsletter Signups</CardTitle>
                <CardDescription>Email subscriptions</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{analytics?.newsletterSignups || 0}</div>
                <Mail className="h-4 w-4 text-purple-500 mt-2" />
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="contacts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Contact Management</CardTitle>
              <CardDescription>Manage your contacts and leads</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                <Button onClick={() => exportData('contacts')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Contacts
                </Button>
                <Button variant="outline" onClick={() => exportData('analytics')}>
                  <Download className="h-4 w-4 mr-2" />
                  Export Analytics
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="content" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Blog Management</CardTitle>
                <CardDescription>Manage your blog posts</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Published</span>
                    <span>{stats?.blogPosts.published || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Drafts</span>
                    <span>{stats?.blogPosts.draft || 0}</span>
                  </div>
                  <Button onClick={() => exportData('blog')} className="w-full mt-4">
                    <Download className="h-4 w-4 mr-2" />
                    Export Blog Posts
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Portfolio Management</CardTitle>
                <CardDescription>Manage your portfolio images</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total Images</span>
                    <span>{stats?.portfolioImages.total || 0}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Featured</span>
                    <span>{stats?.portfolioImages.featured || 0}</span>
                  </div>
                  <Button onClick={() => exportData('portfolio')} className="w-full mt-4">
                    <Download className="h-4 w-4 mr-2" />
                    Export Portfolio
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;