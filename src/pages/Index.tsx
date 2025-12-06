import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User as SupabaseUser } from "@supabase/supabase-js";
import { Globe, ArrowRight, Sparkles, Search, Tag, CheckCircle, ShoppingBag } from "lucide-react";

// Simplified Official Store Logo Components (SVG)
const AmazonLogo = ({ height = 24 }: { height?: number }) => (
  <svg height={height} viewBox="0 0 603 182" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path fillRule="evenodd" clipRule="evenodd" d="M374.006 142.184C339.055 168.159 288.587 182 245.179 182C184.339 182 129.556 159.279 88.206 121.553C84.935 118.553 87.838 114.484 91.756 116.878C136.252 142.81 190.851 158.575 247.289 158.575C285.551 158.575 327.634 150.672 366.308 134.199C372.046 131.789 376.896 137.895 374.006 142.184Z" fill="#FF9900"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M383.358 131.297C378.932 125.624 353.695 128.611 342.291 129.955C338.859 130.36 338.311 127.36 341.376 125.22C361.561 110.914 394.594 114.911 398.39 119.614C402.186 124.332 397.368 157.434 378.473 173.644C375.622 176.069 372.909 174.782 374.195 171.629C378.405 161.227 387.784 136.955 383.358 131.297Z" fill="#FF9900"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M343.203 21.0851V6.49537C343.203 4.23628 344.893 2.72021 346.948 2.72021H409.092C411.243 2.72021 412.933 4.27628 412.933 6.49537V19.2149C412.892 21.3431 411.101 24.1024 407.969 28.3938L375.423 75.0823C387.117 74.7857 399.523 76.6173 410.115 82.5871C412.617 83.9941 413.27 86.0517 413.432 88.0683V103.767C413.432 105.819 411.168 108.243 408.809 107.024C390.109 97.0803 365.238 95.9979 344.893 107.127C342.724 108.26 340.419 105.87 340.419 103.818V88.929C340.419 86.6355 340.46 82.4757 342.805 78.8916L380.673 24.1228H347.051C344.893 24.1228 343.203 22.6067 343.203 21.0851Z" fill="#232F3E"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M124.152 110.063H105.904C104.01 109.918 102.523 108.506 102.372 106.695V6.80238C102.372 4.76471 104.111 3.15156 106.206 3.15156H123.224C125.159 3.2392 126.693 4.69761 126.836 6.55473V19.8283H127.199C131.646 6.16972 140.951 0.0 153.784 0.0C166.829 0.0 175.06 6.16972 180.22 19.8283C184.667 6.16972 195.752 0.0 207.938 0.0C216.69 0.0 226.318 3.84656 232.034 11.8844C238.561 20.7458 237.232 33.5927 237.232 44.8954L237.191 106.465C237.191 108.503 235.452 110.063 233.357 110.063H215.145C213.169 109.918 211.601 108.426 211.601 106.465V53.6449C211.601 49.8492 211.964 38.9731 211.238 35.3697C210.065 29.2 205.78 27.376 200.264 27.376C195.752 27.376 191.023 30.4829 189.082 35.3441C187.141 40.2054 187.302 48.4191 187.302 53.6449V106.465C187.302 108.503 185.564 110.063 183.469 110.063H165.256C163.24 109.918 161.713 108.426 161.713 106.465L161.672 53.6449C161.672 42.3422 163.614 27.1711 149.337 27.1711C134.878 27.1711 135.483 41.8714 135.483 53.6449V106.465C135.483 108.503 133.744 110.063 131.649 110.063H124.152Z" fill="#232F3E"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M458.459 0.0C485.518 0.0 500.25 27.1711 500.25 61.6566C500.25 95.0246 483.697 121.135 458.459 121.135C432.209 121.135 417.679 93.964 417.679 60.5984C417.679 27.0081 432.412 0.0 458.459 0.0ZM458.621 22.4693C443.796 22.4693 442.868 42.5422 442.868 55.1842C442.868 67.8529 442.665 98.3023 458.459 98.3023C474.051 98.3023 474.859 76.3531 474.859 62.9508C474.859 54.0894 474.495 43.4032 471.595 35.163C469.098 28.0274 464.463 22.4693 458.621 22.4693Z" fill="#232F3E"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M540.67 110.063H522.498C520.522 109.918 518.954 108.426 518.954 106.465L518.913 6.59282C519.105 4.68762 520.765 3.15156 522.82 3.15156H539.676C541.41 3.22896 542.857 4.46054 543.202 6.09856V22.0598H543.565C548.867 7.34139 556.692 0.0 571.627 0.0C581.147 0.0 590.453 3.64157 596.774 13.1921C602.693 22.0598 602.693 36.0478 602.693 46.8972V107.001C602.419 108.844 600.799 110.243 598.866 110.243H580.532C578.719 110.098 577.232 108.741 576.986 106.981V54.3686C576.986 43.2708 578.398 26.7615 564.321 26.7615C559.809 26.7615 555.641 29.8684 553.579 34.5449C550.88 40.6889 550.516 46.8023 550.516 54.3686V106.465C550.475 108.503 548.696 110.063 546.561 110.063H540.67Z" fill="#232F3E"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M301.456 63.2074C301.456 71.2149 301.659 77.8456 297.618 84.8896C294.352 90.4745 289.069 93.8623 283.23 93.8623C275.089 93.8623 270.251 87.6113 270.251 78.4598C270.251 60.4422 286.049 57.1114 301.456 57.1114V63.2074ZM325.766 109.767C324.31 111.052 322.206 111.145 320.548 110.234C313.464 104.372 312.253 101.558 308.336 95.9178C296.486 108.15 288.022 111.852 272.356 111.852C253.552 111.852 239.033 100.337 239.033 77.0107C239.033 58.8469 249.265 46.4989 264.282 40.4952C277.286 35.1477 295.479 34.2132 301.456 33.5441V31.6948C301.456 28.1083 301.74 23.8377 299.639 20.7555C297.781 18.0151 294.312 16.9365 291.249 16.9365C285.532 16.9365 280.436 19.8573 279.224 25.9712C278.972 27.4025 277.923 28.8118 276.509 28.8838L258.702 26.9381C257.41 26.6461 255.99 25.5808 256.34 23.6175C260.381 2.53523 279.468 -3.8147e-05 296.729 -3.8147e-05C305.548 -3.8147e-05 316.918 2.28717 323.951 8.79606C333.043 17.1413 332.233 28.3538 332.233 40.7231V69.4821C332.233 78.2308 335.864 82.0791 339.27 86.8308C340.42 88.4478 340.663 90.3898 339.189 91.6067C335.459 94.7388 328.799 100.441 325.847 103.548L325.766 109.767Z" fill="#232F3E"/>
    <path fillRule="evenodd" clipRule="evenodd" d="M55.3173 63.2074C55.3173 71.2149 55.5202 77.8456 51.479 84.8896C48.2128 90.4745 42.9302 93.8623 37.0912 93.8623C28.9502 93.8623 24.1123 87.6113 24.1123 78.4598C24.1123 60.4422 39.9098 57.1114 55.3173 57.1114V63.2074ZM79.6272 109.767C78.1706 111.052 76.0671 111.145 74.4091 110.234C67.3253 104.372 66.1136 101.558 62.1971 95.9178C50.3473 108.15 41.8831 111.852 26.217 111.852C7.41346 111.852 -7.10487e-05 100.337 -7.10487e-05 77.0107C-7.10487e-05 58.8469 10.2257 46.4989 25.2433 40.4952C38.2466 35.1477 56.4401 34.2132 62.4174 33.5441V31.6948C62.4174 28.1083 62.7008 23.8377 60.5999 20.7555C58.7419 18.0151 55.2732 16.9365 52.2099 16.9365C46.4929 16.9365 41.3977 19.8573 40.1859 25.9712C39.9335 27.4025 38.8841 28.8118 37.4706 28.8838L19.6631 26.9381C18.3717 26.6461 16.9513 25.5808 17.3012 23.6175C21.342 2.53523 40.4293 -3.8147e-05 57.6901 -3.8147e-05C66.5094 -3.8147e-05 77.8791 2.28717 84.9124 8.79606C94.0044 17.1413 93.1942 28.3538 93.1942 40.7231V69.4821C93.1942 78.2308 96.825 82.0791 100.231 86.8308C101.381 88.4478 101.624 90.3898 100.15 91.6067C96.4205 94.7388 89.7598 100.441 86.8082 103.548L86.7272 109.767L79.6272 109.767Z" fill="#232F3E"/>
  </svg>
);

