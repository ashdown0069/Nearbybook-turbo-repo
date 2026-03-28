import { NewBookRecord } from 'src/database/schema';
import { type doc } from 'src/types/types';

export function TransformLoanBookRes(
  data: doc[],
  kdc: string,
  baseDate: string,
) {
  const records: NewBookRecord[] = [];
  let skippedCount = 0;

  for (const doc of data) {
    // ISBN 13자리 숫자 필수
    const isbn = doc.isbn13?.trim() ?? '';
    if (!/^\d{13}$/.test(isbn)) {
      skippedCount++;
      continue;
    }

    // bookname 비어있으면 스킵
    const title = doc.bookname?.trim() ?? '';
    if (title === '') {
      skippedCount++;
      continue;
    }

    // '?'로 시작하는 제목 스킵 (인코딩 깨짐)
    if (/^\?/.test(title)) {
      skippedCount++;
      continue;
    }

    // vol: 숫자 아니거나 >99이면 null
    let vol: string | null = doc.vol?.trim() ?? null;
    if (vol !== null) {
      if (vol === '' || isNaN(Number(vol)) || Number(vol) > 99) {
        vol = null;
      }
    }

    records.push({
      title,
      authors: doc.authors?.trim() || null,
      publisher: doc.publisher?.trim() || null,
      publicationYear: doc.publication_year?.trim() ?? null,
      isbn,
      vol,
      loanCount: Number(doc.loan_count) || 0,
      kdc: kdc,
      bookImageURL: doc.bookImageURL?.trim() || null,
      baseDate: [baseDate],
    });
  }
  return { records, skippedCount };
}
