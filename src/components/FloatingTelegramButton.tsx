import { TelegramLink } from "@/components/TelegramLink";

export function FloatingTelegramButton() {
  return (
    <div className="fixed bottom-4 right-4 z-50 sm:bottom-6 sm:right-6">
      <TelegramLink
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#29A9EA] text-white shadow-lg shadow-[#29A9EA]/30 transition hover:scale-110 hover:shadow-[#29A9EA]/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring sm:h-14 sm:w-14"
        label=""
        location="floating"
      />
    </div>
  );
}

export default FloatingTelegramButton;