const WalmartLogo = ({ height = 24 }: { height?: number }) => (
  <svg height={height} viewBox="0 0 240 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M47.5 10L50 20L60 22.5L50 25L47.5 35L45 25L35 22.5L45 20L47.5 10Z" fill="#FFC220"/>
    <path d="M47.5 35L50 45L60 47.5L50 50L47.5 60L45 50L35 47.5L45 45L47.5 35Z" fill="#FFC220"/>
    <path d="M35 22.5L37.5 32.5L47.5 35L37.5 37.5L35 47.5L32.5 37.5L22.5 35L32.5 32.5L35 22.5Z" fill="#FFC220"/>
    <path d="M60 22.5L62.5 32.5L72.5 35L62.5 37.5L60 47.5L57.5 37.5L47.5 35L57.5 32.5L60 22.5Z" fill="#FFC220"/>
    <path d="M85 20H92L98 42L104 20H111L118 42L124 20H131L120 50H113L107 30L100 50H93L85 20Z" fill="#0071CE"/>
    <path d="M143 20H150V23C152 21 155 19 160 19C167 19 172 24 172 33V50H165V35C165 29 162 26 157 26C152 26 150 29 150 35V50H143V20Z" fill="#0071CE"/>
    <path d="M180 35C180 26 186 19 196 19C206 19 212 26 212 35C212 44 206 51 196 51C186 51 180 44 180 35ZM205 35C205 29 201 25 196 25C191 25 187 29 187 35C187 41 191 45 196 45C201 45 205 41 205 35Z" fill="#0071CE"/>
    <path d="M220 20H227V23C229 21 232 19 237 19V26C231 26 227 29 227 35V50H220V20Z" fill="#0071CE"/>
    <path d="M134 20H141V50H134V20Z" fill="#0071CE"/>
  </svg>
);

