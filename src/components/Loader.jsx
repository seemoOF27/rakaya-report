import { ORG } from '../data'

export default function Loader({ error }) {
  return (
    <div className="loader">
      <img className="loader__logo" src="/rakaya-logo-black.png" alt={ORG} />
      {error ? (
        <p className="loader__error">{error}</p>
      ) : (
        <span className="loader__spinner" aria-label="جارٍ التحميل" />
      )}
    </div>
  )
}
