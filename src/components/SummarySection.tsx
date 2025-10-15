import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArticleSummary } from "./ArticleSummary";
import { FileText, Copy, Check } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";

interface Article {
  id: string;
  title: string;
  authors: string[];
  date: string;
  abstract: string;
  pmid: string;
}

interface SummarySectionProps {
  articles: Article[];
}

export const SummarySection = ({ articles }: SummarySectionProps) => {
  const [generalSummary, setGeneralSummary] = useState<string>("");
  const [copied, setCopied] = useState(false);

  if (articles.length === 0) return null;

  const generateGeneralSummary = () => {
    const combined = articles
      .map((article, index) => {
        return `${index + 1}. ${article.title}\n${article.abstract}\n`;
      })
      .join("\n");

    const summary = `RESUMO GERAL DE ${articles.length} ARTIGOS\n\n${combined}`;
    setGeneralSummary(summary);
    toast.success("Resumo geral gerado com sucesso!");
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generalSummary);
      setCopied(true);
      toast.success("Resumo copiado para a área de transferência!");
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast.error("Erro ao copiar resumo");
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
          {articles.map((article) => (
            <ArticleSummary key={article.id} article={article} />
          ))}
        </div>
      </div>

      {/* Resumo Geral */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium text-foreground">Resumo Geral</h3>
          <Button
            onClick={generateGeneralSummary}
            variant="default"
            className="gap-2"
          >
            <FileText className="h-4 w-4" />
            Gerar Resumo Geral
          </Button>
        </div>

        {generalSummary && (
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
                {generalSummary}
              </pre>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