const TargetLogo = ({ height = 28 }: { height?: number }) => (
  <svg height={height} viewBox="0 0 200 60" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="30" cy="30" r="28" fill="#CC0000"/>
    <circle cx="30" cy="30" r="18" fill="white"/>
    <circle cx="30" cy="30" r="9" fill="#CC0000"/>
    <path d="M72 18V24H64V50H56V24H48V18H72Z" fill="#CC0000"/>
    <path d="M98 18V50H90V40H80V50H72V18H80V34H90V18H98Z" fill="#CC0000"/>
    <path d="M102 50V18H120C128 18 133 22 133 29C133 33 131 36 127 38L134 50H125L119 39H110V50H102ZM110 33H118C121 33 123 31 123 29C123 27 121 25 118 25H110V33Z" fill="#CC0000"/>
    <path d="M138 18H162V24H146V31H160V37H146V44H162V50H138V18Z" fill="#CC0000"/>
    <path d="M166 18H190V24H174V31H188V37H174V44H190V50H166V18Z" fill="#CC0000"/>
  </svg>
);

const EtsyLogo = ({ height = 24 }: { height?: number }) => (
  <svg height={height} viewBox="0 0 100 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 8C8 6 9.5 4 12 4H30V10H16V16H28V22H16V30H30V36H12C9.5 36 8 34 8 32V8Z" fill="#F56400"/>
    <path d="M40 14V10H48V30C48 33 50 34 52 34H56V36H50C45 36 40 34 40 28V10H36V36H40V14Z" fill="#F56400"/>
    <path d="M62 26C62 23 64 22 66 22C70 22 72 20 72 20V26C72 26 70 28 66 28C62 28 58 26 58 22C58 16 64 14 70 14C76 14 80 16 80 16V22C80 22 76 20 72 20C72 20 74 22 74 26C74 32 68 36 62 36C56 36 52 32 52 26C52 20 58 14 68 14V10C56 10 44 16 44 26C44 36 54 40 62 40C70 40 80 36 80 26V10H72V14C70 12 66 10 62 10C54 10 48 16 48 26C48 36 56 40 66 40C72 40 78 38 80 36V40H88V10H80V14C78 12 74 10 68 10C58 10 48 18 48 28C48 38 58 44 70 44C82 44 92 36 92 26V6H84V10C82 8 76 6 68 6C54 6 40 14 40 28C40 42 56 48 72 48C88 48 100 38 100 24V2H92V6C90 4 84 2 74 2C56 2 36 12 36 30C36 48 58 52 76 52C96 52 108 40 108 24V0H62V26Z" fill="#F56400"/>
  </svg>
);

