const Topbar = () => {
  return (
    <div className="h-16 bg-white shadow flex items-center justify-between px-6">
      <input
        placeholder="Search"
        className="border rounded-full px-4 py-2 w-80"
      />

      <div className="flex items-center gap-4">
        <span>🔔</span>
        <span>Amanda Persdotter</span>
      </div>
    </div>
  );
};

export default Topbar;