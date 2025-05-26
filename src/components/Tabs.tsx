'use client';

import { useState } from "react";

type Tab = {
    label: string;
    key: string;
    content: React.ReactNode;
};

export function Tabs({ tabs, initialKey }: { tabs: Tab[]; initialKey?: string }) {
    const [active, setActive] = useState(initialKey || tabs[0].key);
    const current = tabs.find((t) => t.key === active);
    return (
        <div>
            <div className="flex gap-2 border-b mb-4">
                {tabs.map((tab) => (
                    <button
                        key={tab.key}
                        className={`px-4 py-2 font-semibold border-b-2 transition-colors ${active === tab.key
                            ? "border-primary text-primary"
                            : "border-transparent text-gray-500 hover:text-primary"
                            }`}
                        onClick={() => setActive(tab.key)}
                    >
                        {tab.label}
                    </button>
                ))}
            </div>
            <div>{current?.content}</div>
        </div>
    );
} 