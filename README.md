<div align="center">

# 🎬 Commit Story

**Git geçmişinizi interaktif bir hikayeye dönüştürün.**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-15-black.svg)](https://nextjs.org/)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-brightgreen.svg)](http://makeapullrequest.com)

[Demo](https://commitstory.dev) · [Docs](https://commitstory.dev/docs) · [Report Bug](https://github.com/scuton/commit-story/issues) · [Request Feature](https://github.com/scuton/commit-story/issues)

<!-- TODO: Add demo GIF here -->
<!-- ![Commit Story Demo](./public/demo.gif) -->

</div>

---

## ✨ Nedir?

Commit Story, herhangi bir GitHub reposunun commit geçmişini interaktif, görsel bir hikaye olarak sunar. Projenizin evrimini görselleştirin, katkıda bulunanların yolculuğunu anlayın ve başarı noktalarını kutlayın.

## 🚀 Özellikler

- **📖 İnteraktif Zaman Çizelgesi** — Commit'ler kronolojik bir hikaye olarak görselleştirilir
- **👥 Katkıda Bulunanlar Haritası** — Kim ne zaman ne kadar katkı yaptı, görsel olarak
- **📊 Proje İstatistikleri** — Satır değişimleri, dosya hareketleri, en aktif dönemler
- **🎨 Embeddable Widget** — README'nize ekleyebileceğiniz SVG/iframe badge'i
- **🔀 Branch Hikayesi** — Branch'ler arası ilişkileri görsel ağaç olarak gösterir
- **🏆 Milestone Tespiti** — Büyük release'ler, refactor'lar ve dönüm noktaları otomatik tespit
- **🌙 Dark/Light Mode** — Otomatik tema desteği
- **🔗 Paylaşılabilir URL** — Her proje için unique, paylaşılabilir hikaye sayfası

## 📦 Kurulum

```bash
# Klonla
git clone https://github.com/scuton/commit-story.git
cd commit-story

# Bağımlılıkları yükle
npm install

# Environment değişkenlerini ayarla
cp .env.example .env.local
# GITHUB_TOKEN değerini ekle

# Geliştirme sunucusunu başlat
npm run dev
```

## 🛠️ Kullanım

### Web Arayüzü

```
http://localhost:3000
```

Herhangi bir GitHub repo URL'si girin ve hikayeyi görün.

### API

```bash
# Repo hikayesini getir
GET /api/story/:owner/:repo

# Embeddable SVG badge
GET /api/badge/:owner/:repo
```

### README Badge

```markdown
[![Commit Story](https://commitstory.dev/api/badge/your-username/your-repo)](https://commitstory.dev/story/your-username/your-repo)
```

## 🏗️ Teknoloji Stack

| Teknoloji | Kullanım |
|-----------|----------|
| **Next.js 15** | Full-stack framework |
| **TypeScript** | Type safety |
| **D3.js** | Veri görselleştirme |
| **GitHub API (Octokit)** | Repo verisi |
| **Tailwind CSS** | Styling |
| **Vercel** | Deployment |

## 📁 Proje Yapısı

```
commit-story/
├── src/
│   ├── app/              # Next.js App Router
│   ├── components/       # React bileşenleri
│   │   ├── Timeline.tsx  # Ana zaman çizelgesi
│   │   ├── StoryCard.tsx # Commit hikaye kartı
│   │   ├── Contributors.tsx
│   │   └── Badge.tsx     # Embeddable badge
│   ├── lib/
│   │   ├── github.ts     # GitHub API istemcisi
│   │   ├── analyzer.ts   # Commit analiz motoru
│   │   └── story.ts      # Hikaye oluşturucu
│   └── api/              # API route'ları
├── public/
├── .env.example
├── Dockerfile
├── docker-compose.yml
└── package.json
```

## 🐳 Docker ile Çalıştırma

```bash
docker compose up -d
```

## 🤝 Katkıda Bulunma

Katkılarınızı bekliyoruz! Lütfen [CONTRIBUTING.md](CONTRIBUTING.md) dosyasını okuyun.

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Commit yapın (`git commit -m 'feat: add amazing feature'`)
4. Push yapın (`git push origin feature/amazing-feature`)
5. Pull Request açın

## 📄 Lisans

MIT License — detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 🙏 Teşekkürler

[Scuton Technology](https://scuton.com) tarafından ❤️ ile geliştirildi.

---

<div align="center">

**[⬆ Yukarı](#-commit-story)**

⭐ Bu projeyi beğendiyseniz star vermeyi unutmayın!

</div>
