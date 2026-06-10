import Link from 'next/link';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 font-sans pb-16">
      <header className="bg-gradient-to-b from-amber-100 to-[#faf8f5] px-4 text-center">
        <nav className="max-w-6xl mx-auto flex justify-between items-center py-4 border-b border-amber-200/40">
          <Link href="/" className="text-xl font-bold text-stone-900 flex items-center gap-1">
            🏡 성남나우
          </Link>
          <div className="flex gap-4">
            <Link href="/" className="text-sm font-semibold text-stone-700 hover:text-amber-700 transition-colors">
              홈
            </Link>
            <Link href="/blog" className="text-sm font-semibold text-stone-700 hover:text-amber-700 transition-colors">
              블로그
            </Link>
            <Link href="/about" className="text-sm font-semibold text-stone-700 hover:text-amber-700 transition-colors">
              소개
            </Link>
          </div>
        </nav>
      </header>

      <main className="max-w-3xl mx-auto px-4 pt-12">
        <article className="bg-white rounded-2xl p-6 sm:p-10 shadow-sm border border-stone-100">
          <h1 className="text-3xl font-extrabold text-stone-900 mb-6 border-b border-stone-100 pb-4">
            서비스 소개
          </h1>
          
          <div className="space-y-6 text-stone-600 leading-relaxed text-sm sm:text-base">
            <section>
              <h2 className="text-xl font-bold text-stone-900 mb-2">🎯 사이트 운영 목적</h2>
              <p>
                성남나우는 성남시민 및 지역 방문객분들을 위해 여러 공공기관에 흩어져 있는 다양한 혜택, 행사, 그리고 지원금 소식을 한곳에 모아 편리하게 읽을 수 있도록 돕는 비영리 정보 제공 포털입니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-stone-900 mb-2">📊 데이터 출처</h2>
              <p>
                본 사이트에서 제공하는 모든 정보는 대한민국 공공데이터포털(data.go.kr) 등 공공기관의 오픈 API를 통해 자동으로 수집 및 필터링된 신뢰할 수 있는 데이터에 기반하고 있습니다.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-bold text-stone-900 mb-2">🤖 콘텐츠 생성 방식 (AI 활용 안내)</h2>
              <p>
                더 유용하고 가독성 높은 정보를 신속히 제공하기 위해, 수집된 공공 정보를 바탕으로 구글의 인공지능인 Gemini AI를 활용하여 블로그 형식의 글을 자동으로 정제 및 작성하고 있습니다. AI가 작성한 포스트는 최종적으로 시민분들의 눈높이에 맞춰 친근한 톤앤매너로 구성됩니다.
              </p>
              <p className="mt-2 text-xs text-stone-400">
                * 유의사항: 인공지능 기술의 특성이나 공공데이터 원본의 실시간 업데이트 지연에 따라 일부 최신 변경 사항이 즉시 반영되지 못할 수 있으므로, 중요한 신청 전에는 반드시 본문에 첨부된 공공 웹사이트 링크를 통해 최종 상세 조건을 교차 검증해 주시기 바랍니다.
              </p>
            </section>
          </div>
        </article>
      </main>
    </div>
  );
}
