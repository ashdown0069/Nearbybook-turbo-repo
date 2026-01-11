export default function PrivacyPolicyExtension() {
  return (
    <div className="mx-auto w-full max-w-4xl rounded-lg bg-white p-6 font-sans text-gray-800 shadow sm:p-8 md:p-10">
      <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
        NearbyBook Extension 개인정보처리방침
      </h1>

      <section className="mb-8 space-y-4">
        <h2 className="border-b pb-2 text-2xl font-semibold text-gray-800">
          1. 총칙
        </h2>
        <p className="text-base leading-relaxed">
          NearbyBook Extension(이하 '확장 프로그램')은 사용자 여러분의
          개인정보를 매우 중요하게 생각하며, 「개인정보 보호법」 및 관련 법규를
          준수하고 있습니다. 본 개인정보처리방침은 사용자의 개인정보가 어떻게
          수집, 이용, 제공, 파기되는지에 대한 정보를 투명하게 제공합니다.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="border-b pb-2 text-2xl font-semibold text-gray-800">
          2. 수집하는 개인정보 항목 및 수집 방법
        </h2>
        <p className="text-base leading-relaxed">
          확장 프로그램은 서비스 제공을 위해 다음과 같은 정보를 수집합니다.
        </p>
        <div className="space-y-3 pl-4">
          <div>
            <p className="font-semibold text-gray-700">
              가. 사용자가 직접 제공하는 정보:
            </p>
            <p className="ml-4">
              <strong>이메일 주소:</strong> 피드백 제출 시 사용자가 선택적으로
              입력할 수 있습니다. 이는 피드백에 대한 회신 및 서비스 개선을
              목적으로 합니다.
            </p>
          </div>
          <div>
            <p className="font-semibold text-gray-700">
              나. 서비스 이용 과정에서 자동으로 생성 및 수집되는 정보:
            </p>
            <ul className="ml-8 list-disc space-y-1">
              <li>
                <strong>지역 설정 정보:</strong> 사용자가 옵션 페이지에서 설정한
                '시/도' 및 '시/군/구' 정보 (예: 서울특별시, 강남구).
              </li>
              <li>
                <strong>브라우징 정보:</strong> 사용자가 방문하는 온라인 서점
                사이트(교보문고, YES24, 알라딘, 네이버 도서 등)의 URL 및 해당
                페이지에서 추출된 도서 정보(ISBN, 도서명). 이 정보는 사용자가
                확장 프로그램을 활성화한 시점에만 수집되며, 개인을 식별할 수
                없는 형태로 도서관 검색에만 활용됩니다.
              </li>
            </ul>
          </div>
        </div>
        <p className="pl-4 text-base leading-relaxed">
          서비스 이용 과정에서 자동으로 생성 및 수집되는 정보는 도서관 검색 및
          결과 제공에만 이용됩니다. 피드백 시 제공된 이메일 주소는 백엔드 서버로
          전송되어 피드백 처리에만 활용됩니다.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="border-b pb-2 text-2xl font-semibold text-gray-800">
          3. 개인정보의 수집 및 이용 목적
        </h2>
        <p className="text-base leading-relaxed">
          확장 프로그램은 수집된 정보를 다음의 목적을 위해서만 이용합니다.
        </p>
        <ul className="ml-8 list-disc space-y-1">
          <li>
            사용자가 온라인 서점 사이트에서 보고 있는 도서의 주변 공공 도서관
            소장 여부를 검색하고 결과를 제공하기 위함.
          </li>
          <li>
            사용자가 설정한 지역 정보를 기반으로 맞춤형 도서관 검색 결과를
            제공하기 위함.
          </li>
          <li>피드백에 대한 회신, 문의 응대 및 서비스 개선을 위함.</li>
        </ul>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="border-b pb-2 text-2xl font-semibold text-gray-800">
          4. 개인정보의 제3자 제공
        </h2>
        <p className="text-base leading-relaxed">
          확장 프로그램은 사용자의 개인정보를 제3자에게 제공하지 않습니다.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="border-b pb-2 text-2xl font-semibold text-gray-800">
          5. 개인정보의 보유 및 이용 기간
        </h2>
        <p className="text-base leading-relaxed">
          확장 프로그램은 법령에 따른 개인정보 보유·이용 기간 또는
          정보주체로부터 개인정보를 수집 시에 동의 받은 개인정보 보유·이용 기간
          내에서 개인정보를 처리·보유합니다.
        </p>
        <ul className="ml-8 list-disc space-y-1">
          <li>
            <strong>이메일 주소:</strong> 피드백 처리 완료 및 관련 문의 응대가
            완료될 때까지 보관하며, 그 이후 지체 없이 파기합니다.
          </li>
          <li>
            <strong>지역 설정 정보:</strong> 사용자가 확장 프로그램을 사용하는
            동안 유지되며, 확장 프로그램 삭제시 파기됩니다.
          </li>
          <li>
            <strong>브라우징 및 도서 정보:</strong> 도서관 검색 요청 시
            일시적으로 활용되며 브라우저가 열려있는 동안에만 브라우저내의
            저장소에 보관됩니다.
          </li>
        </ul>
      </section>
      <section className="mb-8 space-y-4">
        <h2 className="border-b pb-2 text-2xl font-semibold text-gray-800">
          6. 개인정보 보호책임자 및 담당부서
        </h2>
        <p className="text-base leading-relaxed">
          확장 프로그램은 개인정보 처리에 관한 업무를 총괄해서 책임지고,
          개인정보 처리와 관련한 정보주체의 불만처리 및 피해구제 등을 위하여
          아래와 같이 개인정보 보호책임자를 지정하고 있습니다.
        </p>
        <div className="space-y-1 pl-4">
          <p>
            <strong>개인정보 보호책임자:</strong> [김재하]
          </p>
          <p>
            <strong>문의 이메일:</strong> [ashesdown0069@gmail.com]
          </p>
        </div>
        <p className="text-base leading-relaxed">
          정보주체께서는 확장 프로그램의 서비스를 이용하시면서 발생한 모든
          개인정보 보호 관련 문의, 불만 처리, 피해 구제 등에 관한 사항을
          개인정보 보호책임자 및 담당부서로 문의하실 수 있습니다. 확장
          프로그램은 정보주체의 문의에 대해 지체 없이 답변 및 처리해드릴
          것입니다.
        </p>
      </section>

      <section className="mb-8 space-y-4">
        <h2 className="border-b pb-2 text-2xl font-semibold text-gray-800">
          7. 개인정보처리방침 변경
        </h2>
        <p className="text-base leading-relaxed">
          본 개인정보처리방침은 법령 및 방침에 따른 변경 내용 추가, 삭제 및
          정정이 있을 경우에는 변경되는 개인정보처리방침을 시행하기 최소 7일
          전부터 웹사이트 공지사항을 통해 고지할 것입니다.
        </p>
      </section>

      <div className="mt-10 border-t pt-4 text-right text-gray-500">
        <p>시행일: [2025년 10월 15일]</p>
      </div>
    </div>
  );
}
