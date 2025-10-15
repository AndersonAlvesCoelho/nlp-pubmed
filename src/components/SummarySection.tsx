import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { IAnalyzeResponse } from '@/types/articles';
import { Check, Copy, FileText } from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import { ArticleSummary } from './ArticleSummary';

interface SummarySectionProps {
  analysis: IAnalyzeResponse;
}

export const SummarySection = ({ analysis }: SummarySectionProps) => {
  const [copied, setCopied] = useState(false);

  if (analysis?.articles.length === 0) return null;

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(analysis.general_summary || '');
      setCopied(true);
      toast.success('Resumo copiado para a área de transferência!');
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error('Erro ao copiar resumo');
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center gap-3 mb-4">
        <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
          <FileText className="h-5 w-5 text-primary-foreground" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground">
          Resumos Interativos
        </h2>
      </div>

      {/* Resumos Individuais */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">
          Resumos Individuais
        </h3>
        <div className="space-y-3">
          {analysis.articles.map((article) => (
            <ArticleSummary key={article.id} article={article} />
          ))}
        </div>
      </div>

      {/* Resumo Geral */}
      <div className="space-y-4">
        <h3 className="text-lg font-medium text-foreground">Resumo Geral</h3>

        {analysis?.general_summary && (
          <Card className="border-primary/20 bg-card/50 backdrop-blur animate-scale-in">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">Resumo Combinado</CardTitle>
                <Button
                  onClick={copyToClipboard}
                  variant="outline"
                  size="sm"
                  className="gap-2"
                >
                  {copied ? (
                    <>
                      <Check className="h-4 w-4" />
                      Copiado
                    </>
                  ) : (
                    <>
                      <Copy className="h-4 w-4" />
                      Copiar
                    </>
                  )}
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <pre className="text-sm leading-relaxed whitespace-pre-wrap text-foreground/90 font-sans">
                {analysis?.general_summary}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
