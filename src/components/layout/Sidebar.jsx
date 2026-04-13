const Sidebar = () => {
  return (
    <div className="w-64 bg-green-100 p-6">
      <h1 className="font-bold text-lg mb-8">
        Information System
      </h1>

      <nav className="space-y-3">
        <p className="cursor-pointer">Dashboard</p>
        <p className="cursor-pointer">User Management</p>
        <p className="cursor-pointer">Jobs</p>
        <p className="cursor-pointer">Permits</p>
        <p className="cursor-pointer">Reports</p>
        <p className="cursor-pointer">Settings</p>
      </nav>
    </div>
  );
};

export default Sidebar;