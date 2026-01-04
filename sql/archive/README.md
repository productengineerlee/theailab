# 📁 Archive (보관된 SQL 파일)

## ℹ️ 이 폴더는?

이 폴더에는 **이전에 사용했던 개별 SQL 파일들**이 보관되어 있습니다.

## 🔄 통합 완료

모든 SQL 파일의 내용이 다음 파일로 통합되었습니다:
```
sql/00-complete-setup.sql
```

## 📂 보관된 파일 목록

### **마이그레이션 파일**
- `supabase-migration-about.sql` - About 테이블
- `supabase-migration-career.sql` - Career 테이블
- `supabase-migration-culture.sql` - Culture 테이블
- `supabase-migration-history-update.sql` - History 테이블 업데이트
- `supabase-migration-news-image.sql` - News 이미지 추가
- `supabase-migration-partner-update.sql` - Partner 테이블 업데이트
- `supabase-migration-product-image.sql` - Product 이미지 추가
- `supabase-migration-product-url.sql` - Product URL 추가

### **초기 설정 파일**
- `supabase-quick-setup.sql` - 빠른 전체 설정
- `supabase-schema.sql` - 데이터베이스 스키마
- `supabase-storage-setup.sql` - Storage 버킷 설정

### **수정 파일**
- `supabase-fix-about-rls.sql` - About RLS 정책 수정
- `supabase-fix-culture-rls.sql` - Culture RLS 정책 수정
- `supabase-storage-fix.sql` - Storage 권한 수정
- `supabase-update-culture-value.sql` - Culture 값 업데이트
- `supabase-update-work-method.sql` - Work Method 업데이트

### **샘플 데이터**
- `supabase-career-sample-data.sql` - Career 샘플 데이터
- `supabase-history-sample-data.sql` - History 샘플 데이터
- `supabase-partner-sample-data.sql` - Partner 샘플 데이터

## ⚠️ 사용 안 함

이 파일들은 **개별적으로 사용하지 마세요**. 

**대신 사용:**
```sql
sql/00-complete-setup.sql
```

## 🗑️ 삭제 가능?

이 파일들은 참고용으로 보관되어 있습니다:
- ✅ 필요시 삭제 가능
- ✅ 문제 발생 시 참고용으로 사용
- ✅ 개발 히스토리 확인용

---

**보관일**: 2026-01-04

