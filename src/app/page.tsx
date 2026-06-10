import Link from "next/link";
import localInfoDataRaw from "../../public/data/local-info.json";

interface InfoItem {
  id: string | number;
  title: string;
  category: "행사" | "혜택" | string;
  startDate: string;
  endDate: string;
  location: string;
  target: string;
  summary: string;
  link: string;
}

const localInfoData = localInfoDataRaw as InfoItem[];

export default function Home() {
  const events = localInfoData.filter((item) => item.category === "행사");
  const benefits = localInfoData.filter((item) => item.category === "혜택");

  // Format date helper: "2026-04-05" -> "4월 5일"
  const formatDate = (dateStr: string) => {
    try {
      const [, month, day] = dateStr.split("-");
      return `${parseInt(month, 10)}월 ${parseInt(day, 10)}일`;
    } catch {
      return dateStr;
    }
  };

  const displayDateRange = (start: string, end: string) => {
    if (start === end) {
      return formatDate(start);
    }
    return `${formatDate(start)} ~ ${formatDate(end)}`;
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 font-sans pb-16">
      {/* 상단 헤더 / 히어로 영역 */}
      <header className="bg-gradient-to-b from-amber-100 to-[#faf8f5] pb-8 px-4 text-center">
        {/* 네비게이션 바 */}
        <nav className="max-w-6xl mx-auto flex justify-between items-center py-4 mb-8 border-b border-amber-200/40">
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
          </div>
        </nav>

        <div className="max-w-4xl mx-auto">
          <span className="inline-block bg-amber-500/10 text-amber-700 font-bold text-xs px-3 py-1 rounded-full mb-3">
            📍 우리 동네 실시간 소식
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold text-stone-900 tracking-tight mb-3">
            성남시 생활 정보 포털
          </h1>
          <p className="text-stone-600 text-sm sm:text-base max-w-lg mx-auto">
            우리 동네 행사, 축제 소식부터 정부 및 성남시의 알찬 지원금 혜택 정보까지 매일 아침 전해드립니다.
          </p>
        </div>
      </header>

      {/* 메인 콘텐츠 영역 */}
      <main className="max-w-6xl mx-auto px-4 mt-6 grid grid-cols-1 gap-12">
        {/* 1. 이번 달 행사/축제 목록 */}
        <section>
          <div className="flex items-center gap-2 mb-6 border-b border-amber-200/60 pb-3">
            <span className="text-2xl">🎉</span>
            <h2 className="text-2xl font-bold text-stone-900">이번 달 행사 / 축제</h2>
            <span className="bg-amber-100 text-amber-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {events.length}건
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-stone-100 hover:shadow-md hover:border-amber-300/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6">
                  {/* 카테고리 태그 */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-amber-100 text-amber-800 text-xs font-bold px-2.5 py-1 rounded-md">
                      {item.category}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">
                      📅 {displayDateRange(item.startDate, item.endDate)}
                    </span>
                  </div>

                  {/* 제목 */}
                  <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-amber-700 transition-colors">
                    {item.title}
                  </h3>

                  {/* 요약 */}
                  <p className="text-stone-600 text-sm leading-relaxed mb-4 line-clamp-3">
                    {item.summary}
                  </p>

                  {/* 장소 & 대상 */}
                  <div className="space-y-1.5 text-xs text-stone-500 border-t border-stone-50 pt-3">
                    <div className="flex items-start gap-1">
                      <span className="text-amber-500 font-bold shrink-0">📍 장소:</span>
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="text-amber-500 font-bold shrink-0">👥 대상:</span>
                      <span>{item.target}</span>
                    </div>
                  </div>
                </div>

                {/* 하단 링크 버튼 */}
                <div className="px-6 pb-6 pt-2">
                  <Link
                    href="/blog"
                    className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm hover:shadow transition-all"
                  >
                    자세히 보기 &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* 2. 지원금/혜택 정보 목록 */}
        <section>
          <div className="flex items-center gap-2 mb-6 border-b border-emerald-200/60 pb-3">
            <span className="text-2xl">💰</span>
            <h2 className="text-2xl font-bold text-stone-900">꿀정보 지원금 / 혜택</h2>
            <span className="bg-emerald-100 text-emerald-800 text-xs font-semibold px-2.5 py-0.5 rounded-full">
              {benefits.length}건
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {benefits.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm border border-stone-100 hover:shadow-md hover:border-emerald-300/50 transition-all duration-300 flex flex-col justify-between overflow-hidden group"
              >
                <div className="p-6">
                  {/* 카테고리 태그 */}
                  <div className="flex justify-between items-start mb-4">
                    <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded-md">
                      {item.category}
                    </span>
                    <span className="text-xs text-stone-400 font-medium">
                      신청 기간 내 상시
                    </span>
                  </div>

                  {/* 제목 */}
                  <h3 className="text-lg font-bold text-stone-900 mb-2 group-hover:text-emerald-700 transition-colors">
                    {item.title}
                  </h3>

                  {/* 요약 */}
                  <p className="text-stone-600 text-sm leading-relaxed mb-4">
                    {item.summary}
                  </p>

                  {/* 장소 & 대상 */}
                  <div className="space-y-1.5 text-xs text-stone-500 border-t border-stone-50 pt-3">
                    <div className="flex items-start gap-1">
                      <span className="text-emerald-600 font-bold shrink-0">📍 접수처:</span>
                      <span>{item.location}</span>
                    </div>
                    <div className="flex items-start gap-1">
                      <span className="text-emerald-600 font-bold shrink-0">👥 지원 대상:</span>
                      <span>{item.target}</span>
                    </div>
                  </div>
                </div>

                {/* 하단 링크 버튼 */}
                <div className="px-6 pb-6 pt-2">
                  <Link
                    href="/blog"
                    className="block text-center w-full bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold py-2.5 rounded-xl shadow-sm hover:shadow transition-all"
                  >
                    지원금 신청하러 가기 &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* 하단 푸터 */}
      <footer className="max-w-6xl mx-auto px-4 mt-20 pt-8 border-t border-stone-200 text-center text-xs text-stone-400 space-y-2">
        <p>출처: 공공데이터포털 (data.go.kr) 등 공공기관 오픈 API</p>
        <p>본 사이트는 비영리 정보 제공 목적으로 공공데이터를 수집하여 제공하고 있습니다.</p>
        <p className="text-stone-300 font-medium">마지막 업데이트: 2026년 6월 8일</p>
      </footer>
    </div>
  );
}
