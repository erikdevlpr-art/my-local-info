import Link from "next/link";
import localInfoDataRaw from "../../../../public/data/local-info.json";

interface InfoItem {
  id: string;
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

// Cloudflare Pages 정적 배포(export)를 위해 모든 상세페이지 경로를 미리 등록해 둡니다.
export function generateStaticParams() {
  return localInfoData.map((item) => ({
    id: item.id,
  }));
}

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function InfoDetailPage({ params }: PageProps) {
  const { id } = await params;
  const item = localInfoData.find((info) => info.id === id);

  if (!item) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#faf8f5] text-stone-800 p-4">
        <h1 className="text-2xl font-bold mb-4">요청하신 정보를 찾을 수 없습니다.</h1>
        <Link
          href="/"
          className="bg-amber-600 hover:bg-amber-700 text-white font-bold py-2 px-6 rounded-xl transition-colors"
        >
          홈으로 돌아가기
        </Link>
      </div>
    );
  }

  // 날짜 형식 예쁘게 변경: "2026-04-05" -> "4월 5일"
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

  const isEvent = item.category === "행사";

  return (
    <div className="min-h-screen bg-[#faf8f5] text-stone-800 font-sans py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-3xl shadow-sm border border-stone-200/60 overflow-hidden">
        {/* 상단 컬러 띠 */}
        <div className={`h-3 ${isEvent ? "bg-amber-400" : "bg-emerald-400"}`} />

        <div className="p-8 sm:p-10">
          {/* 뒤로가기 버튼 */}
          <Link
            href="/"
            className="inline-flex items-center gap-1 text-sm text-stone-400 hover:text-stone-600 transition-colors mb-6 group"
          >
            <span className="group-hover:-translate-x-1 transition-transform">&larr;</span> 목록으로 돌아가기
          </Link>

          {/* 카테고리 태그 */}
          <div className="mb-4">
            <span
              className={`inline-block text-xs font-bold px-3 py-1 rounded-md ${
                isEvent ? "bg-amber-100 text-amber-800" : "bg-emerald-100 text-emerald-800"
              }`}
            >
              {item.category}
            </span>
          </div>

          {/* 큰 제목 */}
          <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 tracking-tight mb-8">
            {item.title}
          </h1>

          {/* 주요 정보 요약 박스 */}
          <div className="bg-[#faf8f5] rounded-2xl p-6 border border-stone-100 space-y-4 mb-8">
            <h2 className="text-sm font-bold text-stone-900 border-b border-stone-200/60 pb-2">
              📌 핵심 요약 정보
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
              <div className="flex flex-col gap-1">
                <span className="text-xs text-stone-400 font-medium">기간 / 일정</span>
                <span className="font-semibold text-stone-700">
                  {isEvent ? displayDateRange(item.startDate, item.endDate) : "신청 기간 내 상시"}
                </span>
              </div>
              <div className="flex flex-col gap-1">
                <span className="text-xs text-stone-400 font-medium">장소 / 접수처</span>
                <span className="font-semibold text-stone-700">{item.location}</span>
              </div>
              <div className="flex flex-col gap-1 sm:col-span-2">
                <span className="text-xs text-stone-400 font-medium">지원 대상 / 참여 대상</span>
                <span className="font-semibold text-stone-700">{item.target}</span>
              </div>
            </div>
          </div>

          {/* 상세 설명 전문 */}
          <div className="space-y-4 text-stone-600 leading-relaxed text-sm sm:text-base mb-10">
            <h2 className="text-lg font-bold text-stone-900">상세 설명</h2>
            <p className="whitespace-pre-line">{item.summary}</p>
          </div>

          {/* 버튼 영역 */}
          <div className="flex flex-col sm:flex-row gap-3 pt-6 border-t border-stone-100">
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={`flex-1 text-center font-bold py-3.5 px-6 rounded-2xl text-white transition-colors shadow-sm ${
                isEvent
                  ? "bg-amber-600 hover:bg-amber-700 shadow-amber-200"
                  : "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-200"
              }`}
            >
              원본 공식 사이트 바로가기 &rarr;
            </a>
            <Link
              href="/"
              className="text-center font-bold py-3.5 px-6 rounded-2xl bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors border border-stone-200/60"
            >
              목록으로
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
