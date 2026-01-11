(() => {
    const naverBookParser = () => {
        const ISBN = document.querySelector("#book_section-info > div.bookBasicInfo_basic_info__wp1KX > ul > li:nth-child(3) > div > div.bookBasicInfo_info_detail__73sfK")?.textContent.trim();

        const TITLE = document.querySelector("#container > div.bookCatalog_inner_container__lNIvv > div.bookCatalog_book_catalog__Kufik > div.bookCatalog_book_info_top__btdRi > div.bookSummary_book_summary__k8OSK > div.bookTitle_book_title__mjAnO > div.bookTitle_title_area__jrOKo > h2")?.textContent.trim();
        return { ISBN, TITLE };
    };

    return naverBookParser();
})()




