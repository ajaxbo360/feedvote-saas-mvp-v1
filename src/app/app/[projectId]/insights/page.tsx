'use client';

import { createClient } from '@/utils/supabase/client';
import { useEffect, useState } from 'react';
import { redirect } from 'next/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import {
  Brain,
  TrendingUp,
  TrendingDown,
  AlertTriangle,
  CheckCircle,
  Users,
  MessageSquare,
  Star,
  Target,
  BarChart3,
  ArrowUp,
  ArrowDown,
  Clock,
  Heart,
  Zap,
  Eye,
  ThumbsUp,
  ThumbsDown,
  Calendar,
  Lightbulb,
} from 'lucide-react';

interface PageProps {
  params: {
    projectId: string;
  };
}

// AI Insights interface
interface AIInsight {
  id: string;
  type: 'opportunity' | 'warning' | 'success' | 'trend';
  title: string;
  description: string;
  impact: 'high' | 'medium' | 'low';
  confidence: number;
  actionItems: string[];
}

// Customer Health interface
interface CustomerHealth {
  id: string;
  email: string;
  company?: string;
  healthScore: number;
  status: 'healthy' | 'at_risk' | 'unhappy' | 'champion';
  lastActivity: string;
  feedbackCount: number;
  sentimentTrend: 'positive' | 'neutral' | 'negative';
  riskFactors: string[];
  positiveSignals: string[];
}

// Predictive Analytics interface
interface PredictiveAnalytic {
  id: string;
  title: string;
  prediction: string;
  confidence: number;
  timeframe: string;
  category: 'engagement' | 'churn' | 'feature_demand' | 'growth';
  trend: 'up' | 'down' | 'stable';
}

