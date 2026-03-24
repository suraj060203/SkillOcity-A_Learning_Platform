import Sidebar from './Sidebar';

export default function PageWrapper({ children }) {
    return (
        <div className="min-h-screen bg-bg bg-gradient-mesh overflow-x-hidden flex flex-col">
            <Sidebar />
            <main className="lg:ml-[260px] flex-1 w-full min-h-screen">
                <div className="w-full max-w-[100vw] lg:max-w-[calc(100vw-260px)] px-4 sm:px-6 lg:px-8 py-4 pt-20 lg:pt-8 min-h-full">
                    {children}
                </div>
            </main>
        </div>
    );
}
