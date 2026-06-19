// يعرض فيديو يوتيوب/فيميو كـ iframe، أو رابط مباشر كمشغّل فيديو
function resolve(url) {
  const u = (url || '').trim()
  if (!u) return null
  const yt = u.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|shorts\/))([\w-]{11})/)
  if (yt) return { type: 'iframe', src: `https://www.youtube.com/embed/${yt[1]}` }
  const vm = u.match(/vimeo\.com\/(\d+)/)
  if (vm) return { type: 'iframe', src: `https://player.vimeo.com/video/${vm[1]}` }
  return { type: 'video', src: u }
}

export default function VideoEmbed({ url }) {
  const v = resolve(url)
  if (!v) return null
  return (
    <div className="tl-video">
      {v.type === 'iframe' ? (
        <iframe
          src={v.src}
          title="فيديو الحدث"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      ) : (
        <video src={v.src} controls preload="metadata" />
      )}
    </div>
  )
}