const EbayLogo = ({ height = 22 }: { height?: number }) => (
  <svg height={height} viewBox="0 0 120 48" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10 16C10 10 14 6 22 6C30 6 34 10 34 18V22H16C16 28 20 32 26 32C30 32 34 30 34 30V36C34 36 30 38 24 38C14 38 8 32 8 24C8 16 14 10 22 10C28 10 32 14 32 20H16C16 14 18 12 22 12C26 12 28 14 28 18V16H10Z" fill="#E53238"/>
    <path d="M38 2H46V14C50 10 54 8 60 8C70 8 76 16 76 26C76 36 70 44 58 44C52 44 48 42 46 40V42H38V2ZM56 38C64 38 68 32 68 26C68 20 64 14 56 14C48 14 46 20 46 26C46 32 48 38 56 38Z" fill="#0064D2"/>
    <path d="M100 8C110 8 116 16 116 24C116 32 110 40 100 40C90 40 84 32 84 24C84 16 90 8 100 8ZM100 34C106 34 108 28 108 24C108 20 106 14 100 14C94 14 92 20 92 24C92 28 94 34 100 34Z" fill="#F5AF02"/>
    <path d="M78 8H86L94 28L102 8H110L96 44C92 52 88 54 82 54H78V48H82C86 48 88 46 90 42L78 8Z" fill="#86B817"/>
  </svg>
);

const BestBuyLogo = ({ height = 26 }: { height?: number }) => (
  <svg height={height} viewBox="0 0 180 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="50" height="50" rx="4" fill="#0046BE"/>
    <path d="M14 12H28C34 12 38 15 38 20C38 23 36 25 33 26C37 27 40 30 40 34C40 40 36 44 28 44H14V12ZM20 24H26C29 24 31 22 31 20C31 18 29 16 26 16H20V24ZM20 40H27C31 40 33 38 33 35C33 32 31 30 27 30H20V40Z" fill="#FFF200"/>
    <path d="M58 12H72C78 12 82 15 82 20C82 23 80 25 77 26C81 27 84 30 84 34C84 40 80 44 72 44H58V12ZM64 24H70C73 24 75 22 75 20C75 18 73 16 70 16H64V24ZM64 40H71C75 40 77 38 77 35C77 32 75 30 71 30H64V40Z" fill="#0046BE"/>
    <path d="M88 12H106V18H94V24H104V30H94V38H106V44H88V12Z" fill="#0046BE"/>
    <path d="M112 32V26C112 26 116 28 122 28C126 28 128 27 128 25C128 20 110 24 110 14C110 8 116 4 126 4C134 4 138 6 138 6V12C138 12 134 10 128 10C124 10 122 11 122 13C122 18 140 14 140 25C140 32 134 36 124 36C116 36 112 34 112 32Z" fill="#0046BE"/>
    <path d="M144 12H168V18H156V44H150V18H144V12Z" fill="#0046BE"/>
  </svg>
);

const MacysLogo = ({ height = 22 }: { height?: number }) => (
  <svg height={height} viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 6L16 22L24 6H32L40 22L48 6H56L42 36H34L26 20L18 36H10L0 6H8Z" fill="#E21A2C"/>
    <path d="M64 14C72 14 78 18 78 26C78 34 72 38 64 38C56 38 50 34 50 26C50 18 56 14 64 14ZM64 32C68 32 70 30 70 26C70 22 68 20 64 20C60 20 58 22 58 26C58 30 60 32 64 32Z" fill="#E21A2C"/>
    <path d="M82 14H90V16C92 14 96 14 100 14C108 14 114 18 114 28C114 38 108 42 98 42C94 42 92 40 90 38V50H82V14ZM96 36C102 36 106 32 106 28C106 24 102 20 96 20C90 20 90 24 90 28C90 32 90 36 96 36Z" fill="#E21A2C"/>
    <path d="M118 26C118 22 120 20 124 20C128 20 132 22 132 22V16C132 16 128 14 122 14C112 14 108 20 108 28C108 36 114 42 124 42C130 42 134 40 134 40V34C134 34 130 36 126 36C120 36 118 32 118 26Z" fill="#E21A2C"/>
    <path d="M130 6L132 10L136 12L132 14L130 18L128 14L124 12L128 10L130 6Z" fill="#E21A2C"/>
  </svg>
);

