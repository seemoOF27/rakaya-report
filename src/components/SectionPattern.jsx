// طبقة زخرفية متحركة ناعمة خلف بعض الأقسام (ثابتة، ليست قابلة للاختيار)
export default function SectionPattern({ name }) {
  if (!name || name === 'none') return null
  if (name === 'stars' || name === 'float') {
    return (
      <span className={`sec-pattern sec-pattern--shapes`} data-pattern={name} aria-hidden="true">
        <i className="shape s1" />
        <i className="shape s2" />
        <i className="shape s3" />
        <i className="shape s4" />
      </span>
    )
  }
  return <span className="sec-pattern" data-pattern={name} aria-hidden="true" />
}
