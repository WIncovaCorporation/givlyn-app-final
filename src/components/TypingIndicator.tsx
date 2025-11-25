export const TypingIndicator = () => {
  return (
    <div className="flex gap-3 animate-fade-in">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center flex-shrink-0">
        <svg className="w-5 h-5 text-primary-foreground" viewBox="0 0 24 24" fill="none">
          <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z" fill="currentColor" opacity="0.2"/>
          <circle cx="7" cy="12" r="1.5" fill="currentColor">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="1.4s" begin="0s" repeatCount="indefinite"/>
          </circle>
          <circle cx="12" cy="12" r="1.5" fill="currentColor">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="1.4s" begin="0.2s" repeatCount="indefinite"/>
          </circle>
          <circle cx="17" cy="12" r="1.5" fill="currentColor">
            <animate attributeName="opacity" values="0.2;1;0.2" dur="1.4s" begin="0.4s" repeatCount="indefinite"/>
          </circle>
        </svg>
      </div>
      <div className="rounded-2xl px-4 py-3 bg-muted max-w-[85%] animate-pulse">
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
        </div>
      </div>
    </div>
  );
};
