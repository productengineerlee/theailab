import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { supabase, type NewsItem } from '@/lib/supabase';
import { Calendar, Plus, Minus, Image as ImageIcon, ExternalLink } from 'lucide-react';
import SEO from '@/components/SEO';
import { useTranslation } from 'react-i18next';

interface GroupedNews {
  [year: string]: NewsItem[];
}

export default function News() {
  const { t } = useTranslation('news');
  const [newsData, setNewsData] = useState<GroupedNews>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [openYears, setOpenYears] = useState<{ [year: string]: boolean }>({});
  const [expandedItems, setExpandedItems] = useState<{ [id: number]: boolean }>({});

  useEffect(() => {
    fetchNews();
  }, []);

  const fetchNews = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .order('date', { ascending: false });

    if (error) {
      console.error('Error fetching news:', error);
      setError(t('error'));
      setLoading(false);
      return;
    }

    const grouped: GroupedNews = {};
    data.forEach((item) => {
      const year = item.date.split('.')[0];
      if (!grouped[year]) {
        grouped[year] = [];
        setOpenYears((prev) => ({ ...prev, [year]: true }));
      }
      grouped[year].push(item);
    });

    setNewsData(grouped);
    setLoading(false);
  };

  const toggleYear = (year: string) => {
    setOpenYears((prev) => ({ ...prev, [year]: !prev[year] }));
  };

  const toggleContent = (id: number) => {
    setExpandedItems((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const sortedYears = Object.keys(newsData).sort((a, b) => parseInt(b) - parseInt(a));

  return (
    <>
      <SEO
        title={t('seo.title')}
        description={t('seo.description')}
      />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-[#1e1b4b] via-[#5b21b6] to-[#a855f7] py-20 md:py-32">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
                {t('hero.title')}
              </h1>
              <p className="text-lg md:text-xl text-white/90">
                {t('hero.subtitle')}
              </p>
            </div>
          </div>
        </section>

        {/* News Timeline Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              {loading && (
                <div className="flex justify-center items-center h-48">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
                </div>
              )}
              
              {error && (
                <div className="text-center text-destructive p-8">{error}</div>
              )}
              
              {!loading && !error && sortedYears.length === 0 && (
                <div className="text-center text-muted-foreground p-8">
                  {t('noNews')}
                </div>
              )}

              {!loading && !error && sortedYears.length > 0 && (
                <div className="divide-y divide-border rounded-lg border bg-card shadow-sm">
                  {sortedYears.map((year) => (
                    <div key={year}>
                      {/* Year Header */}
                      <button
                        onClick={() => toggleYear(year)}
                        className="w-full px-6 py-5 flex items-center justify-between hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <Calendar className="h-5 w-5 text-muted-foreground" />
                          <h2 className="text-lg md:text-xl font-semibold">{year}년</h2>
                        </div>
                        <svg
                          className={`h-5 w-5 text-muted-foreground transition-transform ${
                            openYears[year] ? 'rotate-180' : ''
                          }`}
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>

                      {/* Year Content */}
                      {openYears[year] && (
                        <div className="px-6 pb-6 pt-2 bg-muted/20 space-y-4">
                          {newsData[year].map((item) => (
                            <Card key={item.id} className="overflow-hidden hover:shadow-md transition-shadow">
                              <div className="flex gap-4 p-4">
                                {/* 좌측: 썸네일 이미지 */}
                                <div className="flex-shrink-0">
                                  {item.image_url ? (
                                    <img
                                      src={item.image_url}
                                      alt={item.title}
                                      className="w-48 h-28 object-cover rounded-lg border"
                                    />
                                  ) : (
                                    <div className="w-48 h-28 bg-muted rounded-lg border flex items-center justify-center">
                                      <ImageIcon className="h-8 w-8 text-muted-foreground opacity-50" />
                                    </div>
                                  )}
                                </div>

                                {/* 우측: 텍스트 */}
                                <div className="flex-1 min-w-0 flex flex-col">
                                  <div className="flex items-start justify-between gap-4 mb-2">
                                    <div className="flex-1">
                                      <div className="flex items-center gap-2 mb-2">
                                        <span className="text-sm font-medium text-primary">{item.date}</span>
                                      </div>
                                      <h3 className="text-base md:text-lg font-semibold text-foreground mb-2">
                                        {item.title}
                                      </h3>
                                    </div>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      onClick={() => toggleContent(item.id!)}
                                      className="flex-shrink-0"
                                    >
                                      {expandedItems[item.id!] ? (
                                        <Minus className="h-4 w-4" />
                                      ) : (
                                        <Plus className="h-4 w-4" />
                                      )}
                                    </Button>
                                  </div>
                                  
                                   <p
                                     className={`text-sm md:text-base text-muted-foreground leading-relaxed text-justify whitespace-pre-wrap ${
                                       expandedItems[item.id!] ? '' : 'line-clamp-3'
                                     }`}
                                   >
                                     {item.content}
                                   </p>

                                   {/* 원문 기사 링크 - 펼쳐진 상태에서만 표시 */}
                                   {expandedItems[item.id!] && item.link && (
                                     <div className="mt-3 pt-3 border-t">
                                       <div className="flex items-start gap-2">
                                         <ExternalLink className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                         <div className="flex-1 min-w-0">
                                           <p className="text-xs text-muted-foreground mb-1">원문 기사</p>
                                           <a
                                             href={item.link}
                                             target="_blank"
                                             rel="noopener noreferrer"
                                             className="text-sm text-primary hover:underline break-all"
                                           >
                                             {item.link}
                                           </a>
                                         </div>
                                       </div>
                                     </div>
                                   )}
                                </div>
                              </div>
                            </Card>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
