import { AnalysisFeedback } from '@/components/AnalysisFeedback';
import DialogSelectedArticles from '@/components/DialogSelectedArticles';
import { SummarySection } from '@/components/SummarySection';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import { usePubMedArticles } from '@/hooks/UsePubMedArticles';
import { AnimatePresence } from 'framer-motion';
import { BookMarked, Loader2, Save, Search, Trash2 } from 'lucide-react';

export default function Index() {
  const {
    openDialog,
    setOpenDialog,
    searchQuery,
    setSearchQuery,
    searchResults,
    savedArticles,
    isLoading,
    searchPubMed,
    saveArticle,
    removeArticle,
    analyzeArticles,
    analysisResult,
    isAnalyzing,
    progress,
    statusMessage,
  } = usePubMedArticles({ pubmedApiKey: '' });

  return (
    <div className="min-h-screen bg-background">
      <DialogSelectedArticles
        open={openDialog}
        setOpen={setOpenDialog}
        savedArticles={savedArticles}
        removeArticle={removeArticle}
        analyzeArticles={analyzeArticles}
      />

      <AnimatePresence>
        <AnalysisFeedback
          isAnalyzing={isAnalyzing}
          progress={progress}
          message={statusMessage}
        />
      </AnimatePresence>

      {/* Header */}
      <header className="sticky top-0 z-50 w-full border-b border-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 rounded-lg bg-gradient-to-br from-primary to-accent">
              <BookMarked className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              Resumo de Artigos PubMed - NPL
            </h1>
          </div>

          {/* Barra de Pesquisa */}
          <div className="flex gap-2 max-w-3xl">
            <Input
              type="text"
              placeholder="Digite palavras-chave, autores ou termos médicos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 h-12 text-base"
            />
            <Button
              onClick={searchPubMed}
              disabled={isLoading}
              className="h-12 px-6 gap-2"
              size="lg"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Buscando...
                </>
              ) : (
                <>
                  <Search className="h-4 w-4" />
                  Pesquisar
                </>
              )}
            </Button>
          </div>
        </div>

        {savedArticles.length > 0 && (
          <Button
            onClick={() => setOpenDialog(true)}
            className="fixed bottom-6 right-6 z-50 h-12 px-6 gap-2 bg-primary text-primary-foreground hover:bg-primary/90 shadow-lg"
            size="lg"
          >
            <BookMarked className="h-5 w-5" />
            Gerar Resumo ({savedArticles.length} artigos)
          </Button>
        )}
      </header>

      {/* Conteúdo Principal */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Resultados da Pesquisa */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold text-foreground">
                Resultados da Pesquisa
              </h2>
              {searchResults.length > 0 && (
                <span className="text-sm text-muted-foreground">
                  {searchResults.length} artigos encontrados
                </span>
              )}
            </div>

            {searchResults.length === 0 && !isLoading && (
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-12 text-center">
                  <Search className="h-12 w-12 text-muted-foreground mb-4" />
                  <p className="text-muted-foreground">
                    Digite um termo na barra de pesquisa acima para começar
                  </p>
                </CardContent>
              </Card>
            )}

            {searchResults.map((article) => (
              <Card
                key={article.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <CardTitle className="text-lg leading-tight mb-2">
                        {article.title}
                      </CardTitle>
                      <CardDescription className="text-sm">
                        {article.authors.length > 0 ? (
                          <span>
                            {article.authors.join(', ')}
                            {article.authors.length === 5 && ' et al.'}
                          </span>
                        ) : (
                          'Autores não disponíveis'
                        )}
                      </CardDescription>
                      <CardDescription className="text-xs mt-1">
                        {article.date} • PMID: {article.pmid}
                      </CardDescription>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => saveArticle(article)}
                      className="shrink-0 gap-2"
                    >
                      <Save className="h-4 w-4" />
                      Salvar
                    </Button>
                  </div>
                </CardHeader>
                <Separator />
                <CardContent className="pt-4">
                  <p className="text-sm text-foreground/80 leading-relaxed line-clamp-4">
                    {article.abstract}
                  </p>
                  <a
                    href={`https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline mt-2 inline-block"
                  >
                    Ver no PubMed →
                  </a>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Lista Pessoal */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                Lista Pessoal
              </h2>

              {savedArticles.length === 0 ? (
                <Card className="border-dashed">
                  <CardContent className="flex flex-col items-center justify-center py-8 text-center">
                    <BookMarked className="h-10 w-10 text-muted-foreground mb-3" />
                    <p className="text-sm text-muted-foreground">
                      Nenhum artigo salvo ainda
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3 scroll-">
                  {savedArticles.map((article) => (
                    <Card
                      key={article.id}
                      className="hover:shadow-md transition-shadow"
                    >
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-medium text-sm leading-tight mb-1 line-clamp-2">
                              {article.title}
                            </h3>
                            <p className="text-xs text-muted-foreground mb-2">
                              PMID: {article.pmid}
                            </p>
                            <a
                              href={`https://pubmed.ncbi.nlm.nih.gov/${article.pmid}/`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-xs text-primary hover:underline"
                            >
                              Ver artigo →
                            </a>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => removeArticle(article.id)}
                            className="shrink-0 h-8 w-8 text-destructive hover:text-destructive hover:bg-destructive/10"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}

              {savedArticles.length > 0 && (
                <p className="text-xs text-muted-foreground mt-4 text-center">
                  {savedArticles.length}{' '}
                  {savedArticles.length === 1
                    ? 'artigo salvo'
                    : 'artigos salvos'}
                </p>
              )}
            </div>
          </div>
        </div>
        {/* Seção de Resumos Interativos */}
        {analysisResult?.articles.length > 0 && (
          <div className="mt-12">
            <SummarySection analysis={analysisResult} />
          </div>
        )}
      </main>
    </div>
  );
}
