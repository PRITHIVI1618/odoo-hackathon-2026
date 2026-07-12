import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ExternalLink, Newspaper, Loader2 } from 'lucide-react';
import type { NewsApiResponse } from '@/services/aiApi';

export function NewsWidget({ news, loading }: { news: NewsApiResponse | null; loading: boolean }) {
  if (loading) {
    return (
      <Card className="glass h-full">
        <CardHeader><CardTitle className="flex items-center gap-2"><Newspaper className="w-5 h-5 text-blue-500" /> ESG News</CardTitle></CardHeader>
        <CardContent className="flex items-center justify-center h-48">
          <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  const articles = news?.articles?.slice(0, 5) || [];

  return (
    <Card className="glass h-full flex flex-col">
      <CardHeader className="border-b pb-3">
        <CardTitle className="flex items-center gap-2 text-base">
          <Newspaper className="w-5 h-5 text-blue-500" />
          Latest ESG News
        </CardTitle>
      </CardHeader>
      <CardContent className="flex-1 overflow-y-auto pt-4 space-y-4">
        {articles.length === 0 ? (
          <p className="text-muted-foreground text-sm text-center py-8">No news available.</p>
        ) : articles.map((article, i) => (
          <a
            key={i}
            href={article.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block group"
          >
            <div className="flex gap-3 p-2 -mx-2 rounded-lg hover:bg-muted/30 transition-colors">
              {article.urlToImage && (
                <img src={article.urlToImage} alt="" className="w-16 h-16 object-cover rounded-lg flex-shrink-0 bg-muted" onError={(e) => (e.currentTarget.style.display = 'none')} />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium line-clamp-2 group-hover:text-blue-500 transition-colors leading-snug">
                  {article.title}
                </p>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-xs text-muted-foreground">{article.source.name}</span>
                  <span className="text-xs text-muted-foreground">·</span>
                  <span className="text-xs text-muted-foreground">{new Date(article.publishedAt).toLocaleDateString()}</span>
                  <ExternalLink className="w-3 h-3 text-muted-foreground ml-auto opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </div>
          </a>
        ))}
      </CardContent>
    </Card>
  );
}