export default function InsightsPage({ params }: PageProps) {
  const { projectId } = params;
  const slug = projectId; // The URL param is actually the slug
  const [user, setUser] = useState<any>(null);
  const [project, setProject] = useState<any>(null);
  const supabase = createClient();

  // Sample AI insights data
  const [aiInsights] = useState<AIInsight[]>([
    {
      id: '1',
      type: 'opportunity',
      title: 'Mobile App Requests Trending Up',
      description: 'Mobile app feature requests have increased 40% this week, indicating strong user demand.',
      impact: 'high',
      confidence: 87,
      actionItems: [
        'Prioritize mobile development in next sprint',
        'Survey users for specific mobile features',
        'Consider mobile-first design approach',
      ],
    },
    {
      id: '2',
      type: 'success',
      title: 'Performance Issues Resolved',
      description: 'User complaints about slow loading times have decreased 60% after recent optimizations.',
      impact: 'high',
      confidence: 92,
      actionItems: [
        'Document successful optimization techniques',
        'Share performance wins with marketing team',
        'Continue monitoring performance metrics',
      ],
    },
    {
      id: '3',
      type: 'warning',
      title: 'Enterprise Customer Response Delays',
      description: 'Average response time to enterprise customers has increased to 2.3 days, exceeding SLA.',
      impact: 'high',
      confidence: 95,
      actionItems: [
        'Review customer support workflow',
        'Prioritize enterprise customer tickets',
        'Set up automated response acknowledgments',
      ],
    },
    {
      id: '4',
      type: 'trend',
      title: 'API Integration Requests Growing',
      description: 'API and integration requests are becoming more frequent, suggesting expansion opportunities.',
      impact: 'medium',
      confidence: 73,
      actionItems: ['Expand API documentation', 'Create integration tutorials', 'Consider API-first roadmap items'],
    },
  ]);

  // Sample customer health data
  const [customerHealth] = useState<CustomerHealth[]>([
    {
      id: '1',
      email: 'sarah@techcorp.com',
      company: 'TechCorp Inc.',
      healthScore: 85,
      status: 'healthy',
      lastActivity: '2 hours ago',
      feedbackCount: 8,
      sentimentTrend: 'positive',
      riskFactors: [],
      positiveSignals: ['Active feedback participation', 'Quick response times', 'Feature adoption'],
    },
    {
      id: '2',
      email: 'john@startup.com',
      company: 'StartupCo',
      healthScore: 25,
      status: 'unhappy',
      lastActivity: '14 days ago',
      feedbackCount: 3,
      sentimentTrend: 'negative',
      riskFactors: ['No activity for 2 weeks', 'Critical issues unresolved', 'Negative sentiment'],
      positiveSignals: [],
    },
    {
      id: '3',
      email: 'lisa@enterprise.com',
      company: 'Enterprise Solutions',
      healthScore: 72,
      status: 'at_risk',
      lastActivity: '1 day ago',
      feedbackCount: 12,
      sentimentTrend: 'neutral',
      riskFactors: ['Response time SLA missed', 'Feature requests ignored'],
      positiveSignals: ['High engagement', 'Constructive feedback'],
    },
    {
      id: '4',
      email: 'mike@growth.com',
      company: 'GrowthTech',
      healthScore: 92,
      status: 'champion',
      lastActivity: '30 minutes ago',
      feedbackCount: 15,
      sentimentTrend: 'positive',
      riskFactors: [],
      positiveSignals: ['Frequent positive feedback', 'Feature advocate', 'High engagement'],
    },
  ]);

  // Sample predictive analytics
  const [predictions] = useState<PredictiveAnalytic[]>([
    {
      id: '1',
      title: 'User Engagement',
      prediction: 'Expected to increase 25% next month',
      confidence: 78,
      timeframe: 'Next 30 days',
      category: 'engagement',
      trend: 'up',
    },
    {
      id: '2',
      title: 'Feature Request Volume',
      prediction: 'Mobile requests likely to increase 50%',
      confidence: 85,
      timeframe: 'Next quarter',
      category: 'feature_demand',
      trend: 'up',
    },
    {
      id: '3',
      title: 'Customer Churn Risk',
      prediction: '3 customers at high churn risk',
      confidence: 70,
      timeframe: 'Next 2 weeks',
      category: 'churn',
      trend: 'stable',
    },
    {
      id: '4',
      title: 'User Growth',
      prediction: 'Organic growth expected to slow',
      confidence: 65,
      timeframe: 'Next 6 months',
      category: 'growth',
      trend: 'down',
    },
  ]);

  useEffect(() => {
    async function getUser() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        redirect('/login');
      }
      setUser(user);
    }

    async function getProject() {
      const { data: project, error } = await supabase.from('projects').select('*').eq('slug', slug).single();

      if (error || !project) {
        console.error('Project not found:', error?.message || 'No project with this slug');
        redirect('/app');
      }
      setProject(project);
    }

    getUser();
    getProject();
  }, [slug]);

  const getInsightIcon = (type: string) => {
    switch (type) {
      case 'opportunity':
        return <Lightbulb className="h-5 w-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-600" />;
      case 'trend':
        return <TrendingUp className="h-5 w-5 text-blue-600" />;
      default:
        return <Brain className="h-5 w-5 text-gray-600" />;
    }
  };

  const getInsightColor = (type: string) => {
    switch (type) {
      case 'opportunity':
        return 'border-green-200 bg-green-50 dark:bg-green-950/30';
      case 'warning':
        return 'border-red-200 bg-red-50 dark:bg-red-950/30';
      case 'success':
        return 'border-green-200 bg-green-50 dark:bg-green-950/30';
      case 'trend':
        return 'border-blue-200 bg-blue-50 dark:bg-blue-950/30';
      default:
        return 'border-gray-200 bg-gray-50 dark:bg-gray-950/30';
    }
  };

  const getHealthScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    if (score >= 40) return 'text-orange-600 dark:text-orange-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getHealthStatusColor = (status: string) => {
    switch (status) {
      case 'healthy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'champion':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200';
      case 'at_risk':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'unhappy':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'up':
        return <ArrowUp className="h-4 w-4 text-green-600" />;
      case 'down':
        return <ArrowDown className="h-4 w-4 text-red-600" />;
      default:
        return <div className="h-4 w-4 bg-gray-400 rounded-full" />;
    }
  };

  if (!user || !project) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-green-500"></div>
      </div>
    );
  }

  return (
    <main className="flex flex-1 flex-col h-[calc(100vh-4rem)] overflow-auto">
      <div className="flex flex-col flex-1">
        <div className="w-full sticky top-0 bg-white dark:bg-gray-900 z-10 border-b">
          <div className="flex justify-between items-center px-8 py-4">
            <div>
              <h1 className="text-2xl font-semibold flex items-center gap-2">
                <Brain className="h-6 w-6 text-green-600" />
                Smart Insights
              </h1>
              <p className="text-sm text-muted-foreground mt-1">
                AI-powered analytics • Customer health • Predictive insights
              </p>
            </div>

            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Last 30 days
              </Button>
              <Button size="sm">
                <Eye className="h-4 w-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 p-8 space-y-8">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Active Users</p>
                    <p className="text-2xl font-bold">247</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <ArrowUp className="h-3 w-3" />
                      +12% from last week
                    </p>
                  </div>
                  <Users className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Feedback Sentiment</p>
                    <p className="text-2xl font-bold">85%</p>
                    <p className="text-xs text-green-600 flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" />
                      Positive sentiment
                    </p>
                  </div>
                  <Heart className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Response Time</p>
                    <p className="text-2xl font-bold">1.2d</p>
                    <p className="text-xs text-red-600 flex items-center gap-1">
                      <ArrowUp className="h-3 w-3" />
                      Above 1d target
                    </p>
                  </div>
                  <Clock className="h-8 w-8 text-red-600" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground">Feature Requests</p>
                    <p className="text-2xl font-bold">32</p>
                    <p className="text-xs text-blue-600 flex items-center gap-1">
                      <ArrowUp className="h-3 w-3" />
                      This week
                    </p>
                  </div>
                  <Zap className="h-8 w-8 text-blue-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* AI Insights */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Brain className="h-5 w-5 text-green-600" />
                  AI-Powered Insights
                </CardTitle>
                <CardDescription>Smart recommendations based on user behavior and feedback patterns</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {aiInsights.map((insight) => (
                    <div key={insight.id} className={`p-4 rounded-lg border ${getInsightColor(insight.type)}`}>
                      <div className="flex items-start gap-3">
                        {getInsightIcon(insight.type)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <h4 className="font-semibold">{insight.title}</h4>
                            <Badge variant="outline" className="text-xs">
                              {insight.confidence}% confidence
                            </Badge>
                            <Badge
                              variant="outline"
                              className={
                                insight.impact === 'high'
                                  ? 'border-red-200 text-red-700'
                                  : insight.impact === 'medium'
                                    ? 'border-yellow-200 text-yellow-700'
                                    : 'border-gray-200 text-gray-700'
                              }
                            >
                              {insight.impact} impact
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{insight.description}</p>
                          <div className="space-y-1">
                            <h5 className="text-sm font-medium">Recommended Actions:</h5>
                            {insight.actionItems.map((action, index) => (
                              <div key={index} className="flex items-center gap-2 text-sm">
                                <Target className="h-3 w-3 text-green-600" />
                                <span>{action}</span>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Customer Health Dashboard */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Heart className="h-5 w-5 text-red-600" />
                  Customer Health Dashboard
                </CardTitle>
                <CardDescription>Monitor customer satisfaction and identify at-risk relationships</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {customerHealth.map((customer) => (
                    <div key={customer.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                            <Users className="h-5 w-5" />
                          </div>
                          <div>
                            <h4 className="font-semibold">{customer.email}</h4>
                            {customer.company && <p className="text-sm text-muted-foreground">{customer.company}</p>}
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="text-right">
                            <p className={`text-lg font-bold ${getHealthScoreColor(customer.healthScore)}`}>
                              {customer.healthScore}/100
                            </p>
                            <p className="text-xs text-muted-foreground">Health Score</p>
                          </div>
                          <Badge className={getHealthStatusColor(customer.status)}>
                            {customer.status.replace('_', ' ')}
                          </Badge>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                        <div className="flex items-center gap-2 text-sm">
                          <Clock className="h-4 w-4 text-gray-500" />
                          <span>Last active: {customer.lastActivity}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          <MessageSquare className="h-4 w-4 text-gray-500" />
                          <span>{customer.feedbackCount} feedback items</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm">
                          {customer.sentimentTrend === 'positive' ? (
                            <ThumbsUp className="h-4 w-4 text-green-500" />
                          ) : customer.sentimentTrend === 'negative' ? (
                            <ThumbsDown className="h-4 w-4 text-red-500" />
                          ) : (
                            <div className="h-4 w-4 bg-gray-400 rounded-full" />
                          )}
                          <span>{customer.sentimentTrend} sentiment</span>
                        </div>
                      </div>

                      <Progress value={customer.healthScore} className="mb-3" />

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {customer.riskFactors.length > 0 && (
                          <div>
                            <h5 className="text-sm font-semibold text-red-600 mb-2 flex items-center gap-1">
                              <AlertTriangle className="h-4 w-4" />
                              Risk Factors
                            </h5>
                            <ul className="space-y-1">
                              {customer.riskFactors.map((risk, index) => (
                                <li key={index} className="text-sm text-red-700 dark:text-red-400">
                                  • {risk}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                        {customer.positiveSignals.length > 0 && (
                          <div>
                            <h5 className="text-sm font-semibold text-green-600 mb-2 flex items-center gap-1">
                              <CheckCircle className="h-4 w-4" />
                              Positive Signals
                            </h5>
                            <ul className="space-y-1">
                              {customer.positiveSignals.map((signal, index) => (
                                <li key={index} className="text-sm text-green-700 dark:text-green-400">
                                  • {signal}
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {customer.status === 'unhappy' || customer.status === 'at_risk' ? (
                        <div className="mt-3 pt-3 border-t">
                          <Button size="sm" className="bg-red-600 hover:bg-red-700">
                            <AlertTriangle className="h-4 w-4 mr-2" />
                            Take Action
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Predictive Analytics */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-5 w-5 text-blue-600" />
                  Predictive Analytics
                </CardTitle>
                <CardDescription>Data-driven predictions about user behavior and business metrics</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {predictions.map((prediction) => (
                    <div key={prediction.id} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold">{prediction.title}</h4>
                        <div className="flex items-center gap-1">{getTrendIcon(prediction.trend)}</div>
                      </div>
                      <p className="text-sm text-muted-foreground mb-3">{prediction.prediction}</p>
                      <div className="flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">{prediction.timeframe}</span>
                        <Badge variant="outline">{prediction.confidence}% confidence</Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sentiment Analysis */}
          <div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Star className="h-5 w-5 text-yellow-600" />
                  Sentiment Analysis
                </CardTitle>
                <CardDescription>Understanding customer emotions and satisfaction trends</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {/* Overall Sentiment */}
                  <div className="text-center">
                    <div className="mb-4">
                      <div className="text-3xl font-bold text-green-600">85%</div>
                      <div className="text-sm text-muted-foreground">Positive Sentiment</div>
                    </div>
                    <Progress value={85} className="mb-2" />
                    <div className="text-xs text-muted-foreground">This Month</div>
                  </div>

                  {/* Sentiment Breakdown */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ThumbsUp className="h-4 w-4 text-green-600" />
                        <span className="text-sm">Positive (85%)</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Feature requests, praise</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="h-4 w-4 bg-gray-400 rounded-full" />
                        <span className="text-sm">Neutral (10%)</span>
                      </div>
                      <span className="text-sm text-muted-foreground">General questions</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <ThumbsDown className="h-4 w-4 text-red-600" />
                        <span className="text-sm">Negative (5%)</span>
                      </div>
                      <span className="text-sm text-muted-foreground">Bug reports, frustrations</span>
                    </div>
                  </div>

                  {/* Action Items */}
                  <div className="space-y-3">
                    <h5 className="font-semibold text-sm">Action Items:</h5>
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Target className="h-3 w-3 text-red-600" />
                        <span>Address 2 critical bug reports</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-3 w-3 text-yellow-600" />
                        <span>Follow up with frustrated users</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Target className="h-3 w-3 text-green-600" />
                        <span>Share positive feedback with team</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </main>
  );
}
