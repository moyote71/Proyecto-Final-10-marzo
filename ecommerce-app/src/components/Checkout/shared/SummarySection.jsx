import Button from "../../common/Button";
import * as styles from "./SummarySectionStyles";

const SummarySection = ({
  title,
  selected,
  summaryContent,
  isExpanded,
  onToggle,
  children,
}) => {
  const handleToggle = (e) => {
    if (e.target.tagName === "BUTTON" || e.target.closest("button")) return;
    if (onToggle) onToggle();
  };

  return (
    <div
      className={`${styles.section} ${isExpanded ? styles.expanded : ""}`}
    >
      <div className={styles.header} onClick={handleToggle}>
        <div className={styles.title}>
          <h3 className="text-lg font-semibold text-gray-800">{title}</h3>

          {!isExpanded && selected && (
            <div className={styles.content}>
              {summaryContent}

              <Button variant="text" size="small" onClick={onToggle}>
                Cambiar
              </Button>
            </div>
          )}
        </div>

        {!isExpanded && selected && (
          <div className={styles.badge}>✓</div>
        )}
      </div>

      {isExpanded && (
        <div className={styles.expandedContent}>{children}</div>
      )}
    </div>
  );
};

export default SummarySection;
