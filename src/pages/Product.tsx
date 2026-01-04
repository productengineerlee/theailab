import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import SEO from '@/components/SEO';
import { supabase, type ProductItem } from '@/lib/supabase';
import { useTranslation } from 'react-i18next';
import { ExternalLink } from 'lucide-react';

export default function Product() {
  const { t } = useTranslation('product');
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('product')
      .select('*')
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching products:', error);
      setError(t('error'));
      setLoading(false);
      return;
    }

    setProducts(data || []);
    setLoading(false);
  };

  return (
    <>
      <SEO
        title={t('seo.title')}
        description={t('seo.description')}
        keywords={t('seo.keywords')}
        path="/product"
      />
      <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-[#1e1b4b] via-[#5b21b6] to-[#a855f7] py-20 md:py-32 animate-fade-in">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white animate-slide-up">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl text-white/90 animate-slide-up animate-delay-200">
              {t('hero.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            {loading && (
              <div className="flex justify-center items-center h-48">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
              </div>
            )}

            {error && (
              <div className="text-center text-destructive p-8">{error}</div>
            )}

            {!loading && !error && products.length === 0 && (
              <div className="text-center text-muted-foreground p-8">
                {t('noProducts')}
              </div>
            )}

            {!loading && !error && products.length > 0 && (
              <div className="max-w-4xl mx-auto space-y-4">
                {products.map((product) => (
                  <Card
                    key={product.id}
                    className="hover:shadow-lg transition-shadow overflow-hidden"
                  >
                    <div className="flex flex-col md:flex-row gap-6 p-6">
                      {/* 좌측: 이미지 */}
                      {product.image_url && (
                        <div className="flex-shrink-0 md:w-48">
                          <div className="w-full h-32 md:h-40 bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                            <img
                              src={product.image_url}
                              alt={product.title}
                              className="w-full h-full object-contain p-2"
                            />
                          </div>
                        </div>
                      )}

                      {/* 우측: 텍스트 */}
                      <div className="flex-1 flex flex-col justify-between space-y-4">
                        <div>
                          <h2 className="text-xl md:text-2xl font-bold text-primary mb-2">
                            {product.title}
                          </h2>
                          <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                            {product.description}
                          </p>
                        </div>
                        {product.url && (
                          <div className="flex">
                            <Button
                              variant="default"
                              size="sm"
                              asChild
                            >
                              <a
                                href={product.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2"
                              >
                                {t('productList.viewMore')}
                                <ExternalLink className="h-4 w-4" />
                              </a>
                            </Button>
                          </div>
                        )}
                      </div>
                    </div>
                  </Card>
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
