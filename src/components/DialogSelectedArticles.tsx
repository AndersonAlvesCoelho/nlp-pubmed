import { Button } from '@/components/ui/button';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { IArticle } from '@/types/articles';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';

interface DialogSelectedArticlesProps {
  open: boolean;
  setOpen: (open: boolean) => void;
  savedArticles: IArticle[];
  removeArticle: (articleId: string) => void;
  analyzeArticles: (email: string, articleIds: string[]) => Promise<void>;
}

export default function DialogSelectedArticles({
  open,
  setOpen,
  savedArticles,
  removeArticle,
  analyzeArticles,
}: DialogSelectedArticlesProps) {
  const [loading, setLoading] = useState(false);

  const handleAnalyze = async () => {
    setLoading(true);
    try {
      const articleIds = savedArticles.map((a) => a.id);
      await analyzeArticles('usuario@example.com', articleIds);
      setOpen(false);
    } catch (error) {
      console.error('Erro ao gerar resumo:', error);
    } finally {
      setLoading(false);
    }
  };

  if (savedArticles.length === 0) return null;

  return (
    <div className="mt-4 flex justify-center">
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="sm:max-w-xl sm:w-full">
          <DialogHeader>
            <DialogTitle>Artigos Selecionados</DialogTitle>
          </DialogHeader>

          <div className="max-h-96 overflow-y-auto space-y-2 mt-4">
            {savedArticles.map((article) => (
              <Card
                key={article.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="flex justify-between items-start p-4">
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-sm line-clamp-2">
                      {article.title}
                    </CardTitle>
                    <p className="text-xs text-muted-foreground">
                      PMID: {article.pmid}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => removeArticle(article.id)}
                    className="h-8 w-8 text-destructive hover:bg-destructive/10"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <DialogFooter className="mt-4 flex justify-end gap-2">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleAnalyze} disabled={loading}>
              {loading ? 'Gerando...' : 'Gerar Resumo'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