const HomeDepotLogo = ({ height = 26 }: { height?: number }) => (
  <svg height={height} viewBox="0 0 200 50" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="0" y="0" width="50" height="50" rx="4" fill="#F96302"/>
    <path d="M12 15H18V22H32V15H38V38H32V28H18V38H12V15Z" fill="white"/>
    <path d="M56 15H62V38H56V15ZM56 42H62V48H56V42Z" fill="#F96302"/>
    <path d="M68 15H82C92 15 98 20 98 28C98 36 92 42 82 42H68V15ZM74 36H80C86 36 90 32 90 28C90 24 86 21 80 21H74V36Z" fill="#F96302"/>
    <path d="M102 15H130V21H110V24H128V30H110V35H130V42H102V15Z" fill="#F96302"/>
    <path d="M134 15H152C162 15 168 19 168 26C168 33 162 38 152 38H142V48H134V15ZM142 32H150C156 32 160 30 160 26C160 22 156 20 150 20H142V32Z" fill="#F96302"/>
    <path d="M172 15H200V21H180V24H198V30H180V35H200V42H172V15Z" fill="#F96302"/>
  </svg>
);

const NikeLogo = ({ height = 20 }: { height?: number }) => (
  <svg height={height} viewBox="0 0 100 35" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8 28C6 28 4 26 5 24L90 2C92 1 94 3 93 5L40 30C38 32 34 34 28 34L8 28Z" fill="#111111"/>
  </svg>
);

const AdidasLogo = ({ height = 22 }: { height?: number }) => (
  <svg height={height} viewBox="0 0 140 40" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M0 40L18 8H28L10 40H0Z" fill="#000000"/>
    <path d="M15 40L33 8H43L25 40H15Z" fill="#000000"/>
    <path d="M30 40L48 8H58L40 40H30Z" fill="#000000"/>
    <path d="M70 16C78 16 82 20 82 26C82 32 78 36 70 36C62 36 58 32 58 26C58 20 62 16 70 16ZM70 30C74 30 76 28 76 26C76 24 74 22 70 22C66 22 64 24 64 26C64 28 66 30 70 30Z" fill="#000000"/>
    <path d="M86 6H92V36H86V6Z" fill="#000000"/>
    <path d="M98 16H104V36H98V16ZM101 6C103 6 105 8 105 10C105 12 103 14 101 14C99 14 97 12 97 10C97 8 99 6 101 6Z" fill="#000000"/>
    <path d="M110 16H116V18C118 16 122 16 126 16C134 16 140 22 140 28C140 34 134 40 124 40C120 40 118 38 116 36V44H110V16ZM122 34C128 34 132 30 132 28C132 26 128 22 122 22C116 22 116 26 116 28C116 30 116 34 122 34Z" fill="#000000"/>
  </svg>
);

