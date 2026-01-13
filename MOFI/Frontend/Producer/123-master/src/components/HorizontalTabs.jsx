function HorizontalTabs({ activeTab, setActiveTab, tabs }) {
  return (
    <div className="mb-8">
      <div className="border-b-2 border-gray-700">
        <div className="flex space-x-8">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`pb-4 px-2 font-semibold text-lg transition-all duration-200 border-b-4 ${
                activeTab === tab.id
                  ? 'border-amber-500 text-amber-500'
                  : 'border-transparent text-gray-400 hover:text-gray-300'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HorizontalTabs;
