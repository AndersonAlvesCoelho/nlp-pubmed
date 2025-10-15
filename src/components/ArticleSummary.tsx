import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { IFullAnalyzedArticle } from "@/types/articles";
import { ChevronDown, ChevronUp } from "lucide-react";
import { useState } from "react";


interface ArticleSummaryProps {
  article: IFullAnalyzedArticle;
}

export const ArticleSummary = ({ article }: ArticleSummaryProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <Card className="hover:shadow-md transition-shadow">
      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-4">
            <CardTitle className="text-base leading-tight flex-1">
              {article.title}
            </CardTitle>
            <CollapsibleTrigger asChild>
              <Button variant="ghost" size="sm" className="shrink-0">
                {isOpen ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </CollapsibleTrigger>
          </div>
        </CardHeader>
        <CollapsibleContent>
          <CardContent className="pt-0 space-y-3">
            <div className="text-sm text-muted-foreground space-y-1">
              <p>
                <span className="font-medium">Autores:</span>{" "}
                {article.authors.length > 0
                  ? article.authors.join(", ")
                  : "Não disponível"}
              </p>
              <p>
                <span className="font-medium">Data:</span> {article.date}
              </p>
              <p>
                <span className="font-medium">PMID:</span> {article.pmid}
              </p>
            </div>
            <div className="text-sm leading-relaxed text-foreground/90 pt-2 border-t">
              <p className="font-medium mb-2">Resumo:</p>
              <p>{article.summary}</p>
            </div>
          </CardContent>
        </CollapsibleContent>
      </Collapsible>
    </Card>
  );
};
