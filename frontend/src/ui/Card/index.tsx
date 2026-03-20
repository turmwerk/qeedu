import React from "react";
import { RightOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import Button from "@/ui/Button";

// ─── Sub-link ─────────────────────────────────────────────────────────────────

export type SubLink = {
  label: string;
  /** Navigate to this route when clicked (mutually exclusive with onClick). */
  to?: string;
  icon?: React.ReactNode;
  /** Custom click handler (used when `to` is absent). */
  onClick?: () => void;
};

// ─── Props ────────────────────────────────────────────────────────────────────

export type CardProps = {
  // ── icon ──────────────────────────────────────────────────────────────────
  /** Icon displayed in the card. */
  icon?: React.ReactNode;
  /**
   * How the icon is laid out relative to the title.
   *
   * - `"stacked"` (default): icon sits on its own row above the title, inside
   *   a small rounded box (tutorial-card style).  A level badge is shown on the
   *   same row to the right.
   * - `"inline"`: icon and title share the same row and behave as a single
   *   clickable link (module-card / hub style).  Sub-links indent to match the
   *   title.
   */
  iconLayout?: "stacked" | "inline";

  // ── title ─────────────────────────────────────────────────────────────────
  /** Main heading text. */
  title: string;
  /**
   * When supplied the title becomes a navigable link with a hover underline
   * animation (uses Button under the hood, no default underline).
   * In `"inline"` iconLayout the underline starts after the icon.
   */
  titleLink?: string;

  // ── subTitle ──────────────────────────────────────────────────────────────
  /** Optional secondary heading rendered below the title. */
  subTitle?: string;
  /** When supplied subTitle becomes a navigable link with hover underline. */
  subTitleLink?: string;

  // ── body ──────────────────────────────────────────────────────────────────
  /** Body description text. */
  desc?: string;

  // ── card background ───────────────────────────────────────────────────────
  /**
   * Background style for light mode (e.g. a css gradient).
   * When omitted the default frosted-glass white style is applied.
   */
  lightStyle?: React.CSSProperties;
  /** Background style for dark mode. Paired with `lightStyle`. */
  darkStyle?: React.CSSProperties;

  // ── level badge ───────────────────────────────────────────────────────────
  /** Level label shown as a badge (e.g. "入门"). Hidden when not supplied. */
  level?: string;
  /** Tailwind classes for the badge in light mode. */
  badge?: string;
  /** Tailwind classes for the badge in dark mode. */
  darkBadge?: string;

  // ── meta footer ───────────────────────────────────────────────────────────
  /** Programming-language label shown in the footer (hidden when absent). */
  lang?: string;
  /** Time-estimate label shown in the footer (hidden when absent). */
  time?: string;
  /**
   * Show the right-arrow icon on hover in the footer.
   * Defaults to `false`.
   */
  showArrow?: boolean;

  // ── sub-links ─────────────────────────────────────────────────────────────
  /** Array of link/action buttons rendered below the description. */
  subLinks?: SubLink[];

  // ── extras ────────────────────────────────────────────────────────────────
  className?: string;
  /** Invoked when the whole card area is clicked. */
  onClick?: () => void;
};

// ─── Dark-mode hook ───────────────────────────────────────────────────────────

function useIsDark() {
  const [dark, setDark] = React.useState(() =>
    document.documentElement.classList.contains("dark"),
  );
  React.useEffect(() => {
    const obs = new MutationObserver(() =>
      setDark(document.documentElement.classList.contains("dark")),
    );
    obs.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });
    return () => obs.disconnect();
  }, []);
  return dark;
}

// ─── Component ────────────────────────────────────────────────────────────────

