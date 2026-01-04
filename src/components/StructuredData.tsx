import { Helmet } from 'react-helmet-async';

interface OrganizationSchemaProps {
  type?: 'Organization' | 'EducationalOrganization';
}

export function OrganizationSchema({ type = 'EducationalOrganization' }: OrganizationSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': type,
    name: '더에이아이랩',
    alternateName: 'The AI Lab',
    url: 'https://theailab.co',
    logo: 'https://theailab.co/logo.png',
    description:
      '더에이아이랩은 누구나 쉽게 배우고, 일상과 업무에서 실질적으로 활용할 수 있도록 보편적 인공지능 시대를 지향합니다.',
    address: {
      '@type': 'PostalAddress',
      streetAddress: '영동대로 324, 804호',
      addressLocality: '강남구',
      addressRegion: '서울특별시',
      addressCountry: 'KR',
    },
    contactPoint: {
      '@type': 'ContactPoint',
      telephone: '+82-2-2039-9355',
      contactType: 'customer service',
      email: 'contact@theailab.co',
      availableLanguage: ['ko', 'en'],
    },
    sameAs: [],
    foundingDate: '2020',
    founder: {
      '@type': 'Person',
      name: '최영준',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}

interface BreadcrumbSchemaProps {
  items: Array<{ name: string; url: string }>;
}

export function BreadcrumbSchema({ items }: BreadcrumbSchemaProps) {
  const schema = {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: `https://theailab.co${item.url}`,
    })),
  };

  return (
    <Helmet>
      <script type="application/ld+json">{JSON.stringify(schema)}</script>
    </Helmet>
  );
}



