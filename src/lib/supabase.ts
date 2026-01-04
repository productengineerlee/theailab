import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 데이터베이스 타입 정의
export interface HistoryItem {
  id?: number;
  year_month: string; // YYYY-MM 형식
  major_category: 'AICE' | 'AI교육' | '자격증'; // 대분류
  sub_category?: string; // 중분류
  logo_url?: string; // 거래처 로고 이미지 URL
  client: string; // 거래처
  education_content: string; // 교육내용
  participants: number; // 인원
  created_at?: string;
  updated_at?: string;
}

export interface ProductItem {
  id?: number;
  title: string;
  description: string;
  image_url?: string; // 제품 이미지 URL
  url?: string; // 제품 링크 URL
  created_at?: string;
  updated_at?: string;
}

export interface PartnerItem {
  id?: number;
  name: string;
  logo_url?: string;
  url?: string;
  description?: string;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CareerItem {
  id?: number;
  title: string;
  description: string;
  type: 'benefit' | 'process' | 'job_posting';
  order_index: number;
  created_at?: string;
  updated_at?: string;
}

export interface NewsItem {
  id?: number;
  date: string; // YYYY.MM 형식
  title: string;
  content: string;
  image_url?: string; // 썸네일 이미지 URL
  link?: string; // 원문 기사 링크
  created_at?: string;
  updated_at?: string;
}

export interface AboutItem {
  id?: number;
  section: 'hero' | 'mission' | 'vision';
  title_en?: string;
  title_ko?: string;
  subtitle?: string;
  content?: string;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

export interface CultureItem {
  id?: number;
  section: 'hero' | 'principle' | 'work_method' | 'culture_value';
  title?: string;
  subtitle?: string;
  content?: string;
  order_index?: number;
  created_at?: string;
  updated_at?: string;
}

