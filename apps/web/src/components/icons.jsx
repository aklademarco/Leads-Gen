// 16px stroke icons, 1.5 stroke width. Inherit colour via currentColor.
function Icon({ size = 16, className = "", children, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
      {...rest}
    >
      {children}
    </svg>
  );
}

export const SearchIcon = (p) => (
  <Icon {...p}>
    <circle cx="7" cy="7" r="4.25" />
    <path d="M10.25 10.25 13.5 13.5" />
  </Icon>
);

export const InboxIcon = (p) => (
  <Icon {...p}>
    <path d="M2.5 9.5 4 3.5h8l1.5 6v3a1 1 0 0 1-1 1h-9a1 1 0 0 1-1-1z" />
    <path d="M2.5 9.5h3l.75 1.5h3.5l.75-1.5h3" />
  </Icon>
);

export const MenuIcon = (p) => (
  <Icon {...p}>
    <path d="M2.5 4.5h11M2.5 8h11M2.5 11.5h11" />
  </Icon>
);

export const CloseIcon = (p) => (
  <Icon {...p}>
    <path d="m4 4 8 8M12 4l-8 8" />
  </Icon>
);

export const PhoneIcon = (p) => (
  <Icon {...p}>
    <path d="M3.5 2.5h2l1 3-1.5 1a7 7 0 0 0 4.5 4.5l1-1.5 3 1v2a1 1 0 0 1-1 1A10.5 10.5 0 0 1 2.5 3.5a1 1 0 0 1 1-1z" />
  </Icon>
);

export const ChatIcon = (p) => (
  <Icon {...p}>
    <path d="M2.75 13.25 3.6 10.6A5.25 5.25 0 1 1 5.4 12.4z" />
  </Icon>
);

export const PinIcon = (p) => (
  <Icon {...p}>
    <path d="M8 14s4.5-4 4.5-7.5a4.5 4.5 0 0 0-9 0C3.5 10 8 14 8 14z" />
    <circle cx="8" cy="6.5" r="1.5" />
  </Icon>
);

export const MapIcon = (p) => (
  <Icon {...p}>
    <path d="M1.75 3.75 5.75 2.25l4.5 1.5 4-1.5v10l-4 1.5-4.5-1.5-4 1.5z" />
    <path d="M5.75 2.25v10M10.25 3.75v10" />
  </Icon>
);

export const MoreIcon = (p) => (
  <Icon {...p}>
    <circle cx="3.5" cy="8" r=".6" fill="currentColor" />
    <circle cx="8" cy="8" r=".6" fill="currentColor" />
    <circle cx="12.5" cy="8" r=".6" fill="currentColor" />
  </Icon>
);

export const BuildingIcon = (p) => (
  <Icon {...p}>
    <path d="M2 14h12" />
    <path d="M3.5 14V3.5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1V14" />
    <path d="M9.5 6.5h2a1 1 0 0 1 1 1V14" />
    <path d="M5.5 5h1.5M5.5 7.5h1.5M5.5 10h1.5" />
  </Icon>
);

export const CheckIcon = (p) => (
  <Icon {...p}>
    <path d="m3.5 8.5 3 3 6-7" />
  </Icon>
);

export const ChevronDownIcon = (p) => (
  <Icon {...p}>
    <path d="m4.5 6.5 3.5 3.5 3.5-3.5" />
  </Icon>
);

export const GridIcon = (p) => (
  <Icon {...p}>
    <rect x="2.5" y="2.5" width="4.5" height="4.5" rx="1" />
    <rect x="9" y="2.5" width="4.5" height="4.5" rx="1" />
    <rect x="2.5" y="9" width="4.5" height="4.5" rx="1" />
    <rect x="9" y="9" width="4.5" height="4.5" rx="1" />
  </Icon>
);

export const RowsIcon = (p) => (
  <Icon {...p}>
    <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" />
    <path d="M2.5 6.25h11M2.5 9.75h11" />
  </Icon>
);

export const NoteIcon = (p) => (
  <Icon {...p}>
    <path d="M10.5 2.5 13.5 5.5 6 13H3v-3z" />
    <path d="m9 4 3 3" />
  </Icon>
);

export const TrashIcon = (p) => (
  <Icon {...p}>
    <path d="M2.5 4.5h11M6.5 4.5V3a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 .5.5v1.5" />
    <path d="M4 4.5l.6 8.1a1 1 0 0 0 1 .9h4.8a1 1 0 0 0 1-.9l.6-8.1" />
  </Icon>
);

export const RetryIcon = (p) => (
  <Icon {...p}>
    <path d="M13 8a5 5 0 1 1-1.5-3.55" />
    <path d="M13 2.5v3h-3" />
  </Icon>
);

export const AlertIcon = (p) => (
  <Icon {...p}>
    <circle cx="8" cy="8" r="5.75" />
    <path d="M8 5v3.25M8 10.75h.01" />
  </Icon>
);

export const ClockIcon = (p) => (
  <Icon {...p}>
    <circle cx="8" cy="8" r="5.75" />
    <path d="M8 5v3l2 1.25" />
  </Icon>
);

export const FilterIcon = (p) => (
  <Icon {...p}>
    <path d="M2.5 4h11M4.5 8h7M6.5 12h3" />
  </Icon>
);

export const ArrowIcon = (p) => (
  <Icon {...p}>
    <path d="M3 8h10M9 4l4 4-4 4" />
  </Icon>
);

export function StarIcon({ filled, className = "", size = 12 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 12 12"
      aria-hidden="true"
      focusable="false"
      className={`shrink-0 ${className}`}
    >
      <path
        d="M6 1.2 7.4 4l3.1.45-2.25 2.2.53 3.1L6 8.27 3.22 9.75l.53-3.1L1.5 4.45 4.6 4z"
        fill={filled ? "currentColor" : "none"}
        stroke="currentColor"
        strokeWidth="1"
        strokeLinejoin="round"
      />
    </svg>
  );
}
