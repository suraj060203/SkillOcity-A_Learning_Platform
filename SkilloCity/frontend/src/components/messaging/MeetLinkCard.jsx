import { Video, ExternalLink } from 'lucide-react';
import Button from '../common/Button';

export default function MeetLinkCard({ meetLink, className = '' }) {
    return (
        <div className={`bg-white border border-border rounded-lg p-4 max-w-xs ${className}`}>
            <div className="flex items-center gap-2 mb-2">
                <div className="w-10 h-10 bg-primary-light rounded-lg flex items-center justify-center">
                    <Video size={20} className="text-primary" />
                </div>
                <div>
                    <p className="text-sm font-semibold text-text">Study Room Ready 🎥</p>
                    <p className="text-xs text-muted truncate" style={{ maxWidth: 180 }}>{meetLink}</p>
                </div>
            </div>
            <Button
                variant="accent"
                size="sm"
                fullWidth
                icon={ExternalLink}
                onClick={() => window.open(meetLink, '_blank')}
            >
                Join Study Room
            </Button>
        </div>
    );
}
