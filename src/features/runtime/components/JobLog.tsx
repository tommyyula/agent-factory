import React from 'react';
import { useTranslation } from 'react-i18next';
import { Clock, CheckCircle, AlertTriangle, Loader, Pause } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface JobEntry {
  id: string;
  agent: string;
  taskDescription: string;
  status: 'completed' | 'running' | 'failed' | 'queued';
  duration: string;
  timestamp: string;
}

// Mock data for 15+ job entries
const mockJobs: JobEntry[] = [
  { id: 'JOB-001', agent: 'DataAnalyzer Pro', taskDescription: 'Process quarterly sales data', status: 'completed', duration: '2m 34s', timestamp: '2026-03-14 09:15:42' },
  { id: 'JOB-002', agent: 'TaskScheduler', taskDescription: 'Schedule backup processes', status: 'running', duration: '1m 12s', timestamp: '2026-03-14 09:14:30' },
  { id: 'JOB-003', agent: 'NotificationBot', taskDescription: 'Send daily summary emails', status: 'completed', duration: '45s', timestamp: '2026-03-14 09:13:15' },
  { id: 'JOB-004', agent: 'DataAnalyzer Pro', taskDescription: 'Generate customer insights', status: 'failed', duration: '5m 22s', timestamp: '2026-03-14 09:12:03' },
  { id: 'JOB-005', agent: 'TaskScheduler', taskDescription: 'Clean temporary files', status: 'queued', duration: '--', timestamp: '2026-03-14 09:11:47' },
  { id: 'JOB-006', agent: 'NotificationBot', taskDescription: 'Alert system administrators', status: 'completed', duration: '12s', timestamp: '2026-03-14 09:10:35' },
  { id: 'JOB-007', agent: 'DataAnalyzer Pro', taskDescription: 'Process inventory updates', status: 'running', duration: '3m 45s', timestamp: '2026-03-14 09:09:18' },
  { id: 'JOB-008', agent: 'TaskScheduler', taskDescription: 'Update database indexes', status: 'completed', duration: '8m 15s', timestamp: '2026-03-14 09:08:22' },
  { id: 'JOB-009', agent: 'NotificationBot', taskDescription: 'Process webhook notifications', status: 'failed', duration: '1m 5s', timestamp: '2026-03-14 09:07:55' },
  { id: 'JOB-010', agent: 'DataAnalyzer Pro', taskDescription: 'Generate monthly reports', status: 'queued', duration: '--', timestamp: '2026-03-14 09:07:12' },
  { id: 'JOB-011', agent: 'TaskScheduler', taskDescription: 'Optimize query performance', status: 'completed', duration: '4m 33s', timestamp: '2026-03-14 09:06:48' },
  { id: 'JOB-012', agent: 'NotificationBot', taskDescription: 'Update user preferences', status: 'running', duration: '2m 18s', timestamp: '2026-03-14 09:05:25' },
  { id: 'JOB-013', agent: 'DataAnalyzer Pro', taskDescription: 'Validate data integrity', status: 'completed', duration: '6m 42s', timestamp: '2026-03-14 09:04:13' },
  { id: 'JOB-014', agent: 'TaskScheduler', taskDescription: 'Archive old log files', status: 'failed', duration: '1m 55s', timestamp: '2026-03-14 09:03:37' },
  { id: 'JOB-015', agent: 'NotificationBot', taskDescription: 'Send maintenance alerts', status: 'queued', duration: '--', timestamp: '2026-03-14 09:02:51' },
  { id: 'JOB-016', agent: 'DataAnalyzer Pro', taskDescription: 'Process real-time metrics', status: 'running', duration: '7m 21s', timestamp: '2026-03-14 09:01:29' },
  { id: 'JOB-017', agent: 'TaskScheduler', taskDescription: 'Sync external APIs', status: 'completed', duration: '3m 8s', timestamp: '2026-03-14 09:00:15' },
  { id: 'JOB-018', agent: 'NotificationBot', taskDescription: 'Update system status page', status: 'completed', duration: '28s', timestamp: '2026-03-14 08:59:47' }
];

export function JobLog() {
  const { t } = useTranslation();

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="h-4 w-4 text-green-500" />;
      case 'running': return <Loader className="h-4 w-4 text-blue-500 animate-spin" />;
      case 'failed': return <AlertTriangle className="h-4 w-4 text-red-500" />;
      case 'queued': return <Pause className="h-4 w-4 text-gray-500" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'completed': return 'success';
      case 'running': return 'default';
      case 'failed': return 'destructive';
      case 'queued': return 'secondary';
      default: return 'outline';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return t('runtime.jobs.status.completed');
      case 'running': return t('runtime.jobs.status.running');
      case 'failed': return t('runtime.jobs.status.failed');
      case 'queued': return t('runtime.jobs.status.queued');
      default: return status;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{t('runtime.jobs.title')}</h2>
        <p className="text-muted-foreground">
          {t('runtime.jobs.subtitle')}
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t('runtime.jobs.recentJobs')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left py-3 px-2 font-medium">{t('runtime.jobs.table.jobId')}</th>
                  <th className="text-left py-3 px-2 font-medium">{t('runtime.jobs.table.agent')}</th>
                  <th className="text-left py-3 px-2 font-medium">{t('runtime.jobs.table.description')}</th>
                  <th className="text-left py-3 px-2 font-medium">{t('runtime.jobs.table.status')}</th>
                  <th className="text-left py-3 px-2 font-medium">{t('runtime.jobs.table.duration')}</th>
                  <th className="text-left py-3 px-2 font-medium">{t('runtime.jobs.table.timestamp')}</th>
                </tr>
              </thead>
              <tbody>
                {mockJobs.map((job, index) => (
                  <tr
                    key={job.id}
                    className={`border-b border-border/50 hover:bg-muted/50 ${index % 2 === 0 ? 'bg-background' : 'bg-muted/20'}`}
                  >
                    <td className="py-3 px-2 font-mono text-xs">{job.id}</td>
                    <td className="py-3 px-2 font-medium">{job.agent}</td>
                    <td className="py-3 px-2 max-w-xs">
                      <div className="truncate" title={job.taskDescription}>
                        {job.taskDescription}
                      </div>
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant={getStatusVariant(job.status)} className="flex items-center space-x-1 w-fit">
                        {getStatusIcon(job.status)}
                        <span>{getStatusText(job.status)}</span>
                      </Badge>
                    </td>
                    <td className="py-3 px-2 font-mono text-xs">
                      {job.status === 'queued' ? '--' : job.duration}
                    </td>
                    <td className="py-3 px-2 font-mono text-xs text-muted-foreground">
                      {job.timestamp}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}