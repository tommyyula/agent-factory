import React, { useState, useCallback, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  Download, 
  Upload, 
  FileText, 
  CheckCircle, 
  AlertTriangle, 
  X,
  Eye,
  Copy,
  ExternalLink
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

import { OntologyBlueprint, ValidationResult, ValidationError } from '@/shared/types/obr.types';
import { obrValidationService } from '@/shared/services/obr-validation.service';
import { useOBRStore } from '@/stores/obr.store';

interface ImportExportProps {
  readonly?: boolean;
}

export function ImportExport({ readonly = false }: ImportExportProps) {
  const { 
    currentBlueprint, 
    importBlueprint, 
    exportBlueprint,
    validateBlueprint 
  } = useOBRStore();

  // State
  const [exportFormat, setExportFormat] = useState<'json' | 'yaml' | 'rdf'>('json');
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [importPreview, setImportPreview] = useState<OntologyBlueprint | null>(null);
  const [importValidation, setImportValidation] = useState<ValidationResult | null>(null);
  const [importProgress, setImportProgress] = useState(0);
  const [exportedContent, setExportedContent] = useState<string>('');
  const [showExportPreview, setShowExportPreview] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Export current blueprint
  const handleExport = useCallback(async () => {
    if (!currentBlueprint) {
      console.error('No blueprint to export');
      return;
    }

    setIsExporting(true);
    try {
      const exported = await exportBlueprint(exportFormat);
      setExportedContent(exported);
      
      // Download file
      const blob = new Blob([exported], { 
        type: exportFormat === 'json' ? 'application/json' : 'text/plain' 
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `${currentBlueprint.metadata.name}-${currentBlueprint.metadata.version}.${exportFormat}`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      setShowExportPreview(true);
    } catch (error) {
      console.error('Export failed:', error);
    }
    setIsExporting(false);
  }, [currentBlueprint, exportFormat, exportBlueprint]);

  // Handle file selection
  const handleFileSelect = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    setImportProgress(10);

    try {
      // Read file content
      const content = await file.text();
      setImportProgress(30);

      // Parse JSON
      let blueprint: OntologyBlueprint;
      try {
        blueprint = JSON.parse(content);
      } catch (error) {
        throw new Error('Invalid JSON format');
      }
      setImportProgress(50);

      // Validate schema
      const validation = await obrValidationService.validateBlueprint(blueprint);
      setImportProgress(80);

      // Set preview data
      setImportPreview(blueprint);
      setImportValidation(validation);
      setImportProgress(100);

    } catch (error) {
      console.error('Import failed:', error);
      setImportValidation({
        isValid: false,
        timestamp: new Date().toISOString(),
        errors: [{
          code: 'IMPORT_ERROR',
          type: 'schema',
          path: 'file',
          message: error instanceof Error ? error.message : 'Import failed',
          severity: 'error'
        }],
        warnings: [],
        metrics: {
          objectCount: 0,
          behaviorCount: 0,
          ruleCount: 0,
          scenarioCount: 0,
          linkCount: 0,
          completenessScore: 0,
          consistencyScore: 0
        }
      });
    }
    
    setIsImporting(false);
    setTimeout(() => setImportProgress(0), 2000);
  }, []);

  // Confirm import
  const handleConfirmImport = useCallback(async () => {
    if (!importPreview || !importValidation?.isValid) {
      console.error('No valid preview data to import');
      return;
    }

    try {
      // Create a File object for the store import method
      const blob = new Blob([JSON.stringify(importPreview, null, 2)], { 
        type: 'application/json' 
      });
      const file = new File([blob], 'import.json', { type: 'application/json' });
      
      await importBlueprint(file);
      
      // Clear preview
      setImportPreview(null);
      setImportValidation(null);
      
      // Reset file input
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Import confirmation failed:', error);
    }
  }, [importPreview, importValidation, importBlueprint]);

  // Cancel import
  const handleCancelImport = useCallback(() => {
    setImportPreview(null);
    setImportValidation(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }, []);

  // Copy to clipboard
  const handleCopyToClipboard = useCallback(() => {
    if (exportedContent) {
      navigator.clipboard.writeText(exportedContent);
    }
  }, [exportedContent]);

  return (
    <div className="import-export space-y-6">
      {/* Export Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Download className="h-5 w-5" />
            导出本体蓝图
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center gap-4">
            <div className="space-y-2">
              <Label htmlFor="export-format">导出格式</Label>
              <Select 
                value={exportFormat} 
                onValueChange={(value) => setExportFormat(value as any)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="json">JSON</SelectItem>
                  <SelectItem value="yaml">YAML</SelectItem>
                  <SelectItem value="rdf">RDF</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex-1" />

            <Button 
              onClick={handleExport} 
              disabled={!currentBlueprint || isExporting}
              className="min-w-[100px]"
            >
              {isExporting ? '导出中...' : '导出蓝图'}
            </Button>
          </div>

          {currentBlueprint && (
            <div className="p-3 bg-muted rounded-lg">
              <h4 className="font-medium mb-2">当前蓝图信息</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">名称:</span> {currentBlueprint.metadata.name}
                </div>
                <div>
                  <span className="text-muted-foreground">版本:</span> {currentBlueprint.metadata.version}
                </div>
                <div>
                  <span className="text-muted-foreground">域:</span> {currentBlueprint.metadata.domain}
                </div>
                <div>
                  <span className="text-muted-foreground">更新时间:</span> {new Date(currentBlueprint.metadata.updatedAt).toLocaleDateString()}
                </div>
              </div>
              
              <div className="mt-3 flex gap-2">
                <Badge variant="outline">{currentBlueprint.objects.length} 对象</Badge>
                <Badge variant="outline">{currentBlueprint.behaviors.length} 行为</Badge>
                <Badge variant="outline">{currentBlueprint.rules.length} 规则</Badge>
                <Badge variant="outline">{currentBlueprint.scenarios.length} 场景</Badge>
                <Badge variant="outline">{currentBlueprint.links.length} 关系</Badge>
              </div>
            </div>
          )}

          {/* Export Preview */}
          {showExportPreview && exportedContent && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label>导出内容预览</Label>
                <div className="flex gap-2">
                  <Button onClick={handleCopyToClipboard} size="sm" variant="outline">
                    <Copy className="h-4 w-4 mr-1" />
                    复制
                  </Button>
                  <Button 
                    onClick={() => setShowExportPreview(false)} 
                    size="sm" 
                    variant="ghost"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Textarea
                value={exportedContent}
                readOnly
                rows={10}
                className="font-mono text-xs"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Import Section */}
      {!readonly && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              导入本体蓝图
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="file-import">选择文件</Label>
                <div className="flex items-center gap-4">
                  <Button 
                    onClick={() => fileInputRef.current?.click()}
                    variant="outline"
                    disabled={isImporting}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    选择 JSON 文件
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".json"
                    onChange={handleFileSelect}
                    className="hidden"
                  />
                  {isImporting && <span className="text-sm text-muted-foreground">处理中...</span>}
                </div>
              </div>

              {importProgress > 0 && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm">导入进度</span>
                    <span className="text-sm">{importProgress}%</span>
                  </div>
                  <Progress value={importProgress} />
                </div>
              )}
            </div>

            {/* Import Preview and Validation */}
            {importPreview && importValidation && (
              <div className="space-y-4 border-t pt-4">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium">导入预览</h4>
                  <div className="flex items-center gap-2">
                    {importValidation.isValid ? (
                      <Badge variant="success" className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        验证通过
                      </Badge>
                    ) : (
                      <Badge variant="destructive" className="flex items-center gap-1">
                        <AlertTriangle className="h-3 w-3" />
                        验证失败
                      </Badge>
                    )}
                  </div>
                </div>

                {/* Blueprint Info */}
                <div className="p-3 bg-muted rounded-lg">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-muted-foreground">名称:</span> {importPreview.metadata.name}
                    </div>
                    <div>
                      <span className="text-muted-foreground">版本:</span> {importPreview.metadata.version}
                    </div>
                    <div>
                      <span className="text-muted-foreground">域:</span> {importPreview.metadata.domain}
                    </div>
                    <div>
                      <span className="text-muted-foreground">作者:</span> {importPreview.metadata.author}
                    </div>
                  </div>
                  
                  <div className="mt-3 flex gap-2">
                    <Badge variant="outline">{importPreview.objects.length} 对象</Badge>
                    <Badge variant="outline">{importPreview.behaviors.length} 行为</Badge>
                    <Badge variant="outline">{importPreview.rules.length} 规则</Badge>
                    <Badge variant="outline">{importPreview.scenarios.length} 场景</Badge>
                    <Badge variant="outline">{importPreview.links.length} 关系</Badge>
                  </div>
                </div>

                {/* Validation Results */}
                {(importValidation.errors.length > 0 || importValidation.warnings.length > 0) && (
                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">验证结果</h4>
                    {importValidation.errors.map((error, index) => (
                      <Alert key={index} variant="destructive">
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <span className="font-medium">{error.path}:</span> {error.message}
                        </AlertDescription>
                      </Alert>
                    ))}
                    {importValidation.warnings.map((warning, index) => (
                      <Alert key={index}>
                        <AlertTriangle className="h-4 w-4" />
                        <AlertDescription>
                          <span className="font-medium">{warning.path}:</span> {warning.message}
                        </AlertDescription>
                      </Alert>
                    ))}
                  </div>
                )}

                {/* Quality Metrics */}
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="font-medium text-sm mb-2">质量指标</h4>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>完整性</span>
                        <span>{importValidation.metrics.completenessScore}%</span>
                      </div>
                      <Progress value={importValidation.metrics.completenessScore} className="h-2" />
                    </div>
                    <div className="space-y-1">
                      <div className="flex justify-between">
                        <span>一致性</span>
                        <span>{importValidation.metrics.consistencyScore}%</span>
                      </div>
                      <Progress value={importValidation.metrics.consistencyScore} className="h-2" />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={handleCancelImport}>
                    取消
                  </Button>
                  <Button 
                    onClick={handleConfirmImport}
                    disabled={!importValidation.isValid}
                    className="min-w-[100px]"
                  >
                    确认导入
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Import Guidelines */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            导入导出说明
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">支持的格式</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li><strong>JSON:</strong> 标准 JSON 格式，支持完整的 OBR 数据结构</li>
                <li><strong>YAML:</strong> 人类可读的 YAML 格式 (开发中)</li>
                <li><strong>RDF:</strong> 语义网 RDF 格式 (开发中)</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">导入要求</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>文件必须是有效的 JSON 格式</li>
                <li>必须包含所需的 metadata 字段</li>
                <li>对象 ID 必须唯一</li>
                <li>引用的对象必须存在于蓝图中</li>
                <li>状态机定义必须完整</li>
              </ul>
            </div>

            <div>
              <h4 className="font-medium mb-2">最佳实践</h4>
              <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                <li>导入前备份当前蓝图</li>
                <li>仔细检查验证错误</li>
                <li>注意命名空间冲突</li>
                <li>确保版本兼容性</li>
                <li>测试导入的数据完整性</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ImportExport;