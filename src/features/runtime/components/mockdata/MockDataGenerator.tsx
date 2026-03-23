/**
 * Mock Data Generator Component
 * Main interface for generating mock data with domain and table selection
 */

import React, { useState, useEffect } from 'react';
import { 
  Database, 
  Table, 
  Play, 
  Settings, 
  Download, 
  RefreshCw,
  BarChart3,
  FileText,
  Check,
  Loader2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { AGENCY_DOMAINS } from '@/data/agency-agents-simple';
import { getTablesByDomain, agencySchemas } from '@/data/agency-schemas';
import { useAgentRuntimeStore } from '@/stores/agentRuntimeStore';
import { mockDataGenerator } from '@/shared/services/mockdata-generator.service';
import { TableConfig } from './TableConfig';
import { DataPreview } from './DataPreview';

export function MockDataGenerator() {
  const {
    selectedDomain,
    availableTables,
    currentMockSession,
    mockDataSessions,
    loading,
    setSelectedDomain,
    setAvailableTables,
    createMockSession,
    setCurrentMockSession,
    startDataGeneration,
    exportGeneratedData
  } = useAgentRuntimeStore();

  const [selectedTables, setSelectedTables] = useState<Set<string>>(new Set());
  const [tableConfigs, setTableConfigs] = useState<Map<string, TableGenerationConfig>>(new Map());
  const [globalRowCount, setGlobalRowCount] = useState(100);

  // Interface for table configuration
  interface TableGenerationConfig {
    tableName: string;
    rowCount: number;
    statusDistribution: Record<string, number>;
    enabled: boolean;
  }

  useEffect(() => {
    if (selectedDomain) {
      const tables = getTablesByDomain(selectedDomain);
      setAvailableTables(tables);
      
      // Reset selections
      setSelectedTables(new Set());
      setTableConfigs(new Map());
    }
  }, [selectedDomain, setAvailableTables]);

  const handleDomainChange = (domain: string) => {
    setSelectedDomain(domain);
  };

  const handleTableToggle = (tableName: string) => {
    const newSelected = new Set(selectedTables);
    if (newSelected.has(tableName)) {
      newSelected.delete(tableName);
      const newConfigs = new Map(tableConfigs);
      newConfigs.delete(tableName);
      setTableConfigs(newConfigs);
    } else {
      newSelected.add(tableName);
      // Create default config
      setTableConfigs(prev => new Map(prev).set(tableName, {
        tableName,
        rowCount: globalRowCount,
        statusDistribution: getDefaultStatusDistribution(selectedDomain),
        enabled: true
      }));
    }
    setSelectedTables(newSelected);
  };

  const handleGlobalRowCountChange = (value: number[]) => {
    const newCount = value[0];
    setGlobalRowCount(newCount);
    
    // Update all table configs
    setTableConfigs(prev => {
      const updated = new Map(prev);
      for (const [tableName, config] of updated) {
        updated.set(tableName, { ...config, rowCount: newCount });
      }
      return updated;
    });
  };

  const handleTableConfigChange = (tableName: string, config: TableGenerationConfig) => {
    setTableConfigs(prev => new Map(prev).set(tableName, config));
  };

  const handleStartGeneration = async () => {
    if (selectedTables.size === 0) return;

    // Create generation config
    const config = {
      domain: selectedDomain,
      tables: Array.from(tableConfigs.values()).filter(c => c.enabled),
      globalSettings: {
        dateRange: [new Date(2024, 0, 1), new Date()] as [Date, Date],
        locale: 'zh_CN'
      }
    };

    const sessionId = createMockSession(selectedDomain, config);
    setCurrentMockSession(sessionId);
    await startDataGeneration(sessionId);
  };

  const handleExportData = async (format: 'json' | 'sql' | 'csv') => {
    if (!currentMockSession) return;
    
    try {
      const exportedData = await exportGeneratedData(currentMockSession.id, format);
      
      // Create download
      const blob = new Blob([exportedData], { 
        type: format === 'json' ? 'application/json' : 'text/plain' 
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `mock-data-${selectedDomain}-${new Date().toISOString().split('T')[0]}.${format}`;
      a.click();
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Export failed:', error);
    }
  };

  const domainStats = agencySchemas.find(s => s.domain === selectedDomain.toUpperCase());
  const totalRows = Array.from(tableConfigs.values()).reduce((sum, config) => 
    config.enabled ? sum + config.rowCount : sum, 0
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Database className="h-8 w-8 text-primary" />
            Mock 数据生成器
          </h1>
          <p className="text-muted-foreground">
            为智能体测试生成符合业务规则的模拟数据
          </p>
        </div>

        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="h-4 w-4 mr-2" />
            重置
          </Button>
          
          <Button 
            onClick={handleStartGeneration}
            disabled={selectedTables.size === 0 || loading.generation}
          >
            {loading.generation ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Play className="h-4 w-4 mr-2" />
            )}
            开始生成
          </Button>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{selectedTables.size}</div>
            <div className="text-sm text-muted-foreground">选择的表</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">{totalRows.toLocaleString()}</div>
            <div className="text-sm text-muted-foreground">总行数</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">
              {domainStats ? domainStats.tables.length : 0}
            </div>
            <div className="text-sm text-muted-foreground">可用表数</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold">
              {currentMockSession ? Math.round(currentMockSession.progress) : 0}%
            </div>
            <div className="text-sm text-muted-foreground">生成进度</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        
        {/* Left Panel - Domain & Table Selection */}
        <div className="space-y-4">
          
          {/* Domain Selection */}
          <Card>
            <CardHeader>
              <CardTitle>选择业务域</CardTitle>
            </CardHeader>
            <CardContent>
              <Select value={selectedDomain} onValueChange={handleDomainChange}>
                <SelectTrigger>
                  <SelectValue placeholder="选择业务域" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(AGENCY_DOMAINS).map(([key, domain]) => (
                    <SelectItem key={key} value={key}>
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: domain.color }}
                        />
                        {domain.name}
                        <Badge variant="outline">{domain.count} 智能体</Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              {selectedDomain && domainStats && (
                <div className="mt-3 p-3 bg-muted rounded-lg">
                  <div className="text-sm font-medium mb-2">域信息</div>
                  <div className="grid gap-1 text-xs">
                    <div className="flex justify-between">
                      <span>数据表:</span>
                      <span>{domainStats.tables.length}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>总列数:</span>
                      <span>{domainStats.tables.reduce((sum, table) => sum + table.columns.length, 0)}</span>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Global Settings */}
          {selectedDomain && (
            <Card>
              <CardHeader>
                <CardTitle>全局设置</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label>默认行数: {globalRowCount}</Label>
                  <Slider
                    value={[globalRowCount]}
                    onValueChange={handleGlobalRowCountChange}
                    max={1000}
                    min={10}
                    step={10}
                    className="mt-2"
                  />
                </div>

                <div>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setSelectedTables(new Set(availableTables.map(t => t.name)));
                      const newConfigs = new Map();
                      availableTables.forEach(table => {
                        newConfigs.set(table.name, {
                          tableName: table.name,
                          rowCount: globalRowCount,
                          statusDistribution: getDefaultStatusDistribution(selectedDomain),
                          enabled: true
                        });
                      });
                      setTableConfigs(newConfigs);
                    }}
                    className="w-full"
                  >
                    全选表
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Table List */}
          {selectedDomain && availableTables.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Table className="h-4 w-4" />
                  数据表 ({availableTables.length})
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ScrollArea className="h-[400px]">
                  <div className="space-y-2">
                    {availableTables.map((table) => (
                      <div 
                        key={table.name}
                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                          selectedTables.has(table.name) 
                            ? 'bg-primary/10 border-primary/30' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => handleTableToggle(table.name)}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2">
                              {selectedTables.has(table.name) && (
                                <Check className="h-4 w-4 text-primary" />
                              )}
                              <span className="font-medium font-mono text-sm">
                                {table.name}
                              </span>
                            </div>
                            <div className="text-xs text-muted-foreground mt-1">
                              {table.columns.length} 列
                              {table.foreignKeys.length > 0 && (
                                <> • {table.foreignKeys.length} 外键</>
                              )}
                            </div>
                          </div>
                          
                          {selectedTables.has(table.name) && tableConfigs.has(table.name) && (
                            <Badge variant="outline" className="text-xs">
                              {tableConfigs.get(table.name)!.rowCount} 行
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Center Panel - Configuration */}
        <div className="space-y-4">
          {selectedTables.size > 0 ? (
            <Tabs defaultValue="config" className="space-y-4">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="config">表配置</TabsTrigger>
                <TabsTrigger value="preview">数据预览</TabsTrigger>
              </TabsList>

              <TabsContent value="config">
                <ScrollArea className="h-[600px]">
                  <div className="space-y-4">
                    {Array.from(selectedTables).map(tableName => {
                      const table = availableTables.find(t => t.name === tableName);
                      const config = tableConfigs.get(tableName);
                      
                      return table && config ? (
                        <TableConfig
                          key={tableName}
                          table={table}
                          config={config}
                          onChange={(newConfig: TableGenerationConfig) => handleTableConfigChange(tableName, newConfig)}
                        />
                      ) : null;
                    })}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="preview">
                {currentMockSession?.generatedData ? (
                  <DataPreview 
                    data={currentMockSession.generatedData}
                    tables={Array.from(selectedTables)}
                  />
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center">
                      <FileText className="h-8 w-8 mx-auto text-muted-foreground mb-3" />
                      <p className="text-muted-foreground">
                        生成数据后可以在此预览
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <Database className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
                <p className="text-lg font-medium">选择数据表开始配置</p>
                <p className="text-sm text-muted-foreground">
                  从左侧选择一个或多个表来生成模拟数据
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Right Panel - Generation Status */}
        <div className="space-y-4">
          
          {/* Generation Status */}
          {currentMockSession && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="h-4 w-4" />
                  生成状态
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>进度</span>
                    <span>{Math.round(currentMockSession.progress)}%</span>
                  </div>
                  <Progress value={currentMockSession.progress} className="h-2" />
                </div>

                <div className="grid gap-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">状态:</span>
                    <Badge variant={
                      currentMockSession.status === 'completed' ? 'default' :
                      currentMockSession.status === 'generating' ? 'secondary' :
                      currentMockSession.status === 'error' ? 'destructive' : 'outline'
                    }>
                      {getStatusText(currentMockSession.status)}
                    </Badge>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">域:</span>
                    <span>{currentMockSession.domain.toUpperCase()}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">配置表数:</span>
                    <span>{currentMockSession.config.tables.length}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">创建时间:</span>
                    <span>{new Date(currentMockSession.createdAt).toLocaleTimeString()}</span>
                  </div>
                </div>

                {currentMockSession.status === 'error' && currentMockSession.error && (
                  <div className="p-3 bg-red-50 border border-red-200 rounded">
                    <div className="text-sm text-red-600">{currentMockSession.error}</div>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Export Options */}
          {currentMockSession?.status === 'completed' && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  导出数据
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleExportData('json')}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  导出为 JSON
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleExportData('sql')}
                >
                  <Database className="h-4 w-4 mr-2" />
                  导出为 SQL
                </Button>
                
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => handleExportData('csv')}
                >
                  <Table className="h-4 w-4 mr-2" />
                  导出为 CSV
                </Button>
              </CardContent>
            </Card>
          )}

          {/* Recent Sessions */}
          <Card>
            <CardHeader>
              <CardTitle>历史会话</CardTitle>
            </CardHeader>
            <CardContent>
              <ScrollArea className="h-[200px]">
                {mockDataSessions.length === 0 ? (
                  <div className="text-center py-4 text-muted-foreground text-sm">
                    还没有生成会话
                  </div>
                ) : (
                  <div className="space-y-2">
                    {mockDataSessions.slice(-5).reverse().map((session) => (
                      <div 
                        key={session.id}
                        className={`p-2 border rounded cursor-pointer ${
                          session.id === currentMockSession?.id 
                            ? 'bg-primary/10 border-primary/30' 
                            : 'hover:bg-muted/50'
                        }`}
                        onClick={() => setCurrentMockSession(session.id)}
                      >
                        <div className="flex justify-between items-start">
                          <div className="flex-1">
                            <div className="font-medium text-sm">
                              {session.domain.toUpperCase()}
                            </div>
                            <div className="text-xs text-muted-foreground">
                              {new Date(session.createdAt).toLocaleString()}
                            </div>
                          </div>
                          <Badge variant="outline" className="text-xs">
                            {getStatusText(session.status)}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        </div>

      </div>
    </div>
  );
}

// Helper functions

function getDefaultStatusDistribution(domain: string): Record<string, number> {
  const distributions: Record<string, Record<string, number>> = {
    wms: { 'ACTIVE': 0.7, 'PENDING': 0.2, 'COMPLETED': 0.08, 'CANCELLED': 0.02 },
    fms: { 'DELIVERED': 0.6, 'IN_TRANSIT': 0.25, 'PLANNED': 0.1, 'CANCELLED': 0.05 },
    oms: { 'DELIVERED': 0.5, 'CONFIRMED': 0.3, 'PROCESSING': 0.15, 'CANCELLED': 0.05 },
    bnp: { 'PAID': 0.6, 'PENDING': 0.25, 'OVERDUE': 0.1, 'CANCELLED': 0.05 },
    yms: { 'CHECKED_OUT': 0.4, 'SCHEDULED': 0.3, 'CHECKED_IN': 0.2, 'LOADING': 0.1 }
  };
  
  return distributions[domain.toLowerCase()] || distributions.wms;
}

function getStatusText(status: string): string {
  switch (status) {
    case 'draft': return '草稿';
    case 'generating': return '生成中';
    case 'completed': return '已完成';
    case 'error': return '错误';
    default: return status;
  }
}