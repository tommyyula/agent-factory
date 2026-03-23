import { Collapsible, CollapsibleTrigger, CollapsibleContent } from "@/components/ui/collapsible";
/**
 * Table Config Component
 * Configuration interface for individual table data generation
 */

import React, { useState } from 'react';
import { Table, Settings, BarChart3, Calendar } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
// Note: Collapsible component not available, using manual toggle
import { SchemaTable } from '@/data/agency-schemas';

interface TableGenerationConfig {
  tableName: string;
  rowCount: number;
  statusDistribution: Record<string, number>;
  enabled: boolean;
}

interface TableConfigProps {
  table: SchemaTable;
  config: TableGenerationConfig;
  onChange: (config: TableGenerationConfig) => void;
}

export function TableConfig({ table, config, onChange }: TableConfigProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const handleRowCountChange = (value: number[]) => {
    onChange({
      ...config,
      rowCount: value[0]
    });
  };

  const handleEnabledChange = (enabled: boolean) => {
    onChange({
      ...config,
      enabled
    });
  };

  const handleStatusDistributionChange = (status: string, value: number) => {
    const newDistribution = { ...config.statusDistribution };
    newDistribution[status] = value / 100; // Convert percentage to decimal
    
    // Normalize to ensure sum equals 1
    const total = Object.values(newDistribution).reduce((sum, val) => sum + val, 0);
    if (total > 0) {
      Object.keys(newDistribution).forEach(key => {
        newDistribution[key] = newDistribution[key] / total;
      });
    }

    onChange({
      ...config,
      statusDistribution: newDistribution
    });
  };

  const statusColumns = table.columns.filter(col => 
    col.name.toLowerCase().includes('status') || 
    col.name.toLowerCase().includes('state')
  );

  const dateColumns = table.columns.filter(col => 
    col.type === 'date' || 
    col.type === 'datetime' || 
    col.type === 'timestamp' ||
    col.name.toLowerCase().includes('date') ||
    col.name.toLowerCase().includes('time')
  );

  const foreignKeyColumns = table.foreignKeys.map(fk => 
    table.columns.find(col => col.name === fk.column)
  ).filter(Boolean);

  return (
    <Card className={`${!config.enabled ? 'opacity-50' : ''}`}>
      <CardHeader 
        className="cursor-pointer hover:bg-muted/50 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table className="h-4 w-4" />
            <span className="font-mono text-sm">{table.name}</span>
            <Badge variant="outline" className="text-xs">
              {table.columns.length} 列
            </Badge>
            {table.foreignKeys.length > 0 && (
              <Badge variant="outline" className="text-xs">
                {table.foreignKeys.length} FK
              </Badge>
            )}
          </div>
          
          <div className="flex items-center gap-2">
            <Badge variant={config.enabled ? 'default' : 'secondary'}>
              {config.rowCount} 行
            </Badge>
            <Switch
              checked={config.enabled}
              onCheckedChange={handleEnabledChange}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
        </CardTitle>
      </CardHeader>

      {isExpanded && (
          <CardContent className="space-y-4">
            
            {/* Row Count Configuration */}
            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                行数: {config.rowCount}
              </Label>
              <Slider
                value={[config.rowCount]}
                onValueChange={handleRowCountChange}
                max={1000}
                min={1}
                step={10}
                className="w-full"
                disabled={!config.enabled}
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>1</span>
                <span>1000</span>
              </div>
            </div>

            {/* Status Distribution Configuration */}
            {statusColumns.length > 0 && (
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Settings className="h-4 w-4" />
                  状态分布配置
                </Label>
                
                {statusColumns.map(column => (
                  <div key={column!.name} className="space-y-2 p-3 bg-muted/50 rounded-lg">
                    <div className="font-medium text-sm">{column!.name}</div>
                    
                    <div className="space-y-2">
                      {Object.entries(config.statusDistribution).map(([status, probability]) => (
                        <div key={status} className="space-y-1">
                          <div className="flex justify-between text-xs">
                            <span>{status}</span>
                            <span>{Math.round(probability * 100)}%</span>
                          </div>
                          <Slider
                            value={[Math.round(probability * 100)]}
                            onValueChange={(value) => handleStatusDistributionChange(status, value[0])}
                            max={100}
                            min={0}
                            step={5}
                            disabled={!config.enabled}
                            className="w-full"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Date Column Configuration */}
            {dateColumns.length > 0 && (
              <div className="space-y-3">
                <Label className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  日期列配置
                </Label>
                
                <div className="p-3 bg-muted/50 rounded-lg space-y-2">
                  {dateColumns.map(column => (
                    <div key={column.name} className="flex justify-between items-center text-sm">
                      <span className="font-mono">{column.name}</span>
                      <Badge variant="outline" className="text-xs">
                        {column.type}
                      </Badge>
                    </div>
                  ))}
                  
                  <div className="text-xs text-muted-foreground mt-2">
                    日期范围: 过去一年到现在
                  </div>
                </div>
              </div>
            )}

            {/* Foreign Key Information */}
            {table.foreignKeys.length > 0 && (
              <div className="space-y-2">
                <Label>外键约束</Label>
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg space-y-1">
                  {table.foreignKeys.map((fk, index) => (
                    <div key={index} className="text-xs font-mono">
                      {fk.column} → {fk.referencedTable}.{fk.referencedColumn}
                    </div>
                  ))}
                  <div className="text-xs text-muted-foreground mt-2">
                    外键值将自动从引用表生成
                  </div>
                </div>
              </div>
            )}

            {/* Column Summary */}
            <div className="space-y-2">
              <Label>列信息</Label>
              <div className="max-h-32 overflow-y-auto">
                <div className="grid gap-1">
                  {table.columns.slice(0, 10).map(column => (
                    <div key={column.name} className="flex justify-between items-center text-xs p-1">
                      <span className="font-mono">{column.name}</span>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">
                          {column.type}
                        </Badge>
                        {!column.nullable && (
                          <Badge variant="destructive" className="text-xs">
                            NOT NULL
                          </Badge>
                        )}
                      </div>
                    </div>
                  ))}
                  {table.columns.length > 10 && (
                    <div className="text-xs text-muted-foreground text-center py-1">
                      ... 还有 {table.columns.length - 10} 列
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Generation Preview */}
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
              <div className="text-sm font-medium mb-1">生成预览</div>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>将生成 {config.rowCount} 行数据</div>
                <div>包含 {table.columns.length} 列</div>
                {table.foreignKeys.length > 0 && (
                  <div>需要引用 {new Set(table.foreignKeys.map(fk => fk.referencedTable)).size} 个父表</div>
                )}
              </div>
            </div>

          </CardContent>
      )}
    </Card>
  );
}