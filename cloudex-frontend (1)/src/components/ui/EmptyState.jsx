export default function EmptyState({ icon: Icon, title, description, action }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-20 px-6 animate-fadeUp">
      {Icon && (
        <div className="w-14 h-14 rounded-2xl bg-cobalt-soft flex items-center justify-center mb-4">
          <Icon size={26} className="text-cobalt" />
        </div>
      )}
      <h3 className="font-display font-semibold text-ink text-lg">{title}</h3>
      {description && (
        <p className="text-sm text-ink-muted mt-1.5 max-w-sm">{description}</p>
      )}
      {action && <div className="mt-5">{action}</div>}
    </div>
  );
}
