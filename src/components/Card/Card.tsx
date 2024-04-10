import './Card.css'

export default function Card({ title, children }) {
  return (
    <div className="Card">
      {title && <h3>{title}</h3>}
      {children}
    </div>
  )
}
