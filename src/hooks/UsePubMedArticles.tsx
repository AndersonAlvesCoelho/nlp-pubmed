import { IAnalyzeResponse, IArticle } from '@/types/articles';
import { useCallback, useEffect, useState } from 'react';
import { toast } from 'sonner';

interface UsePubMedArticlesProps {
  pubmedApiKey?: string;
}

export const usePubMedArticles = ({
  pubmedApiKey = '',
}: UsePubMedArticlesProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<IArticle[]>([]);
  const [savedArticles, setSavedArticles] = useState<IArticle[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const [analysisResult, setAnalysisResult] = useState<IAnalyzeResponse | null>(
    null
  );
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const [openDialog, setOpenDialog] = useState(false);

  const [progress, setProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('Preparando análise...');

  // Carregar artigos salvos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem('savedArticles');
    if (saved) {
      try {
        setSavedArticles(JSON.parse(saved));
      } catch (error) {
        console.error('Erro ao carregar artigos salvos:', error);
      }
    }
  }, []);

  // Salvar artigos no localStorage sempre que a lista mudar
  useEffect(() => {
    localStorage.setItem('savedArticles', JSON.stringify(savedArticles));
  }, [savedArticles]);

  const searchPubMed = useCallback(async () => {
    if (!searchQuery.trim()) {
      toast.error('Por favor, digite um termo de pesquisa');
      return;
    }

    setIsLoading(true);
    setSearchResults([]);

    try {
      const apiKeyParam = pubmedApiKey ? `&api_key=${pubmedApiKey}` : '';
      const searchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/esearch.fcgi?db=pubmed&term=${encodeURIComponent(
        searchQuery
      )}&retmode=json&retmax=20${apiKeyParam}`;

      const searchResponse = await fetch(searchUrl);
      const searchData = await searchResponse.json();

      if (!searchData.esearchresult?.idlist?.length) {
        toast.info('Nenhum artigo encontrado');
        setIsLoading(false);
        return;
      }

      const ids = searchData.esearchresult.idlist.join(',');
      const fetchUrl = `https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi?db=pubmed&id=${ids}&retmode=xml${apiKeyParam}`;

      const fetchResponse = await fetch(fetchUrl);
      const xmlText = await fetchResponse.text();
      const parser = new DOMParser();
      const xmlDoc = parser.parseFromString(xmlText, 'text/xml');
      const articles = xmlDoc.querySelectorAll('PubmedArticle');

      const parsedArticles: IArticle[] = Array.from(articles).map((article) => {
        const pmid = article.querySelector('PMID')?.textContent || '';
        const title =
          article.querySelector('ArticleTitle')?.textContent ||
          'Título não disponível';

        const authorNodes = article.querySelectorAll('Author');
        const authors = Array.from(authorNodes)
          .map((author) => {
            const lastName =
              author.querySelector('LastName')?.textContent || '';
            const foreName =
              author.querySelector('ForeName')?.textContent || '';
            return `${foreName} ${lastName}`.trim();
          })
          .filter(Boolean);

        const year = article.querySelector('PubDate Year')?.textContent || '';
        const month = article.querySelector('PubDate Month')?.textContent || '';
        const date = `${month} ${year}`.trim() || 'Data não disponível';

        const abstractNodes = article.querySelectorAll('AbstractText');
        const abstract =
          Array.from(abstractNodes)
            .map((node) => node.textContent)
            .join(' ')
            .trim() || 'Resumo não disponível';

        return {
          id: pmid,
          title,
          authors: authors.slice(0, 5),
          date,
          abstract,
          pmid,
        };
      });

      setSearchResults(parsedArticles);
      toast.success(`${parsedArticles.length} artigos encontrados`);
    } catch (error) {
      console.error('Erro ao buscar artigos:', error);
      toast.error('Erro ao buscar artigos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  }, [searchQuery, pubmedApiKey]);

  const saveArticle = useCallback(
    (article: IArticle) => {
      if (savedArticles.some((a) => a.id === article.id)) {
        toast.info('Artigo já está na sua lista');
        return;
      }
      setSavedArticles((prev) => [...prev, article]);
      toast.success('Artigo salvo na lista pessoal');
    },
    [savedArticles]
  );

  const removeArticle = useCallback((articleId: string) => {
    setSavedArticles((prev) => prev.filter((a) => a.id !== articleId));
    toast.success('Artigo removido da lista');
  }, []);

  // Função para chamar sua API de análise
  const analyzeArticles = useCallback(
    async (email: string, articleIds: string[]) => {
      if (!email || !articleIds.length) {
        toast.error('Email e artigos são obrigatórios para análise');
        return;
      }

      setOpenDialog(false)
      setIsAnalyzing(true);
      setProgress(10);
      setStatusMessage('Enviando artigos para análise...');

      try {
        setIsAnalyzing(true);

        const response = await fetch(
          'https://api-pubmed-nlp.onrender.com/analyze',
          {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, article_ids: articleIds }),
          }
        );

        setProgress(60);
        setStatusMessage('Processando conteúdo e gerando resumos...');

        if (!response.ok) {
          const text = await response.text();
          throw new Error(text || 'Erro na API de análise');
        }

        const data = await response.json();
        setProgress(90);
        setStatusMessage('Finalizando e organizando resultados...');

        const combinedArticles = data.articles.map((analyzed) => {
          const original = savedArticles.find((a) => a.id === analyzed.id);
          return {
            ...(original || {
              id: analyzed.id,
              title: analyzed.title,
              authors: [],
              date: '',
              abstract: '',
              pmid: '',
            }),
            processed: analyzed.processed,
            summary: analyzed.summary,
          };
        });

        setAnalysisResult({
          articles: combinedArticles,
          general_summary: data.general_summary,
        });

        setProgress(100);
        setStatusMessage('Análise concluída!');
        toast.success(
          `Análise concluída com sucesso! ${combinedArticles.length} artigos processados.`
        );

        return null;
      } catch {
        toast.error(`Erro ao analisar artigos: `);
      } finally {
        setIsAnalyzing(false);
      }
    },
    [savedArticles]
  );

  return {
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
  };
};
