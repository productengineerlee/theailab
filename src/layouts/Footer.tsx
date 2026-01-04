import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-muted/50 border-t mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* 로고 및 슬로건 */}
          <div>
            <h3 className="text-xl font-bold mb-2">The AI Lab</h3>
            <p className="text-muted-foreground mb-4">
              인공지능 교육의 미래를 만듭니다
            </p>
          </div>

          {/* 회사 정보 */}
          <div className="text-sm space-y-1 text-muted-foreground">
            <p>
              <span className="font-semibold">법인상호명:</span> 더에이아이랩(주)
            </p>
            <p>
              <span className="font-semibold">대표이사:</span> 최영준
            </p>
            <p>
              <span className="font-semibold">주소:</span> 서울특별시 강남구
              영동대로 324, 804호
            </p>
            <p>
              <span className="font-semibold">E-mail:</span>{' '}
              <a
                href="mailto:contact@theailab.co"
                className="hover:text-primary transition-colors"
              >
                contact@theailab.co
              </a>
            </p>
            <p>
              <span className="font-semibold">Tel:</span> 02-2039-9355
            </p>
            <p>
              <span className="font-semibold">Fax:</span> 02-2039-9356
            </p>
            <p>
              <span className="font-semibold">통신판매신고번호:</span> 제
              2020-서울강남-02380
            </p>
            <p>
              <span className="font-semibold">사업자등록번호:</span> 439-87-00757
            </p>
          </div>
        </div>

        {/* Copyright 및 링크 */}
        <div className="mt-8 pt-8 border-t flex flex-col sm:flex-row justify-between items-center gap-4 text-sm text-muted-foreground">
          <p>Copyright(c) 2020. The AI Lab. All rights reserved</p>
          <div className="flex gap-4">
            <Link to="/admin" className="hover:text-primary transition-colors">
              ADMIN
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}



