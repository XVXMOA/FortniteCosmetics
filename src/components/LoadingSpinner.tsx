
export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-6">
      <div className="relative">
        <div className="w-20 h-20 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin" />
        <div className="absolute inset-0 w-20 h-20 border-4 border-transparent border-r-blue-500 rounded-full animate-spin animate-pulse" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
        <div className="absolute inset-2 w-16 h-16 border-2 border-transparent border-l-pink-500 rounded-full animate-spin" style={{ animationDuration: '2s' }} />
      </div>
      <div className="text-center max-w-md">
        <h3 className="text-2xl font-bold text-white mb-3 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
          Loading Fortnite Cosmetics
        </h3>
        <p className="text-gray-300 text-lg mb-2">Fetching the latest items from the vault...</p>
        <p className="text-gray-400 text-sm">This may take a few moments</p>
        <div className="mt-4 flex justify-center space-x-1">
          <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
          <div className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
          <div className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
        </div>
      </div>
    </div>
  );
};
