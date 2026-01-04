import { Calendar, Image as ImageIcon } from 'lucide-react';
import { useState, useEffect } from 'react';
import { supabase, type HistoryItem } from '@/lib/supabase';
import SEO from '@/components/SEO';

interface GroupedHistory {
  [year: string]: {
    [month: string]: HistoryItem[];
  };
}

export default function History() {
  const [historyData, setHistoryData] = useState<GroupedHistory>({});
  const [openYears, setOpenYears] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  async function fetchHistory() {
    try {
      const { data, error } = await supabase
        .from('history')
        .select('*')
        .order('year_month', { ascending: false });

      if (error) throw error;

      // 년/월별로 데이터 그룹화
      const grouped: GroupedHistory = {};
      data?.forEach((item) => {
        const [year, month] = item.year_month.split('-');
        if (!grouped[year]) {
          grouped[year] = {};
          setOpenYears((prev) => ({ ...prev, [year]: year === new Date().getFullYear().toString() }));
        }
        if (!grouped[year][month]) {
          grouped[year][month] = [];
        }
        grouped[year][month].push(item);
      });

      setHistoryData(grouped);
    } catch (error) {
      console.error('Error fetching history:', error);
    } finally {
      setLoading(false);
    }
  }

  const toggleYear = (year: string) => {
    setOpenYears((prev) => ({ ...prev, [year]: !prev[year] }));
  };

  const getMonthName = (month: string) => {
    return `${parseInt(month)}월`;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <>
      <SEO
        title="History - 더에이아이랩"
        description="더에이아이랩이 걸어온 길을 소개합니다. 교육 이력과 주요 활동 내역을 확인하세요."
        keywords="더에이아이랩, History, 교육이력, AI교육"
        path="/history"
      />
      <div className="min-h-screen bg-background">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-br from-primary/10 via-background to-primary/5 py-20 md:py-32 animate-fade-in">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent animate-slide-up">
                그동안의 발자취
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground animate-slide-up animate-delay-200">
                더에이아이랩이 걸어온 길을 소개합니다
              </p>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="py-12 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              {Object.keys(historyData).length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  아직 등록된 교육 이력이 없습니다.
                </div>
              ) : (
                <div className="divide-y divide-border rounded-lg border bg-card shadow-sm">
                  {Object.keys(historyData)
                    .sort((a, b) => b.localeCompare(a))
                    .map((year) => (
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
                          <div className="px-6 pb-8 pt-4 bg-muted/20">
                            <div className="space-y-8">
                              {Object.keys(historyData[year])
                                .sort((a, b) => parseInt(a) - parseInt(b))
                                .map((month) => (
                                  <div key={month}>
                                    {/* Month Header */}
                                    <h3 className="text-lg md:text-xl font-semibold text-primary mb-4 px-2">
                                      {getMonthName(month)}
                                    </h3>

                                    {/* Items List */}
                                    <div className="space-y-3">
                                      {historyData[year][month].map((item) => (
                                        <div
                                          key={item.id}
                                          className="bg-background rounded-lg border border-border p-5 hover:border-primary/50 hover:shadow-sm transition-all"
                                        >
                                          <div className="flex gap-4">
                                            {/* Logo */}
                                            {item.logo_url ? (
                                              <div className="w-16 h-16 flex-shrink-0 border rounded-md overflow-hidden bg-muted">
                                                <img 
                                                  src={item.logo_url} 
                                                  alt={item.client} 
                                                  className="w-full h-full object-contain"
                                                />
                                              </div>
                                            ) : (
                                              <div className="w-16 h-16 flex-shrink-0 border rounded-md bg-muted flex items-center justify-center text-muted-foreground">
                                                <ImageIcon className="w-8 h-8" />
                                              </div>
                                            )}

                                            {/* Content */}
                                            <div className="flex-1">
                                              {/* Item Header */}
                                              <div className="flex items-center gap-3 mb-2 flex-wrap">
                                                <span className="inline-flex items-center px-3 py-1 text-base md:text-lg font-medium bg-primary text-primary-foreground rounded">
                                                  {item.major_category}
                                                </span>
                                                {item.sub_category && (
                                                  <span className="inline-flex items-center px-3 py-1 text-sm md:text-base font-medium bg-muted text-foreground rounded">
                                                    {item.sub_category}
                                                  </span>
                                                )}
                                                <span className="text-lg md:text-xl font-medium text-foreground">
                                                  {item.client}
                                                </span>
                                                {item.participants > 0 && (
                                                  <span className="text-lg md:text-xl text-muted-foreground ml-auto">
                                                    {item.participants}명
                                                  </span>
                                                )}
                                              </div>
                                              
                                              {/* Item Content */}
                                              <p className="text-base md:text-lg text-muted-foreground leading-relaxed">
                                                {item.education_content}
                                              </p>
                                            </div>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>
                                ))}
                            </div>
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
