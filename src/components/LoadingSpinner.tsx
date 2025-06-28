
export const LoadingSpinner = () => {
  return (
    <div className="flex flex-col items-center justify-center py-16 space-y-4">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-purple-500/20 border-t-purple-500 rounded-full animate-spin" />
        <div className="absolute inset-0 w-16 h-16 border-4 border-transparent border-r-blue-500 rounded-full animate-spin animate-pulse" style={{ animationDirection: 'reverse', animationDuration: '1.5s' }} />
      </div>
      <div className="text-center">
        <h3 className="text-xl font-semibold text-white mb-2">Loading Fortnite Cosmetics</h3>
        <p className="text-gray-400">Fetching the latest items from the vault...</p>
      </div>
    </div>
  );
};