const Index = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<SupabaseUser | null>(null);
  const [language, setLanguage] = useState<'es' | 'en'>('es');
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth <= 640);
      setIsTablet(window.innerWidth > 640 && window.innerWidth <= 1024);
    };
    checkDevice();
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);

  useEffect(() => {
    const checkSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user || null);
    };
    checkSession();
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user || null);
    });
    return () => subscription.unsubscribe();
  }, []);

  const handleCreateList = () => {
    navigate(user ? "/lists" : "/auth?tab=signup&action=create-list");
  };

  const handleSmartAssistant = () => {
    navigate(user ? "/dashboard" : "/auth?tab=signup&action=smart-assistant");
  };

  const toggleLanguage = () => setLanguage(prev => prev === 'es' ? 'en' : 'es');

  const content = {
    es: {
      heroTitle1: 'LA UNICA LISTA DE REGALOS QUE',
      heroTitle2: 'GARANTIZA CERO DUPLICADOS.',
      heroSub: 'Añade productos de cualquier tienda, o deja que nuestro Asistente IA encuentre el regalo perfecto por ti.',
      ctaPrimary: 'CREAR LISTA GRATIS EN 2 MINUTOS',
      ctaSecondary: 'UTILIZA EL ASISTENTE DE COMPRAS INTELIGENTE',
      trustText: 'Compra inteligente desde tus tiendas favoritas.',
      howItWorks: 'Como Funciona',
      step1: 'Crea tu lista',
      step1Sub: 'Añade productos de cualquier tienda',
      step2: 'Comparte el link',
      step2Sub: 'Un solo enlace para todos',
      step3: 'Tus invitados reservan',
      step3Sub: 'Sin duplicados garantizado',
      step4: 'Recibe tus regalos',
      step4Sub: 'Directo de la tienda oficial',
      login: 'Iniciar sesion',
      register: 'Registrarse',
      footerProduct: 'Givlyn es un producto de',
      footerRights: 'Todos los derechos reservados.',
    },
    en: {
      heroTitle1: 'THE ONLY GIFT LIST THAT',
      heroTitle2: 'GUARANTEES ZERO DUPLICATES.',
      heroSub: 'Add products from any store, or let our AI Assistant find the perfect gift for you.',
      ctaPrimary: 'CREATE FREE LIST IN 2 MINUTES',
      ctaSecondary: 'USE THE SMART SHOPPING ASSISTANT',
      trustText: 'Smart shopping from your favorite stores.',
      howItWorks: 'How It Works',
      step1: 'Create your list',
      step1Sub: 'Add products from any store',
      step2: 'Share the link',
      step2Sub: 'One link for everyone',
      step3: 'Guests reserve',
      step3Sub: 'Zero duplicates guaranteed',
      step4: 'Receive your gifts',
      step4Sub: 'Direct from official store',
      login: 'Sign In',
      register: 'Sign Up',
      footerProduct: 'Givlyn is a product of',
      footerRights: 'All rights reserved.',
    }
  };

  const t = content[language];

  const colors = {
    primaryBlue: '#1A3E5C',
    actionOrange: '#FF9900',
    actionOrangeHover: '#E07C00',
    accentGreen: '#1ABC9C',
    accentGreenHover: '#16A085',
    textDark: '#1F2937',
    textGrey: '#6B7280',
    bgWhite: '#FFFFFF',
    bgLight: '#F8FAFC',
    bgTrust: '#F3F4F6',
  };

  const steps = [
    { num: 1, title: t.step1, sub: t.step1Sub, Icon: Search },
    { num: 2, title: t.step2, sub: t.step2Sub, Icon: Tag },
    { num: 3, title: t.step3, sub: t.step3Sub, Icon: CheckCircle },
    { num: 4, title: t.step4, sub: t.step4Sub, Icon: ShoppingBag },
  ];

  const cardShadow = '0 2px 8px rgba(0, 0, 0, 0.06)';
  const cardShadowHover = '0 8px 24px rgba(0, 0, 0, 0.1)';
  const btnShadow = '0 2px 8px rgba(0, 0, 0, 0.12)';
  const btnShadowHover = '0 4px 16px rgba(0, 0, 0, 0.15)';

  const logoHeight = isMobile ? 18 : 24;

  const storeLogos = [
    { Component: AmazonLogo, height: logoHeight },
    { Component: WalmartLogo, height: logoHeight },
    { Component: TargetLogo, height: logoHeight + 4 },
    { Component: EbayLogo, height: logoHeight - 2 },
    { Component: BestBuyLogo, height: logoHeight + 2 },
    { Component: MacysLogo, height: logoHeight - 2 },
    { Component: HomeDepotLogo, height: logoHeight + 2 },
    { Component: NikeLogo, height: logoHeight - 4 },
    { Component: AdidasLogo, height: logoHeight - 2 },
  ];

  return (
    <div style={{
      fontFamily: "'Inter', 'Segoe UI', Roboto, Helvetica, Arial, sans-serif",
      color: colors.textDark,
      lineHeight: 1.5,
      minHeight: '100vh',
      display: 'flex',
      flexDirection: 'column',
      background: colors.bgWhite,
      overflowX: 'hidden',
    }}>
      {/* HEADER */}
      <header style={{
        background: colors.bgWhite,
        boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        position: 'sticky',
        top: 0,
        zIndex: 100,
        height: '56px',
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 20px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          height: '100%',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <img src="/logo-icon-only.png" alt="Givlyn" style={{ height: '32px', width: 'auto' }} />
            <span style={{ fontSize: '20px', fontWeight: 700, color: colors.primaryBlue }}>
              Givlyn
            </span>
          </div>
          <nav style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {!isMobile && !user && (
              <a href="/auth?tab=login" style={{ color: colors.textGrey, textDecoration: 'none', fontSize: '14px', fontWeight: 500 }}>
                {t.login}
              </a>
            )}
            {!user && (
              <a href="/auth?tab=signup" style={{ 
                background: colors.primaryBlue, 
                color: 'white', 
                padding: '8px 16px', 
                borderRadius: '6px', 
                fontSize: '14px', 
                fontWeight: 600, 
                textDecoration: 'none',
              }}>
                {t.register}
              </a>
            )}
            {user && (
              <button onClick={() => navigate('/dashboard')} style={{ 
                background: colors.actionOrange, 
                color: 'white', 
                border: 'none', 
                padding: '8px 16px', 
                borderRadius: '6px', 
                fontSize: '14px', 
                fontWeight: 600, 
                cursor: 'pointer',
              }}>
                Dashboard
              </button>
            )}
            <button onClick={toggleLanguage} style={{ 
              background: 'none', 
              border: 'none', 
              fontSize: '13px', 
              cursor: 'pointer', 
              color: colors.textGrey, 
              display: 'flex', 
              alignItems: 'center', 
              gap: '4px', 
              padding: '6px',
            }}>
              <Globe size={14} />
              {language.toUpperCase()}
            </button>
          </nav>
        </div>
      </header>

      {/* HERO SECTION - CENTERED */}
      <section style={{
        background: colors.bgWhite,
        padding: isMobile ? '40px 20px 32px' : isTablet ? '56px 32px 48px' : '72px 48px 56px',
        maxWidth: '900px',
        margin: '0 auto',
        width: '100%',
        textAlign: 'center',
      }}>
        <h1 style={{
          fontSize: isMobile ? '28px' : isTablet ? '40px' : '52px',
          lineHeight: 1.1,
          fontWeight: 800,
          color: colors.primaryBlue,
          marginBottom: '20px',
          letterSpacing: '-0.02em',
        }}>
          {t.heroTitle1}<br />
          <span style={{ color: colors.actionOrange }}>{t.heroTitle2}</span>
        </h1>

        <p style={{
          fontSize: isMobile ? '16px' : '20px',
          color: colors.textGrey,
          marginBottom: '36px',
          lineHeight: 1.6,
          maxWidth: '680px',
          margin: '0 auto 36px',
        }}>
          {t.heroSub}
        </p>

        {/* CTAs Container */}
        <div style={{
          display: 'flex',
          flexDirection: isMobile ? 'column' : 'row',
          justifyContent: 'center',
          alignItems: 'center',
          gap: isMobile ? '14px' : '20px',
        }}>
          {/* CTA Primary */}
          <button
            onClick={handleCreateList}
            style={{
              background: colors.actionOrange,
              color: 'white',
              padding: isMobile ? '16px 28px' : '18px 36px',
              borderRadius: '10px',
              border: 'none',
              fontSize: isMobile ? '15px' : '17px',
              fontWeight: 700,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: btnShadow,
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: isMobile ? '100%' : 'auto',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = btnShadowHover;
              e.currentTarget.style.background = colors.actionOrangeHover;
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.boxShadow = btnShadow;
              e.currentTarget.style.background = colors.actionOrange;
            }}
          >
            {t.ctaPrimary}
            <ArrowRight size={18} />
          </button>

          {/* CTA Secondary */}
          <button
            onClick={handleSmartAssistant}
            style={{
              background: 'transparent',
              color: colors.accentGreen,
              padding: isMobile ? '14px 24px' : '16px 32px',
              borderRadius: '10px',
              border: `2px solid ${colors.accentGreen}`,
              fontSize: isMobile ? '14px' : '16px',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              display: 'inline-flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
              width: isMobile ? '100%' : 'auto',
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.background = colors.accentGreen;
              e.currentTarget.style.color = 'white';
              e.currentTarget.style.transform = 'translateY(-2px)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = colors.accentGreen;
              e.currentTarget.style.transform = 'translateY(0)';
            }}
          >
            <Sparkles size={18} />
            {t.ctaSecondary}
          </button>
        </div>
      </section>

      {/* TRUST BAR - Official Store Logos SVG */}
      <section style={{
        background: colors.bgTrust,
        padding: '20px 0',
        overflow: 'hidden',
        borderTop: '1px solid #E5E7EB',
        borderBottom: '1px solid #E5E7EB',
      }}>
        <p style={{
          textAlign: 'center',
          fontSize: isMobile ? '12px' : '14px',
          color: colors.textGrey,
          marginBottom: '16px',
          fontStyle: 'italic',
        }}>
          "{t.trustText}"
        </p>
        
        {/* Marquee Container */}
        <div style={{
          display: 'flex',
          overflow: 'hidden',
          width: '100%',
          maskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, transparent 0%, black 5%, black 95%, transparent 100%)',
        }}>
          <div 
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: isMobile ? '32px' : '48px',
              animation: 'marquee 35s linear infinite',
              whiteSpace: 'nowrap',
            }}
          >
            {[...storeLogos, ...storeLogos, ...storeLogos].map((logo, idx) => (
              <div 
                key={idx}
                style={{
                  flexShrink: 0,
                  opacity: 0.75,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <logo.Component height={logo.height} />
              </div>
            ))}
          </div>
        </div>

        <style>{`
          @keyframes marquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(-33.33%); }
          }
        `}</style>
      </section>

      {/* HOW IT WORKS SECTION */}
      <section style={{
        background: colors.bgWhite,
        padding: isMobile ? '40px 20px 48px' : '64px 48px 72px',
        maxWidth: '1200px',
        margin: '0 auto',
        width: '100%',
      }}>
        <h2 style={{
          fontSize: isMobile ? '24px' : '32px',
          fontWeight: 700,
          color: colors.primaryBlue,
          textAlign: 'center',
          marginBottom: isMobile ? '32px' : '48px',
        }}>
          {t.howItWorks}
        </h2>

        {/* 4-Column Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: isMobile ? 'repeat(2, 1fr)' : 'repeat(4, 1fr)',
          gap: isMobile ? '16px' : '24px',
        }}>
          {steps.map((step) => (
            <div
              key={step.num}
              style={{
                background: colors.bgWhite,
                borderRadius: '16px',
                padding: isMobile ? '20px 16px' : '28px 24px',
                boxShadow: cardShadow,
                transition: 'all 0.25s ease',
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                textAlign: 'center',
                border: '1px solid #F1F5F9',
              }}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)';
                e.currentTarget.style.boxShadow = cardShadowHover;
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = cardShadow;
              }}
              onClick={handleCreateList}
            >
              {/* Icon Container */}
              <div style={{
                width: isMobile ? '56px' : '72px',
                height: isMobile ? '56px' : '72px',
                borderRadius: '16px',
                background: `linear-gradient(135deg, ${colors.accentGreen}12 0%, ${colors.accentGreen}20 100%)`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '16px',
              }}>
                <step.Icon size={isMobile ? 28 : 36} color={colors.accentGreen} strokeWidth={1.5} />
              </div>

              {/* Step Number */}
              <div style={{
                width: '26px',
                height: '26px',
                borderRadius: '50%',
                background: colors.accentGreen,
                color: 'white',
                fontSize: '13px',
                fontWeight: 700,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                marginBottom: '12px',
              }}>
                {step.num}
              </div>

              {/* Title */}
              <strong style={{
                display: 'block',
                fontSize: isMobile ? '15px' : '18px',
                fontWeight: 700,
                color: colors.textDark,
                marginBottom: '8px',
                lineHeight: 1.3,
              }}>
                {step.title}
              </strong>

              {/* Description */}
              <span style={{
                fontSize: isMobile ? '13px' : '14px',
                color: colors.textGrey,
                lineHeight: 1.5,
              }}>
                {step.sub}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        background: colors.primaryBlue,
        color: 'white',
        padding: '20px 24px',
        textAlign: 'center',
        marginTop: 'auto',
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            gap: '24px', 
            marginBottom: '12px', 
            flexWrap: 'wrap',
          }}>
            <a href="/privacy" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '13px' }}>
              {language === 'es' ? 'Privacidad' : 'Privacy'}
            </a>
            <a href="/terms" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '13px' }}>
              {language === 'es' ? 'Terminos' : 'Terms'}
            </a>
            <a href="mailto:support@givlyn.com" style={{ color: 'rgba(255,255,255,0.9)', textDecoration: 'none', fontSize: '13px' }}>
              {language === 'es' ? 'Soporte' : 'Support'}
            </a>
          </div>
          <p style={{ fontSize: '12px', margin: '4px 0', opacity: 0.8 }}>
            {t.footerProduct} <strong>WINCOVA CORPORATION</strong>. {t.footerRights}
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
