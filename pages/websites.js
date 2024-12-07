import { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  Card, 
  CardHeader, 
  CardTitle, 
  CardContent, 
  CardDescription 
} from '@/components/ui/card';
import { Alert, AlertTitle, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useTheme } from 'next-themes';
import { Spinner } from '@/components/ui/spinner';
import { Palette } from "lucide-react"

const Websites = () => {
    const [websites, setWebsites] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { theme, setTheme } = useTheme();

    useEffect(() => {
        const fetchWebsites = async () => {
            try {
                const response = await fetch('/api/uptimeRobot');
                if (!response.ok) {
                    throw new Error('Failed to fetch websites');
                }
                const data = await response.json();
                setWebsites(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchWebsites();
    }, []);

    const handleEditContacts = (id) => {
        const websiteToEdit = websites.find((website) => website.id === id);
        alert(`Editing: ${websiteToEdit.friendly_name}`);
        // Implement modal or redirect to an edit page here
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Spinner />
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <Alert variant="destructive">
                    <AlertTitle>Error</AlertTitle>
                    <AlertDescription>{error}</AlertDescription>
                </Alert>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-6">
            <div className="max-w-5xl mx-auto">
                <div className="flex justify-between items-center mb-6">
                    <h1 className="text-4xl font-bold">Websites List</h1>
                    <div className="flex gap-2">
                    <Button>Request create</Button>
                    <Button variant="outline" size="icon" onClick={() => setTheme(theme === 'light' ? 'dark' : 'light')}>
                        <Palette />
                    </Button>
                    </div>
                </div>
                <div className="space-y-4">
                    {websites.map((website) => (
                        <Card key={website.id}>
                            <CardHeader>
                                <CardTitle>
                                {website.friendly_name}
                                </CardTitle>
                                <CardDescription>
                                    <Link 
                                        href={website.url}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="hover:underline"
                                    >
                                        {website.url}
                                    </Link>
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-end">
                                <Button variant="secondary" onClick={() => handleEditContacts(website.id)}>
                                    Edit Contacts
                                </Button>
                                <Button variant="destructive">Request delete</Button>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Websites;
