# JEJUNU BACL — Lab Website

제주대학교 약학대학 **생체이용률조절연구실 (Bioavailability Control Laboratory, BACL)** 홈페이지.
GitHub Pages용 정적 사이트입니다. 빌드 도구 없이 그대로 배포됩니다.

## 배포 방법 (GitHub Pages)

1. GitHub에서 새 저장소 생성 (예: `jejunu-bacl/lab-website`)
2. 이 폴더의 **모든 파일**을 저장소 루트에 업로드 (또는 `git push`)
3. 저장소 **Settings → Pages → Source: `Deploy from a branch`**, Branch: `main` / `/ (root)` 저장
4. 1~2분 뒤 `https://<계정>.github.io/lab-website/` 에서 공개됨

## 폴더 구조

```
index.html          홈 (히어로·통계·연구방향·하이라이트·최신소식)
professor.html      교수 소개 + 현재 대형과제
research.html       연구 3축 + GA 하이라이트
publications.html   논문 73편 (연도 필터 + DOI 링크)
achievements.html   특허·연구과제 수주내역·학술발표
members.html        구성원 / Alumni
news.html           소식
assets/css|js       스타일·스크립트
data/*.json         ★ 내용은 전부 여기서 관리 (HTML 수정 불필요)
images/ga/*.jpg     graphical abstract 이미지
```

## 내용 갱신 방법 — `data/` 안의 JSON만 고치면 됩니다

| 파일 | 내용 |
|---|---|
| `publications.json` | 논문 목록 `{n, cite, doi, year}` |
| `achievements.json` | 특허(등록/출원)·학술발표·연구과제 |
| `members.json` | 현재 구성원 / Alumni |
| `news.json` | 소식 `{date, tag, title, body}` |
| `highlights.json` | GA 하이라이트 (이미지·DOI·출처) |
| `site.json` | 연구실 기본 정보 |

새 논문이 나오면 `publications.json` 맨 앞에 한 줄 추가하면 끝입니다.

## 저작권 유의
`images/ga/`의 graphical abstract는 각 저널(Elsevier·Springer) 저작물입니다.
카드마다 DOI와 `© Journal` 출처를 함께 표기하고 있으며, 저자 재사용 범위 내에서만 사용하십시오.
