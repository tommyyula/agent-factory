import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowLeft, Star, Download, Calendar, Clock, Users, DollarSign, Shield, Zap } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { AgentDefinition, AgentReview } from '@/shared/types/agent.types';

interface AgentDetailProps {
  agent: AgentDefinition;
  onBack: () => void;
}

// Mock version history data
const mockVersionHistory = [
  {
    version: '2.1.0',
    date: '2026-03-10',
    changelog: 'Added advanced analytics capabilities and improved performance optimization algorithms'
  },
  {
    version: '2.0.5',
    date: '2026-02-28',
    changelog: 'Bug fixes in data processing pipeline and enhanced error handling'
  },
  {
    version: '2.0.0',
    date: '2026-02-15',
    changelog: 'Major update with new machine learning models and redesigned user interface'
  }
];

// Mock additional reviews if the agent doesn't have enough
const mockReviews: AgentReview[] = [
  {
    id: 'rev-001',
    userId: 'user-001',
    userName: 'Sarah Chen',
    rating: 5,
    comment: 'Excellent performance and very intuitive to use. Dramatically improved our data processing workflow.',
    createdAt: new Date('2026-03-12')
  },
  {
    id: 'rev-002',
    userId: 'user-002',
    userName: 'Michael Rodriguez',
    rating: 4,
    comment: 'Great agent overall. Setup was straightforward and the documentation is comprehensive.',
    createdAt: new Date('2026-03-08')
  },
  {
    id: 'rev-003',
    userId: 'user-003',
    userName: 'Emma Thompson',
    rating: 5,
    comment: 'Outstanding automation capabilities. Saved us hours of manual work every day.',
    createdAt: new Date('2026-03-05')
  },
  {
    id: 'rev-004',
    userId: 'user-004',
    userName: 'David Kim',
    rating: 4,
    comment: 'Solid agent with good performance. Would like to see more customization options.',
    createdAt: new Date('2026-03-01')
  }
];

