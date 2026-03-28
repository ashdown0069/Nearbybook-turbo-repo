// import { pgTable, decimal, text, date, } from 'drizzle-orm/pg-core';

// export const libraries = pgTable('libraries', {
//   libCode: text('lib_code').primaryKey(),
//   libName: text('lib_name').notNull(),
//   address: text('address'),
//   tel: text('tel'),
//   fax: text('fax'),
//   latitude: decimal('latitude', { precision: 10, scale: 7 }),
//   longitude: decimal('longitude', { precision: 10, scale: 7 }),
//   homepage: text('homepage'),
//   closed: text('closed'),
//   operatingTime: text('operating_time'),
//   regionCode: text('region_code'),
//   delRegionCode: text('del_region_code'),
//   createdAt: date('created_at').defaultNow().notNull(),
// });

import { pgTable, text, integer, numeric } from 'drizzle-orm/pg-core';

// regions: 광역 지역 테이블 (서울특별시, 부산광역시 등 17개 시도)
// code에 unique 제약을 추가하는 이유:
//   1) PostgreSQL FK는 참조 대상 컬럼이 unique 또는 PK여야 동작
//   2) onConflictDoUpdate의 target으로 사용하기 위해 필요
export const regions = pgTable('regions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  code: text('code').unique(),
  name: text('name').notNull(),
});

// detailRegions: 세부 지역 테이블 (구/군/시 단위)
// dtlRegionCode에 unique 제약을 추가하는 이유:
//   1) libraries.dtlRegionCode 가 이 컬럼을 FK 참조 → unique 필수
//   2) 스크래퍼의 upsert target으로 사용
export const detailRegions = pgTable('detail_regions', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  regionCode: text('region_code')
    .notNull()
    .references(() => regions.code),
  dtlRegionCode: text('dtl_region_code').notNull().unique(),
  dtlRegionName: text('region_name').notNull(),
  name: text('name').notNull(),
});

// libraries: 도서관 테이블
// libCode에 unique 제약을 추가하는 이유:
//   1) 공공데이터 API의 도서관 고유 식별자로, 중복 삽입 방지
//   2) 스크래퍼의 upsert target (ON CONFLICT DO UPDATE)으로 사용
export const libraries = pgTable('libraries', {
  id: integer().primaryKey().generatedAlwaysAsIdentity(),
  libCode: text('lib_code').unique(),
  libName: text('lib_name').notNull(),
  address: text('address').notNull(),
  tel: text('tel'),
  fax: text('fax'),
  latitude: numeric('latitude', { precision: 10, scale: 7 }),
  longitude: numeric('longitude', { precision: 10, scale: 7 }),
  homepage: text('homepage'),
  closed: text('closed'),
  operatingTime: text('operating_time'),
  regionCode: text('region_code').references(() => regions.code),
  dtlRegionCode: text('dtl_region_code').references(
    () => detailRegions.dtlRegionCode,
  ),
});
