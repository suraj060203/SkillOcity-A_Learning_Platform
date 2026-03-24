import { Link } from 'react-router-dom';
import Logo from '../common/Logo';

export default function Footer() {
    return (
        <footer className="bg-[#1A1A2E] text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-1">
                        <Logo light className="mb-4" />
                        <p className="text-gray-400 text-sm leading-relaxed">
                            Free peer-to-peer learning platform for college students. Learn from your peers, teach what you know.
                        </p>
                    </div>

                    {/* Platform */}
                    <div>
                        <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">Platform</h4>
                        <div className="space-y-3">
                            <Link to="/browse-tutors" className="block text-sm text-gray-400 hover:text-white transition-colors no-underline">Browse Tutors</Link>
                            <Link to="/signup" className="block text-sm text-gray-400 hover:text-white transition-colors no-underline">Become a Teacher</Link>
                            <a href="#subjects" className="block text-sm text-gray-400 hover:text-white transition-colors no-underline">Subjects</a>
                            <a href="#how-it-works" className="block text-sm text-gray-400 hover:text-white transition-colors no-underline">How it Works</a>
                        </div>
                    </div>

                    {/* Support */}
                    <div>
                        <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">Support</h4>
                        <div className="space-y-3">
                            <a href="#" className="block text-sm text-gray-400 hover:text-white transition-colors no-underline">Help Center</a>
                            <a href="#" className="block text-sm text-gray-400 hover:text-white transition-colors no-underline">Contact Us</a>
                            <a href="#" className="block text-sm text-gray-400 hover:text-white transition-colors no-underline">Report an Issue</a>
                            <a href="#" className="block text-sm text-gray-400 hover:text-white transition-colors no-underline">FAQ</a>
                        </div>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="font-semibold text-sm uppercase tracking-wider mb-4 text-gray-300">Legal</h4>
                        <div className="space-y-3">
                            <a href="#" className="block text-sm text-gray-400 hover:text-white transition-colors no-underline">Privacy Policy</a>
                            <a href="#" className="block text-sm text-gray-400 hover:text-white transition-colors no-underline">Terms of Service</a>
                            <a href="#" className="block text-sm text-gray-400 hover:text-white transition-colors no-underline">Community Guidelines</a>
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-700 mt-12 pt-8 text-center">
                    <p className="text-sm text-gray-400">
                        Built by students, for students 💙 &nbsp;•&nbsp; © {new Date().getFullYear()} SkilloCity
                    </p>
                </div>
            </div>
        </footer>
    );
}