const Card: React.FC<CardProps> = ({
  icon,
  iconLayout = "stacked",
  title,
  titleLink,
  subTitle,
  subTitleLink,
  desc,
  lightStyle,
  darkStyle,
  level,
  badge,
  darkBadge,
  lang,
  time,
  showArrow = false,
  subLinks,
  className = "",
  onClick,
}) => {
  const isDark = useIsDark();
  const navigate = useNavigate();

  // ── card background ────────────────────────────────────────────────────────
  const hasCustomBg = lightStyle || darkStyle;
  const cardBgStyle: React.CSSProperties = hasCustomBg
    ? (isDark ? darkStyle ?? {} : lightStyle ?? {})
    : {};

  const defaultBgClass = hasCustomBg
    ? ""
    : "bg-white/[0.58] dark:bg-white/10 border-0 shadow-[0_8px_30px_rgba(120,90,200,0.14),inset_0_1px_0_rgba(255,255,255,0.74),inset_0_-1px_0_rgba(255,255,255,0.34)] dark:shadow-[0_8px_30px_rgba(0,0,0,0.46),inset_0_1px_0_rgba(255,255,255,0.14),inset_0_-1px_0_rgba(255,255,255,0.08)]";

  // ── badge class (light / dark) ─────────────────────────────────────────────
  const activeBadgeClass = level
    ? isDark && darkBadge
      ? darkBadge
      : (badge ?? "")
    : "";

  // ── shared link-button style (hover underline animation) ──────────────────
  const linkBtnBase =
    "relative inline-flex items-center gap-0 p-0 pb-0.5 bg-transparent border-0 text-[var(--brand-blue)] hover:text-[var(--brand-purple)] transition-colors duration-200 cursor-pointer select-none after:content-[''] after:absolute after:left-0 after:bottom-0 after:bg-current after:transition-all after:duration-200";

  // ── subTitle element ───────────────────────────────────────────────────────
  const subTitleEl = subTitle ? (
    subTitleLink ? (
      <Button
        type="button"
        className={`${linkBtnBase} after:h-[1.5px] after:w-0 hover:after:w-full font-semibold text-[15px] leading-snug`}
        onClick={(e) => {
          e.stopPropagation();
          navigate(subTitleLink);
        }}
      >
        {subTitle}
      </Button>
    ) : (
      <span className="text-[15px] font-bold leading-snug text-gray-800 dark:text-white">
        {subTitle}
      </span>
    )
  ) : null;

  // ── INLINE layout (icon + title share one row, like ModuleCard) ────────────
  if (iconLayout === "inline") {
    return (
      // eslint-disable-next-line react/forbid-dom-props
      <div
        style={cardBgStyle}
        className={`group relative flex flex-col gap-3 rounded-2xl p-3 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg overflow-hidden backdrop-blur-[40px] backdrop-saturate-[210%] min-w-0 ${defaultBgClass} ${className}`}
        onClick={onClick}
        role={onClick ? "button" : undefined}
        tabIndex={onClick ? 0 : undefined}
        onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); } : undefined}
      >
        {/* icon + title combined row */}
        <div
          className={`relative inline-flex items-center gap-3 pb-1 w-fit ${
            titleLink
              ? "text-[var(--brand-blue)] hover:text-[var(--brand-purple)] cursor-pointer after:content-[''] after:absolute after:bottom-0 after:h-[2px] after:w-0 after:bg-current after:transition-all after:duration-200 hover:after:w-full"
              : ""
          }`}
          style={titleLink && icon ? { paddingLeft: 0 } : undefined}
          onClick={titleLink ? (e) => { e.stopPropagation(); navigate(titleLink); } : undefined}
          role={titleLink ? "button" : undefined}
          tabIndex={titleLink ? 0 : undefined}
          onKeyDown={titleLink ? (e) => { if (e.key === "Enter" || e.key === " ") navigate(titleLink!); } : undefined}
        >
          {icon && (
            <span className="shrink-0 text-[16px] sm:text-[22px] leading-none transition-colors duration-200">
              {icon}
            </span>
          )}
          <span className="font-extrabold text-[16px] sm:text-[22px] leading-none break-words transition-colors duration-200">
            {title}
          </span>
        </div>

        {/* optional subTitle */}
        {subTitleEl && (
          <div>{subTitleEl}</div>
        )}

        {/* description */}
        {desc && (
          <div className="text-[14px] leading-[1.6] text-[#5a6475] dark:text-[#c1cbde] whitespace-pre-line">
            {desc}
          </div>
        )}

        {/* sub-links */}
        {subLinks && subLinks.length > 0 && (
          <div className="flex flex-wrap gap-x-4 gap-y-1 pt-1">
            {subLinks.map((link, idx) => (
              <Button
                key={link.to ?? idx}
                type="button"
                className={`${linkBtnBase} after:h-[1.5px] after:w-0 hover:after:w-full text-[14px] font-semibold gap-1.5`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (link.onClick) link.onClick();
                  else if (link.to) navigate(link.to);
                }}
              >
                {link.icon && link.icon}
                <span>{link.label}</span>
              </Button>
            ))}
          </div>
        )}
      </div>
    );
  }

  // ── STACKED layout (icon top-left in box, title below, like TutorialSection)
  const hasMeta = lang || time;

  return (
    // eslint-disable-next-line react/forbid-dom-props
    <div
      style={cardBgStyle}
      className={`group relative flex flex-col gap-0 rounded-2xl p-3 sm:p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-lg overflow-hidden backdrop-blur-[40px] backdrop-saturate-[210%] min-w-0 ${defaultBgClass} ${className}`}
      onClick={onClick}
      role={onClick ? "button" : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyDown={onClick ? (e) => { if (e.key === "Enter" || e.key === " ") onClick(); } : undefined}
    >
      {/* top row: boxed icon + level badge */}
      {(icon || level) && (
        <div className="mb-4 flex items-start justify-between">
          {icon ? (
            <div className="flex h-9 w-9 sm:h-11 sm:w-11 items-center justify-center rounded-xl sm:rounded-2xl bg-white/70 dark:bg-white/20 text-base sm:text-lg font-bold text-gray-700 dark:text-white shadow-sm backdrop-blur-sm">
              {icon}
            </div>
          ) : (
            <span />
          )}
          {level && (
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${activeBadgeClass}`}>
              {level}
            </span>
          )}
        </div>
      )}

      {/* title */}
      <div className="mb-1.5">
        {titleLink ? (
          <Button
            type="button"
            className={`${linkBtnBase} after:h-[2px] after:w-0 hover:after:w-full font-bold text-[13px] sm:text-[15px] leading-snug break-words whitespace-normal text-left`}
            onClick={(e) => { e.stopPropagation(); navigate(titleLink); }}
          >
            {title}
          </Button>
        ) : (
          <span className="text-[13px] sm:text-[15px] font-bold leading-snug break-words text-gray-800 dark:text-white">
            {title}
          </span>
        )}
      </div>

      {/* subTitle */}
      {subTitleEl && <div className="mb-1.5">{subTitleEl}</div>}

      {/* description */}
      {desc && (
        <div className="mb-4 flex-1 text-[12px] sm:text-[13px] leading-relaxed break-words text-gray-600 dark:text-white/80 whitespace-pre-line">
          {desc}
        </div>
      )}

      {/* sub-links */}
      {subLinks && subLinks.length > 0 && (
        <div className="flex flex-wrap gap-x-4 gap-y-1 mb-3">
          {subLinks.map((link, idx) => (
            <Button
              key={link.to ?? idx}
              type="button"
              className={`${linkBtnBase} after:h-[1.5px] after:w-0 hover:after:w-full text-[14px] font-semibold gap-1.5`}
              onClick={(e) => {
                e.stopPropagation();
                if (link.onClick) link.onClick();
                else if (link.to) navigate(link.to);
              }}
            >
              {link.icon && link.icon}
              <span>{link.label}</span>
            </Button>
          ))}
        </div>
      )}

      {/* meta footer */}
      {(hasMeta || showArrow) && (
        <div className="flex min-w-0 items-center justify-between text-[12px] text-gray-500 dark:text-white/60 mt-auto">
          <div className="flex min-w-0 flex-wrap items-center gap-x-3 gap-y-1">
            {lang && (
              <span className="flex min-w-0 items-center gap-1 break-words">
                <span className="opacity-60">▶</span> {lang}
              </span>
            )}
            {time && (
              <span className="flex min-w-0 items-center gap-1 break-words">
                <span className="opacity-60">◷</span> {time}
              </span>
            )}
          </div>
          {showArrow && (
            <RightOutlined className="opacity-0 transition-opacity group-hover:opacity-60" />
          )}
        </div>
      )}
    </div>
  );
};

export default Card;
