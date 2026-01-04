import { useState, useEffect } from 'react';
import { supabase, type HistoryItem } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Pencil, Trash2, Save, X, Image as ImageIcon } from 'lucide-react';

// 중분류 옵션 매핑
const SUB_CATEGORY_OPTIONS: Record<string, string[]> = {
  'AICE': ['BASIC', 'ASSOCIATE', 'PROFESSIONAL'],
  'AI교육': ['생성형AI', '데이터분석', '바이브코딩', 'AI자동화'],
  '자격증': ['빅데이터분석기사', 'ADsP', 'SQLD', '경영정보시각화능력'],
};

export default function HistoryManage() {
  const [items, setItems] = useState<HistoryItem[]>([]);
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [formData, setFormData] = useState<Partial<HistoryItem>>({
    year_month: '',
    major_category: 'AICE',
    sub_category: '',
    logo_url: '',
    client: '',
    education_content: '',
    participants: 0,
  });
  const [uploadingLogo, setUploadingLogo] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  async function fetchItems() {
    const { data, error } = await supabase
      .from('history')
      .select('*')
      .order('year_month', { ascending: false });

    if (error) {
      console.error('Error fetching history:', error);
    } else {
      setItems(data || []);
    }
  }

  async function handleLogoUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      return;
    }

    // 파일 크기 검증 (5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      return;
    }

    setUploadingLogo(true);

    try {
      // 파일명 생성 (타임스탬프 + 원본 파일명)
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}.${fileExt}`;
      const filePath = `history-logos/${fileName}`;

      // Supabase Storage에 업로드
      const { error } = await supabase.storage
        .from('images')
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Storage error:', error);
        
        if (error.message.includes('Bucket not found')) {
          alert('이미지 저장소가 설정되지 않았습니다.\n\n해결방법:\n1. Supabase 대시보드 → Storage 메뉴\n2. "New Bucket" 클릭\n3. Name: images\n4. Public bucket 체크\n5. Create\n\n자세한 내용은 SUPABASE_SETUP.md 파일을 참고하세요.');
        } else if (error.message.includes('permission')) {
          alert('업로드 권한이 없습니다. Supabase Storage 정책을 확인하세요.');
        } else {
          alert(`업로드 오류: ${error.message}`);
        }
        return;
      }

      // 공개 URL 가져오기
      const { data: { publicUrl } } = supabase.storage
        .from('images')
        .getPublicUrl(filePath);

      setFormData({ ...formData, logo_url: publicUrl });
      alert('로고가 업로드되었습니다.');
    } catch (error: any) {
      console.error('Error uploading logo:', error);
      alert(`로고 업로드 중 오류가 발생했습니다.\n${error.message || error}`);
    } finally {
      setUploadingLogo(false);
    }
  }

  async function handleSave() {
    if (editingId) {
      // 수정
      const { error } = await supabase
        .from('history')
        .update(formData)
        .eq('id', editingId);

      if (error) {
        console.error('Error updating:', error);
        alert('수정 중 오류가 발생했습니다.');
      } else {
        setEditingId(null);
        fetchItems();
      }
    } else {
      // 추가
      const { error } = await supabase
        .from('history')
        .insert([formData as HistoryItem]);

      if (error) {
        console.error('Error inserting:', error);
        alert('추가 중 오류가 발생했습니다.');
      } else {
        setIsAdding(false);
        fetchItems();
      }
    }

    setFormData({ 
      year_month: '', 
      major_category: 'AICE', 
      sub_category: '', 
      logo_url: '',
      client: '', 
      education_content: '', 
      participants: 0 
    });
  }

  async function handleDelete(id: number) {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    const { error } = await supabase.from('history').delete().eq('id', id);

    if (error) {
      console.error('Error deleting:', error);
    } else {
      fetchItems();
    }
  }

  function handleEdit(item: HistoryItem) {
    setEditingId(item.id!);
    setFormData({
      year_month: item.year_month,
      major_category: item.major_category,
      sub_category: item.sub_category || '',
      logo_url: item.logo_url || '',
      client: item.client,
      education_content: item.education_content,
      participants: item.participants,
    });
    setIsAdding(false);
  }

  function handleCancel() {
    setIsAdding(false);
    setEditingId(null);
    setFormData({ 
      year_month: '', 
      major_category: 'AICE', 
      sub_category: '', 
      logo_url: '',
      client: '', 
      education_content: '', 
      participants: 0 
    });
  }

  // 대분류 변경 시 중분류 초기화
  function handleMajorCategoryChange(newCategory: 'AICE' | 'AI교육' | '자격증') {
    setFormData({ 
      ...formData, 
      major_category: newCategory,
      sub_category: '' // 중분류 초기화
    });
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">History 관리</h1>
          <p className="text-muted-foreground">교육 이력을 관리합니다</p>
        </div>
        {!isAdding && !editingId && (
          <Button onClick={() => setIsAdding(true)}>
            <Plus className="mr-2 h-4 w-4" />
            새 항목 추가
          </Button>
        )}
      </div>

      {/* 추가/수정 폼 */}
      {(isAdding || editingId) && (
        <Card>
          <CardHeader>
            <CardTitle>{editingId ? '항목 수정' : '새 항목 추가'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="year_month">년월 (YYYY-MM)</Label>
                <Input
                  id="year_month"
                  type="month"
                  value={formData.year_month}
                  onChange={(e) =>
                    setFormData({ ...formData, year_month: e.target.value })
                  }
                  placeholder="2025-01"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="major_category">대분류</Label>
                <select
                  id="major_category"
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={formData.major_category}
                  onChange={(e) => handleMajorCategoryChange(e.target.value as 'AICE' | 'AI교육' | '자격증')}
                >
                  <option value="AICE">AICE</option>
                  <option value="AI교육">AI교육</option>
                  <option value="자격증">자격증</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="sub_category">중분류</Label>
                <select
                  id="sub_category"
                  className="w-full h-10 px-3 py-2 border border-input bg-background rounded-md text-sm"
                  value={formData.sub_category || ''}
                  onChange={(e) =>
                    setFormData({ ...formData, sub_category: e.target.value })
                  }
                >
                  <option value="">선택하세요</option>
                  {formData.major_category && SUB_CATEGORY_OPTIONS[formData.major_category]?.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
                {formData.major_category && (
                  <p className="text-xs text-muted-foreground">
                    대분류: {formData.major_category} - 
                    옵션 {SUB_CATEGORY_OPTIONS[formData.major_category]?.length || 0}개
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="logo">로고</Label>
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Input
                      id="logo"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      disabled={uploadingLogo}
                      className="cursor-pointer"
                    />
                  </div>
                  {formData.logo_url && (
                    <div className="w-10 h-10 border rounded-md overflow-hidden bg-muted flex items-center justify-center">
                      <img 
                        src={formData.logo_url} 
                        alt="로고 미리보기" 
                        className="w-full h-full object-contain"
                      />
                    </div>
                  )}
                  {!formData.logo_url && (
                    <div className="w-10 h-10 border rounded-md overflow-hidden bg-muted flex items-center justify-center text-muted-foreground">
                      <ImageIcon className="w-5 h-5" />
                    </div>
                  )}
                </div>
                {uploadingLogo && (
                  <p className="text-xs text-muted-foreground">업로드 중...</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="client">거래처</Label>
                <Input
                  id="client"
                  value={formData.client}
                  onChange={(e) =>
                    setFormData({ ...formData, client: e.target.value })
                  }
                  placeholder="협성고등학교"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="education_content">교육내용</Label>
                <Input
                  id="education_content"
                  value={formData.education_content}
                  onChange={(e) =>
                    setFormData({ ...formData, education_content: e.target.value })
                  }
                  placeholder="aice basic"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="participants">인원</Label>
                <Input
                  id="participants"
                  type="number"
                  value={formData.participants}
                  onChange={(e) =>
                    setFormData({ ...formData, participants: parseInt(e.target.value) || 0 })
                  }
                  placeholder="30"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSave}>
                <Save className="mr-2 h-4 w-4" />
                저장
              </Button>
              <Button variant="outline" onClick={handleCancel}>
                <X className="mr-2 h-4 w-4" />
                취소
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* 항목 목록 */}
      <div className="space-y-4">
        {items.map((item) => (
          <Card key={item.id}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex gap-4 flex-1">
                  {/* 로고 */}
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
                  
                  {/* 정보 */}
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-3 flex-wrap">
                      <span className="font-semibold text-lg">{item.year_month}</span>
                      <span className="text-sm px-2 py-1 bg-primary/10 text-primary rounded font-medium">
                        {item.major_category}
                      </span>
                      {item.sub_category && (
                        <span className="text-sm px-2 py-1 bg-muted text-foreground rounded">
                          {item.sub_category}
                        </span>
                      )}
                      <span className="text-sm text-muted-foreground">
                        {item.participants}명
                      </span>
                    </div>
                    <p className="text-base font-medium">{item.client}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.education_content}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(item)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="destructive"
                    onClick={() => handleDelete(item.id!)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {items.length === 0 && !isAdding && (
        <Card>
          <CardContent className="p-12 text-center">
            <p className="text-muted-foreground">
              아직 등록된 항목이 없습니다.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}

