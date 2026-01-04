import { Helmet } from 'react-helmet-async';

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  ogImage?: string;
  path?: string;
}

export default function SEO({
  title = '더에이아이랩 - AI for Everyone, for Everything',
  description = '더에이아이랩은 누구나 쉽게 배우고, 일상과 업무에서 실질적으로 활용할 수 있도록 보편적 인공지능 시대를 지향합니다.',
  keywords = 'AI, 인공지능, AI교육, AICE, 생성형AI, 더에이아이랩, AI for Everyone',
  ogImage = '/og-image.jpg',
  path = '/',
}: SEOProps) {
  const siteUrl = 'https://theailab.co';
  const fullUrl = `${siteUrl}${path}`;

  return (
    <Helmet>
      {/* 기본 메타 태그 */}
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <link rel="canonical" href={fullUrl} />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={fullUrl} />
      <meta property="og:image" content={`${siteUrl}${ogImage}`} />
      <meta property="og:site_name" content="더에이아이랩" />
      <meta property="og:locale" content="ko_KR" />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={`${siteUrl}${ogImage}`} />

      {/* 기타 메타 태그 */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />
      <meta name="robots" content="index, follow" />
      <meta name="author" content="더에이아이랩" />
      <meta httpEquiv="Content-Type" content="text/html; charset=utf-8" />
      <meta name="language" content="Korean" />
    </Helmet>
  );
}



