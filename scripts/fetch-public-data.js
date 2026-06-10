const fs = require('fs');
const path = require('path');

async function run() {
  try {
    const PUBLIC_DATA_API_KEY = process.env.PUBLIC_DATA_API_KEY;
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;

    if (!PUBLIC_DATA_API_KEY || !GEMINI_API_KEY) {
      console.error("Missing API Keys");
      return;
    }

    // 1단계: 공공데이터 API 호출
    const url = `https://api.odcloud.kr/api/gov24/v3/serviceList?page=1&perPage=20&returnType=JSON&serviceKey=${encodeURIComponent(PUBLIC_DATA_API_KEY)}`;
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`Failed to fetch public data: ${response.statusText}`);
    }
    const data = await response.json();
    const items = data.data || [];

    // 필터링 적용
    let filtered = items.filter(item => {
      const matchText = (item.서비스명 || '') + (item.서비스목적요약 || '') + (item.지원대상 || '') + (item.소관기관명 || '');
      return matchText.includes('성남');
    });

    if (filtered.length === 0) {
      filtered = items.filter(item => {
        const matchText = (item.서비스명 || '') + (item.서비스목적요약 || '') + (item.지원대상 || '') + (item.소관기관명 || '');
        return matchText.includes('경기');
      });
    }

    if (filtered.length === 0) {
      filtered = items;
    }

    // 2단계: 기존 데이터와 비교
    const localInfoPath = path.join(process.cwd(), 'public/data/local-info.json');
    let existingData = [];
    if (fs.existsSync(localInfoPath)) {
      const content = fs.readFileSync(localInfoPath, 'utf8');
      existingData = JSON.parse(content);
    }

    const newItems = filtered.filter(item => {
      const serviceName = item.서비스명;
      return !existingData.some(existing => existing.name === serviceName || existing.title === serviceName);
    });

    if (newItems.length === 0) {
      console.log("새로운 데이터가 없습니다");
      return;
    }

    const targetItem = newItems[0];

    // 3단계: Gemini AI로 새 항목 1개만 가공
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const prompt = `아래 공공데이터 1건을 분석해서 JSON 객체로 변환해줘. 형식:
{id: 숫자, name: 서비스명, category: '행사' 또는 '혜택', startDate: 'YYYY-MM-DD', endDate: 'YYYY-MM-DD', location: 장소 또는 기관명, target: 지원대상, summary: 한줄요약, link: 상세URL}
category는 내용을 보고 행사/축제면 '행사', 지원금/서비스면 '혜택'으로 판단해.
startDate가 없으면 오늘 날짜, endDate가 없으면 '상시'로 넣어.
반드시 JSON 객체만 출력해. 다른 텍스트 없이.

공공데이터:
${JSON.stringify(targetItem, null, 2)}`;

    const geminiResponse = await fetch(geminiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ]
      })
    });

    if (!geminiResponse.ok) {
      throw new Error(`Gemini API failed: ${geminiResponse.statusText}`);
    }

    const geminiData = await geminiResponse.json();
    const resultText = geminiData.candidates[0].content.parts[0].text;

    const jsonMatch = resultText.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error("Could not extract JSON from Gemini response");
    }
    const processedItem = JSON.parse(jsonMatch[0]);

    // 기존 템플릿(src/app/page.tsx)과의 정합성을 위해 title 필드도 동기화합니다.
    processedItem.title = processedItem.name;

    // 4단계: 기존 데이터에 추가
    existingData.push(processedItem);
    fs.writeFileSync(localInfoPath, JSON.stringify(existingData, null, 2), 'utf8');

    console.log("새로운 데이터를 성공적으로 추가했습니다.");
  } catch (error) {
    console.error("Error fetching or processing data:", error);
  }
}

run();
