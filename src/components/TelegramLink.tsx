export const TELEGRAM_GROUP_URL = "https://t.me/+8xnMvFtjulkyNzE1";

export function TelegramIcon({ className }: { className?: string }) {
  // Lucide does not ship Telegram; use inline SVG to avoid extra dependency.
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
      aria-hidden="true"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M21.6 4.8c-.5-.4-1.1-.4-1.6-.2L2.8 11.3c-.9.3-1.1 1.1-.5 1.6l3.4 2.6 2.3 7.1c.2.6.8.9 1.4.5l3-2.3 3.8 3.1c.6.5 1.5.3 1.8-.5l4.5-13.2c.3-.9-.2-1.5-1.1-1.8-.1-.1-.2-.1-.3-.1-.2-.1-.3-.2-.5-.3zM9.8 17.2l.6-4.1 6.5-5.8-8.5 7.5 1.4 2.4z" />
    </svg>
  );
}

export function TelegramLink({ className = "", label }: { className?: string; label?: string }) {
  return (
    <a
      href={TELEGRAM_GROUP_URL}
      target="_blank"
      rel="noopener noreferrer"
      className={`inline-flex items-center gap-1.5 ${className}`}
      aria-label={label || "Join Telegram group"}
    >
      <TelegramIcon className="h-4 w-4" />
      {label && <span>{label}</span>}
    </a>
  );
}

export default TelegramLink;
