'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { apiClient, ContentHistory } from '@/lib/api';

export default function DashboardPage() {
  const { token, logout } = useAuth();
  const router = useRouter();
  const [history, setHistory] = useState<ContentHistory[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedContent, setSelectedContent] = useState<ContentHistory | null>(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!token) {
      router.push('/auth/login');
      return;
    }

    loadHistory();
  }, [token, router]);

  const loadHistory = async () => {
    try {
      setIsLoading(true);
      const data = await apiClient.getHistory();
      setHistory(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load history');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this content?')) return;

    try {
      await apiClient.deleteContent(id);
      setHistory(history.filter((item) => item.id !== id));
      if (selectedContent?.id === id) {
        setSelectedContent(null);
      }
    } catch (err: any) {
      alert('Failed to delete content: ' + err.message);
    }
  };

  const handleCopy = async (content: string) => {
    await navigator.clipboard.writeText(content);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getContentTypeColor = (type: string) => {
    const colors = {
      blog: 'bg-purple-100 text-purple-700',
      email: 'bg-blue-100 text-blue-700',
      social: 'bg-pink-100 text-pink-700',
    };
    return colors[type as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navigation */}
      <nav className="border-b bg-white/80 backdrop-blur-sm">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <a href="/" className="flex items-center">
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                AI Content Gen
              </h1>
            </a>
            <div className="flex gap-4">
              <a
                href="/generate"
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-blue-600 to-purple-600 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all"
              >
                Generate New
              </a>
              <button
                onClick={logout}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
              >
                Log out
              </button>
            </div>
          </div>
        </div>
      </nav>

      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Your Content</h1>
          <p className="mt-2 text-lg text-gray-600">
            View and manage all your generated content
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
            <p className="text-sm text-red-600">{error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* History List */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Generations ({history.length})
              </h2>

              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <svg className="animate-spin h-8 w-8 text-blue-600" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                </div>
              ) : history.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">No content generated yet</p>
                  <a
                    href="/generate"
                    className="mt-4 inline-block text-sm font-medium text-blue-600 hover:text-blue-700"
                  >
                    Create your first content →
                  </a>
                </div>
              ) : (
                <div className="space-y-3 max-h-[600px] overflow-y-auto">
                  {history.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => setSelectedContent(item)}
                      className={`w-full text-left p-4 rounded-lg border-2 transition-all ${
                        selectedContent?.id === item.id
                          ? 'border-blue-600 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded ${getContentTypeColor(item.content_type)}`}>
                          {item.content_type}
                        </span>
                        <span className="text-xs text-gray-500">
                          {formatDate(item.created_at)}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {item.product}
                      </p>
                      <p className="text-xs text-gray-600 mt-1">
                        {item.tone} • {item.length}
                      </p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Content Display */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm ring-1 ring-gray-200 p-8">
              {selectedContent ? (
                <>
                  <div className="flex items-start justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">{selectedContent.product}</h2>
                      <div className="flex gap-2 mt-2">
                        <span className={`px-3 py-1 text-sm font-medium rounded ${getContentTypeColor(selectedContent.content_type)}`}>
                          {selectedContent.content_type}
                        </span>
                        <span className="px-3 py-1 text-sm font-medium rounded bg-gray-100 text-gray-700">
                          {selectedContent.tone}
                        </span>
                        <span className="px-3 py-1 text-sm font-medium rounded bg-gray-100 text-gray-700">
                          {selectedContent.length}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mt-2">
                        Target: {selectedContent.audience}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        Generated on {formatDate(selectedContent.created_at)}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleCopy(selectedContent.generated_content)}
                        className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                      >
                        {copied ? '✓ Copied!' : 'Copy'}
                      </button>
                      <button
                        onClick={() => handleDelete(selectedContent.id)}
                        className="px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  </div>

                  <div className="prose max-w-none">
                    <div className="p-6 bg-gray-50 rounded-lg border border-gray-200 whitespace-pre-wrap font-sans text-gray-800">
                      {selectedContent.generated_content}
                    </div>
                  </div>

                  {selectedContent.extra_instructions && (
                    <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                      <p className="text-sm font-medium text-blue-900 mb-1">Additional Instructions:</p>
                      <p className="text-sm text-blue-700">{selectedContent.extra_instructions}</p>
                    </div>
                  )}
                </>
              ) : (
                <div className="flex items-center justify-center h-[600px] text-gray-400">
                  <div className="text-center">
                    <svg className="mx-auto h-12 w-12 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <p>Select a content item to view details</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
