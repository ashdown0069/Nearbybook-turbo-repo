// export interface Book {
//   bookname: string;
//   authors: string;
//   publisher: string;
//   publicationYear: string;
//   isbn: string;
//   vol: string;
//   bookImageURL: string;
// }

// export interface library {
//   hasBook: boolean;
//   libName: string;
//   libCode: string;
//   address: string;
//   homepage: string;
//   tel: string;
//   operatingTime: string;
//   closed: string;
//   latitude: string;
//   longitude: string;
// }

export interface Region {
  region: string;
  dtlRegion: string;
}

export interface MapProps extends Partial<Region> {
  isbn: string;
}
