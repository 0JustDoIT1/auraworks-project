import Link from "next/link";

const FOOTER_LINKS = [
  { label: "회사소개", href: "#" },
  { label: "이용약관", href: "#" },
  { label: "개인정보처리방침", href: "#" },
];

const BUSINESS_NUMBER = "735-87-02522";
const COPYRIGHT_YEAR = 2026;

export default function Footer() {
  return (
    <footer className="bg-white">
      <div className="container-page py-10 text-[13px] text-gray-500">
        {/* 링크 */}
        <ul className="flex flex-wrap items-center divide-x divide-gray-300">
          {FOOTER_LINKS.map(({ label, href }) => (
            <li key={label} className="px-3.5 leading-none first:pl-0">
              <Link href={href} className="hover:text-gray-900">
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* 사업자 정보 */}
        <address className="mt-4 flex flex-col gap-1 not-italic leading-relaxed">
          <p>
            (주)히든카이스 | 대표: 안영호 | 사업자등록번호: {BUSINESS_NUMBER} (
            <a
              href={`https://www.ftc.go.kr/bizCommPop.do?wrkr_no=${BUSINESS_NUMBER.replaceAll("-", "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="underline underline-offset-2 hover:text-gray-900"
            >
              사업자정보확인
            </a>
            )
          </p>
          <p>
            주소: 경기도 고양시 일산서구 일현로 97-11, 56F | 통신판매업신고: 제
            2024-고양일산서-1209 | 이메일:{" "}
            <a
              href="mailto:Hidden_kice@naver.com"
              className="hover:text-gray-900"
            >
              Hidden_kice@naver.com
            </a>
          </p>
        </address>

        {/* 저작권 */}
        <p className="mt-4">
          Copyright © {COPYRIGHT_YEAR} 히든카이스. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
