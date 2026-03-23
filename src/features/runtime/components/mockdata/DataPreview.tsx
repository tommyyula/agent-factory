/**
 * Data Preview Component
 * Shows generated mock data in a simple table format
 */

import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Download, Eye, Table as TableIcon } from 'lucide-react';

interface DataPreviewProps {
  data: Map<string, any[]>;
  tables: string[];
}

export function DataPreview({ data, tables }: DataPreviewProps) {
  if (tables.length === 0 || data.size === 0) {
    return (
      <Card>
        <CardContent className="py-8 text-center text-muted-foreground">
          <Eye className="h-8 w-8 mx-auto mb-3" />
          <p>暂无数据，请先生成 Mock 数据</p>
        </CardContent>
      </Card>
    );
  }

  const handleExportTable = (tableName: string, format: 'json' | 'sql') => {
    const tableData = data.get(tableName) || [];
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(tableData, null, 2)], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tableName}_mock_data.json`;
      a.click();
      URL.revokeObjectURL(url);
    } else if (format === 'sql') {
      const inserts = tableData.map(row => {
        const cols = Object.keys(row).join(', ');
        const vals = Object.values(row).map(v => 
          v === null ? 'NULL' : typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : String(v)
        ).join(', ');
        return `INSERT INTO ${tableName} (${cols}) VALUES (${vals});`;
      }).join('\n');
      const blob = new Blob([inserts], { type: 'text/sql' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${tableName}_mock_data.sql`;
      a.click();
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="space-y-4">
      {tables.map(tableName => {
        const tableData = data.get(tableName) || [];
        const columns = tableData.length > 0 ? Object.keys(tableData[0]) : [];
        const displayData = tableData.slice(0, 20); // Show max 20 rows per table

        return (
          <Card key={tableName}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <TableIcon className="h-4 w-4" />
                  <span className="font-mono">{tableName}</span>
                  <Badge variant="secondary">{tableData.length} 行</Badge>
                  <Badge variant="outline">{columns.length} 列</Badge>
                </CardTitle>
                <div className="flex gap-2">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleExportTable(tableName, 'json')}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    JSON
                  </Button>
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => handleExportTable(tableName, 'sql')}
                  >
                    <Download className="h-3 w-3 mr-1" />
                    SQL
                  </Button>
                </div>
              </div>
            </CardHeader>
            
            <CardContent>
              <ScrollArea className="h-64">
                <div className="overflow-x-auto">
                  <table className="w-full text-xs">
                    <thead>
                      <tr className="border-b">
                        {columns.slice(0, 6).map(col => (
                          <th key={col} className="px-2 py-1 text-left font-medium text-muted-foreground font-mono">
                            {col}
                          </th>
                        ))}
                        {columns.length > 6 && (
                          <th className="px-2 py-1 text-muted-foreground">+{columns.length - 6}</th>
                        )}
                      </tr>
                    </thead>
                    <tbody>
                      {displayData.map((row, i) => (
                        <tr key={i} className="border-b hover:bg-muted/50">
                          {columns.slice(0, 6).map(col => (
                            <td key={col} className="px-2 py-1 max-w-32 truncate font-mono">
                              {row[col] === null || row[col] === undefined ? (
                                <span className="text-muted-foreground italic">NULL</span>
                              ) : (
                                <span className={`${
                                  typeof row[col] === 'number' ? 'text-blue-600' :
                                  typeof row[col] === 'boolean' ? 'text-purple-600' :
                                  String(row[col]).match(/^\d{4}-\d{2}-\d{2}/) ? 'text-green-600' :
                                  ''
                                }`}>
                                  {String(row[col])}
                                </span>
                              )}
                            </td>
                          ))}
                          {columns.length > 6 && (
                            <td className="px-2 py-1 text-muted-foreground">...</td>
                          )}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                
                {tableData.length > 20 && (
                  <p className="text-xs text-muted-foreground mt-2 text-center">
                    显示前 20 行，共 {tableData.length} 行数据
                  </p>
                )}
                
                {tableData.length === 0 && (
                  <p className="text-xs text-muted-foreground text-center py-4">
                    该表暂无数据
                  </p>
                )}
              </ScrollArea>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
}