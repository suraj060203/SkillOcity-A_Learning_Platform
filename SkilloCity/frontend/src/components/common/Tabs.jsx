export default function Tabs({ tabs, activeTab, onChange, className = '' }) {
    return (
        <div className={`flex border-b border-border ${className}`}>
            {tabs.map((tab) => (
                <button
                    key={tab.id}
                    onClick={() => onChange(tab.id)}
                    className={`px-4 py-3 text-sm font-medium transition-all relative whitespace-nowrap ${activeTab === tab.id
                            ? 'text-primary'
                            : 'text-muted hover:text-text'
                        }`}
                >
                    {tab.icon && <span className="mr-1.5">{tab.icon}</span>}
                    {tab.label}
                    {tab.count !== undefined && (
                        <span className={`ml-1.5 text-xs px-1.5 py-0.5 rounded-full ${activeTab === tab.id ? 'bg-primary text-white' : 'bg-gray-100 text-muted'
                            }`}>
                            {tab.count}
                        </span>
                    )}
                    {activeTab === tab.id && (
                        <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
                    )}
                </button>
            ))}
        </div>
    );
}
