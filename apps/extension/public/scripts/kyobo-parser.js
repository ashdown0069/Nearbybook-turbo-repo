/**
 * 익명함수 사용해야함
 * 탭 전환 후 돌아올 경우
 * 콘텐츠 스크립트가 이미 존재한다는 오류가남 
 */
(() => {
  const kyoboParser = () => {
    const ISBN = document.querySelector(
      "#scrollSpyProdInfo > div.product_detail_area.basic_info > div.tbl_row_wrap > table > tbody > tr:nth-child(1) > td"
    )?.textContent.trim();

    const TITLE = document.querySelector("#contents > div.prod_detail_header > div > div.prod_detail_title_wrap > div > div.prod_title_box.auto_overflow_wrap > div.auto_overflow_contents > div > h1 > span")?.textContent.trim();
    return { ISBN, TITLE };
  };

  return kyoboParser();
})()