export function AgentDetail({ agent, onBack }: AgentDetailProps) {
  const { t } = useTranslation();

  const formatPrice = () => {
    if (agent.pricing.price === 0) {
      return t('marketplace.agent.free');
    }

    switch (agent.pricing.model) {
      case 'subscription':
        return `$${agent.pricing.price}${t('marketplace.agent.perMonth')}`;
      case 'usage':
      case 'pay-per-use':
        return `$${agent.pricing.price}${t('marketplace.agent.perUse')}`;
      default:
        return `$${agent.pricing.price}`;
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`h-4 w-4 ${
          i < rating ? 'fill-current text-yellow-500' : 'text-gray-300'
        }`}
      />
    ));
  };

  const getSkillTypeColor = (type: string) => {
    const colorMap = {
      'api': 'bg-blue-100 text-blue-800',
      'function': 'bg-green-100 text-green-800',
      'workflow': 'bg-purple-100 text-purple-800',
      'knowledge': 'bg-orange-100 text-orange-800',
      'nlp': 'bg-pink-100 text-pink-800',
      'optimization': 'bg-red-100 text-red-800',
      'analytics': 'bg-indigo-100 text-indigo-800',
      'learning': 'bg-yellow-100 text-yellow-800',
      'generation': 'bg-teal-100 text-teal-800',
      'integration': 'bg-gray-100 text-gray-800',
      'geospatial': 'bg-emerald-100 text-emerald-800',
      'memory': 'bg-violet-100 text-violet-800'
    };
    return colorMap[type as keyof typeof colorMap] || 'bg-gray-100 text-gray-800';
  };

  // Combine agent reviews with mock reviews for demonstration
  const allReviews = [...(agent.metadata.reviews || []), ...mockReviews].slice(0, 5);

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
        <ArrowLeft className="h-4 w-4" />
        <span>{t('marketplace.detail.backToCatalog')}</span>
      </Button>

      {/* Agent Header */}
      <Card>
        <CardContent className="p-6">
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div>
                <h1 className="text-3xl font-bold">{agent.displayName}</h1>
                <p className="text-muted-foreground">v{agent.version}</p>
              </div>

              <div className="flex items-center space-x-4">
                <Badge variant="success">{t('marketplace.detail.status.published')}</Badge>
                <div className="flex items-center space-x-1">
                  {renderStars(Math.floor(agent.metadata.rating))}
                  <span className="ml-2 text-sm font-medium">{agent.metadata.rating.toFixed(1)}</span>
                </div>
                <div className="flex items-center space-x-1 text-muted-foreground">
                  <Download className="h-4 w-4" />
                  <span className="text-sm">{agent.metadata.downloads.toLocaleString()} {t('marketplace.agent.downloads')}</span>
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-3xl font-bold">{formatPrice()}</div>
              <Button className="mt-4" size="lg">
                <DollarSign className="mr-2 h-4 w-4" />
                {t('marketplace.detail.deploy')}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          {/* Description */}
          <Card>
            <CardHeader>
              <CardTitle>{t('marketplace.detail.description')}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground leading-relaxed">
                {agent.description}
              </p>
            </CardContent>
          </Card>

          {/* Capabilities */}
          <Card>
            <CardHeader>
              <CardTitle>{t('marketplace.detail.capabilities')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {agent.capabilities.map((capability, index) => (
                  <Badge key={index} variant="secondary">
                    {capability}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Skills Breakdown */}
          <Card>
            <CardHeader>
              <CardTitle>{t('marketplace.detail.skills')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {agent.skills.slice(0, 5).map((skill) => (
                  <div key={skill.id} className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">{skill.name}</h4>
                      <Badge className={getSkillTypeColor(skill.type)}>
                        {skill.type}
                      </Badge>
                    </div>
                    {skill.parameters.length > 0 && (
                      <div className="ml-4 space-y-1">
                        <p className="text-sm font-medium text-muted-foreground">
                          {t('marketplace.detail.parameters')}:
                        </p>
                        {skill.parameters.slice(0, 3).map((param) => (
                          <div key={param.name} className="text-sm text-muted-foreground">
                            <span className="font-mono">{param.name}</span> ({param.type})
                            {param.required && <span className="text-red-500 ml-1">*</span>}
                            {param.description && <span className="ml-2">- {param.description}</span>}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Reviews */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>{t('marketplace.detail.reviews')}</span>
                <Badge variant="outline">{allReviews.length} {t('marketplace.detail.reviewsCount')}</Badge>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {allReviews.map((review) => (
                  <div key={review.id} className="space-y-2 border-b border-border pb-4 last:border-b-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <span className="font-semibold">{review.userName}</span>
                        <div className="flex items-center space-x-1">
                          {renderStars(review.rating)}
                        </div>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {new Date(review.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-muted-foreground">{review.comment}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          {/* Pricing Card */}
          <Card>
            <CardHeader>
              <CardTitle>{t('marketplace.detail.pricing')}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold">{formatPrice()}</div>
                <p className="text-sm text-muted-foreground mt-1">
                  {agent.pricing.model === 'subscription'
                    ? t('marketplace.detail.billedMonthly')
                    : agent.pricing.model === 'free'
                    ? t('marketplace.detail.noCommitment')
                    : t('marketplace.detail.payPerUsage')
                  }
                </p>
              </div>

              <Separator />

              <div className="space-y-2">
                <div className="flex items-center text-sm">
                  <Shield className="h-4 w-4 mr-2 text-green-500" />
                  <span>{t('marketplace.detail.features.security')}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Zap className="h-4 w-4 mr-2 text-yellow-500" />
                  <span>{t('marketplace.detail.features.performance')}</span>
                </div>
                <div className="flex items-center text-sm">
                  <Users className="h-4 w-4 mr-2 text-blue-500" />
                  <span>{t('marketplace.detail.features.support')}</span>
                </div>
              </div>

              <Button className="w-full" size="lg">
                {t('marketplace.detail.hire')}
              </Button>
            </CardContent>
          </Card>

          {/* Version History */}
          <Card>
            <CardHeader>
              <CardTitle>{t('marketplace.detail.versionHistory')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockVersionHistory.map((version) => (
                  <div key={version.version} className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold">v{version.version}</span>
                      <span className="text-sm text-muted-foreground">{version.date}</span>
                    </div>
                    <p className="text-sm text-muted-foreground">{version.changelog}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Agent Stats */}
          <Card>
            <CardHeader>
              <CardTitle>{t('marketplace.detail.stats')}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('marketplace.detail.author')}</span>
                  <span className="font-medium">{agent.metadata.author}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('marketplace.detail.category')}</span>
                  <span className="font-medium">{agent.category.function}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('marketplace.detail.created')}</span>
                  <span className="font-medium">{new Date(agent.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{t('marketplace.detail.updated')}</span>
                  <span className="font-medium">{new Date(agent.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}