const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

async function run() {
  try {
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      console.error("Missing GEMINI_API_KEY");
      return;
    }

    // 1단계: 최신 데이터 확인
    const localInfoPath = path.join(process.cwd(), 'public/data/local-info.json');
    if (!fs.existsSync(localInfoPath)) {
      console.error("local-info.json does not exist");
      return;
    }
    const localInfoData = JSON.parse(fs.readFileSync(localInfoPath, 'utf8'));
    if (localInfoData.length === 0) {
      console.log("No data available to write a post");
      return;
    }
    const latestItem = localInfoData[localInfoData.length - 1];
    const latestName = latestItem.name || latestItem.title;

    const postsDirectory = path.join(process.cwd(), 'src/content/posts');
    if (!fs.existsSync(postsDirectory)) {
      fs.mkdirSync(postsDirectory, { recursive: true });
    }

    const fileNames = fs.readdirSync(postsDirectory);
    let isAlreadyWritten = false;

    for (const fileName of fileNames) {
      if (fileName.endsWith('.md')) {
        const fullPath = path.join(postsDirectory, fileName);
        const fileContents = fs.readFileSync(fullPath, 'utf8');
        const { data } = matter(fileContents);
        if (data.title === latestName || data.title === latestItem.title) {
          isAlreadyWritten = true;
          break;
        }
      }
    }

    if (isAlreadyWritten) {
      console.log("이미 작성된 글입니다");
      return;
    }

    // 2단계: Gemini AI로 블로그 글 생성
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`;
    const today = new Date().toISOString().split('T')[0];

    const prompt = `아래 공공서비스 정보를 바탕으로 블로그 글을 작성해줘.

정보: ${JSON.stringify(latestItem, null, 2)}

아래 형식으로 출력해줘. 반드시 이 형식만 출력하고 다른 텍스트는 없이:
---
title: (친근하고 흥미로운 제목)
date: ${today}
summary: (한 줄 요약)
category: 정보
tags: [태그1, 태그2, 태그3]
---

(본문: 800자 이상, 친근한 블로그 톤, 추천 이유 3가지 포함, 신청 방법 안내)

마지막 줄에 FILENAME: YYYY-MM-DD-keyword 형식으로 파일명도 출력해줘. 키워드는 영문으로.`;

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
    let resultText = geminiData.candidates[0].content.parts[0].text;

    // 마크다운 백틱 코드블록 제거 및 다듬기
    resultText = resultText.replace(/^```markdown\n/i, '').replace(/^```\n/i, '').replace(/\n```$/, '');

    // FILENAME 파싱
    const filenameRegex = /FILENAME:\s*([^\s\n\r]+)/i;
    const match = resultText.match(filenameRegex);
    if (!match) {
      throw new Error("Could not extract FILENAME from Gemini response");
    }

    let filename = match[1].trim();
    filename = filename.replace(/\.md$/i, '');

    const contentToSave = resultText.replace(filenameRegex, '').trim();

    // 3단계: 파일 저장
    const targetFilePath = path.join(postsDirectory, `${filename}.md`);
    fs.writeFileSync(targetFilePath, contentToSave, 'utf8');

    console.log(`블로그 글 생성 및 저장 완료: ${filename}.md`);
  } catch (error) {
    console.error("Error generating blog post:", error);
  }
}

run();
