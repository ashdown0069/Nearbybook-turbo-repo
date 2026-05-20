import { Separator } from "@workspace/ui/components/separator"
import { Button } from "@workspace/ui/components/button"

export default function FoundAtLibrary({
  libName,
  loanAvailable,
  bookCode,
  shelfLocation,
  address,
}: {
  libName: string
  loanAvailable: boolean | null
  bookCode: string | null
  shelfLocation: string | null
  address: string | null
}) {
  return (
    <div className="space-y-3 px-4 pt-4">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-slate-700">{libName}</h3>
        <LoanBadge available={loanAvailable} />
      </div>
      <Separator />
      {shelfLocation || bookCode ? (
        <>
          <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-1.5">
            {shelfLocation && (
              <>
                <dt className="text-xs text-slate-400">자료실</dt>
                <dd className="text-sm text-slate-700">{shelfLocation}</dd>
              </>
            )}
            {bookCode && (
              <>
                <dt className="text-xs text-slate-400">청구기호</dt>
                <dd className="font-mono text-sm text-slate-700">{bookCode}</dd>
              </>
            )}
            {address && (
              <>
                <dt className="text-xs text-slate-400">주소</dt>
                <dd className="text-sm text-slate-700">{address}</dd>
              </>
            )}
          </dl>
        </>
      ) : (
        <p className="text-sm text-slate-400">위치 정보 없음</p>
      )}
      <Button
        asChild
        className="mx-auto mt-5 flex cursor-pointer items-center justify-center bg-green-500 hover:bg-green-400!"
      >
        <a
          href={`https://map.naver.com/v5/search/${address}`}
          target="_blank"
          rel="noopener noreferrer"
        >
          네이버 지도에서 보기
        </a>
      </Button>
    </div>
  )
}

function LoanBadge({ available }: { available: boolean | null }) {
  if (available === true) {
    return (
      <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
        대출 가능
      </span>
    )
  }
  if (available === false) {
    return (
      <span className="rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700">
        대출 중
      </span>
    )
  }
  return (
    <span className="rounded-full bg-slate-100 px-2 py-0.5 text-xs font-medium text-slate-500">
      알 수 없음
    </span>
  )
}
