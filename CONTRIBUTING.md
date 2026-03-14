# Katkida Bulunma Rehberi

Bu projeye katki yaptiginiz icin tesekkurler! Asagidaki adimlari izleyin.

## Gelistirme Ortami

```bash
# Repoyu fork edin ve klonlayin
git clone https://github.com/YOUR_USERNAME/REPO_NAME.git
cd REPO_NAME

# Bagimliliklari yukleyin
npm install

# Gelistirme sunucusunu baslatin
npm run dev
```

## Pull Request Sureci

1. `main` branch'inden yeni bir branch olusturun
2. Degisikliklerinizi yapin
3. `npm run lint && npm run type-check && npm test` komutlarini calistirin
4. Commit mesajlarinizda [Conventional Commits](https://www.conventionalcommits.org/) kullanin:
   - `feat:` yeni ozellik
   - `fix:` hata duzeltme
   - `docs:` dokumantasyon
   - `refactor:` yeniden yapilandirma
   - `test:` test ekleme
5. Pull Request olusturun

## Kod Standartlari

- TypeScript strict mode kullanin
- ESLint kurallarini takip edin
- Yeni ozellikler icin test yazin
- Fonksiyonlara JSDoc yorum ekleyin

## Sorun Bildirme

GitHub Issues uzerinden bildirin. Template'leri kullanin:
- Bug Report: Hata bildirimi
- Feature Request: Ozellik onerisi

## Lisans

Katkilariniz MIT lisansi altinda yayinlanacaktir.
