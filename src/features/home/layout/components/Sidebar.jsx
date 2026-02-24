import { useState, useCallback, useMemo, memo, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { SvgIcon, Logo } from "../../../../shared/components";
import ChevronLeft from "../../../../assets/icons/ChevronLeft.svg";
import ChevronRight from "../../../../assets/icons/ChevronRight.svg";
import { ROUTES } from "../../../../core/constants";

const Overview = () => (
    <svg width="100%" height="100%" viewBox="0 0 48 46" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M19.9998 11H13.3331C12.5967 11 11.9998 11.597 11.9998 12.3333V21.6667C11.9998 22.403 12.5967 23 13.3331 23H19.9998C20.7361 23 21.3331 22.403 21.3331 21.6667V12.3333C21.3331 11.597 20.7361 11 19.9998 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M34.667 11H28.0003C27.2639 11 26.667 11.597 26.667 12.3333V16.3333C26.667 17.0697 27.2639 17.6667 28.0003 17.6667H34.667C35.4034 17.6667 36.0003 17.0697 36.0003 16.3333V12.3333C36.0003 11.597 35.4034 11 34.667 11Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M34.667 23H28.0003C27.2639 23 26.667 23.597 26.667 24.3333V33.6667C26.667 34.403 27.2639 35 28.0003 35H34.667C35.4034 35 36.0003 34.403 36.0003 33.6667V24.3333C36.0003 23.597 35.4034 23 34.667 23Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M19.9998 28.3332H13.3331C12.5967 28.3332 11.9998 28.9301 11.9998 29.6665V33.6665C11.9998 34.4029 12.5967 34.9999 13.3331 34.9999H19.9998C20.7361 34.9999 21.3331 34.4029 21.3331 33.6665V29.6665C21.3331 28.9301 20.7361 28.3332 19.9998 28.3332Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)


const Library = () => (
    <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M16.5152 13.2727H10.1515C9.56579 13.2727 9.09094 13.7297 9.09094 14.2935V31.6459C9.09094 32.2097 9.56579 32.6667 10.1515 32.6667H16.5152C17.1009 32.6667 17.5758 32.2097 17.5758 31.6459V14.2935C17.5758 13.7297 17.1009 13.2727 16.5152 13.2727Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M22.6264 6H18.586C18.0282 6 17.5759 6.45919 17.5759 7.02564V31.641C17.5759 32.2075 18.0282 32.6667 18.586 32.6667H22.6264C23.1843 32.6667 23.6365 32.2075 23.6365 31.641V7.02564C23.6365 6.45919 23.1843 6 22.6264 6Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M27.3017 9.64311L24.7687 9.90908C24.0715 9.98231 23.5661 10.6332 23.6445 11.3548L25.8339 31.4809C25.9129 32.2025 26.5468 32.7326 27.244 32.66L29.777 32.394C30.4742 32.3208 30.9796 31.6699 30.9012 30.9483L28.7149 10.8253C28.6328 10.1006 27.9989 9.56988 27.3017 9.64311Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round" />
        <path d="M9.09094 34H20.3892" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)


const Progress = () => (
    <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M12.2222 10L12.2132 27.8852L30 27.7778V30H10L10.009 10H12.2222ZM30 13.3333V20H27.7778L27.7778 17.0504L22.182 22.0866L19.4444 19.35L14.119 24.6746L12.5477 23.1032L19.4444 16.2064L22.2622 19.0233L26.1166 15.5555L23.3333 15.5556V13.3333H30Z" fill="currentColor" />
    </svg>
)


const UserBook = () => (
    <svg width="100%" height="100%" viewBox="0 0 45 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M35.9615 20.9617V18.3596C35.9615 17.9066 35.5615 17.5393 35.0681 17.5393C33.2223 17.5393 31.5014 17.6823 29.8756 17.9743C28.9279 17.1341 27.7725 16.5244 26.5213 16.1912C27.8856 15.1369 28.7542 13.5585 28.7542 11.797C28.7542 8.6005 25.9485 6 22.4999 6C19.0513 6 16.2456 8.6005 16.2456 11.797C16.2456 13.5585 17.1141 15.1369 18.4785 16.1911C17.2273 16.5244 16.0719 17.1341 15.1242 17.9743C13.4984 17.6823 11.7776 17.5392 9.93176 17.5392C9.43833 17.5392 9.03829 17.9065 9.03829 18.3596V20.9617C7.99835 21.3003 7.25134 22.2121 7.25134 23.2815V24.9222C7.25134 25.9916 7.99835 26.9035 9.03829 27.2421V29.8442C9.03829 30.2972 9.43833 30.6645 9.93176 30.6645C14.6034 30.6645 18.4395 31.6808 22.0044 33.8628C22.3031 34.0455 22.6966 34.046 22.9956 33.8628C26.5604 31.6808 30.3965 30.6645 35.0682 30.6645C35.5616 30.6645 35.9617 30.2972 35.9617 29.8442V27.2421C37.0016 26.9035 37.7486 25.9916 37.7486 24.9222V23.2815C37.7485 22.2122 37.0015 21.3003 35.9615 20.9617ZM18.0325 11.797C18.0325 9.50516 20.0366 7.64066 22.4999 7.64066C24.9632 7.64066 26.9672 9.50516 26.9672 11.797C26.9672 14.0586 24.9632 15.8986 22.4999 15.8986C20.0366 15.8986 18.0325 14.0586 18.0325 11.797ZM9.9317 25.7426C9.43904 25.7426 9.03823 25.3746 9.03823 24.9223V23.2816C9.03823 22.8293 9.43904 22.4613 9.9317 22.4613C10.4244 22.4613 10.8252 22.8293 10.8252 23.2816V24.9223C10.8252 25.3746 10.4244 25.7426 9.9317 25.7426ZM21.6064 31.7083C18.3629 30.0052 14.8824 29.1445 10.8252 29.0357V27.2422C11.8651 26.9035 12.6121 25.9917 12.6121 24.9223V23.2816C12.6121 22.2122 11.8651 21.3003 10.8252 20.9617V19.1916C15.0234 19.3022 18.3979 20.2099 21.6064 22.0855V31.7083ZM22.4999 20.6642C20.8508 19.7088 19.1342 18.9814 17.3018 18.4702C18.3087 17.8694 19.4939 17.5393 20.7129 17.5393H24.2868C25.5058 17.5393 26.6911 17.8694 27.698 18.4702C25.8655 18.9814 24.1489 19.7088 22.4999 20.6642ZM34.1746 29.0357C30.1175 29.1445 26.6368 30.0055 23.3934 31.7084V22.0861C26.6019 20.2103 29.9762 19.3021 34.1746 19.1916V20.9617C33.1346 21.3003 32.3876 22.2122 32.3876 23.2816V24.9223C32.3876 25.9917 33.1346 26.9035 34.1746 27.2422V29.0357ZM35.9615 24.9223C35.9615 25.3746 35.5607 25.7426 35.0681 25.7426C34.5754 25.7426 34.1746 25.3746 34.1746 24.9223V23.2816C34.1746 22.8293 34.5754 22.4613 35.0681 22.4613C35.5607 22.4613 35.9615 22.8293 35.9615 23.2816V24.9223Z" fill="currentColor" />
    </svg>
)

const Course = () => (
    <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M31 10H9C8.20435 10 7.44129 10.3161 6.87868 10.8787C6.31607 11.4413 6 12.2044 6 13V27C6 27.7956 6.31607 28.5587 6.87868 29.1213C7.44129 29.6839 8.20435 30 9 30H31C31.7956 30 32.5587 29.6839 33.1213 29.1213C33.6839 28.5587 34 27.7956 34 27V13C34 12.2044 33.6839 11.4413 33.1213 10.8787C32.5587 10.3161 31.7956 10 31 10ZM8 27V13C8 12.7348 8.10536 12.4804 8.29289 12.2929C8.48043 12.1054 8.73478 12 9 12H14V24C14 24.2652 14.1054 24.5196 14.2929 24.7071C14.4804 24.8946 14.7348 25 15 25C15.2652 25 15.5196 24.8946 15.7071 24.7071C15.8946 24.5196 16 24.2652 16 24V12H19V28H9C8.73478 28 8.48043 27.8946 8.29289 27.7071C8.10536 27.5196 8 27.2652 8 27ZM32 27C32 27.2652 31.8946 27.5196 31.7071 27.7071C31.5196 27.8946 31.2652 28 31 28H21V12H31C31.2652 12 31.5196 12.1054 31.7071 12.2929C31.8946 12.4804 32 12.7348 32 13V27Z" fill="currentColor" />
        <path d="M29 15H24C23.7348 15 23.4804 15.1054 23.2929 15.2929C23.1054 15.4804 23 15.7348 23 16C23 16.2652 23.1054 16.5196 23.2929 16.7071C23.4804 16.8946 23.7348 17 24 17H29C29.2652 17 29.5196 16.8946 29.7071 16.7071C29.8946 16.5196 30 16.2652 30 16C30 15.7348 29.8946 15.4804 29.7071 15.2929C29.5196 15.1054 29.2652 15 29 15Z" fill="currentColor" />
        <path d="M29 19H26C25.7348 19 25.4804 19.1054 25.2929 19.2929C25.1054 19.4804 25 19.7348 25 20C25 20.2652 25.1054 20.5196 25.2929 20.7071C25.4804 20.8946 25.7348 21 26 21H29C29.2652 21 29.5196 20.8946 29.7071 20.7071C29.8946 20.5196 30 20.2652 30 20C30 19.7348 29.8946 19.4804 29.7071 19.2929C29.5196 19.1054 29.2652 19 29 19Z" fill="currentColor" />
        <path d="M29 23H24C23.7348 23 23.4804 23.1054 23.2929 23.2929C23.1054 23.4804 23 23.7348 23 24C23 24.2652 23.1054 24.5196 23.2929 24.7071C23.4804 24.8946 23.7348 25 24 25H29C29.2652 25 29.5196 24.8946 29.7071 24.7071C29.8946 24.5196 30 24.2652 30 24C30 23.7348 29.8946 23.4804 29.7071 23.2929C29.5196 23.1054 29.2652 23 29 23Z" fill="currentColor" />
    </svg>
)

const Calendar = () => (
    <svg width="100%" height="100%" viewBox="0 0 45 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M24.8238 32.0699H9.84102C9.48948 32.0685 9.1524 31.9297 8.90182 31.6832C8.65124 31.4366 8.50703 31.1019 8.5 30.7504V9.27259C8.5 8.91694 8.64129 8.57584 8.89277 8.32435C9.14426 8.07286 9.48536 7.93158 9.84102 7.93158H31.2973C31.653 7.93158 31.994 8.07286 32.2455 8.32435C32.497 8.57584 32.6383 8.91694 32.6383 9.27259V21.3363" stroke="currentColor" strokeWidth="2" />
        <path d="M8.5 14.6899H32.6383" stroke="currentColor" strokeWidth="2" />
        <path d="M14.2937 7.93106V6" stroke="currentColor" strokeWidth="2" />
        <path d="M26.8447 7.93106V6" stroke="currentColor" strokeWidth="2" />
        <path d="M29.7414 34C33.4741 34 36.5001 30.974 36.5001 27.2413C36.5001 23.5085 33.4741 20.4825 29.7414 20.4825C26.0087 20.4825 22.9827 23.5085 22.9827 27.2413C22.9827 30.974 26.0087 34 29.7414 34Z" stroke="currentColor" strokeWidth="2" />
        <path d="M29.7419 22.4141V27.3611L32.6385 29.1728" stroke="currentColor" strokeWidth="2" />
    </svg>

)

const Payment = () => (
    <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M12.1667 24.5556V30.8889H33.8333V16.1111H29.5V14H34.6112C35.0943 14 35.2698 14.0486 35.4453 14.1414C35.6206 14.2311 35.7641 14.3701 35.857 14.5404C35.9502 14.7114 36 14.8824 36 15.3532V31.6468C36 32.1176 35.9502 32.2886 35.8548 32.4596C35.7629 32.6304 35.6201 32.7702 35.4453 32.8607C35.2698 32.9514 35.0943 33 34.6112 33H11.3888C10.9057 33 10.7302 32.9514 10.5547 32.8586C10.3794 32.7689 10.2359 32.6299 10.143 32.4596C10.052 32.2886 10 32.1176 10 31.6489V24.5556H12.1667Z" fill="currentColor" />
        <path d="M29.8333 9.22222H8.16667V24.7778H29.8333V9.22222ZM32 8.42444V25.5756C32 26.0711 31.9502 26.2511 31.8548 26.4311C31.7629 26.6109 31.6201 26.7581 31.4453 26.8533C31.2698 26.9489 31.0943 27 30.6112 27H7.38883C6.90567 27 6.73017 26.9489 6.55467 26.8511C6.37937 26.7568 6.23589 26.6104 6.143 26.4311C6.052 26.2511 6 26.0711 6 25.5778V8.42444C6 7.92889 6.04983 7.74889 6.14517 7.56889C6.23713 7.38909 6.37985 7.24194 6.55467 7.14667C6.73017 7.05333 6.90567 7 7.38667 7H30.609C31.0922 7 31.2677 7.05111 31.4432 7.14889C31.6185 7.24321 31.7619 7.38959 31.8548 7.56889C31.948 7.74889 31.9978 7.92889 31.9978 8.42444H32Z" fill="currentColor" />
        <path d="M19 22C17.6739 22 16.4021 21.4732 15.4645 20.5355C14.5268 19.5979 14 18.3261 14 17C14 15.6739 14.5268 14.4021 15.4645 13.4645C16.4021 12.5268 17.6739 12 19 12C20.3261 12 21.5979 12.5268 22.5355 13.4645C23.4732 14.4021 24 15.6739 24 17C24 18.3261 23.4732 19.5979 22.5355 20.5355C21.5979 21.4732 20.3261 22 19 22ZM19 20C19.7956 20 20.5587 19.6839 21.1213 19.1213C21.6839 18.5587 22 17.7956 22 17C22 16.2044 21.6839 15.4413 21.1213 14.8787C20.5587 14.3161 19.7956 14 19 14C18.2044 14 17.4413 14.3161 16.8787 14.8787C16.3161 15.4413 16 16.2044 16 17C16 17.7956 16.3161 18.5587 16.8787 19.1213C17.4413 19.6839 18.2044 20 19 20Z" fill="currentColor" />
    </svg>
)
const Logout = () => (
    <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <g clipPath="url(#clip0_654_594)">
            <path d="M23 21C22.447 21 22 21.448 22 22V26C22 26.551 21.552 27 21 27H18V12C18 11.146 17.456 10.383 16.638 10.099L16.342 10H21C21.552 10 22 10.449 22 11V14C22 14.552 22.447 15 23 15C23.553 15 24 14.552 24 14V11C24 9.346 22.654 8 21 8H10.25C10.212 8 10.18 8.017 10.143 8.022C10.095 8.018 10.049 8 10 8C8.897 8 8 8.897 8 10V28C8 28.854 8.544 29.617 9.362 29.901L15.38 31.907C15.584 31.97 15.787 32 16 32C17.103 32 18 31.103 18 30V29H21C22.654 29 24 27.654 24 26V22C24 21.448 23.553 21 23 21Z" fill="currentColor" />
            <path d="M31.707 17.293L27.707 13.293C27.421 13.007 26.991 12.921 26.617 13.076C26.244 13.231 26 13.596 26 14V17H22C21.448 17 21 17.448 21 18C21 18.552 21.448 19 22 19H26V22C26 22.404 26.244 22.769 26.617 22.924C26.991 23.079 27.421 22.993 27.707 22.707L31.707 18.707C32.098 18.316 32.098 17.684 31.707 17.293Z" fill="currentColor" />
        </g>
        <defs>
            <clipPath id="clip0_654_594">
                <rect width="24" height="24" fill="white" transform="translate(8 8)" />
            </clipPath>
        </defs>
    </svg>
)

const Settings = () => (
    <svg width="100%" height="100%" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path fillRule="evenodd" clipRule="evenodd" d="M18.8 32.4C18.1716 32.4 17.6355 31.93 17.5332 31.2893C17.4389 30.771 17.0778 30.3474 16.592 30.1857C16.1962 30.0452 15.8091 29.8796 15.4332 29.6897C14.9858 29.4532 14.449 29.4886 14.0343 29.7818C13.5324 30.1547 12.843 30.0969 12.4057 29.6454L10.7052 27.8881C10.2475 27.4152 10.188 26.6696 10.5646 26.1256C10.855 25.6871 10.8968 25.1219 10.6743 24.6429C10.5277 24.3102 10.3983 23.9696 10.2869 23.6225C10.1272 23.0757 9.6865 22.6662 9.14344 22.5597C8.48856 22.4516 8.0051 21.8704 8.00002 21.1851V18.9867C7.99654 18.1968 8.54866 17.5212 9.30287 17.3924C9.87504 17.2799 10.3528 16.875 10.5714 16.3172C10.6366 16.1601 10.7052 16.0042 10.7772 15.8495C11.0679 15.271 11.0278 14.5743 10.6726 14.0356C10.2284 13.3976 10.2966 12.5212 10.8337 11.9648L12.0834 10.6734C12.6998 10.0363 13.6719 9.9538 14.3806 10.4785L14.42 10.5069C14.9492 10.8749 15.6226 10.9416 16.2097 10.684C16.8379 10.4504 17.3009 9.89263 17.4286 9.21552L17.4458 9.15529C17.5868 8.25889 18.336 7.60035 19.2149 7.59998H20.7235C21.626 7.59955 22.3963 8.27413 22.544 9.19426L22.5714 9.31826C22.6926 9.9669 23.1316 10.5037 23.7303 10.7354C24.3073 10.9913 24.9709 10.9245 25.4892 10.5583L25.5749 10.4945C26.3019 9.95303 27.3016 10.0363 27.9355 10.6911L29.0857 11.8815C29.6622 12.4805 29.7347 13.4225 29.2571 14.1082C28.883 14.6813 28.8353 15.4177 29.132 16.0373L29.2058 16.2144C29.446 16.8194 29.9659 17.2578 30.5874 17.38C31.3999 17.517 31.9974 18.2408 32 19.0912V21.0628C31.9998 21.8129 31.4748 22.4527 30.7589 22.5756C30.17 22.6924 29.6904 23.1329 29.5091 23.7235C29.4291 23.9596 29.34 24.196 29.2417 24.4321C29.0129 24.9511 29.0637 25.5559 29.3755 26.0264C29.7867 26.6177 29.7229 27.4299 29.2246 27.9448L27.6287 29.5958C27.1722 30.0674 26.4524 30.1281 25.9281 29.7393C25.4903 29.4302 24.9233 29.3962 24.4538 29.6507C24.1192 29.822 23.7758 29.974 23.4252 30.106C22.9349 30.2808 22.5734 30.7145 22.4789 31.2415C22.3789 31.9045 21.8287 32.395 21.1794 32.4H18.8Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
        <path fillRule="evenodd" clipRule="evenodd" d="M24 19.6C24 21.8092 22.2092 23.6 20 23.6C17.7908 23.6 16 21.8092 16 19.6C16 17.3908 17.7908 15.6 20 15.6C22.2092 15.6 24 17.3908 24 19.6Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
)

const TooltipIcon = memo(({ label }) => {
    return (
        <div className="px-4 py-[9px] rounded-lg bg-blue-800 text-white whitespace-nowrap">
            <span className="text-text-4 font-semibold">{label}</span>
        </div>
    )
});

TooltipIcon.displayName = 'TooltipIcon';

const TooltipPortal = memo(({ children, position }) => {
    if (!position) return null;
    
    return createPortal(
        <div 
            style={{
                position: 'fixed',
                left: `${position.left}px`,
                top: `${position.top}px`,
                transform: 'translateY(-50%)',
                zIndex: 9999,
                pointerEvents: 'none',
            }}
            className="animate-[fadeIn_0.15s_ease-in-out]"
        >
            {children}
        </div>,
        document.body
    );
});

TooltipPortal.displayName = 'TooltipPortal';

const MenuItem = memo(({ item, index, isActive, isCollapsed, hoveredIndex, onMouseEnter, onMouseLeave }) => {
    const Icon = item.icon;
    const active = isActive(item.path);
    const itemRef = useRef(null);
    const [tooltipPosition, setTooltipPosition] = useState(null);

    useEffect(() => {
        if (isCollapsed && hoveredIndex === index && !active && itemRef.current) {
            const rect = itemRef.current.getBoundingClientRect();
            setTooltipPosition({
                left: rect.right - 18 ,
                top: rect.top + rect.height / 2,
            });
        } else {
            setTooltipPosition(null);
        }
    }, [isCollapsed, hoveredIndex, index, active]);

    return (
        <>
            <div
                ref={itemRef}
                className="relative w-full flex justify-center"
                onMouseEnter={onMouseEnter}
                onMouseLeave={onMouseLeave}
            >
                <Link
                    to={item.path}
                    className={`
                        group
                        flex ${isCollapsed ? 'justify-center' : 'flex-row gap-2 md:gap-2.5 lg:gap-3'} items-center
                        ${isCollapsed ? 'p-1.5 md:p-1.5 lg:p-2' : 'px-3 py-1.5 md:px-3.5 md:py-1.5 lg:px-4 lg:py-2'} rounded-2xl ${isCollapsed ? '' : 'w-full'}
                        transition-colors
                        ${active ? 'bg-blue-800' : 'hover:bg-blue-100'}
                    `}
                    title={isCollapsed ? item.label : undefined}
                >
                    <div className={`flex justify-center items-center w-8 h-8 md:w-9 md:h-9 lg:w-10 lg:h-10 ${active ? 'text-white' : 'text-gray-900 group-hover:text-blue-800'}`}>
                        <Icon />
                    </div>
                    {!isCollapsed && (
                        <span className={`${active ? 'text-white' : 'text-gray-900 group-hover:text-blue-800'} text-text-4 font-semibold flex-shrink-0`}>
                            {item.label}
                        </span>
                    )}
                </Link>
            </div>

            {tooltipPosition && (
                <TooltipPortal position={tooltipPosition}>
                    <TooltipIcon label={item.label} />
                </TooltipPortal>
            )}
        </>
    );
});

MenuItem.displayName = 'MenuItem';


// Menu items configuration - moved outside component for performance
const MENU_ITEMS = [
    {
        icon: Overview,
        label: "Tổng quan",
        path: ROUTES.DASHBOARD,
    },
    {
        icon: Course,
        label: "Khóa học",
        path: ROUTES.COURSE_ENROLLMENTS,
    },
    {
        icon: UserBook,
        label: "Phòng luyện đề",
        path: ROUTES.USER_BOOK,
    },
    {
        icon: Library,
        label: "Thư viện",
        path: ROUTES.LIBRARY,
    },
    {
        icon: Progress,
        label: "Tiến độ học tập",
        path: ROUTES.PROGRESS,
    },
    {
        icon: Calendar,
        label: "Lịch học",
        path: ROUTES.CALENDAR,
    },
    {
        icon: Payment,
        label: "Thanh toán",
        path: ROUTES.PAYMENT,
    },
];

const BOTTOM_MENU_ITEMS = [
    {
        icon: Settings,
        label: "Cài đặt",
        path: ROUTES.SETTINGS,
    },
    {
        icon: Logout,
        label: "Đăng xuất",
        path: ROUTES.LOGOUT,
    },
];

export const Sidebar = memo(({ isCollapsed, onToggleCollapse }) => {
    const location = useLocation();
    const [hoveredIndex, setHoveredIndex] = useState(null);

    const isActive = useCallback((path) => {
        return location.pathname === path || location.pathname.startsWith(path + '/');
    }, [location.pathname]);

    const handleMouseEnter = useCallback((index) => {
        setHoveredIndex(index);
    }, []);

    const handleMouseLeave = useCallback(() => {
        setHoveredIndex(null);
    }, []);

    const renderMenuItems = useMemo(() => (
        MENU_ITEMS.map((item, index) => (
            <MenuItem
                key={item.path}
                item={item}
                index={index}
                isActive={isActive}
                isCollapsed={isCollapsed}
                hoveredIndex={hoveredIndex}
                onMouseEnter={() => handleMouseEnter(index)}
                onMouseLeave={handleMouseLeave}
            />
        ))
    ), [isActive, isCollapsed, hoveredIndex, handleMouseEnter, handleMouseLeave]);

    const renderBottomMenuItems = useMemo(() => (
        BOTTOM_MENU_ITEMS.map((item, index) => {
            const bottomIndex = MENU_ITEMS.length + index;
            return (
                <MenuItem
                    key={item.path}
                    item={item}
                    index={bottomIndex}
                    isActive={isActive}
                    isCollapsed={isCollapsed}
                    hoveredIndex={hoveredIndex}
                    onMouseEnter={() => handleMouseEnter(bottomIndex)}
                    onMouseLeave={handleMouseLeave}
                />
            );
        })
    ), [isActive, isCollapsed, hoveredIndex, handleMouseEnter, handleMouseLeave]);

    if (isCollapsed) {
        return (
            <aside className="
                pt-3 px-3 pb-6 md:pt-4 md:px-4 md:pb-7 lg:pt-5 lg:px-6 lg:pb-9
                h-screen
                bg-background
                w-[100px] md:w-[120px] lg:w-[132px]
                flex flex-col
            ">
                {/* Logo Collapsed */}
                <Logo mode="collapsed" />

                {/* Expand Button */}
                <div className="flex items-center w-full justify-end flex-shrink-0">
                    <button
                        onClick={onToggleCollapse}
                        className="
                            w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8
                            flex items-center justify-center
                            bg-blue-light
                            hover:bg-blue-cyan
                            rounded-full
                            cursor-pointer
                            transition
                        "
                        aria-label="Mở rộng sidebar"
                    >
                        <SvgIcon src={ChevronRight} width={8} height={16} />
                    </button>
                </div>

                {/* Menu Items - Collapsed - Scrollable */}
                <div className="flex-1 overflow-y-auto overflow-x-hidden mt-4 md:mt-5 lg:mt-6 flex flex-col gap-2 md:gap-2.5 lg:gap-3">
                    {renderMenuItems}
                </div>

                {/* Bottom Menu Items - Collapsed - Fixed at bottom */}
                <div className="flex flex-col gap-4 md:gap-5 lg:gap-6 justify-center items-center w-full mt-4 md:mt-5 lg:mt-6 flex-shrink-0">
                    {renderBottomMenuItems}
                </div>
            </aside>
        );
    }

    return (
        <aside className="
            pt-3 px-3 pb-3 md:pt-4 md:px-4 md:pb-16 lg:pt-5 lg:px-6 lg:pb-10
            h-screen
            bg-background
            w-[240px] md:w-[260px] lg:w-[288px]
            flex flex-col
        ">
            {/* Logo */}
            <Logo mode="default" />

            {/* Collapse Button */}
            <div className="flex items-center w-full justify-end flex-shrink-0">
                <button
                    onClick={onToggleCollapse}
                    className="
                        w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8
                        flex items-center justify-center
                        bg-blue-light
                        hover:bg-blue-cyan
                        rounded-full
                        cursor-pointer
                        transition
                    "
                    aria-label="Thu gọn sidebar"
                >
                    <SvgIcon src={ChevronLeft} width={8} height={16} />
                </button>
            </div>

            {/* Menu Items - Scrollable */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden mt-3 md:mt-3.5 lg:mt-[14px] flex flex-col gap-2 md:gap-2.5 lg:gap-3">
                {renderMenuItems}
            </div>

            {/* Bottom Menu Items - Fixed at bottom */}
            <div className="flex flex-col gap-2 md:gap-2.5 lg:gap-3 justify-center items-center w-full mt-4 md:mt-5 lg:mt-6 flex-shrink-0">
                {renderBottomMenuItems}
            </div>
        </aside>
    );
});

Sidebar.displayName = 'Sidebar';

export default Sidebar;
