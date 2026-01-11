

/**
 * 익명함수 사용해야함
 * 사용안할경우 
 * 탭 전환 후 돌아올 경우
 * 콘텐츠 스크립트가 이미 존재한다는 오류가남 
 */
(() => {
    const aladinParser = () => {
        const container = document.querySelector("#Ere_prod_allwrap > div.Ere_prod_middlewrap > div:nth-child(1) > div.Ere_prod_mconts_R > div.conts_info_list1 > ul > li:nth-child(4)")
            ?.textContent;

        const ISBN = container.split(':')[1].trim();

        const TITLE = document.querySelector("#Ere_prod_allwrap > div.Ere_prod_topwrap > div.Ere_prod_titlewrap > div.left > div > ul > li:nth-child(2) > div > span")?.textContent.trim();
        console.log('aladin', ISBN, TITLE)

        return { ISBN, TITLE };
    };

    return aladinParser();
})()




