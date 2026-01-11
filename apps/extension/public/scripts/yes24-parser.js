(() => {
    const yes24Parser = () => {
        let isbnValue = ""
        //yes24 의 경우 테이블마다 데이터 차이가 있어서 밑의 코드처럼 동작해야함
        const tbody = document.querySelector("#infoset_specific > div.infoSetCont_wrap > div > table > tbody")
        if (tbody) {
            const rows = tbody.querySelectorAll("tr");

            for (const row of rows) {
                const th = row.querySelector('th');

                if (th && th.textContent.trim() === 'ISBN13') {
                    const td = row.querySelector('td');

                    if (td) {
                        isbnValue = td.textContent.trim();
                        break;
                    }
                }
            }
        }



        const TITLE = document.querySelector("#yDetailTopWrap > div.topColRgt > div.gd_infoTop > div > h2")?.textContent.trim();
        return { ISBN: isbnValue.trim(), TITLE };
    }

    return yes24Parser();
})()
